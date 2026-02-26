// ========================================
// Permission middleware
// ========================================

import Role from "@/models/access/role.models";
import { Request, Response, NextFunction } from "express";


const permissions = 
    (requiredPermissions: string[]) => // 1. Rename for clarity
        async (req: Request, res: Response, next: NextFunction) => {
            if (!req.user) return res.status(401).json({ message: 'unauthorized' });
            
            const role = await Role.findByName(req.user.role);
            if (!role) return res.status(404).json({ message: 'role not found' });

            // 2. Check if the user's role has EVERY required permission
            const userPermissions = role.permissions || []; // Adjust based on your schema
            const hasAllPermissions = requiredPermissions.every(perm => 
                userPermissions.includes(perm)
            );

            if (!hasAllPermissions) {
                return res.status(403).json({ // 3. Use 403 Forbidden for authz issues
                    message: 'Permission denied: Insufficient privileges'
                });
            }

            next();
        }

export default permissions;
