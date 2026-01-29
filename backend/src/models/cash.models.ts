// ======================
// Cash Register Models
//
// Modèle Mongoose pour les caisses enregistreuses avec des fonctionnalités de pagination intégrées.
// ======================

import mongoose, { Schema, Document, Types, PaginateModel } from 'mongoose';
import paginate from 'mongoose-paginate-v2';
import { z } from "zod";

import root from '@/models/root.models';


// ==================
// Interface de base
// =================

export interface ICashRegister extends Document {
    id: Types.ObjectId | string;
    store: Types.ObjectId | string;
    registerNumber: number;
    status: 'Classic' | 'mobile' | 'self-checkout';
    deviceId: string;
    online: boolean;
    lastActivity?: Date;
    amount?: number;
    createdAt?: Date;
    updatedAt?: Date;
}


// ==================
// Schéma Mongoose
// ==================

const CashRegisterSchema: Schema<ICashRegister> = new Schema(
    {
        store: { type: Schema.Types.ObjectId, ref: 'Store', required: true },
        registerNumber: { type: Number, required: true },
        status: { type: String, enum: ['Classic', 'mobile', 'self-checkout'], default: 'Classic' },
        deviceId: { type: String, required: true, unique: true },
        online: { type: Boolean, default: false },
        lastActivity: { type: Date },
        amount: { type: Number, default: 0 },
    },
    {
        timestamps: true,
    }
);


// ==================
// Validation Zod
// ==================

export const CashRegisterZodSchema = z.object({
    store: z.string().min(1, "L'ID du magasin est requis."),
    registerNumber: z.number().min(1, "Le numéro de la caisse enregistreuse doit être au moins 1."),
    status: z.enum(['Classic', 'mobile', 'self-checkout']),
    deviceId: z.string().min(1, "L'ID de l'appareil est requis."),
    online: z.boolean(),
    amount: z.number().min(0, "Le montant ne peut pas être négatif.").optional(),
});

export const RequiredCashRegisterAttrs = [
    'store',
    'registerNumber',
    'status',
    'deviceId',
    'online',
];

// ==================
// Plugin de pagination
// ==================

CashRegisterSchema.plugin(paginate);
CashRegisterSchema.plugin(root);

// ==================
// Modèle Mongoose
// ==================

interface CashRegisterModel<T extends Document> extends PaginateModel<T> {}

const CashRegister = mongoose.model<ICashRegister, CashRegisterModel<ICashRegister>>('CashRegister', CashRegisterSchema);

export default CashRegister;