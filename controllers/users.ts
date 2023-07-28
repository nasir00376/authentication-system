import Debug from 'debug';
import bcrypt from 'bcrypt';
import { pick, template } from 'lodash';
import { randomBytes } from 'crypto';


import { ResponseBuilder } from '../shared/responseBuilder';
import { BadRequestError } from '../errors/badRequestError';
import { User, UserDocument, validateUser, validateLoginUser } from '../models/user';
import { ApiHandler, Request, Response } from '../interfaces/common';
import { Token, TokenDocument, validateForgotPasswordRequest, validateResetPasswordRequest } from '../models/token';
import { sendEmail } from '../shared/email/sendEmail';

const debug = Debug('auth:controller:users');

export class UsersController {
    public register: ApiHandler = async (req: Request, res: Response) => {
        const { error } = validateUser(req.body);

        if (error) {
            throw new BadRequestError(error.details[0].message)
        }

        // If already user exists
        let existingUser = await User.findOne({ email: req.body.email });

        if (existingUser) {
            throw new BadRequestError('User already registered.');
        }

        // save new user

        const user = User.build(pick(req.body, ['name', 'email', 'password']));
        await user.save();


        const token = user.generateToken();
        res.header('x-auth-token', token)

        debug(user);
        ResponseBuilder.ok<UserDocument>(user, res);
    }

    public login: ApiHandler = async (req: Request, res: Response) => {
        const { error } = validateLoginUser(req.body);

        const { email, password } = req.body;


        if (error) {
            throw new BadRequestError(error.details[0].message)
        }

        const existingUser = (await User.findOne({ email })) as UserDocument;


        if (!existingUser) {
            throw new BadRequestError("Invalid credentials");
        }

        const passwordMatch = await bcrypt.compare(password, existingUser.password);


        if (!passwordMatch) {
            throw new BadRequestError('Incorrect email or password.');
        }


        const token = existingUser.generateToken();

        res.header('x-auth-token', token)

        debug(existingUser);
        ResponseBuilder.ok<UserDocument>(existingUser, res);
    }

    public forgotPassword: ApiHandler = async (req: Request, res: Response) => {
        const { error } = validateForgotPasswordRequest(req.body);

        if (error) {
            throw new BadRequestError(error.details[0].message)
        }

        const { email } = req.body;

        const existingUser = (await User.findOne({ email })) as UserDocument;


        if (!existingUser) {
            throw new BadRequestError("User does not exist");
        }

        const existingToekn = await Token.findOne({ userId: existingUser.id }) as TokenDocument;

        if (existingToekn) {
            await existingToekn.deleteOne()
        };

        let resetToken = randomBytes(32).toString("hex");

        const hashedToken = await bcrypt.hash(resetToken, Number(process.env.BCRYPT_SALT));

        const tokenDoc = Token.build({ userId: existingUser.id, token: hashedToken });

        await tokenDoc.save();

        const link = `${process.env.CLIENT_URL}/passwordReset?token=${resetToken}&id=${tokenDoc.userId}`;
        // send email with link

        await sendEmail({
            email: existingUser.email,
            subject: "Password Reset Request",
            payload: { name: existingUser.name, link: link, },
            template: "./templates/requestResetPassword.handlebars"
        });

        tokenDoc.token = resetToken;

        debug(tokenDoc);
        ResponseBuilder.ok<TokenDocument>(tokenDoc, res);
    }

    public resetPassword: ApiHandler = async (req: Request, res: Response) => {
        const { error } = validateResetPasswordRequest(req.body);

        if (error) {
            throw new BadRequestError(error.details[0].message)
        }

        const { userId, token, password } = req.body;

        const passwordResetToken = await Token.findOne({ userId }) as TokenDocument;

        if (!passwordResetToken || !passwordResetToken.token) {
            throw new BadRequestError("Invalid or expired password reset token");
        }

        const isValid = await bcrypt.compare(token, passwordResetToken.token);

        if (!isValid) {
            throw new Error("Invalid or expired password reset token");
        }

        // Update user password
        await User.updateOne(
            { _id: userId },
            { $set: { password } },
            { new: true }
        );

        // delete token
        await passwordResetToken.deleteOne();

        const result = { message: 'Password reset successfully.' }

        debug(result);
        ResponseBuilder.ok(result, res);
    }
}