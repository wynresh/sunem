// ========================================
// Fields Required middlewres
// ========================================

import { Request, Response, NextFunction } from "express";


const requiredFields = 
    (fields: string[]) =>
        (req: Request, res: Response, next: NextFunction) => {
            // Find the first field that is missing from the request body
            const missingField = fields.find(field => !req.body[field]);

            if (missingField) {
                return res.status(400).json({ 
                    message: `${missingField} is required` 
                });
            }

            next();
        };

export default requiredFields;
