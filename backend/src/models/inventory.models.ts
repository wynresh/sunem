// ================================
// Inventory Models:
// 
// Modèle Mongoose pour les inventaires avec des fonctionnalités de pagination intégrées.
// ================================

import mongoose, { Schema, Document, Types, PaginateModel } from 'mongoose';
import paginate from 'mongoose-paginate-v2';
import { z } from "zod";

import root from '@/models/root.models';


// ==================
// Interface de base
// =================

export interface IInventory extends Document {
    id: Types.ObjectId | string;
    product: Types.ObjectId | string;
    variant: Types.ObjectId | string;
    store: Types.ObjectId | string;
    currentQuantity: number;
    reservedQuantity: number;
    minStock: number;
    maxStock: number;
    alertThreshold: number;
    lastUpdate: Date;
    location: string;
    createdAt?: Date;
    updatedAt?: Date;
}


// ==================
// Schéma Mongoose
// ==================

const InventorySchema: Schema<IInventory> = new Schema(
    {
        product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
        variant: { type: Schema.Types.ObjectId, ref: 'Variant', required: true },
        store: { type: Schema.Types.ObjectId, ref: 'Store', required: true },
        currentQuantity: { type: Number, required: true, default: 0 },
        reservedQuantity: { type: Number, required: true, default: 0 },
        minStock: { type: Number, required: true, default: 0 },
        maxStock: { type: Number, required: true, default: 0 },
        alertThreshold: { type: Number, required: true, default: 0 },
        lastUpdate: { type: Date, required: true, default: Date.now },
        location: { type: String, required: true },
    },
    {
        timestamps: true,
    }
);



// ===================
// Validation Zod
// ===================

export const InventoryZodSchema = z.object({
    product: z.string().min(1, "Product ID is required"),
    variant: z.string().min(1, "Variant ID is required"),
    store: z.string().min(1, "Store ID is required"),
    currentQuantity: z.number().min(0, "Current quantity cannot be negative").optional(),
    reservedQuantity: z.number().min(0, "Reserved quantity cannot be negative").optional(),
    minStock: z.number().min(0, "Minimum stock cannot be negative").optional(),
    maxStock: z.number().min(0, "Maximum stock cannot be negative").optional(),
    alertThreshold: z.number().min(0, "Alert threshold cannot be negative").optional(),
    location: z.string().min(1, "Location is required"),
});

export const RequiredAttrs = [
    'product',
    'variant',
    'store',
    'location',
];

// ==================
// Plugins Mongoose
// ==================

InventorySchema.plugin(paginate);
InventorySchema.plugin(root);

// ==================
// Modèle Mongoose
// ==================

interface InventoryModel<T extends Document> extends PaginateModel<T> {}

const Inventory = mongoose.model<IInventory, InventoryModel<IInventory>>('Inventory', InventorySchema);

export default Inventory;
