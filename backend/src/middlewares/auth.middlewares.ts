import { Request, Response, NextFunction } from "express";
import TokenService from "@/services/token.services";
import User from "@/models/access/user.models";



const auth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authorization = req.headers['authorization'];
        if (!authorization || !authorization?.startsWith('Bearer '))
            res.status(401).json({ message: 'entete d\'authorization manquant' });

        const token = authorization && authorization.split(' ')[1];
        if (!token) res.status(401).json({ message: 'token invalid' });

        const payload = TokenService.verifyToken(token as string);
        if (!payload) res.status(401).json({ message: 'object not found' });

        const user = await User.findById((payload as any).id);
        if (!user || (user.status != 'active' && user.status != 'deleted' && user.online == true)) return res.status(401).json({ message: 'unauthorized' });

        req.user = { id: user.id.toString(), role: user.role };
        next();
    } catch (error) {
        next(error);
    }
}

export default auth;
