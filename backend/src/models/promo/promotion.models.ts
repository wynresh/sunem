// ================================
// Promotion Models:
// 
// Modèle Mongoose pour les promotions avec des fonctionnalités de pagination intégrées.
// ================================

import mongoose, { Schema, Document, Types, PaginateModel } from 'mongoose';
import paginate from 'mongoose-paginate-v2';
import { z } from "zod";

import root from '@/models/root.models';


// ==================
// Interface de base
// =================

export interface IPromotion extends Document {
    id: Types.ObjectId | string;
    code: string;
    name: string;
    description?: string;
    promotionType: 'PERCENTAGE' | 'FIXED_AMOUNT' | 'BUY_X_GET_Y' | 'BUNDLE';
    discountValue: number;
    minQuantity?: number;
    maxQuantity?: number;
    startDate: Date;
    endDate: Date;
    applyToAllStores: boolean;
    active: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}


// ==================
// Schéma Mongoose
// ==================

const PromotionSchema: Schema<IPromotion> = new Schema(
    {
        code: { type: String, required: true, unique: true },
        name: { type: String, required: true },
        description: { type: String },
        promotionType: { type: String, enum: ['PERCENTAGE', 'FIXED_AMOUNT', 'BUY_X_GET_Y', 'BUNDLE'], required: true },
        discountValue: { type: Number, required: true },
        minQuantity: { type: Number },
        maxQuantity: { type: Number },
        startDate: { type: Date, required: true },
        endDate: { type: Date, required: true },
        applyToAllStores: { type: Boolean, default: false },
        active: { type: Boolean, default: true },
    },
    {
        timestamps: true,
    }
);


// ==================
// Validation Zod
// ==================

export const PromotionValidation = z.object({
    code: z.string().min(1, "Le code de la promotion est requis."),
    name: z.string().min(1, "Le nom de la promotion est requis."),
    description: z.string().optional(),
    promotionType: z.enum(['PERCENTAGE', 'FIXED_AMOUNT', 'BUY_X_GET_Y', 'BUNDLE']),
    discountValue: z.number().positive("La valeur de la remise doit être un nombre positif."),
    minQuantity: z.number().positive("La quantité minimale doit être un nombre positif.").optional(),
    maxQuantity: z.number().positive("La quantité maximale doit être un nombre positif.").optional(),
    startDate: z.date(),
    endDate: z.date(),
    applyToAllStores: z.boolean().optional(),
    active: z.boolean().optional(),
});

export const RequiredAttrs = [
    'code',
    'name',
    'promotionType',
    'discountValue',
    'startDate',
    'endDate',
];


// ==================
// Convertir
// ==================

export const convertToPromo = (data: any): IPromotion => {
    return {
        id: data._id,
        code: data.code,
        name: data.name,
        description: data.description,
        promotionType: data.promotionType,
        discountValue: data.discountValue,
        minQuantity: data.minQuantity,
        maxQuantity: data.maxQuantity,
        startDate: data.startDate,
        endDate: data.endDate,
        applyToAllStores: data.applyToAllStores,
        active: data.active,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
    } as IPromotion;
};


// ==================
// Plugin de pagination
// ==================

PromotionSchema.plugin(paginate);
PromotionSchema.plugin(root);


// ==================
// Modèle Mongoose
// ==================

interface PromotionModel<T extends Document> extends PaginateModel<T> {}

const Promotion = mongoose.model<IPromotion, PromotionModel<IPromotion>>('Promotion', PromotionSchema);

export default Promotion;
