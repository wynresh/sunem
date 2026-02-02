// =====================================
// Sales Analytics Models:
// 
// Modèle Mongoose pour les analyses de ventes avec des fonctionnalités de pagination intégrées.
// =====================================

import mongoose, { Schema, Document, Types, PaginateModel } from 'mongoose';
import paginate from 'mongoose-paginate-v2';
import { z } from "zod";

import root from '@/models/root.models';


// ==================
// Interface de base
// =================

export interface ISaleAnalytic extends Document {
    id: Types.ObjectId | string;
    store: Types.ObjectId | string;
    product: Types.ObjectId | string;
    date: Date;
    quantitySold: number;
    revenue: number;
    cost: number;
    margin: number;
    promotionDiscount: number;
    uniqueCustomers: number;
    averageBasket: number;
    createdAt?: Date;
    updatedAt?: Date;
}


// ==================
// Schéma Mongoose
// ==================

const SaleAnalyticSchema: Schema<ISaleAnalytic> = new Schema(
    {
        store: { type: Schema.Types.ObjectId, ref: 'Store', required: true },
        product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
        date: { type: Date, required: true },
        quantitySold: { type: Number, required: true },
        revenue: { type: Number, required: true },
        cost: { type: Number, required: true },
        margin: { type: Number, required: true },
        promotionDiscount: { type: Number, required: true },
        uniqueCustomers: { type: Number, required: true },
        averageBasket: { type: Number, required: true },
    },
    {
        timestamps: true,
    }
);


export const requiredSaleAnalyticFields = [
    'store',
    'product',
    'date',
    'quantitySold',
    'revenue',
    'cost',
    'margin',
    'promotionDiscount',
    'uniqueCustomers',
    'averageBasket',
];


// ==================
// Plugin de pagination
// ==================

SaleAnalyticSchema.plugin(paginate);
SaleAnalyticSchema.plugin(root);


// ==================
// Modèle Mongoose
// ==================

interface SaleAnalyticModel<T extends Document> extends PaginateModel<T> {}

const SaleAnalytic: SaleAnalyticModel<ISaleAnalytic> = mongoose.model<ISaleAnalytic, SaleAnalyticModel<ISaleAnalytic>>('SaleAnalytic', SaleAnalyticSchema);

export default SaleAnalytic;
