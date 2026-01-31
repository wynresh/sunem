// ================================
// Promotion Produit Modèle
//
// produit concerné par une promotion
// ================================


import mongoose, { Schema, Document, Types, PaginateModel } from 'mongoose';
import paginate from 'mongoose-paginate-v2';
import { z } from "zod";

import root from '@/models/root.models';


// ==================
// Interface de base
// =================

export interface IPromoPrd extends Document {
    id: Types.ObjectId | string;
    promotion: Types.ObjectId | string;
    product: Types.ObjectId | string;
    store: Types.ObjectId | string;
    variant?: Types.ObjectId | string;
    isExcluded: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}


// ==================
// Schéma Mongoose
// ==================

const PromoPrdSchema: Schema<IPromoPrd> = new Schema(
    {
        promotion: { type: Schema.Types.ObjectId, ref: 'Promotion', required: true },
        product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
        store: { type: Schema.Types.ObjectId, ref: 'Store', required: true },
        variant: { type: Schema.Types.ObjectId, ref: 'Variant' },
        isExcluded: { type: Boolean, default: false },
    },
    {
        timestamps: true,
    }
);


// ==================
// Validation avec Zod
// ==================

export const PromoPrdZodSchema = z.object({
    promotion: z.string().length(24, "L'ID de la promotion doit être une chaîne de 24 caractères."),
    product: z.string().length(24, "L'ID du produit doit être une chaîne de 24 caractères."),
    store: z.string().length(24, "L'ID du magasin doit être une chaîne de 24 caractères."),
    variant: z.string().length(24, "L'ID de la variante doit être une chaîne de 24 caractères.").optional(),
    isExcluded: z.boolean().optional(),
});

export const RequiredAttrs = ['promotion', 'product', 'store'] as const;


// ==================
// Convertir
// ==================

export const convertToPromoPrd = (data: any): IPromoPrd => {
    return {
        promotion: data.promotion,
        product: data.product,
        store: data.store,
        variant: data.variant,
        isExcluded: data.isExcluded || false,
    } as IPromoPrd;
};


// ==================
// Plugin de pagination
// ==================

PromoPrdSchema.plugin(paginate);
PromoPrdSchema.plugin(root);


// ==================
// Modèle Mongoose
// ==================

interface PromoPrdModel<T extends Document> extends PaginateModel<T> {}

const PromoPrd: PromoPrdModel<IPromoPrd> = mongoose.model<IPromoPrd>('PromoPrd', PromoPrdSchema) as PromoPrdModel<IPromoPrd>;

export default PromoPrd;
