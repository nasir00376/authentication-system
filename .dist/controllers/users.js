"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersController = void 0;
const debug_1 = __importDefault(require("debug"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const lodash_1 = require("lodash");
const crypto_1 = require("crypto");
const responseBuilder_1 = require("../shared/responseBuilder");
const badRequestError_1 = require("../errors/badRequestError");
const user_1 = require("../models/user");
const token_1 = require("../models/token");
const sendEmail_1 = require("../shared/email/sendEmail");
const debug = (0, debug_1.default)('auth:controller:users');
class UsersController {
    constructor() {
        this.register = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { error } = (0, user_1.validateUser)(req.body);
            if (error) {
                throw new badRequestError_1.BadRequestError(error.details[0].message);
            }
            // If already user exists
            let existingUser = yield user_1.User.findOne({ email: req.body.email });
            if (existingUser) {
                throw new badRequestError_1.BadRequestError('User already registered.');
            }
            // save new user
            const user = user_1.User.build((0, lodash_1.pick)(req.body, ['name', 'email', 'password']));
            yield user.save();
            const token = user.generateToken();
            res.header('x-auth-token', token);
            debug(user);
            responseBuilder_1.ResponseBuilder.ok(user, res);
        });
        this.login = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { error } = (0, user_1.validateLoginUser)(req.body);
            const { email, password } = req.body;
            if (error) {
                throw new badRequestError_1.BadRequestError(error.details[0].message);
            }
            const existingUser = (yield user_1.User.findOne({ email }));
            if (!existingUser) {
                throw new badRequestError_1.BadRequestError("Invalid credentials");
            }
            const passwordMatch = yield bcrypt_1.default.compare(password, existingUser.password);
            if (!passwordMatch) {
                throw new badRequestError_1.BadRequestError('Incorrect email or password.');
            }
            const token = existingUser.generateToken();
            res.header('x-auth-token', token);
            debug(existingUser);
            responseBuilder_1.ResponseBuilder.ok(existingUser, res);
        });
        this.forgotPassword = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { error } = (0, token_1.validateForgotPasswordRequest)(req.body);
            if (error) {
                throw new badRequestError_1.BadRequestError(error.details[0].message);
            }
            const { email } = req.body;
            const existingUser = (yield user_1.User.findOne({ email }));
            if (!existingUser) {
                throw new badRequestError_1.BadRequestError("User does not exist");
            }
            const existingToekn = yield token_1.Token.findOne({ userId: existingUser.id });
            if (existingToekn) {
                yield existingToekn.deleteOne();
            }
            ;
            let resetToken = (0, crypto_1.randomBytes)(32).toString("hex");
            const hashedToken = yield bcrypt_1.default.hash(resetToken, Number(process.env.BCRYPT_SALT));
            const tokenDoc = token_1.Token.build({ userId: existingUser.id, token: hashedToken });
            yield tokenDoc.save();
            const link = `${process.env.CLIENT_URL}/passwordReset?token=${resetToken}&id=${tokenDoc.userId}`;
            // send email with link
            yield (0, sendEmail_1.sendEmail)({
                email: existingUser.email,
                subject: "Password Reset Request",
                payload: { name: existingUser.name, link: link, },
                template: "./templates/requestResetPassword.handlebars"
            });
            tokenDoc.token = resetToken;
            debug(tokenDoc);
            responseBuilder_1.ResponseBuilder.ok(tokenDoc, res);
        });
        this.resetPassword = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { error } = (0, token_1.validateResetPasswordRequest)(req.body);
            if (error) {
                throw new badRequestError_1.BadRequestError(error.details[0].message);
            }
            const { userId, token, password } = req.body;
            const passwordResetToken = yield token_1.Token.findOne({ userId });
            if (!passwordResetToken || !passwordResetToken.token) {
                throw new badRequestError_1.BadRequestError("Invalid or expired password reset token");
            }
            const isValid = yield bcrypt_1.default.compare(token, passwordResetToken.token);
            if (!isValid) {
                throw new Error("Invalid or expired password reset token");
            }
            // Update user password
            yield user_1.User.updateOne({ _id: userId }, { $set: { password } }, { new: true });
            // delete token
            yield passwordResetToken.deleteOne();
            const result = { message: 'Password reset successfully.' };
            debug(result);
            responseBuilder_1.ResponseBuilder.ok(result, res);
        });
    }
}
exports.UsersController = UsersController;
