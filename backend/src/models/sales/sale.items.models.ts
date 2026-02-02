// =====================================
// Sale Items Model
//
// Articles vendus dans une transaction de vente
// =====================================


import mongoose, { Schema, Document, Types, PaginateModel } from 'mongoose';
import paginate from 'mongoose-paginate-v2';
import { int, z } from "zod";

import root from '@/models/root.models';


// ==================
// Interface de base
// =================

export interface ISaleItem extends Document {
    id: Types.ObjectId | string;
    saleTransaction: Types.ObjectId | string;
    product: Types.ObjectId | string;
    variant?: Types.ObjectId | string;
    quantity: number;
    unitPrice: number;
    unitPriceHT: number;
    taxRate: number;
    taxAmount: number;
    discountAmount: number;
    lineTotal: number;
    promotionApplied?: Types.ObjectId | string; // promotion
    createdAt?: Date;
    updatedAt?: Date;
}


// ==================
// Schéma Mongoose
// ==================

const SaleItemSchema: Schema<ISaleItem> = new Schema(
    {
        saleTransaction: { type: Schema.Types.ObjectId, ref: 'SaleTransaction', required: true },
        product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
        variant: { type: Schema.Types.ObjectId, ref: 'ProductVariant' },
        quantity: { type: Number, required: true },
        unitPrice: { type: Number, required: true },
        unitPriceHT: { type: Number, required: true },
        taxRate: { type: Number, required: true },
        taxAmount: { type: Number, required: true },
        discountAmount: { type: Number, required: true },
        lineTotal: { type: Number, required: true },
        promotionApplied: { type: Schema.Types.ObjectId, ref: 'Promotion' },
    },
    {
        timestamps: true,
    }
);


// ==================
// Validation avec Zod
// ==================

export const SaleItemZodSchema = z.object({
    saleTransaction: z.string().length(24, "L'ID de la transaction de vente doit être une chaîne de 24 caractères."),
    product: z.string().length(24, "L'ID du produit doit être une chaîne de 24 caractères."),
    variant: z.string().length(24, "L'ID de la variante doit être une chaîne de 24 caractères.").optional(),
    quantity: z.number().min(1, "La quantité doit être au moins de 1."),
    unitPrice: z.number().min(0, "Le prix unitaire doit être au moins de 0."),
    unitPriceHT: z.number().min(0, "Le prix unitaire HT doit être au moins de 0."),
    taxRate: z.number().min(0, "Le taux de taxe doit être au moins de 0."),
    taxAmount: z.number().min(0, "Le montant de la taxe doit être au moins de 0."),
    discountAmount: z.number().min(0, "Le montant de la remise doit être au moins de 0."),
    lineTotal: z.number().min(0, "Le total de la ligne doit être au moins de 0."),
    promotionApplied: z.string().length(24, "L'ID de la promotion doit être une chaîne de 24 caractères.").optional(),
});


export const SaleItemRequiredAttrs = [
    'saleTransaction',
    'product',
    'quantity',
    'unitPrice',
    'unitPriceHT',
    'taxRate',
    'taxAmount',
    'discountAmount',
    'lineTotal',
];


// ==================
// Plugin de pagination
// ==================

SaleItemSchema.plugin(paginate);
SaleItemSchema.plugin(root);


// ==================
// Modèle Mongoose
// ==================

interface SaleItemModel<T extends Document> extends PaginateModel<T> {}

const SaleItem: SaleItemModel<ISaleItem> = mongoose.model<ISaleItem>('SaleItem', SaleItemSchema) as SaleItemModel<ISaleItem>;

export default SaleItem;
