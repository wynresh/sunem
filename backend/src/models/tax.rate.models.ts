// =================================================================
// Tax rate Model
//
// taux de TVA applicable
//==================================================================


import mongoose, { Schema, Document, Types, PaginateModel } from 'mongoose';
import paginate from 'mongoose-paginate-v2';
import { z } from "zod";

import root from '@/models/root.models';


// ==================
// Interface de base
// =================

export interface ITaxRate extends Document {
    id: Types.ObjectId | string;
    code: string;
    name: string;
    rate: number;
    description?: string;
    effectiveDate: Date;
    endDate?: Date;
    status: 'active' | 'inactive';
    createdAt?: Date;
    updatedAt?: Date;
}


// ==================
// Schéma Mongoose
// ==================

const TaxRateSchema: Schema<ITaxRate> = new Schema(
    {
        code: { type: String, required: true, unique: true },
        name: { type: String, required: true },
        rate: { type: Number, required: true },
        description: { type: String },
        effectiveDate: { type: Date, required: true },
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

export const TaxRateZodSchema = z.object({
    code: z.string().min(1, "Le code est requis"),
    name: z.string().min(1, "Le nom est requis"),
    rate: z.number().min(0, "Le taux doit être positif"),
    description: z.string().optional(),
    effectiveDate: z.date(),
    endDate: z.date().optional(),
    status: z.enum(['active', 'inactive']).optional(),
});

export const RequiredAttrs = [
    'code',
    'name',
    'rate',
    'effectiveDate',
];

// ==================
// Convertir
// ==================

export const convertToRate = (input: any): ITaxRate => {
    return {
        ...(input.code && { code: String(input.code) }),
        ...(input.name && { name: String(input.name) }),
        ...(input.rate && { rate: Number(input.rate) }),
        ...(input.description && { description: String(input.description) }),
        ...(input.effectiveDate && { effectiveDate: new Date(input.effectiveDate) }),
        ...(input.endDate && { endDate: new Date(input.endDate) }),
        ...(input.status && { status: String(input.status) as 'active' | 'inactive' }),
    } as ITaxRate;
};


// ==================
// Plugins
// ==================

TaxRateSchema.plugin(paginate);
TaxRateSchema.plugin(root);


// ==================
// Modèle Mongoose
// ==================

interface TaxRateModel<T extends Document> extends PaginateModel<T> {}

const TaxRate = mongoose.model<ITaxRate, TaxRateModel<ITaxRate>>('TaxRate', TaxRateSchema);

export default TaxRate;
