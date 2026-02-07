// =================================
// User Models:
// 
// Modèle Mongoose pour les utilisateurs avec des fonctionnalités de pagination intégrées.
// =================================

import mongoose, { Schema, Document, Types, PaginateModel } from 'mongoose';
import paginate from 'mongoose-paginate-v2';
import { parsePhoneNumberWithError, isValidPhoneNumber } from 'libphonenumber-js';
import { email, z } from "zod";
import bcrypt from 'bcrypt';

import root from '@/models/root.models';


// =================
// Interface de base
// =================

export interface IUser extends Document {
    id: Types.ObjectId | string;
    username: string;
    email: string;
    phone: string;
    firstname: string;
    lastname: string;
    // Référence au magasin (store)
    store: Types.ObjectId | string;
    password: string;
    role: Types.ObjectId | string;
    status: 'active' | 'inactive' | 'suspended';
    online: boolean;
    lastLogin?: Date;
    createdAt?: Date;
    updatedAt?: Date;
    comparePassword(candidatePassword: string): Promise<boolean>;
}


// ==================
// Schéma Mongoose
// ==================

const UserSchema: Schema<IUser> = new Schema(
    {
        username: { type: String, required: true, unique: true },
        email: { type: String, required: true, unique: true },
        phone: { type: String, required: true, unique: true },
        firstname: { type: String, required: true },
        lastname: { type: String, required: true },
        store: { type: Schema.Types.ObjectId, ref: 'Store', required: true },
        password: { type: String, required: true },
        role: { type: Schema.Types.ObjectId, ref: 'Role', required: true },
        status: { type: String, enum: ['active', 'inactive', 'suspended'], default: 'active' },
        online: { type: Boolean, default: false },
        lastLogin: { type: Date },
    },
    {
        timestamps: true,
    }
);


// ==================
// Validation Zod
// ==================

export const UserValidation = {
    create: z.object({
        username: z.string().min(3, "Le nom d'utilisateur doit comporter au moins 3 caractères."),
        email: z.email("Adresse e-mail invalide."),
        phone: z.string().refine((val) => isValidPhoneNumber(val), {
            message: "Numéro de téléphone invalide.",
        }),
        firstname: z.string().min(1, "Le prénom est requis."),
        lastname: z.string().min(1, "Le nom de famille est requis."),
        store: z.string().min(1, "L'ID du magasin est requis."),
        password: z.string().min(6, "Le mot de passe doit comporter au moins 6 caractères."),
        role: z.string().min(1, "L'ID du rôle est requis."),
        status: z.enum(['active', 'inactive', 'suspended']).optional(),
        online: z.boolean().optional(),
    }),
    update: z.object({
        username: z.string().min(3, "Le nom d'utilisateur doit comporter au moins 3 caractères.").optional(),
        email: z.email("Adresse e-mail invalide.").optional(),
        phone: z.string().refine((val) => isValidPhoneNumber(val), {
            message: "Numéro de téléphone invalide.",
        }).optional(),
        firstname: z.string().min(1, "Le prénom est requis.").optional(),
        lastname: z.string().min(1, "Le nom de famille est requis.").optional(),
        store: z.string().min(1, "L'ID du magasin est requis.").optional(),
        password: z.string().min(6, "Le mot de passe doit comporter au moins 6 caractères.").optional(),
        role: z.string().min(1, "L'ID du rôle est requis.").optional(),
        status: z.enum(['active', 'inactive', 'suspended']).optional(),
        online: z.boolean().optional(),
    }),
    delete: z.object({
        id: z.string().min(1, "L'ID de l'utilisateur est requis."),
    })
};


export const requiredFields = {
    create: [
        'username', 
        'email', 
        'phone', 
        'firstname', 
        'lastname',
        'store', 
        'password', 
        'role'
    ],
    update: [
        'username',
        'phone', 
        'firstname', 
        'lastname',
    ],
    email: [
        'email', 
    ],
    risk: [
        'store',
        'role',
        'status'
    ],
    password: [
        'password'
    ],
    login: [
        'name',
        'password'
    ]

} as const;


// ========================
// Appliquer les plugins
// ========================

UserSchema.plugin(paginate);
UserSchema.plugin(root);

// ==================
// Hooks
// ==================

UserSchema.pre<IUser>('save', async function () {
    if (this.isModified('password') || this.isNew) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }

    if (this.isModified('phone') || this.isNew) {
        parsePhoneNumberWithError(this.phone);
    }
});

// ==================
// Méthodes d'instance
// ==================

UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
};

// ==================
// Static Method
// ==================

UserSchema.statics.findByUser = async function (name: string): Promise<IUser> {
    const user = await this.findOne({ $or: [
        { username: name },
        { id: name },
        { email: name },
        { phone: name }
    ] });

    if (!user) {
        throw new Error('Utilisateur non trouvé');
    }

    return user;
};


// ==================
// Modèle Mongoose
// ==================

interface UserModel<T extends Document> extends PaginateModel<T> {
    findByUser(name: string): Promise<IUser | null>;
}

const User = mongoose.model<IUser, UserModel<IUser>>('User', UserSchema);

export default User;
