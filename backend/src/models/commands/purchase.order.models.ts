// ============================================
// Purchase Order Model
//
// Commandes aux fournisseurs
// ============================================


import mongoose, { Schema, Document, Types, PaginateModel } from 'mongoose';
import paginate from 'mongoose-paginate-v2';
import { z } from "zod";

import root from '@/models/root.models';


// ==================
// Interface de base
// =================

export interface IPurchaseOrder extends Document {
    id: Types.ObjectId | string;
    Number: string;
    supplier: Types.ObjectId | string;
    store: Types.ObjectId | string;
    orderDate: Date;
    expectedDeliveryDate: Date;
    actualDeliveryDate?: Date;
    status: 'DRAFT' | 'PENDING' | 'PARTIAL' | 'COMPLETED' | 'CANCELLED';
    totalAmount: number;
    taxAmount: number;
    grandTotal: number;
    notes?: string;
    createdBy: Types.ObjectId | string;
    createdAt?: Date;
    updatedAt?: Date;
}


// ==================
// Schéma Mongoose
// ==================

const PurchaseOrderSchema: Schema<IPurchaseOrder> = new Schema(
    {
        Number: { type: String, required: true, unique: true },
        supplier: { type: Schema.Types.ObjectId, ref: 'Supplier', required: true },
        store: { type: Schema.Types.ObjectId, ref: 'Store', required: true },
        orderDate: { type: Date, required: true },
        expectedDeliveryDate: { type: Date, required: true },
        actualDeliveryDate: { type: Date },
        status: { type: String, enum: ['DRAFT', 'PENDING', 'PARTIAL', 'COMPLETED', 'CANCELLED'], default: 'DRAFT' },
        totalAmount: { type: Number, required: true },
        taxAmount: { type: Number, required: true },
        grandTotal: { type: Number, required: true },
        notes: { type: String },
        createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    },
    {
        timestamps: true,
    }
);


// ==================
// Validation avec Zod
// ==================

export const PurchaseOrderValidation = z.object({
    Number: z.string().min(1),
    supplier: z.string().min(1),
    store: z.string().min(1),
    orderDate: z.date(),
    expectedDeliveryDate: z.date(),
    actualDeliveryDate: z.date().optional(),
    status: z.enum(['DRAFT', 'PENDING', 'PARTIAL', 'COMPLETED', 'CANCELLED']).optional(),
    totalAmount: z.number().nonnegative(),
    taxAmount: z.number().nonnegative(),
    grandTotal: z.number().nonnegative(),
    notes: z.string().optional(),
    createdBy: z.string().min(1),
});


export const RequiredAttrs = [
    'Number',
    'supplier',
    'store',
    'orderDate',
    'expectedDeliveryDate',
    'totalAmount',
    'taxAmount',
    'grandTotal',
    'createdBy',
] as const;


// ==================
// Plugins et Modèle
// ==================

PurchaseOrderSchema.plugin(paginate);
PurchaseOrderSchema.plugin(root);


// ==================
// Export du modèle
// ==================

interface PurchaseOrderModel<T extends Document> extends PaginateModel<T> {}

const PurchaseOrder = mongoose.model<IPurchaseOrder, PurchaseOrderModel<IPurchaseOrder>>('PurchaseOrder', PurchaseOrderSchema);

export default PurchaseOrder;
