"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateResetPasswordRequest = exports.validateForgotPasswordRequest = exports.Token = void 0;
const mongoose_1 = require("mongoose");
const joi_1 = __importDefault(require("joi"));
const ToekenSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
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
            delete ret.__v;
        }
    }
});
ToekenSchema.statics.build = (attrs) => new exports.Token(attrs);
exports.Token = (0, mongoose_1.model)("Token", ToekenSchema);
const validateForgotPasswordRequest = (req) => {
    const schema = joi_1.default.object({
        email: joi_1.default.string().min(5).max(255).required().email(),
    });
    return schema.validate(req);
};
exports.validateForgotPasswordRequest = validateForgotPasswordRequest;
const validateResetPasswordRequest = (req) => {
    const schema = joi_1.default.object({
        token: joi_1.default.string().required(),
        userId: joi_1.default.string().required(),
        password: joi_1.default.string().min(5).max(255).required()
    });
    return schema.validate(req);
};
exports.validateResetPasswordRequest = validateResetPasswordRequest;
