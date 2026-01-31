// ================================
// Product Price Models:
// 
// Modèle Mongoose pour les prix des produits avec des fonctionnalités de pagination intégrées.
// ================================

import mongoose, { Schema, Document, Types, PaginateModel } from 'mongoose';
import paginate from 'mongoose-paginate-v2';
import { z } from "zod";

import root from '@/models/root.models';


// ==================
// Interface de base
// =================

export interface IProductPrice extends Document {
    id: Types.ObjectId | string;
    product: Types.ObjectId | string;
    store: Types.ObjectId | string;
    variant?: Types.ObjectId | string;
    costPrice: number;
    sellingPriceHT: number;
    taxRate: Types.ObjectId | string;
    // Marge bénéficiaire en pourcentage
    margin: number;
    priceType: 'REGULAR' | 'PROMOTIONAL' | 'CLEARANCE';
    startDate?: Date;
    endDate?: Date;
    status: 'active' | 'inactive';
    createdAt?: Date;
    updatedAt?: Date;
}


// ==================
// Schéma Mongoose
// ==================

const ProductPriceSchema: Schema<IProductPrice> = new Schema(
    {
        product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
        store: { type: Schema.Types.ObjectId, ref: 'Store', required: true },
        variant: { type: Schema.Types.ObjectId, ref: 'ProductVariant' },
        costPrice: { type: Number, required: true },
        sellingPriceHT: { type: Number, required: true },
        taxRate: { type: Schema.Types.ObjectId, ref: 'TaxRate', required: true },
        margin: { type: Number, required: true },
        priceType: { type: String, enum: ['REGULAR', 'PROMOTIONAL', 'CLEARANCE'], default: 'REGULAR' },
        startDate: { type: Date },
        endDate: { type: Date },
        status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    },
    {
        timestamps: true,
    }
);


// ==================
// Validation avec Zod
// ==================

export const ProductPriceZodSchema = z.object({
    product: z.string().min(1, "Le produit est requis"),
    store: z.string().min(1, "Le magasin est requis"),
    variant: z.string().optional(),
    costPrice: z.number().min(0, "Le prix de revient doit être positif"),
    sellingPriceHT: z.number().min(0, "Le prix de vente HT doit être positif"),
    taxRate: z.string().min(1, "Le taux de TVA est requis"),
    margin: z.number().min(0, "La marge doit être positive"),
    priceType: z.enum(['REGULAR', 'PROMOTIONAL', 'CLEARANCE']).default('REGULAR'),
    startDate: z.date().optional(),
    endDate: z.date().optional(),
    status: z.enum(['active', 'inactive']).default('active'),
});

export const ProductPriceRequiredAttrs = [
    'product',
    'store',
    'costPrice',
    'sellingPriceHT',
    'taxRate',
    'margin',
];


// ==================
// Plugin de pagination
// ==================

ProductPriceSchema.plugin(paginate);
ProductPriceSchema.plugin(root);


// ==================
// Modèle Mongoose
// ==================

interface ProductPriceModel<T extends Document> extends PaginateModel<T> {}

const ProductPrice: ProductPriceModel<IProductPrice> = mongoose.model<IProductPrice, ProductPriceModel<IProductPrice>>('ProductPrice', ProductPriceSchema);
export default ProductPrice;
