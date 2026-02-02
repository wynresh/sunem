// =================================================================
// PRD Supplier Model
//
// permet de gerer les produits d'un fournisseur
// =================================================================


import mongoose, { Schema, Document, Types, PaginateModel } from 'mongoose';
import paginate from 'mongoose-paginate-v2';
import { z } from "zod";

import root from '@/models/root.models';


// ==================
// Interface de base
// =================

export interface IPrdSupplier extends Document {
    id: Types.ObjectId | string;
    product: Types.ObjectId | string;
    supplier: Types.ObjectId | string;
    code: string;
    name: string;
    purchasePrice: number;
    minOrderQuantity: number;
    packagingQuantity: number;
    isPreferred: boolean;
    lastOrderDate?: Date;
    createdAt?: Date;
    updatedAt?: Date;
}


// ==================
// Schéma Mongoose
// ==================

const PrdSupplierSchema: Schema<IPrdSupplier> = new Schema(
    {
        product: { type: Schema.Types.ObjectId, ref: 'PrdProduct', required: true },
        supplier: { type: Schema.Types.ObjectId, ref: 'Supplier', required: true },
        code: { type: String, required: true },
        name: { type: String, required: true },
        purchasePrice: { type: Number, required: true },
        minOrderQuantity: { type: Number, required: true },
        packagingQuantity: { type: Number, required: true },
        isPreferred: { type: Boolean, default: false },
        lastOrderDate: { type: Date },
    },
    {
        timestamps: true,
    }
);


// ==================
// Validation avec Zod
// ==================

export const PrdSupplierValidation = z.object({
    product: z.string().min(1, "Le produit est requis"),
    supplier: z.string().min(1, "Le fournisseur est requis"),
    code: z.string().min(1, "Le code est requis"),
    name: z.string().min(1, "Le nom est requis"),
    purchasePrice: z.number().min(0, "Le prix d'achat doit être positif"),
    minOrderQuantity: z.number().min(1, "La quantité minimale de commande doit être au moins 1"),
    packagingQuantity: z.number().min(1, "La quantité d'emballage doit être au moins 1"),
    isPreferred: z.boolean().optional(),
    lastOrderDate: z.date().optional(),
});

export const PrdSupplierUpdateValidation = PrdSupplierValidation.partial();

export const RequiredAttrs = [
    'product',
    'supplier',
    'code',
    'name',
    'purchasePrice',
    'minOrderQuantity',
    'packagingQuantity',
];

// ==================
// Convertir
// ==================

export const convertToPrdSupplier = (data: any): IPrdSupplier => {
    return {
        ...(data.product && { product: data.product }),
        ...(data.supplier && { supplier: data.supplier }),
        ...(data.code && { code: data.code }),
        ...(data.name && { name: data.name }),
        ...(data.purchasePrice && { purchasePrice: data.purchasePrice }),
        ...(data.minOrderQuantity && { minOrderQuantity: data.minOrderQuantity }),
        ...(data.packagingQuantity && { packagingQuantity: data.packagingQuantity }),
        ...(data.isPreferred !== undefined && { isPreferred: data.isPreferred }),
        ...(data.lastOrderDate && { lastOrderDate: data.lastOrderDate }),
    } as IPrdSupplier;
}


// ==================
// Plugin de pagination
// ==================

PrdSupplierSchema.plugin(paginate);
PrdSupplierSchema.plugin(root);

// ==================
// Modèle Mongoose
// ==================

interface PrdSupplierModel<T extends Document> extends PaginateModel<T> {}

const PrdSupplier = mongoose.model<IPrdSupplier, PrdSupplierModel<IPrdSupplier>>('PrdSupplier', PrdSupplierSchema);

export default PrdSupplier;
