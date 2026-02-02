// ==========================
// Delivery Models:
// 
// Modèle Mongoose pour les livraisons avec des fonctionnalités de pagination intégrées.
// ==========================

import mongoose, { Schema, Document, Types, PaginateModel } from 'mongoose';
import paginate from 'mongoose-paginate-v2';
import { z } from "zod";

import root from '@/models/root.models';


// ==================
// Interface de base
// =================

export interface IDelivery extends Document {
    id: Types.ObjectId | string;
    deliveryNumber: string;
    purchaseOrder: Types.ObjectId | string;
    deliveryDate: Date;
    carrier?: string;
    trackingNumber?: string;
    receivedBy: Types.ObjectId | string;
    status: 'PENDING' | 'RECEIVED' | 'CANCELLED';
    createdAt?: Date;
    updatedAt?: Date;
}


// ==================
// Schéma Mongoose
// ==================

const DeliverySchema: Schema<IDelivery> = new Schema(
    {
        deliveryNumber: { type: String, required: true, unique: true },
        purchaseOrder: { type: Schema.Types.ObjectId, ref: 'PurchaseOrder', required: true },
        deliveryDate: { type: Date, required: true },
        carrier: { type: String },
        trackingNumber: { type: String },
        receivedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        status: { type: String, enum: ['PENDING', 'RECEIVED', 'CANCELLED'], default: 'PENDING' },
    },
    {
        timestamps: true,
    }
);


// ==================
// Validation avec Zod
// ==================

export const DeliveryZodSchema = z.object({
    deliveryNumber: z.string().min(1),
    purchaseOrder: z.string().length(24),
    deliveryDate: z.date(),
    carrier: z.string().optional(),
    trackingNumber: z.string().optional(),
    receivedBy: z.string().length(24),
    status: z.enum(['PENDING', 'RECEIVED', 'CANCELLED']).optional(),
});


export const RequiredAttrsDelivery = [
    'deliveryNumber',
    'purchaseOrder',
    'deliveryDate',
    'receivedBy',
];


// ==================
// Plugin de pagination
// ==================

DeliverySchema.plugin(paginate);
DeliverySchema.plugin(root);


// ==================
// Modèle Mongoose
// ==================

interface DeliveryModel<T extends Document> extends PaginateModel<T> {}

const Delivery: DeliveryModel<IDelivery> = mongoose.model<IDelivery, DeliveryModel<IDelivery>>('Delivery', DeliverySchema);

export default Delivery;
