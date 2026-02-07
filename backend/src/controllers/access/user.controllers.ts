// ============================================
// User Controllers
// ============================================


import { Request, Response, NextFunction } from "express";



export class UserControllers {

    // ========================
    // Get All Users
    //
    // récupère tous les utilisateurs
    // ========================

    public static async getAllUsers(req: Request, res: Response, next: NextFunction): Promise<Response> {
        try {
        } catch (error) {
            next(error);
        }
    }


    // ========================
    // Get User By ID
    //
    // récupère un utilisateur par son ID
    // ========================

    public static async getUserById(req: Request, res: Response, next: NextFunction): Promise<Response> {
        try {
        } catch (error) {
            next(error);
        }
    }


    // ========================
    // Update User
    //
    // met à jour les informations d'un utilisateur
    // ========================

    public static async updateUser(req: Request, res: Response, next: NextFunction): Promise<Response> {
        try {
        } catch (error) {
            next(error);
        }
    }


    // ========================
    // Delete User
    //
    // supprime un utilisateur
    // ========================

    public static async deleteUser(req: Request, res: Response, next: NextFunction): Promise<Response> {
        try {
        } catch (error) {
            next(error);
        }
    }


    // ========================
    // Refresh Token
    //
    // génère un nouveau token JWT à partir d'un token de rafraîchissement valide
    // ========================
    
    public static async refreshToken(req: Request, res: Response, next: NextFunction): Promise<Response> {
        try {
        } catch (error) {
            next(error);
        }
    }

    // ========================
    // Change Password
    //
    // permet à un utilisateur connecté de changer son mot de passe
    // ========================

    public static async changePassword(req: Request, res: Response, next: NextFunction): Promise<Response> {
        try {
        } catch (error) {
            next(error);
        }
    }


    // ========================
    // enable 2FA
    //
    // permet à un utilisateur de configurer l'authentification à deux facteurs (2FA) pour son compte
    // ========================

    public static async enableTwoFactorAuth(req: Request, res: Response, next: NextFunction): Promise<Response> {
        try {
        } catch (error) {
            next(error);
        }
    }


    // ========================
    // disable 2FA
    //
    // permet à un utilisateur de désactiver l'authentification à deux facteurs (2FA) pour son compte
    // ========================

    public static async disableTwoFactorAuth(req: Request, res: Response, next: NextFunction): Promise<Response> {
        try {
        } catch (error) {
            next(error);
        }
    }


    // ========================
    // verify 2FA
    //
    // vérifie le code de l'authentification à deux facteurs (2FA) fourni par l'utilisateur lors de la connexion
    // ========================

    public static async verifyTwoFactorAuth(req: Request, res: Response, next: NextFunction): Promise<Response> {
        try {
        } catch (error) {
            next(error);
        }
    }
}