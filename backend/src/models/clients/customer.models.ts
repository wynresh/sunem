// =====================================
// Customer Models:
// 
// Modèle Mongoose pour les clients avec des fonctionnalités de pagination intégrées.
// =====================================

import mongoose, { Schema, Document, Types, PaginateModel } from 'mongoose';
import paginate from 'mongoose-paginate-v2';
import { parsePhoneNumberWithError, isValidPhoneNumber } from 'libphonenumber-js';
import { z } from "zod";

import root from '@/models/root.models';


// ==================
// Interface de base
// =================

export interface ICustomer extends Document {
    id: Types.ObjectId | string;
    code: string;
    firstname: string;
    lastname: string;
    email?: string;
    phone?: string;
    joinDate: Date;
    segment: 'REGULAR' | 'PREMIUM' | 'BUSINESS';
    totalSpent: number;
    lastPurchaseDate?: Date;
    active: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}


// ==================
// Schéma Mongoose
// ==================

const CustomerSchema: Schema<ICustomer> = new Schema(
    {
        code: { type: String, required: true, unique: true },
        firstname: { type: String, required: true },
        lastname: { type: String, required: true },
        email: { type: String, unique: true, sparse: true },
        phone: { type: String, unique: true, sparse: true },
        joinDate: { type: Date, required: true, default: Date.now },
        segment: { type: String, enum: ['REGULAR', 'PREMIUM', 'BUSINESS'], default: 'REGULAR' },
        totalSpent: { type: Number, default: 0 },
        lastPurchaseDate: { type: Date },
        active: { type: Boolean, default: true },
    },
    {
        timestamps: true,
    }
);


// ==================
// Validation avec Zod
// ==================

export const CustomerValidationSchema = z.object({
    code: z.string().min(1, "Le code client est requis."),
    firstname: z.string().min(1, "Le prénom est requis."),
    lastname: z.string().min(1, "Le nom de famille est requis."),
    email: z.string().email("L'email doit être valide.").optional(),
    phone: z.string().optional().refine((val) => {
        if (!val) return true; // Permettre les valeurs vides
        return isValidPhoneNumber(val);
    }, {
        message: "Le numéro de téléphone doit être valide.",
    }),
    joinDate: z.date().optional(),
    segment: z.enum(['REGULAR', 'PREMIUM', 'BUSINESS']).optional(),
    totalSpent: z.number().min(0).optional(),
    lastPurchaseDate: z.date().optional(),
    active: z.boolean().optional(),
});


export const requiredCustomerAttrs = [
    'code',
    'firstname',
    'lastname',
];


// ==================
// Plugin de pagination
// ==================

CustomerSchema.plugin(paginate);
CustomerSchema.plugin(root);


// ==================
// Modèle Mongoose
// ==================

interface CustomerModel<T extends Document> extends PaginateModel<T> {}

const Customer: CustomerModel<ICustomer> = mongoose.model<ICustomer, CustomerModel<ICustomer>>('Customer', CustomerSchema);

export default Customer;