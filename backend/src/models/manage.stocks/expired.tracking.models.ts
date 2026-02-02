// ================================
// Expiration Tracking Models
// 
// Modèle Mongoose pour le suivi des produits expirés avec des fonctionnalités de pagination intégrées.
// ================================

import mongoose, { Schema, Document, Types, PaginateModel } from 'mongoose';
import paginate from 'mongoose-paginate-v2';
import { z } from "zod";

import root from '@/models/root.models';


// ==================
// Interface de base
// =================

export interface IExpiredTracking extends Document {
    id: Types.ObjectId | string;
    product: Types.ObjectId | string;
    variant: Types.ObjectId | string;
    store: Types.ObjectId | string;
    bacthNumber: string;
    quantity: number;
    expiryDate: Date;
    recevedDate: Date;
    supplier: Types.ObjectId | string;
    status: 'ACTIVE' | 'EXPIRED' | 'CONSUMED';
    alerted: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}


// ==================
// Schéma Mongoose
// ==================

const ExpiredTrackingSchema: Schema<IExpiredTracking> = new Schema(
    {
        product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
        variant: { type: Schema.Types.ObjectId, ref: 'Variant', required: true },
        store: { type: Schema.Types.ObjectId, ref: 'Store', required: true },
        bacthNumber: { type: String, required: true },
        quantity: { type: Number, required: true },
        expiryDate: { type: Date, required: true },
        recevedDate: { type: Date, required: true, default: Date.now },
        supplier: { type: Schema.Types.ObjectId, ref: 'Supplier', required: true },
        status: { type: String, enum: ['ACTIVE', 'EXPIRED', 'CONSUMED'], default: 'ACTIVE' },
        alerted: { type: Boolean, default: false },
    },
    {
        timestamps: true,
    }
);


// ===================
// Validation Zod
// ===================

export const ExpiredTrackingZodSchema = z.object({
    product: z.string().min(1),
    variant: z.string().min(1),
    store: z.string().min(1),
    bacthNumber: z.string().min(1),
    quantity: z.number().min(0),
    expiryDate: z.date(),
    recevedDate: z.date().optional(),
    supplier: z.string().min(1),
    status: z.enum(['ACTIVE', 'EXPIRED', 'CONSUMED']).optional(),
    alerted: z.boolean().optional(),
});


export const requiredExpiredTrackingFields = [
    'product',
    'variant',
    'store',
    'bacthNumber',
    'quantity',
    'expiryDate',
    'supplier',
]; 


// ==================
// Plugin de pagination
// ==================

ExpiredTrackingSchema.plugin(paginate);
ExpiredTrackingSchema.plugin(root);


// ==================
// Modèle Mongoose
// ==================

interface ExpiredTrackingModel<T extends Document> extends PaginateModel<T> {}

const ExpiredTracking: ExpiredTrackingModel<IExpiredTracking> = mongoose.model<IExpiredTracking, ExpiredTrackingModel<IExpiredTracking>>('ExpiredTracking', ExpiredTrackingSchema);

export default ExpiredTracking;
