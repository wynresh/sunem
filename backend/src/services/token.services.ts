// ============================================================
// SERVICES DE GESTION DES TOKENS
// ============================================================

import jwt, { SignOptions, Secret } from "jsonwebtoken";
import { SECURITY_CONFIG } from '@/config';


export default class TokenService {

    private static readonly secret = SECURITY_CONFIG.JWT_SECRET as Secret;

    // Générer un token d'accès
    static generateToken(payload: object, expiresIn: string | number = '1h'): string {
        const options: SignOptions = TokenService.parseExpiration(expiresIn)
        return jwt.sign(payload, this.secret, options);
    }

    // Vérifier un token d'accès
    static verifyToken(token: string): object | null {
        try {
            return jwt.verify(token, this.secret) as object;
        } catch (error) {
            return null;
        }
    }

    /**
   * Convertit une durée lisible ('15m', '7d', '1h') en secondes.
   * Sans dépendance externe (ms).
   */
    private static parseExpiration(value: string | number): SignOptions {
        if (typeof value === "number") {
            const options: SignOptions = {
                expiresIn: value,
            }
            return options;
        }

        const match = value.match(/^(\d+)([smhd])$/);
        if (!match) throw new Error(`Durée invalide : ${value}`);

        const [, amount, unit] = match;
        const num = parseInt(amount, 10);
        const map = { s: 1, m: 60, h: 3600, d: 86400 };

        const options: SignOptions = {
            expiresIn: num * map[unit as keyof typeof map],
        }

        return options;
    }
}
