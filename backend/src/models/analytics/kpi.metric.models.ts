// =====================================
// KPI Metric Models:
// 
// Modèle Mongoose pour les indicateurs clés de performance (KPI) avec des fonctionnalités de pagination intégrées.
// =====================================

import mongoose, { Schema, Document, Types, PaginateModel } from 'mongoose';
import paginate from 'mongoose-paginate-v2';
import { z } from "zod";

import root from '@/models/root.models';


// ==================
// Interface de base
// =================

export interface IKPIMetric extends Document {
    id: Types.ObjectId | string;
    store: Types.ObjectId | string;
    date: Date;
    name: string;
    value: number;
    targetValue?: number;
    variance: number;
    createdAt?: Date;
    updatedAt?: Date;
}


// ==================
// Schéma Mongoose
// ==================

const KPIMetricSchema: Schema<IKPIMetric> = new Schema(
    {
        store: { type: Schema.Types.ObjectId, ref: 'Store', required: true },
        date: { type: Date, required: true },
        name: { type: String, required: true },
        value: { type: Number, required: true },
        targetValue: { type: Number },
        variance: { type: Number, required: true },
    },
    {
        timestamps: true,
    }
);


// ==================
// Validation avec Zod
// ==================

export const KPIMetricValidationSchema = z.object({
    store: z.string().length(24, "L'ID du magasin doit être une chaîne de 24 caractères."),
    date: z.preprocess((arg) => {
        if (typeof arg == 'string' || arg instanceof Date) return new Date(arg);
    }, z.date({ error: "La date doit être une date valide." })),
    name: z.string().min(1, "Le nom de l'indicateur KPI est requis."),
    value: z.number({ error: "La valeur doit être un nombre." }),
    targetValue: z.number({ error: "La valeur cible doit être un nombre." }).optional(),
    variance: z.number({ error: "La variance doit être un nombre." }),
});


export const RequiredKPIMetricAttrs = ['store', 'date', 'name', 'value', 'variance'] as const;


// ==================
// Modèle Mongoose avec pagination
// ==================

KPIMetricSchema.plugin(paginate);
KPIMetricSchema.plugin(root);


// ==================
// Export du modèle
// ==================

interface KPIMetricModel<T extends Document> extends PaginateModel<T> {}

const KPIMetric: KPIMetricModel<IKPIMetric> = mongoose.model<IKPIMetric>('KPIMetric', KPIMetricSchema) as KPIMetricModel<IKPIMetric>;

export default KPIMetric;
