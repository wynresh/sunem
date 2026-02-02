// =====================================
// Loyalty Point Models:
// 
// Modèle Mongoose pour les points de fidélité avec des fonctionnalités de pagination intégrées.
// =====================================

import mongoose, { Schema, Document, Types, PaginateModel } from 'mongoose';
import paginate from 'mongoose-paginate-v2';
import { z } from "zod";

import root from '@/models/root.models';


// ==================
// Interface de base
// =================

export interface ILoyaltyPoint extends Document {
    id: Types.ObjectId | string;
    customer: Types.ObjectId | string;
    loyaltyProgram: Types.ObjectId | string;
    pointBalance: number;
    pointEarned: number;
    pointRedeemed: number;
    pointExpired: number;
    createdAt?: Date;
    updatedAt?: Date;
}


// ==================
// Schéma Mongoose
// ==================

const LoyaltyPointSchema: Schema<ILoyaltyPoint> = new Schema(
    {
        customer: { type: Schema.Types.ObjectId, ref: 'Customer', required: true },
        loyaltyProgram: { type: Schema.Types.ObjectId, ref: 'LoyaltyProgram', required: true },
        pointBalance: { type: Number, required: true, default: 0 },
        pointEarned: { type: Number, required: true, default: 0 },
        pointRedeemed: { type: Number, required: true, default: 0 },
        pointExpired: { type: Number, required: true, default: 0 },
    },
    {
        timestamps: true,
    }
); 


// ==================
// Validation avec Zod
// ==================

export const LoyaltyPointZodSchema = z.object({
    customer: z.string().length(24),
    loyaltyProgram: z.string().length(24),
    pointBalance: z.number().min(0).optional(),
    pointEarned: z.number().min(0).optional(),
    pointRedeemed: z.number().min(0).optional(),
    pointExpired: z.number().min(0).optional(),
});

export const requiredFieldsLoyaltyPoint = [
    'customer',
    'loyaltyProgram',
];


// ==================
// Plugin de pagination
// ==================

LoyaltyPointSchema.plugin(paginate);
LoyaltyPointSchema.plugin(root);


// ==================
// Modèle Mongoose avec pagination
// ==================

interface LoyaltyPointModel<T extends Document> extends PaginateModel<T> {}

const LoyaltyPoint: LoyaltyPointModel<ILoyaltyPoint> = mongoose.model<ILoyaltyPoint, LoyaltyPointModel<ILoyaltyPoint>>('LoyaltyPoint', LoyaltyPointSchema);

export default LoyaltyPoint;
