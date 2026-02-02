// =================================
// Store Models:
// 
// Modèle Mongoose pour les magasins avec des fonctionnalités de pagination intégrées.
// =================================

import mongoose, { Schema, Document, Types, PaginateModel } from 'mongoose';
import paginate from 'mongoose-paginate-v2';
import { z } from "zod";

import root from '@/models/root.models';


// ==================
// Interface de base
// =================

export interface IStore extends Document {
    id: Types.ObjectId | string;
    code: string;
    name: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
    phone: string;
    email: string;
    manager: Types.ObjectId | string;
    // ["HH:MM-HH:MM", ...]
    openingHours: string[];
    area: number; // en mètres carrés
    status: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}


// ==================
// Schéma Mongoose
// ==================

const StoreSchema: Schema<IStore> = new Schema(
    {
        code: { type: String, required: true, unique: true },
        name: { type: String, required: true },
        address: { type: String, required: true },
        city: { type: String, required: true },
        postalCode: { type: String, required: true },
        country: { type: String, required: true },
        phone: { type: String, required: true },
        email: { type: String, required: true },
        manager: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        openingHours: { type: [String], required: true },
        area: { type: Number, required: true },
        status: { type: Boolean, default: true },
    },
    {
        timestamps: true,
    }
);

// ========================
// Validation Zod
// ========================

const StoreZodSchema = z.object({
    code: z.string().min(1),
    name: z.string().min(1),
    address: z.string().min(1),
    city: z.string().min(1),
    postalCode: z.string().min(1),
    country: z.string().min(1),
    phone: z.string().min(1),
    email: z.email(),
    manager: z.string().min(1),
    openingHours: z.array(z.string().regex(/^\d{2}:\d{2}-\d{2}:\d{2}$/)),
    area: z.number().positive(),
    status: z.boolean().optional(),
});

export const StoreUpdateZodSchema = StoreZodSchema.partial();

export const RequiredCreateAttrs = [
    'code',
    'name',
    'address',
    'city',
    'postalCode',
    'country',
    'phone',
    'email',
    'area',
    'manager',
    'openingHours',
];

export const RequiredUpdateAttrs = [
    'code',
    'name',
    'address',
    'city',
    'postalCode',
    'country',
    'phone',
    'email',
    'manager',
    'openingHours',
    'area',
];

// ==================
// Convertir
// ==================

export const ConvertToStore = (data: any) => {
    return {
        ...(data.code && { code: data.code }),
        ...(data.name && { name: data.name }),
        ...(data.address && { address: data.address }),
        ...(data.city && { city: data.city }),
        ...(data.postalCode && { postalCode: data.postalCode }),
        ...(data.country && { country: data.country }),
        ...(data.phone && { phone: data.phone }),
        ...(data.email && { email: data.email }),
        ...(data.manager && { manager: new Types.ObjectId(data.manager) }),
        ...(data.openingHours && { openingHours: data.openingHours }),
        ...(data.area && { area: Number(data.area) }),
        ...(data.status !== undefined && { status: data.status }),
    };
};


// ==================
// Apply Plugins
// ==================

StoreSchema.plugin(paginate);
StoreSchema.plugin(root);


// ==================
// Static Method
// ==================

StoreSchema.statics.findByStore = async function (name: string): Promise<IStore | null> {
    const store = await this.findOne({ $or: [
        { code: name },
        { _id: name }
    ] });

    if (!store) {
        return null;
    }

    return store;
};


// ==================
// Modèle Mongoose
// ==================

interface StoreModel<T extends Document> extends PaginateModel<T> {
    findByStore(name: string): Promise<IStore | null>;
}

export const Store = mongoose.model<IStore, StoreModel<IStore>>('Store', StoreSchema);

export default Store;
