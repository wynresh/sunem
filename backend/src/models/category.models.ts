// ======================================
// Product Category Model
//
// permet d'organiser les produits en catégories
// ======================================

import mongoose, { Schema, Document, Types, PaginateModel } from 'mongoose';
import paginate from 'mongoose-paginate-v2';
import { z } from "zod";

import root from '@/models/root.models';


// ==================
// Interface de base
// =================

export interface ICategory extends Document {
    id: Types.ObjectId | string;
    code: string;
    name: string;
    description?: string;
    parentCategory?: Types.ObjectId | string;
    // Taux de marge pour cette catégorie (en pourcentage)
    marginRate: number;
    // Ordre de tri pour l'affichage
    sortOrder: number;
    status: 'active' | 'inactive';
    createdAt?: Date;
    updatedAt?: Date;
}


// ==================
// Schéma Mongoose
// ==================

const CategorySchema: Schema<ICategory> = new Schema(
    {
        code: { type: String, required: true, unique: true },
        name: { type: String, required: true },
        description: { type: String },
        parentCategory: { type: Schema.Types.ObjectId, ref: 'Category' },
        marginRate: { type: Number, default: 0 },
        sortOrder: { type: Number, default: 0 },
        status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    },
    {
        timestamps: true,
    }
);

// ==================
// Validation Zod
// ==================

export const CategoryZodSchema = z.object({
    code: z.string().min(1, "Le code de la catégorie est requis."),
    name: z.string().min(1, "Le nom de la catégorie est requis."),
    description: z.string().optional(),
    parentCategory: z.string().optional(),
    marginRate: z.number().min(0, "Le taux de marge doit être positif.").optional(),
    sortOrder: z.number().min(0, "L'ordre de tri doit être positif.").optional(),
    status: z.enum(['active', 'inactive']).optional(),
});

export const CategoryUpdateZodSchema = CategoryZodSchema.partial();

export const RequiredCategoryAttrs = [
    'code',
    'name',
];

// ==================
// Convertir
// ========================

export const convertToCategory = (data: any) => {
    return {
        ...(data.code && { code: data.code }),
        ...(data.name && { name: data.name }),
        ...(data.description && { description: data.description }),
        ...(data.parentCategory && { parentCategory: data.parentCategory }),
        ...(data.marginRate !== undefined && { marginRate: Number(data.marginRate) }),
        ...(data.sortOrder !== undefined && { sortOrder: Number(data.sortOrder) }),
        ...(data.status && { status: data.status }),
    };
};

// ==================
// Plugins
// ==================

CategorySchema.plugin(paginate);
CategorySchema.plugin(root);

// ==================
// Modèle Mongoose
// ==================

interface CategoryModel<T extends Document> extends PaginateModel<T> {}

const Category: CategoryModel<ICategory> = mongoose.model<ICategory, CategoryModel<ICategory>>('Category', CategorySchema);

export default Category;
