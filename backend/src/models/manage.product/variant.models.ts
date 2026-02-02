// ==================================================
// Variant Product Model
//
// permet de gérer les variantes de produits dans le système.
// ==================================================

import mongoose, { Schema, Document, Types, PaginateModel } from 'mongoose';
import paginate from 'mongoose-paginate-v2';
import { z } from "zod";

import root from '@/models/root.models';


// ==================
// Interface de base
// =================

export interface IVariant extends Document {
    id: Types.ObjectId | string;
    product: Types.ObjectId | string;
    code: string;
    name: string;
    barcode?: string;
    price: number;
    createdAt?: Date;
    updatedAt?: Date;
}


// ==================
// Schéma Mongoose
// ==================

const VariantSchema: Schema<IVariant> = new Schema(
    {
        product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
        code: { type: String, required: true, unique: true },
        name: { type: String, required: true },
        barcode: { type: String, unique: true, sparse: true },
        price: { type: Number, required: true },
    },
    {
        timestamps: true,
    }
);


// ==================
// Validation Zod
// ==================

export const VariantZodSchema = z.object({
    product: z.string().min(1, "L'ID du produit est requis."),
    code: z.string().min(1, "Le code de la variante est requis."),
    name: z.string().min(1, "Le nom de la variante est requis."),
    barcode: z.string().optional(),
    price: z.number().min(0, "Le prix doit être un nombre positif."),
});

export const VariantUpdateZodSchema = VariantZodSchema.partial();

export const RequiredVariantAttrs = [
    'product',
    'code',
    'name',
    'price',
];


// ========================
// Convertir
// ========================

export const convertToVariant = (data: any) => {
    return {
        ...(data.product && { product: data.product }),
        ...(data.code && { code: data.code }),
        ...(data.name && { name: data.name }),
        ...(data.barcode && { barcode: data.barcode }),
        ...(data.price !== undefined && { price: data.price }),
    };
};


// ==================
// Plugins Mongoose
// ==================

VariantSchema.plugin(paginate);
VariantSchema.plugin(root);


// ==================
// Modèle Mongoose
// ==================

interface VariantModel<T extends Document> extends PaginateModel<T> {}

const Variant: VariantModel<IVariant> = mongoose.model<IVariant, VariantModel<IVariant>>('Variant', VariantSchema);

export default Variant;
