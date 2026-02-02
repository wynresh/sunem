// ==============================
// Competitor,Price Models
//
// Prix de concurrence
// ===============================


import mongoose, { Schema, Document, Types, PaginateModel } from 'mongoose';
import paginate from 'mongoose-paginate-v2';
import { z } from "zod";

import root from '@/models/root.models';


// ==================
// Interface de base
// =================

export interface ICompetitorPrice extends Document {
    id: Types.ObjectId | string;
    name: string;
    product: Types.ObjectId | string;
    price: number;
    collectionDate: Date;
    collectionMethod: 'MANUAL' | 'AUTOMATIC';
    url: string;
    active: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}


// ==================
// Schéma Mongoose
// ==================

const CompetitorPriceSchema: Schema<ICompetitorPrice> = new Schema(
    {
        name: { type: String, required: true },
        product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
        price: { type: Number, required: true },
        collectionDate: { type: Date, required: true },
        collectionMethod: { type: String, enum: ['MANUAL', 'AUTOMATIC'], required: true },
        url: { type: String, required: true },
        active: { type: Boolean, default: true },
    },
    {
        timestamps: true,
    }
);


// ==================
// Validation avec Zod
// ==================

export const CompetitorPriceZodSchema = z.object({
    name: z.string().min(1).max(255),
    product: z.string().length(24),
    price: z.number().nonnegative(),
    collectionDate: z.date(),
    collectionMethod: z.enum(['MANUAL', 'AUTOMATIC']),
    url: z.string().url(),
    active: z.boolean().optional(),
});

export const requiredCompetitorPriceAttrs = [
    'name',
    'product',
    'price',
    'collectionDate',
    'collectionMethod',
    'url',
];


// ==================
// Plugin de pagination
// ==================

CompetitorPriceSchema.plugin(paginate);
CompetitorPriceSchema.plugin(root);


// ==================
// Modèle Mongoose
// ==================

interface CompetitorPriceModel<T extends Document> extends PaginateModel<T> {}

const CompetitorPrice: CompetitorPriceModel<ICompetitorPrice> = mongoose.model<ICompetitorPrice, CompetitorPriceModel<ICompetitorPrice>>('CompetitorPrice', CompetitorPriceSchema);

export default CompetitorPrice;
