import { Document, Model, Schema, model } from "mongoose";
import Joi from 'joi';
import { UserDocument } from "./user";


const ToekenSchema = new Schema<TokenDocument, TokenModel>({
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'user'
    },
    token: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 60 * 60 * 24, // this is the expiry time in seconds
    },
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v
        }
    }
});

interface ForgotPasswordRequestAttrs {
    email: string;
}

interface ResetPasswordRequestAttrs {
    token: string;
    userId: string;
    password: string;
}

// An interface that describes the properties that are required to create new User;
interface TokenAttrs {
    userId: Pick<UserDocument, 'id'>;
    token?: string;
    createdAt?: any;
}

//  An interface that  the properties that a User Document has.
//  Properties a single User has.
export interface TokenDocument extends TokenAttrs, Document {
    generateToken(): string;
}

// An interface that describes the properties that a User model has.
interface TokenModel extends Model<TokenDocument> {
    build(attrs: TokenAttrs): TokenDocument;
}

ToekenSchema.statics.build = (attrs: TokenAttrs) => new Token(attrs);

export const Token = model<TokenDocument, TokenModel>("Token", ToekenSchema);

export const validateForgotPasswordRequest = (req: ForgotPasswordRequestAttrs) => {
    const schema = Joi.object({
        email: Joi.string().min(5).max(255).required().email(),
    });

    return schema.validate(req);
}

export const validateResetPasswordRequest = (req: ResetPasswordRequestAttrs) => {
    const schema = Joi.object({
        token: Joi.string().required(),
        userId: Joi.string().required(),
        password: Joi.string().min(5).max(255).required()
    });

    return schema.validate(req);
}