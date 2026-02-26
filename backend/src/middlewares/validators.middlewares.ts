// =====================================
// Fields Validators
// =====================================

import { Request, Response, NextFunction } from "express";
import { ZodObject, ZodError } from "zod";
/**
 * ✅ Middleware générique de validation basé sur Zod
 */


const validate =
    (schema: ZodObject) =>
        (req: Request, res: Response, next: NextFunction) => {
            try {
                const validatedData = schema.parse({
                    body: req.body
                });

                // Overwrite req objects with validated (and potentially transformed) data
                req.body = validatedData.body as any;

                next();
            } catch (error) {
                if (error instanceof ZodError) {
                    return res.status(400).json({
                        status: "fail",
                        errors: error.issues.map(err => ({
                            path: err.path.join("."),
                            message: err.message
                        }))
                    });
                }
                next(error);
            }
        };

export default validate;