// =====================================
// System Settings Models:
// 
// Modèle Mongoose pour les paramètres système avec des fonctionnalités de pagination intégrées.
// =====================================

import mongoose, { Schema, Document, Types, PaginateModel } from 'mongoose';
import paginate from 'mongoose-paginate-v2';
import { z } from "zod";

import root from '@/models/root.models';


// ==================
// Interface de base
// =================

export interface ISystemSetting extends Document {
    id: Types.ObjectId | string;
    key: string;
    value: string;
    type: 'STRING' | 'NUMBER' | 'BOOLEAN' | 'JSON';
    category: 'GENERAL' | 'SECURITY' | 'NOTIFICATIONS' | 'INTEGRATIONS';
    description?: string;
    createdAt?: Date;
    updatedAt?: Date;
}


// ==================
// Schéma Mongoose
// ==================

const SystemSettingSchema: Schema<ISystemSetting> = new Schema(
    {
        key: { type: String, required: true, unique: true },
        value: { type: String, required: true },
        type: { type: String, enum: ['STRING', 'NUMBER', 'BOOLEAN', 'JSON'], required: true },
        category: { type: String, enum: ['GENERAL', 'SECURITY', 'NOTIFICATIONS', 'INTEGRATIONS'], default: 'GENERAL' },
        description: { type: String },
    },
    {
        timestamps: true,
    }
);


// ==================
// Validation avec Zod
// ==================

export const SystemSettingValidation = z.object({
    key: z.string().min(1).max(100),
    value: z.string(),
    type: z.enum(['STRING', 'NUMBER', 'BOOLEAN', 'JSON']),
    category: z.enum(['GENERAL', 'SECURITY', 'NOTIFICATIONS', 'INTEGRATIONS']).optional(),
    description: z.string().max(500).optional(),
});


// ==================
// Modèle Mongoose avec pagination
// ==================

SystemSettingSchema.plugin(paginate);
SystemSettingSchema.plugin(root);


// =================
// Export du modèle
// =================

interface ISystemSettingModel<T extends Document> extends PaginateModel<T> {}

const SystemSetting: ISystemSettingModel<ISystemSetting> = mongoose.model<ISystemSetting, ISystemSettingModel<ISystemSetting>>('SystemSetting', SystemSettingSchema);

export default SystemSetting;
