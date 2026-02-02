// ================================================
// Purchase Order Items Model
//
// Lignes des commandes aux fournisseurs
// ================================================


import mongoose, { Schema, Document, Types, PaginateModel } from 'mongoose';
import paginate from 'mongoose-paginate-v2';
import { z } from "zod";

import root from '@/models/root.models';


// ==================
// Interface de base
// =================

export interface IPurchaseOrderItem extends Document {
    id: Types.ObjectId | string;
    purchaseOrder: Types.ObjectId | string;
    product: Types.ObjectId | string;
    variant?: Types.ObjectId | string;
    orderedQuantity: number;
    receivedQuantity: number;
    unitPrice: number;
    linePrice: number;
    taxRate: number;
    createdAt?: Date;
    updatedAt?: Date;
}


// ==================
// Schéma Mongoose
// ==================

const PurchaseOrderItemSchema: Schema<IPurchaseOrderItem> = new Schema(
    {
        purchaseOrder: { type: Schema.Types.ObjectId, ref: 'PurchaseOrder', required: true },
        product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
        variant: { type: Schema.Types.ObjectId, ref: 'ProductVariant' },
        orderedQuantity: { type: Number, required: true },
        receivedQuantity: { type: Number, required: true, default: 0 },
        unitPrice: { type: Number, required: true },
        linePrice: { type: Number, required: true },
        taxRate: { type: Number, required: true },
    },
    {
        timestamps: true,
    }
);


// ==================
// Validation avec Zod
// ==================

export const PurchaseOrderItemZodSchema = z.object({
    purchaseOrder: z.string().length(24),
    product: z.string().length(24),
    variant: z.string().length(24).optional(),
    orderedQuantity: z.number().min(0),
    receivedQuantity: z.number().min(0).optional(),
    unitPrice: z.number().min(0),
    linePrice: z.number().min(0),
    taxRate: z.number().min(0),
});


export const RequiredAttrs = [
    'purchaseOrder',
    'product',
    'orderedQuantity',
    'unitPrice',
    'linePrice',
    'taxRate',
];

// ==================
// Plugin de pagination
// ==================

PurchaseOrderItemSchema.plugin(paginate);
PurchaseOrderItemSchema.plugin(root);


// ==================
// Modèle Mongoose
// ==================

interface PurchaseOrderItemModel<T extends Document> extends PaginateModel<T> {}

export const PurchaseOrderItem: PurchaseOrderItemModel<IPurchaseOrderItem> = mongoose.model<IPurchaseOrderItem>('PurchaseOrderItem', PurchaseOrderItemSchema) as PurchaseOrderItemModel<IPurchaseOrderItem>;

// ==================
// Export du modèle
// ==================

export default PurchaseOrderItem;
