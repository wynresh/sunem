// ================================
// Stock Movement Type Models
//
// Modèle Mongoose pour les types de mouvements de stock avec des fonctionnalités de pagination intégrées.
// ================================

import mongoose, { Schema, Document, Types, PaginateModel } from 'mongoose';
import paginate from 'mongoose-paginate-v2';
import { z } from "zod";

import root from '@/models/root.models';


// ==================
// Interface de base
// =================

export interface IStockMovementType extends Document {
    id: Types.ObjectId | string;
    product: Types.ObjectId | string;
    variant: Types.ObjectId | string;
    store: Types.ObjectId | string;
    mvtType: 'IN' | 'OUT' | 'ADJUSTMENT' | 'TRANSFER';
    quantity: number;
    unitCost: number;
    referenceId?: Types.ObjectId | string;
    referenceType?: 'ORDER' | 'SALE' | 'INVENTORY';
    mvtDate: Date;
    user: Types.ObjectId | string;
    notes?: string;
    createdAt?: Date;
    updatedAt?: Date;
}



// ==================
// Schéma Mongoose
// ==================

const StockMovementTypeSchema: Schema<IStockMovementType> = new Schema(
    {
        product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
        variant: { type: Schema.Types.ObjectId, ref: 'Variant', required: true },
        store: { type: Schema.Types.ObjectId, ref: 'Store', required: true },
        mvtType: { type: String, enum: ['IN', 'OUT', 'ADJUSTMENT', 'TRANSFER'], required: true },
        quantity: { type: Number, required: true },
        unitCost: { type: Number, required: true },
        referenceId: { type: Schema.Types.ObjectId },
        referenceType: { type: String, enum: ['ORDER', 'SALE', 'INVENTORY'] },
        mvtDate: { type: Date, required: true, default: Date.now },
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        notes: { type: String },
    },
    {
        timestamps: true,
    }
);


// ===================
// Validation Zod
// ===================

export const StockMovementTypeZodSchema = z.object({
    product: z.string().length(24),
    variant: z.string().length(24),
    store: z.string().length(24),
    mvtType: z.enum(['IN', 'OUT', 'ADJUSTMENT', 'TRANSFER']),
    quantity: z.number().min(0),
    unitCost: z.number().min(0),
    referenceId: z.string().length(24).optional(),
    referenceType: z.enum(['ORDER', 'SALE', 'INVENTORY']).optional(),
    mvtDate: z.preprocess((arg) => {
        if (typeof arg == 'string' || arg instanceof Date) return new Date(arg);
    }, z.date()),
    user: z.string().length(24),
    notes: z.string().optional(),
});

export const StockMovementTypeRequiredAttrs = [
    'product',
    'variant',
    'store',
    'mvtType',
    'quantity',
    'unitCost',
    'mvtDate',
    'user',
];


// ==================
// Plugin de pagination
// ==================

StockMovementTypeSchema.plugin(paginate);
StockMovementTypeSchema.plugin(root);


// ==================
// Modèle Mongoose
// ==================

interface StockMovementTypeModel<T extends Document> extends PaginateModel<T> {}

const StockMovementType: StockMovementTypeModel<IStockMovementType> = mongoose.model<IStockMovementType, StockMovementTypeModel<IStockMovementType>>('StockMovementType', StockMovementTypeSchema);

export default StockMovementType;
