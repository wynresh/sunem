// ============================================
// User Controllers
// ============================================


import config from "@/config";
import Role from "@/models/access/role.models";
import User from "@/models/access/user.models";
import Store from "@/models/stores/store.models";
import MailService from "@/services/mail.services";
import TokenService from "@/services/token.services";
import { Request, Response, NextFunction } from "express";

import speakeasy from 'speakeasy';
import QRCode from 'qrcode';



export class UserControllers {

    private static query(q: any): Object {
        const qs: any = {};

        if (q.name) {
            const reg = { $regex: q.name, $options: 'i' };
            qs.$or = [
                { firstname: reg },
                { lastname: reg },
                { status: reg },
            ]
        }

        if (q.login) qs.lastLogin = { $gte: new Date(q.loginDate) };

        return qs;
    }

    // ========================
    // Get All Users
    //
    // récupère tous les utilisateurs
    // ========================

    public static async getAllUsers(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            const filter = this.query(req.query);
            const options: any = { 
                createdAt: -1,
                limit: config.PAGINATION.DEFAULT_LIMIT,
                page: req.query.page
            };

            const users = await User.paginate(filter, options);

            res.status(200).json({ data: users, message: 'success' })

        } catch (error) {
            next(error);
        }
    }


    // ========================
    // Get User By ID
    //
    // récupère un utilisateur par son ID
    // ========================

    public static async getUserById(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            const user = await User.findById(req.user);
            if (!user) return res.status(400).json({ message: 'not found' });

            res.status(200).json({ DataView: user, message: 'success' });
        } catch (error) {
            next(error);
        }
    }


    // ========================
    // Update User
    //
    // met à jour les informations d'un utilisateur
    // ========================

    public static async updateUser(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            const data = { ...req.body };

            const user = await User.findById(req.params.id);
            if (!user) return res.status(400).json({ message: 'not found' });

            if (data.username) {
                const exist = await User.findOne({ username: data.username });
                if (!exist) user.username = data.username;
                else return res.status(400).json({ message: 'this name exist'});
            }

            if (data.phone) {
                const exist = await User.findOne({ phone: data.phone });
                if (!exist) user.phone = data.phone;
                else return res.status(400).json({ message: 'this number exist'});
            }

            const updated = {
                ...(data.firstname && { firstname: data.firstname }),
                ...(data.lastname && { lastname: data.lastname }),
                ...(data.store && { store: data.store }),
                ...(data.role && { role: data.role }),
                ...(data.status && { status: data.status }),
            }

            if (updated.store) {
                const store = await Store.findById(updated.store);
                if (!store) return res.status(400).json({ message: 'not found' });
            }

            if (updated.role) {
                const role = await Role.findById(updated.role);
                if (!role) return res.status(400).json({ message: 'not found' });
            }

            if (data.email) {
                const exist = await User.findOne({ email: data.email});
                if (exist) return res.status(400).json({ message: 'this email exist'});
                
                updated.email = data.email;

                // token
                const token = TokenService.generateToken({ id: user.id, updated }, config.SECURITY.JWT_VERIFY_EMAIL_EXPIRATION);

                // mail
                await MailService.sendUpdatedVerificationEmail(updated.email, token);
                return res.status(200).json({ message: 'success' })
            }

            if (data.password) {
                user.password = data.password;
                user.online = false;
                user.lastLogin = new Date();
            }

            Object.assign(user, updated);
            await user.save();

            res.status(200).json({ data: user, message: 'success' });

        } catch (error) {
            next(error);
        }
    }


    // ========================
    // Delete User
    //
    // supprime un utilisateur
    // ========================

    public static async deleteUser(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            const user = await User.findById(req.params.id);
            if (!user) return res.status(400).json({ message: 'not found' });

            user.deleteOne();

            res.status(204).json()
        } catch (error) {
            next(error);
        }
    }


    // ========================
    // Refresh Token
    //
    // génère un nouveau token JWT à partir d'un token de rafraîchissement valide
    // ========================
    
    public static async refreshToken(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            const refresh = req.body.refresh;
            const payload = TokenService.verifyToken(refresh);
            if (!payload) return res.status(401).json({ message: 'unauthorized' });

            const access = TokenService.generateToken(payload, config.SECURITY.JWT_ACCESS_EXPIRATION);

            res.status(200).json({ data: access, message: 'success' });
        } catch (error) {
            next(error);
        }
    }


    // ========================
    // enable 2FA
    //
    // permet à un utilisateur de configurer l'authentification à deux facteurs (2FA) pour son compte
    // ========================

    public static async enableTwoFactorAuth(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            const user = await User.findById(req.user);
            if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });

            // Générer un secret unique
            const secret = speakeasy.generateSecret({
                name: `Sunem:${user.email}`
            });

            // Enregistrer le secret temporairement dans la base
            user.twoFactorSecret = secret.base32;
            await user.save();

            // Générer le QR Code pour l'application mobile
            const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url!);

            res.status(200).json({
                data: {
                    qrCode: qrCodeUrl,
                    secret: secret.base32 // Optionnel: pour saisie manuelle
                },
                message: 'success'
            });
        } catch (error) {
            next(error);
        }
    }


    // ========================
    // disable 2FA
    //
    // permet à un utilisateur de désactiver l'authentification à deux facteurs (2FA) pour son compte
    // ========================

    public static async disableTwoFactorAuth(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            const { token } = req.body;
            const user = await User.findById(req.user);

            if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });

            // Optionnel mais recommandé : vérifier le code avant de couper la sécurité
            const verified = speakeasy.totp.verify({
                secret: user.twoFactorSecret!,
                encoding: 'base32',
                token: token
            });

            if (!verified) {
                return res.status(401).json({ message: "Code invalide, désactivation refusée" });
            }

            // Supprimer les données 2FA
            user.twoFactorSecret = undefined;
            user.isTwoFactorEnabled = false;
            await user.save();

            res.status(200).json({ success: true, message: "2FA désactivé" });
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
            const user = await User.findById(req.user);

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

            // Activer officiellement le flag 2FA
            if (!user.isTwoFactorEnabled) {
                user.isTwoFactorEnabled = true;
                await user.save();
            }
            
            res.status(200).json({ message: "2FA vérifié et activé" });
        } catch (error) {
            next(error);
        }
    }
}
