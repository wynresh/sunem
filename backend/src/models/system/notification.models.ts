// =====================================
// Notification Models
// 
// Modèle Mongoose pour les notifications système avec des fonctionnalités de pagination intégrées.
// =====================================

import mongoose, { Schema, Document, Types, PaginateModel } from 'mongoose';
import paginate from 'mongoose-paginate-v2';
import { z } from "zod";

import root from '@/models/root.models';


// ==================
// Interface de base
// =================

export interface INotification extends Document {
    id: Types.ObjectId | string;
    user: Types.ObjectId | string;
    type: 'INFO' | 'WARNING' | 'ERROR' | 'SUCCESS';
    title: string;
    message: string;
    read: boolean;
    priority: 'NORMAL' | 'HIGH' | 'URGENT';
    relatedEntityType?: string;
    relatedEntityId?: Types.ObjectId | string;
    createdAt?: Date;
    updatedAt?: Date;
}


// ==================
// Schéma Mongoose
// ==================

const NotificationSchema: Schema<INotification> = new Schema(
    {
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        type: { type: String, enum: ['INFO', 'WARNING', 'ERROR', 'SUCCESS'], required: true },
        title: { type: String, required: true },
        message: { type: String, required: true },
        read: { type: Boolean, default: false },
        priority: { type: String, enum: ['NORMAL', 'HIGH', 'URGENT'], default: 'NORMAL' },
        relatedEntityType: { type: String },
        relatedEntityId: { type: Schema.Types.ObjectId },
    },
    {
        timestamps: true,
    }
);



// ==================
// Validation avec Zod
// ==================

export const NotificationValidation = {
    create: z.object({
        user: z.string().min(1),
        type: z.enum(['INFO', 'WARNING', 'ERROR', 'SUCCESS']),
        title: z.string().min(1).max(255),
        message: z.string().min(1),
        priority: z.enum(['NORMAL', 'HIGH', 'URGENT']).optional(),
        relatedEntityType: z.string().optional(),
        relatedEntityId: z.string().optional(),
    }),
    update: z.object({
        read: z.boolean().optional(),
    }),
};


// ==================
// Modèle Mongoose avec pagination
// ==================

NotificationSchema.plugin(paginate);
NotificationSchema.plugin(root);


// ==================
// Modèle Mongoose
// ==================

interface NotificationModel<T extends Document> extends PaginateModel<T> {} 

const Notification = mongoose.model<INotification, NotificationModel<INotification>>('Notification', NotificationSchema);

export default Notification;
