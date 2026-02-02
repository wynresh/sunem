// =====================================
// Loyalty Program Models:
// 
// Modèle Mongoose pour les programmes de fidélité avec des fonctionnalités de pagination intégrées.
// =====================================

import mongoose, { Schema, Document, Types, PaginateModel } from 'mongoose';
import paginate from 'mongoose-paginate-v2';
import { z } from "zod";

import root from '@/models/root.models';


// ==================
// Interface de base
// =================

export interface ILoyaltyProgram extends Document {
    id: Types.ObjectId | string;
    name: string;
    description?: string;
    pointsPerDollar: number;
    minPointsToRedeem: number;
    expirationDays?: number;
    active: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}


// ==================
// Schéma Mongoose
// ==================

const LoyaltyProgramSchema: Schema<ILoyaltyProgram> = new Schema(
    {
        name: { type: String, required: true, unique: true },
        description: { type: String },
        pointsPerDollar: { type: Number, required: true },
        minPointsToRedeem: { type: Number, required: true },
        expirationDays: { type: Number },
        active: { type: Boolean, default: true },
    },
    {
        timestamps: true,
    }
);


// ==================
// Validation avec Zod
// ==================

export const LoyaltyProgramValidation = {
    create: z.object({
        name: z.string().min(1, "Le nom est requis"),
        description: z.string().optional(),
        pointsPerDollar: z.number().min(0, "Les points par dollar doivent être positifs"),
        minPointsToRedeem: z.number().min(0, "Le minimum de points à échanger doit être positif"),
        expirationDays: z.number().min(1).optional(),
        active: z.boolean().optional(),
    }),
    update: z.object({
        name: z.string().min(1, "Le nom est requis").optional(),
        description: z.string().optional(),
        pointsPerDollar: z.number().min(0, "Les points par dollar doivent être positifs").optional(),
        minPointsToRedeem: z.number().min(0, "Le minimum de points à échanger doit être positif").optional(),
        expirationDays: z.number().min(1).optional(),
        active: z.boolean().optional(),
    }),
};

// ========================
// Plugin de pagination
// ========================

LoyaltyProgramSchema.plugin(paginate);
LoyaltyProgramSchema.plugin(root);


// ==================
// Modèle Mongoose
// ==================

interface LoyaltyProgramModel<T extends Document> extends PaginateModel<T> {}

const LoyaltyProgram: LoyaltyProgramModel<ILoyaltyProgram> = mongoose.model<ILoyaltyProgram, LoyaltyProgramModel<ILoyaltyProgram>>('LoyaltyProgram', LoyaltyProgramSchema);

export default LoyaltyProgram;
