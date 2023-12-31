import nodemailer from "nodemailer";
import handlebars from "handlebars";
import fs from "fs";
import path from "path";
import { InternalServerError } from "../../errors";

export interface SendEmail {
    email: string;
    subject: string;
    payload: string | Record<string, unknown>;
    template: string;
}

export async function sendEmail({ email, subject, payload, template }: SendEmail): Promise<unknown> {

    // create reusable transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: 465,
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD, // naturally, replace both with your real credentials or an application-specific password
        },
    });

    const source = fs.readFileSync(path.join(__dirname, template), "utf8");
    const compiledTemplate = handlebars.compile(source);
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
            throw new InternalServerError('Sending forgot email failed.')
        } else {
            return true;
        }
    });

};