// =====================================
// Sales Transaction Models:
// 
// Modèle Mongoose pour les transactions de vente avec des fonctionnalités de pagination intégrées.
// =====================================

import mongoose, { Schema, Document, Types, PaginateModel } from 'mongoose';
import paginate from 'mongoose-paginate-v2';
import { int, z } from "zod";

import root from '@/models/root.models';


// ==================
// Interface de base
// =================

export interface ISalesTransaction extends Document {
    id: Types.ObjectId | string;
    store: Types.ObjectId | string;
    cashRegister: Types.ObjectId | string;
    cashier: Types.ObjectId | string; // Référence à l'utilisateur
    paymentMethod: 'CASH' | 'CARD' | 'MOBILE' | 'MIXED';
    transactionDate: Date;
    referenceNumber?: string;
    subTotal: number;
    discountTotal: number;
    grandTotal: number;
    cardLast4Digits?: string;
    customer?: Types.ObjectId | string;
    loyaltyPointsEarned?: number;
    loyaltyPointsRedeemed?: number;
    refunded: boolean;
    originalTransaction?: Types.ObjectId | string; // Pour les remboursements reférences à la transaction originale
    notes?: string;
    createdAt?: Date;
    updatedAt?: Date;
}


// ==================
// Schéma Mongoose
// ==================

const SalesTransactionSchema: Schema<ISalesTransaction> = new Schema(
    {
        store: { type: Schema.Types.ObjectId, ref: 'Store', required: true },
        cashRegister: { type: Schema.Types.ObjectId, ref: 'CashRegister', required: true },
        cashier: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        paymentMethod: { type: String, enum: ['CASH', 'CARD', 'MOBILE', 'MIXED'], required: true },
        transactionDate: { type: Date, required: true },
        referenceNumber: { type: String },
        subTotal: { type: Number, required: true },
        discountTotal: { type: Number, required: true },
        grandTotal: { type: Number, required: true },
        cardLast4Digits: { type: String },
        customer: { type: Schema.Types.ObjectId, ref: 'Customer' },
        loyaltyPointsEarned: { type: Number },
        loyaltyPointsRedeemed: { type: Number },
        refunded: { type: Boolean, default: false },
        originalTransaction: { type: Schema.Types.ObjectId, ref: 'SalesTransaction' },
        notes: { type: String },
    },
    {
        timestamps: true,
    }
);


// =================
// Validation avec Zod
// =================

export const SalesTransactionValidation = z.object({
    store: z.string().min(1),
    cashRegister: z.string().min(1),
    cashier: z.string().min(1),
    paymentMethod: z.enum(['CASH', 'CARD', 'MOBILE', 'MIXED']),
    transactionDate: z.date(),
    referenceNumber: z.string().optional(),
    subTotal: z.number().nonnegative(),
    discountTotal: z.number().nonnegative(),
    grandTotal: z.number().nonnegative(),
    cardLast4Digits: z.string().length(4).optional(),
    customer: z.string().min(1).optional(),
    loyaltyPointsEarned: z.number().nonnegative().optional(),
    loyaltyPointsRedeemed: z.number().nonnegative().optional(),
    refunded: z.boolean().optional(),
    originalTransaction: z.string().min(1).optional(),
    notes: z.string().optional(),
});


export const requiredAttrs = [
    'store',
    'cashRegister',
    'cashier',
    'paymentMethod',
    'transactionDate',
    'subTotal',
    'discountTotal',
    'grandTotal',
];


// ==================
// plugin de pagination
// ==================

SalesTransactionSchema.plugin(paginate);
SalesTransactionSchema.plugin(root);


// ==================
// Modèle Mongoose
// ==================

interface SalesTransactionModel<T extends Document> extends PaginateModel<T> {}

const SalesTransaction = mongoose.model<ISalesTransaction, SalesTransactionModel<ISalesTransaction>>('SalesTransaction', SalesTransactionSchema);

export default SalesTransaction;
