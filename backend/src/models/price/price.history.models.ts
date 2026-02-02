// ================================
// Price History Models:
// 
// Modèle Mongoose pour l'historique des prix avec des fonctionnalités de pagination intégrées.
// ================================

import mongoose, { Schema, Document, Types, PaginateModel } from 'mongoose';
import paginate from 'mongoose-paginate-v2';
import { z } from "zod";

import root from '@/models/root.models';


// ==================
// Interface de base
// =================

export interface IPriceHistory extends Document {
    id: Types.ObjectId | string;
    product: Types.ObjectId | string;
    store: Types.ObjectId | string;
    oldPrice: number;
    newPrice: number;
    changedAt: Date;
    changedBy: Types.ObjectId | string;
    reason?: string;
    createdAt?: Date;
    updatedAt?: Date;
}


// ==================
// Schéma Mongoose
// ==================

const PriceHistorySchema: Schema<IPriceHistory> = new Schema(
    {
        product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
        store: { type: Schema.Types.ObjectId, ref: 'Store', required: true },
        oldPrice: { type: Number, required: true },
        newPrice: { type: Number, required: true },
        changedAt: { type: Date, required: true, default: Date.now },
        changedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        reason: { type: String },
    },
    {
        timestamps: true,
    }
);


// ==================
// Validation avec Zod
// ==================

export const PriceHistoryZodSchema = z.object({
    product: z.string().min(1, "Le produit est requis"),
    store: z.string().min(1, "Le magasin est requis"),
    oldPrice: z.number().nonnegative("L'ancien prix doit être positif"),
    newPrice: z.number().nonnegative("Le nouveau prix doit être positif"),
    changedAt: z.date().optional(),
    changedBy: z.string().min(1, "L'utilisateur ayant effectué le changement est requis"),
    reason: z.string().optional(),
});

export const RequiredAttrs = [
    'product',
    'store',
    'oldPrice',
    'newPrice',
    'changedBy',
];


// ==================
// convertir
// ==================

export const convertToPriceHistory = (input: any): IPriceHistory => {
    return {
        product: input.product,
        store: input.store,
        oldPrice: input.oldPrice,
        newPrice: input.newPrice,
        changedAt: input.changedAt || new Date(),
        changedBy: input.changedBy,
        reason: input.reason,
    } as IPriceHistory;
};


// ==================
// Plugin de pagination
// ==================

PriceHistorySchema.plugin(paginate);
PriceHistorySchema.plugin(root);


// ==================
// Modèle Mongoose
// ==================

interface PriceHistoryModel<T extends Document> extends PaginateModel<T> {}

const PriceHistory: PriceHistoryModel<IPriceHistory> = mongoose.model<IPriceHistory, PriceHistoryModel<IPriceHistory>>('PriceHistory', PriceHistorySchema);
export default PriceHistory;
