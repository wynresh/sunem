// ========================
// Audit Log Models:
// 
// Modèle Mongoose pour les journaux d'audit avec des fonctionnalités de pagination intégrées.
// ========================

import mongoose, { Schema, Document, Types, PaginateModel } from 'mongoose';
import paginate from 'mongoose-paginate-v2';
import { z } from "zod";

import root from '@/models/root.models';


// ==================
// Interface de base
// =================

export interface IAuditLog extends Document {
    id: Types.ObjectId | string;
    user: Types.ObjectId | string;
    action: string;
    entity: string;
    entityId: Types.ObjectId | string;
    oldValue: JSON;
    newValue: JSON;
    ipAddress: string;
    userAgent: string;
    createdAt?: Date;
    updatedAt?: Date;
}


// ==================
// Schéma Mongoose
// ==================

const AuditLogSchema: Schema<IAuditLog> = new Schema(
    {
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        action: { type: String, required: true },
        entity: { type: String, required: true },
        entityId: { type: Schema.Types.ObjectId, required: true },
        oldValue: { type: Schema.Types.Mixed },
        newValue: { type: Schema.Types.Mixed },
        ipAddress: { type: String, required: true },
        userAgent: { type: String, required: true },
    },
    {
        timestamps: true,
    }
);


// ==================
// Validation avec Zod
// ==================

export const AuditLogValidation = z.object({
    user: z.string().min(1),
    action: z.string().min(1),
    entity: z.string().min(1),
    entityId: z.string().min(1),
    oldValue: z.any().optional(),
    newValue: z.any().optional(),
    ipAddress: z.string().min(1),
    userAgent: z.string().min(1),
});


// ==================
// Modèle Mongoose avec pagination
// ==================

AuditLogSchema.plugin(paginate);
AuditLogSchema.plugin(root);


// ==================
// Export du modèle
// ==================

interface AuditLogModel<T extends Document> extends PaginateModel<T> {}

const AuditLog: AuditLogModel<IAuditLog> = mongoose.model<IAuditLog>('AuditLog', AuditLogSchema) as AuditLogModel<IAuditLog>;

export default AuditLog;
