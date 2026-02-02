// =====================================
// Payment Model
//
// Gestion des paiements dans les transactions de vente
// =====================================


import mongoose, { Schema, Document, Types, PaginateModel } from 'mongoose';
import paginate from 'mongoose-paginate-v2';
import { z } from "zod";

import root from '@/models/root.models';


// ==================
// Interface de base
// =================

export interface IPayment extends Document {
    id: Types.ObjectId | string;
    saleTransaction: Types.ObjectId | string;
    paymentMethod: string;
    amount: number;
    cardType?: string;
    authorizationCode?: string;
    paymentStatus: string;
    paymentDate: Date;
    changeGiven?: number;
    createdAt?: Date;
    updatedAt?: Date;
}


// ==================
// Schéma Mongoose
// ==================

const PaymentSchema: Schema<IPayment> = new Schema(
    {
        saleTransaction: { type: Schema.Types.ObjectId, ref: 'SaleTransaction', required: true },
        paymentMethod: { type: String, required: true },
        amount: { type: Number, required: true },
        cardType: { type: String },
        authorizationCode: { type: String },
        paymentStatus: { type: String, required: true },
        paymentDate: { type: Date, required: true },
        changeGiven: { type: Number },
    },
    {
        timestamps: true,
    }
);


// ==================
// Validation avec Zod
// ==================

const PaymentValidationSchema = z.object({
    saleTransaction: z.string().min(1),
    paymentMethod: z.string().min(1),
    amount: z.number().nonnegative(),
    cardType: z.string().optional(),
    authorizationCode: z.string().optional(),
    paymentStatus: z.string().min(1),
    paymentDate: z.date(),
    changeGiven: z.number().nonnegative().optional(),
});


export const requiredPaymentFields = [
    'saleTransaction',
    'paymentMethod',
    'amount',
    'paymentStatus',
    'paymentDate',
];


// ==================
// Plugin de pagination
// ==================

PaymentSchema.plugin(paginate);
PaymentSchema.plugin(root);


// ==================
// Modèle Mongoose
// ==================

interface PaymentModel<T extends Document> extends PaginateModel<T> {}

const Payment = mongoose.model<IPayment, PaymentModel<IPayment>>('Payment', PaymentSchema);

export default Payment;
