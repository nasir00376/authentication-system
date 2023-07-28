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
exports.validateLoginUser = exports.validateUser = exports.User = void 0;
const mongoose_1 = require("mongoose");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const joi_1 = __importDefault(require("joi"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const debug_1 = __importDefault(require("debug"));
const debug = (0, debug_1.default)('auth:model:users');
const UserSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.password;
            delete ret.__v;
        }
    }
});
UserSchema.methods.generateToken = function () {
    const token = jsonwebtoken_1.default.sign({
        id: this.id,
        email: this.email
    }, process.env.JWT_PRIVATE_KEY, { expiresIn: '1h' });
    return token;
};
UserSchema.pre("save", function (done) {
    return __awaiter(this, void 0, void 0, function* () {
        debug('User pre save hook called...');
        if (this.isModified("password")) {
            debug('Start password encrypting...');
            const hashed = yield bcrypt_1.default.hash(this.get("password"), Number(process.env.BCRYPT_SALT));
            debug('Password hashed sucessfully...');
            this.set("password", hashed);
            done();
        }
    });
});
UserSchema.pre("updateOne", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        debug('User pre update one hook called...');
        debug('Start password encrypting...');
        const hashed = yield bcrypt_1.default.hash(this.get("password"), Number(process.env.BCRYPT_SALT));
        debug('Password hashed sucessfully...');
        this.set("password", hashed);
        next();
    });
});
UserSchema.statics.build = (attrs) => new exports.User(attrs);
exports.User = (0, mongoose_1.model)("User", UserSchema);
const validateUser = (user) => {
    const schema = joi_1.default.object({
        name: joi_1.default.string().min(5).max(50).required(),
        email: joi_1.default.string().min(5).max(255).required().email(),
        password: joi_1.default.string().min(5).max(255).required()
    });
    return schema.validate(user);
};
exports.validateUser = validateUser;
const validateLoginUser = (user) => {
    const schema = joi_1.default.object({
        email: joi_1.default.string().min(5).max(255).required().email(),
        password: joi_1.default.string().min(5).max(255).required()
    });
    return schema.validate(user);
};
exports.validateLoginUser = validateLoginUser;
