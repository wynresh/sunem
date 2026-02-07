// =====================================
// Services de mail
// =====================================

import nodemailer from 'nodemailer';

import config from '@/config';


export default class MailService {
    private static transporter = nodemailer.createTransport({
        host: config.EXTERNAL_SERVICES.EMAIL.HOST,
        port: config.EXTERNAL_SERVICES.EMAIL.PORT,
        secure: config.EXTERNAL_SERVICES.EMAIL.SECURE,
        auth: {
            user: config.EXTERNAL_SERVICES.EMAIL.USER,
            pass: config.EXTERNAL_SERVICES.EMAIL.PASSWORD,
        },
    });

    // mail prenant en charge HTML
    public static async sendMail(to: string, subject: string, htmlContent: string): Promise<void> {
        const mailOptions = {
            from: config.EXTERNAL_SERVICES.EMAIL.FROM,
            to,
            subject,
            html: htmlContent,
        };

        await this.transporter.sendMail(mailOptions);
    }

    // verification de compte
    public static async sendVerificationEmail(to: string, token: string): Promise<void> {
        const verificationLink = `${config.APP.FRONTEND_URL}/verify-email?token=${token}`;
        const htmlContent = `
            <p>Merci de vous être inscrit ! Veuillez cliquer sur le lien ci-dessous pour vérifier votre adresse e-mail :</p>
            <a href="${verificationLink}">Vérifier mon adresse e-mail</a>
        `;

        await this.sendMail(to, 'Vérification de votre adresse e-mail', htmlContent);
    }

}
