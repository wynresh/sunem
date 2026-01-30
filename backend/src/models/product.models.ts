// =================================
// product Model
//
// permet d'interagir avec la collection des produits dans MongoDB
// avec des fonctionnalités de pagination intégrées.
// =================================

import mongoose, { Schema, Document, Types, PaginateModel } from 'mongoose';
import paginate from 'mongoose-paginate-v2';
import { z } from "zod";

import root from '@/models/root.models';


// ==================
// Interface de base
// =================

export interface IProduct extends Document {
    id: Types.ObjectId | string;
    eanCode: string;
    internalCode?: string;
    name: string;
    brand?: string;
    description?: string;
    price: number;
    unit: 'piece' | 'kg' | 'liter' | 'box' | 'pack';
    weight?: number;
    dimensions?: {
        length: number;
        width: number;
        height: number;
    };
    volume?: number;
    allergens?: string[];
    nutritionFacts?: {
        calories: number;
        fat: number;
        carbohydrates: number;
        protein: number;
        salt: number;
        [key: string]: number;
    };
    status: 'available' | 'unavailable' | 'discontinued';
    perishable: boolean;
    expirationDate?: Date;
    category: Types.ObjectId | string;
    createdAt?: Date;
    updatedAt?: Date;
}


// ==================
// Schéma Mongoose
// ==================

const ProductSchema: Schema<IProduct> = new Schema(
    {
        eanCode: { type: String, required: true, unique: true },
        internalCode: { type: String, unique: true },
        name: { type: String, required: true },
        brand: { type: String },
        description: { type: String },
        price: { type: Number, required: true },
        unit: { type: String, enum: ['piece', 'kg', 'liter', 'box', 'pack'], required: true },
        weight: { type: Number },
        dimensions: {
            length: { type: Number },
            width: { type: Number },
            height: { type: Number },
        },
        volume: { type: Number },
        allergens: [{ type: String }],
        nutritionFacts: {
            calories: { type: Number },
            fat: { type: Number },
            carbohydrates: { type: Number },
            protein: { type: Number },
            salt: { type: Number },
        },
        status: { type: String, enum: ['available', 'unavailable', 'discontinued'], default: 'available' },
        perishable: { type: Boolean, default: false },
        expirationDate: { type: Date },
        category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    },
    {
        timestamps: true,
    }
);


// ==================
// Validation Zod
// ==================

export const ProductZodSchema = z.object({
    eanCode: z.string().min(8, "Le code EAN doit comporter au moins 8 caractères."),
    internalCode: z.string().optional(),
    name: z.string().min(1, "Le nom du produit est requis."),
    brand: z.string().optional(),
    description: z.string().optional(),
    price: z.number().min(0, "Le prix doit être un nombre positif."),
    unit: z.enum(['piece', 'kg', 'liter', 'box', 'pack']),
    weight: z.number().min(0).optional(),
    dimensions: z.object({
        length: z.number().min(0),
        width: z.number().min(0),
        height: z.number().min(0),
    }).optional(),
    volume: z.number().min(0).optional(),
    allergens: z.array(z.string()).optional(),
    nutritionFacts: z.object({
        calories: z.number().min(0),
        fat: z.number().min(0),
        carbohydrates: z.number().min(0),
        protein: z.number().min(0),
        salt: z.number().min(0),
    }).optional(),
    status: z.enum(['available', 'unavailable', 'discontinued']),
    perishable: z.boolean(),
    expirationDate: z.date().optional(),
    category: z.string().min(1, "L'ID de la catégorie est requis."),
});

export const ProductUpdateZodSchema = ProductZodSchema.partial();

export const RequiredProductAttrs = [
    'eanCode',
    'name',
    'price',
    'unit',
    'category'
] as const;


// ========================
// Convertir
// ========================

export const convertToProduct = (data: any) => {
    return {
        ...(data.eanCode && { eanCode: data.eanCode }),
        ...(data.internalCode && { internalCode: data.internalCode }),
        ...(data.name && { name: data.name }),
        ...(data.brand && { brand: data.brand }),
        ...(data.description && { description: data.description }),
        ...(data.price !== undefined && { price: Number(data.price) }),
        ...(data.unit && { unit: data.unit }),
        ...(data.weight !== undefined && { weight: Number(data.weight) }),
        ...(data.dimensions && { dimensions: {
            length: Number(data.dimensions.length),
            width: Number(data.dimensions.width),
            height: Number(data.dimensions.height),
        } }),
        ...(data.volume !== undefined && { volume: Number(data.volume) }),
        ...(data.allergens && { allergens: data.allergens }),
        ...(data.nutritionFacts && { nutritionFacts: {
            calories: Number(data.nutritionFacts.calories),
            fat: Number(data.nutritionFacts.fat),
            carbohydrates: Number(data.nutritionFacts.carbohydrates),
            protein: Number(data.nutritionFacts.protein),
            salt: Number(data.nutritionFacts.salt),
        } }),
        ...(data.status && { status: data.status }),
        ...(data.perishable !== undefined && { perishable: data.perishable }),
        ...(data.expirationDate && { expirationDate: data.expirationDate }),
        ...(data.category && { category: data.category }),
    };
}

// ========================
// Plugin de pagination
// ========================

ProductSchema.plugin(paginate);
ProductSchema.plugin(root);

// ==================
// Statics
// ==================

ProductSchema.statics.findByPrduct = async function (code: string): Promise<IProduct | null> {
    const product = await this.findOne({ $or: [
        { eanCode: code },
        { internalCode: code },
        { _id: code },
    ] });
    return product;
};

// ==================
// Exporter le modèle
// ==================

interface ProductModel<T extends Document> extends PaginateModel<T> {}

const Product = mongoose.model<IProduct, ProductModel<IProduct>>('Product', ProductSchema);

export default Product;