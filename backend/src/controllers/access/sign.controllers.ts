// =======================================
// Sign Controllers
// =======================================

import { Request, Response, NextFunction } from "express";

import User, { IUser } from "@/models/access/user.models";

import MailService from "@/services/mail.services";
import TokenService from "@/services/token.services";

import { SECURITY_CONFIG } from "@/config";
import LoginAttempt from "@/models/access/auth.models";

import speakeasy from 'speakeasy';



export default class SignControllers {

    private static async authenticate(user: IUser) {
        user.online = true;
        user.lastLogin = undefined;
        await user.save();

        const access = TokenService.generateToken({ id: user.id, role: user.role, store: user.store}, SECURITY_CONFIG.JWT_ACCESS_EXPIRATION);
        const refresh = TokenService.generateToken({ id: user.id, role: user.role, store: user.store}, SECURITY_CONFIG.JWT_REFRESH_EXPIRATION);

        return { user, token: { access, refresh }}
    }


    // ============================
    // Sign Up
    // 
    // finaliser l'enregistrement et connecter automatiquement le nouvel utilisateur
    // ============================

    public static async signUp(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            const token = req.params.token as string;
            if (!token) return res.status(400).json({ messge: 'invalid !!!' });

            const payload = TokenService.verifyToken(token);
            if (!payload) return res.status(400).json({ messge: 'invalid !!!' });

            const user = new User(payload);
            await user.save();

            const data = await this.authenticate(user)

            res.status(201).json({ 
                data: data, 
                message: 'success' 
            });

        } catch (error) {
            next(error);
        }
    }


    // ========================
    // Sign In
    //
    // authentifie un utilisateur et génère un token JWT
    // ========================

    public static async signIn(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            const data = { ...req.body };

            // rechercher l'utilisateur
            const user = await User.findOne({ $or: [
                { email: data.name },
                { phone: data.name },
                { username: data.name }
            ] });

            if (!user) return res.status(400).json({ message: 'user not found' });

            const loginAttempt = await LoginAttempt.findOne({ user: user.id });
            if (!loginAttempt) return res.status(400).json({ message: 'not possible' });

            if (loginAttempt.attempts >= 5) {
                MailService.sendIntrusionMail(user.email);
                return;
            }

            const check = await user.comparePassword(data.password);
            if (!check) {
                await LoginAttempt.updateOne(
                    { _id: loginAttempt.id },
                    {
                        lastAttempt: new Date(),
                        $inc: { attempts: 1 }
                    }
                )
                
                return res.status(401).json({ message: 'password invalid !!!' });
            }

            loginAttempt.attempts = 0;
            loginAttempt.lastAttempt = new Date();
            await loginAttempt.save();

            if (user.isTwoFactorEnabled) return res.status(200).json({ message: 'two factor required' });

            const q = await this.authenticate(user)

            res.status(200).json({ 
                data: q, 
                message: 'success' 
            });
        } catch (error) {
            next(error);
        }
    }


    // ========================
    // verify 2FA
    //
    // vérifie le code de l'authentification à deux facteurs (2FA) fourni par l'utilisateur lors de la connexion
    // ========================
    
    public static async verifyTwoFactorAuth(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            const { token } = req.body;
            const { id } = req.params;
            const user = await User.findById(id);
    
            if (!user || !user.twoFactorSecret) {
                return res.status(400).json({ message: "2FA non configuré" });
            }
    
            // Vérifier le jeton (token)
            const verified = speakeasy.totp.verify({
                secret: user.twoFactorSecret,
                encoding: 'base32',
                token: token
            });
    
            if (!verified) {
                return res.status(401).json({ message: "Code invalide" });
            }

                
            const q = await this.authenticate(user)

            res.status(200).json({ 
                data: q, 
                message: 'success' 
            });
        } catch (error) {
            next(error);
        }
    }


    // ========================
    // Sign Out
    //
    // déconnecte un utilisateur en invalidant son token JWT
    // ========================

    public static async signOut(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            if (!req.user) return res.status(401).json({ message: 'unauthorized' });
            
            const user = await User.findById(req.user.id);
            if (!user) return res.status(400).json({ message: 'user not found' });

            user.online = false;
            user.lastLogin = new Date();
            await user.save();

            res.status(200).json({ messge: 'success' });
        } catch (error) {
            next(error);
        }
    }


    // ========================
    // Forgot Password
    //
    // envoie un email de réinitialisation de mot de passe à l'utilisateur
    // ========================

    public static async forgotPassword(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            const email = req.body.email;

            // trouver l'utilisateur
            const user = await User.findOne({ email });
            if (!user) return res.status(400).json({ message: 'User not found' });

            // creation du token de password
            const token = TokenService.generateToken({ id: user.id }, SECURITY_CONFIG.JWT_VERIFY_EMAIL_EXPIRATION);

            // envoyer le mail
            await MailService.sendForgotPassword(email, token);

            res.status(200).json({ message: 'success' });
        } catch (error) {
            next(error);
        }
    }


    // ========================
    // Reset Password
    //
    // réinitialise le mot de passe de l'utilisateur à partir d'un token de réinitialisation valide
    // ========================

    public static async resetPassword(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            const token = req.params.token as string;
            if (!token) res.status(400).json({ messge: 'invalid !!!' });

            const credentials = req.body;

            if (credentials.newPassword != credentials.confirmPassword) res.status(400).json({ message: 'no match !!!' });

            const payload = TokenService.verifyToken(token) as object;
            if (!payload) return res.status(400).json({ messge: 'invalid !!!' });

            const user = await User.findOne(payload);
            if (!user) return res.status(400).json({ message: 'User not found' });

            user.password = credentials.newPassword;
            user.online = false;
            user.lastLogin = new Date();
            await user.save();

            res.status(200).json({ message: 'success' });
        } catch (error) {
            next(error);
        }
    }


    // ========================
    // Verify OTP
    //
    // vérifie un code OTP envoyé à l'utilisateur pour des opérations sensibles
    // ========================

    // public static async verifyOtp(req: Request, res: Response, next: NextFunction): Promise<Response> {
    //     try {
    //     } catch (error) {
    //         next(error);
    //     }
    // }


    // ========================
    // Resend OTP
    //
    // renvoie un code OTP à l'utilisateur si le précédent a expiré ou n'a pas été reçu
    // ========================

    // public static async resendOtp(req: Request, res: Response, next: NextFunction): Promise<Response> {
    //     try {
    //     } catch (error) {
    //         next(error);
    //     }
    // }


    // ==============================
    // Resend Link
    //
    // renvoie le lien
    // ==============================

    public static async ResendLink(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            // creation du token
            const token = TokenService.generateToken({ ...req.body }, SECURITY_CONFIG.JWT_VERIFY_EMAIL_EXPIRATION);

            // 2.2 - envoyer le mail
            await MailService.sendVerificationEmail(req.body.email, token);

            res.status(200).json({ message: 'email envoyé' });
        } catch (error) {
            next(error);
        }
    }

}
