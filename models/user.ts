import { Document, Model, Schema, model } from "mongoose";
import jwt from 'jsonwebtoken';
import Joi from 'joi';
import bcrypt from 'bcrypt'
import Debug from 'debug';

const debug = Debug('auth:model:users');


const UserSchema = new Schema<UserDocument, UserModel>({
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
      delete ret.__v
    }
  }
});

// An interface that describes the properties that are required to create new User;
interface UserAttrs {
  name: string;
  email: string;
  password: string;
}

//  An interface that describes the properties that a User Document has.
//  Properties a single User has.
export interface UserDocument extends UserAttrs, Document {
  generateToken(): string;
}

// An interface that describes the properties that a User model has.
interface UserModel extends Model<UserDocument> {
  build(attrs: UserAttrs): UserDocument;
}

UserSchema.methods.generateToken = function (): string {
  const token = jwt.sign({
    id: this.id,
    email: this.email
  }, process.env.JWT_PRIVATE_KEY!, { expiresIn: '1h' });

  return token;
}

UserSchema.pre("save", async function (done) {
  debug('User pre save hook called...')
  if (this.isModified("password")) {

    debug('Start password encrypting...')
    const hashed = await bcrypt.hash(this.get("password"), Number(process.env.BCRYPT_SALT));
    debug('Password hashed sucessfully...')
    this.set("password", hashed);

    done();
  }
});

UserSchema.pre("updateOne", async function (next) {
  debug('User pre update one hook called...')

  debug('Start password encrypting...')
  const hashed = await bcrypt.hash(this.get("password"), Number(process.env.BCRYPT_SALT));
  debug('Password hashed sucessfully...')
  this.set("password", hashed);

  next();

});

UserSchema.statics.build = (attrs: UserAttrs) => new User(attrs);

export const User = model<UserDocument, UserModel>("User", UserSchema);

export const validateUser = (user: UserAttrs) => {
  const schema = Joi.object({
    name: Joi.string().min(5).max(50).required(),
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required()
  });

  return schema.validate(user);
}

export const validateLoginUser = (user: Pick<UserAttrs, 'email' | 'password'>) => {
  const schema = Joi.object({
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required()
  });

  return schema.validate(user);
}