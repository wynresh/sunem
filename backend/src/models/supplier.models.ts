// ==================================
// Supplier Models:
// 
// Modèle Mongoose pour les fournisseurs avec des fonctionnalités de pagination intégrées.
// ==================================

import mongoose, { Schema, Document, Types, PaginateModel } from 'mongoose';
import paginate from 'mongoose-paginate-v2';
import { z } from "zod";

import root from '@/models/root.models';


// ==================
// Interface de base
// =================

export interface ISupplier extends Document {
    id: Types.ObjectId | string;
    code: string;
    name: string;
    contactPerson: string;
    email: string;
    phone: string;
    address?: string;
    paymentTerms?: string;
    deliveryLeadTime?: string;
    rating?: number;
    status: 'active' | 'inactive';
    createdAt?: Date;
    updatedAt?: Date;
}


// ==================
// Schéma Mongoose
// ==================

const SupplierSchema: Schema<ISupplier> = new Schema(
    {
        code: { type: String, required: true, unique: true },
        name: { type: String, required: true },
        contactPerson: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        phone: { type: String, required: true, unique: true },
        address: { type: String },
        paymentTerms: { type: String },
        deliveryLeadTime: { type: String },
        rating: { type: Number, min: 0, max: 5 },
        status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    },
    {
        timestamps: true,
    }
);


// ==================
// Validation avec Zod
// ==================

export const SupplierValidationSchema = z.object({
    code: z.string().min(1, "Le code du fournisseur est requis."),
    name: z.string().min(1, "Le nom du fournisseur est requis."),
    contactPerson: z.string().min(1, "Le contact du fournisseur est requis."),
    email: z.string().email("L'email doit être valide."),
    phone: z.string().min(1, "Le téléphone du fournisseur est requis."),
    address: z.string().optional(),
    paymentTerms: z.string().optional(),
    deliveryLeadTime: z.string().optional(),
    rating: z.number().min(0).max(5).optional(),
    status: z.enum(['active', 'inactive']).optional(),
});

export const SupplierUpdateValidationSchema = SupplierValidationSchema.partial();

export const RequiredAttrs = [
    'code', 
    'name', 
    'contactPerson', 
    'email', 
    'phone'
];

// ==================
// Convertir
// ==================

export const convertToSupplier = (input: any): ISupplier => {
    return {
        ...(input.name && { name: String(input.name) }),
        ...(input.code && { code: String(input.code) }),
        ...(input.contactPerson && { contactPerson: String(input.contactPerson) }),
        ...(input.email && { email: String(input.email) }),
        ...(input.phone && { phone: String(input.phone) }),
        ...(input.address && { address: String(input.address) }),
        ...(input.paymentTerms && { paymentTerms: String(input.paymentTerms) }),
        ...(input.deliveryLeadTime && { deliveryLeadTime: String(input.deliveryLeadTime) }),
        ...(input.rating !== undefined && { rating: Number(input.rating) }),
        ...(input.status && { status: String(input.status) as 'active' | 'inactive' }),
    } as ISupplier;
};


// ==================
// Plugin de pagination
// ==================

SupplierSchema.plugin(paginate);
SupplierSchema.plugin(root);


// ==================
// Static methods
// ==================

SupplierSchema.statics.findBySupplier = async function(name: string): Promise<ISupplier> {
    const supplier = await this.findOne({ $or: [
        { code: name },
        { email: name },
        { phone: name },
        { _id: name}
    ]});

    if (!supplier) {
        throw new Error('Fournisseur non trouvé');
    }

    return supplier;
};


// ==================
// Modele Mongoose
// ==================

interface SupplierModel<T extends Document> extends PaginateModel<T> {
    findBySupplier(name: string): Promise<ISupplier>;
}

const Supplier: SupplierModel<ISupplier> = mongoose.model<ISupplier, SupplierModel<ISupplier>>('Supplier', SupplierSchema);

export default Supplier;
