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
exports.sendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const handlebars_1 = __importDefault(require("handlebars"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const errors_1 = require("../../errors");
function sendEmail({ email, subject, payload, template }) {
    return __awaiter(this, void 0, void 0, function* () {
        // create reusable transporter object using the default SMTP transport
        const transporter = nodemailer_1.default.createTransport({
            host: process.env.EMAIL_HOST,
            port: 465,
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD, // naturally, replace both with your real credentials or an application-specific password
            },
        });
        const source = fs_1.default.readFileSync(path_1.default.join(__dirname, template), "utf8");
        const compiledTemplate = handlebars_1.default.compile(source);
        const options = () => {
            return {
                from: process.env.FROM_EMAIL,
                to: email,
                subject: subject,
                html: compiledTemplate(payload),
            };
        };
        // Send email
        return transporter.sendMail(options(), (error, info) => {
            if (error) {
                throw new errors_1.InternalServerError('Sending forgot email failed.');
            }
            else {
                return true;
            }
        });
    });
}
exports.sendEmail = sendEmail;
;
