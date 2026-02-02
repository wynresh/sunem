// ================================
// promotion condition models
// condition d'application des promotions
// ================================


import mongoose, { Schema, Document, Types, PaginateModel } from 'mongoose';
import paginate from 'mongoose-paginate-v2';
import { z } from "zod";

import root from '@/models/root.models';


// ==================
// Interface de base
// =================

export interface IPromoCondition extends Document {
    id: Types.ObjectId | string;
    promotion: Types.ObjectId | string;
    conditionType: 'MIN_AMOUNT' | 'SPECIFIC_PRD' | 'CUSTOMER_SEGMENT';
    conditionValue?: string;
    operator: 'AND' | 'OR';
    createdAt?: Date;
    updatedAt?: Date;
}


// ==================
// Schéma Mongoose
// ==================

const PromoConditionSchema: Schema<IPromoCondition> = new Schema(
    {
        promotion: { type: Schema.Types.ObjectId, ref: 'Promotion', required: true },
        conditionType: { type: String, enum: ['MIN_AMOUNT', 'SPECIFIC_PRD', 'CUSTOMER_SEGMENT'], required: true },
        conditionValue: { type: String },
        operator: { type: String, enum: ['AND', 'OR'], default: 'AND' },
    },
    {
        timestamps: true,
    }
);


// ==================
// Validation avec Zod
// ==================

export const PromoConditionZodSchema = z.object({
    promotion: z.string().length(24, "L'ID de la promotion doit être une chaîne de 24 caractères."),
    conditionType: z.enum(['MIN_AMOUNT', 'SPECIFIC_PRD', 'CUSTOMER_SEGMENT'], "Le type de condition est invalide."),
    conditionValue: z.string().optional(),
    operator: z.enum(['AND', 'OR']).optional(),
});

export const RequiredAttrs = ['promotion', 'conditionType'] as const;


// ==================
// plugin de pagination
// ==================

PromoConditionSchema.plugin(paginate);
PromoConditionSchema.plugin(root);

// ==================
// Modèle Mongoose
// ==================

interface IPromoConditionModel<T extends Document> extends PaginateModel<T> {}

const PromoConditionModel = mongoose.model<IPromoCondition, IPromoConditionModel<IPromoCondition>>('PromoCondition', PromoConditionSchema);

export default PromoConditionModel;
