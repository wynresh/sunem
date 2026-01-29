// =================================
// Role Model
// 
// pour permettre la gestion des rôles utilisateur dans l'application,
// avec des fonctionnalités de pagination intégrées.
// =================================

import mongoose, { Schema, Document, Types, PaginateModel } from 'mongoose';
import paginate from 'mongoose-paginate-v2';
import { z } from "zod";

import root from '@/models/root.models';


// =================
// Interface de base
// =================

export interface IRole extends Document {
    id: Types.ObjectId | string;
    name: string;
    permissions: string[];
    description?: string;
    createdAt?: Date;
    updatedAt?: Date;
}


// =================
// Schéma Mongoose
// =================

const RoleSchema: Schema<IRole> = new Schema(
    {
        name: { type: String, required: true, unique: true },
        permissions: { type: [String], default: [] },
    },
    {
        timestamps: true,
    }
);


// ==================
// Validation Zod
// ==================

export const RoleZodSchema = z.object({
    name: z.string().min(1, "Le nom du rôle est requis."),
    permissions: z.array(z.string()).optional(),
    description: z.string().optional(),
});

export const RequiredAttrs = ['name', 'permissions'] as const;


// ========================
// Appliquer les plugins
// ========================

RoleSchema.plugin(paginate);
RoleSchema.plugin(root);

// ==================
// Static Method
// ==================

RoleSchema.statics.findByRole = async function (name: string): Promise<IRole | null> {
    const role = await this.findOne({ $or: [
        { name: name },
        { _id: name }
    ] });

    if (!role) {
        return null;
    }

    return role;
};


// ==================
// Modèle Mongoose
// ==================

interface RoleModel<T extends Document> extends PaginateModel<T> {
    findByName(name: string): Promise<IRole | null>;
}

const Role = mongoose.model<IRole, RoleModel<IRole>>('Role', RoleSchema);

export default Role;
