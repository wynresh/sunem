// =======================================
// Sign Controllers
// =======================================

import { Request, Response, NextFunction } from "express";

import User, { IUser } from "@/models/access/user.models";

import MailService from "@/services/mail.services";
import TokenService from "@/services/token.services";

import { SECURITY_CONFIG } from "@/config";



export class SignControllers {

    private static async authenticate(user: IUser) {
        user.online = true;
        await user.save();

        const access = TokenService.generateToken({ id: user.id, role: user.role, store: user.store}, SECURITY_CONFIG.JWT_ACCESS_EXPIRATION);
        const refresh = TokenService.generateToken({ id: user.id, role: user.role, store: user.store}, SECURITY_CONFIG.JWT_REFRESH_EXPIRATION);

        return { user, token: { access, refresh }}
    }


    // ========================
    // Sign Up
    //
    // enregistre un nouvel utilisateur
    // ========================

    public static async sign(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            const data = { ...req.body };

            // 1- verifier si l'utilisateur existe déjà
            const existingUser = await User.findOne({ $or: [
                { email: data.email },
                { phone: data.phone },
                { username: data.username }
            ] });

            if (existingUser) {
                return res.status(400).json({ 
                    message: 'Un utilisateur avec cet email, téléphone ou nom d\'utilisateur existe déjà.' 
                });
            }

            // 2- exiger la verification par email
            // 2.1- creation du token de verification
            const token = TokenService.generateToken(data, SECURITY_CONFIG.JWT_VERIFY_EMAIL_EXPIRATION);

            // 2.2 - envoyer le mail
            await MailService.sendVerificationEmail(data.email, token);

            res.status(200).json({ message: 'email envoyé' });

        } catch (error) {
            next(error);
        }
    }


    // ============================
    // Sign Up
    // 
    // finaliser l'enregistrement et connecter automatiquement le nouvel utilisateur
    // ============================

    public static async signUp(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            const token = req.params.token as string;
            if (!token) res.status(400).json({ messge: 'invalid !!!' });

            const payload = TokenService.verifyToken(token);
            if (!payload) res.status(400).json({ messge: 'invalid !!!' });

            const user = new User(payload);
            await user.save();

            res.status(201).json(await this.authenticate(user));

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

            const check = await user.comparePassword(data.password);
            
            if (!check) return res.status(401).json({ message: 'password invalid !!!' });

            res.status(200).json(await this.authenticate(user))
        } catch (error) {
            next(error);
        }
    }


    // ========================
    // Sign Out
    //
    // déconnecte un utilisateur en invalidant son token JWT
    // ========================

    public static async signOut(req: Request, res: Response, next: NextFunction): Promise<Response> {
        try {
        } catch (error) {
            next(error);
        }
    }


    // ========================
    // Forgot Password
    //
    // envoie un email de réinitialisation de mot de passe à l'utilisateur
    // ========================

    public static async forgotPassword(req: Request, res: Response, next: NextFunction): Promise<Response> {
        try {
        } catch (error) {
            next(error);
        }
    }


    // ========================
    // Reset Password
    //
    // réinitialise le mot de passe de l'utilisateur à partir d'un token de réinitialisation valide
    // ========================

    public static async resetPassword(req: Request, res: Response, next: NextFunction): Promise<Response> {
        try {
        } catch (error) {
            next(error);
        }
    }


    // ========================
    // Verify OTP
    //
    // vérifie un code OTP envoyé à l'utilisateur pour des opérations sensibles
    // ========================

    public static async verifyOtp(req: Request, res: Response, next: NextFunction): Promise<Response> {
        try {
        } catch (error) {
            next(error);
        }
    }


    // ========================
    // Resend OTP
    //
    // renvoie un code OTP à l'utilisateur si le précédent a expiré ou n'a pas été reçu
    // ========================

    public static async resendOtp(req: Request, res: Response, next: NextFunction): Promise<Response> {
        try {
        } catch (error) {
            next(error);
        }
    }

}