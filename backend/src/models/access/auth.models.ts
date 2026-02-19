// ============================
// LOGIN ATTEMPS MODELS
//
// tentative de connexion
// ============================

import mongoose, { Schema, Document, Types } from 'mongoose';

import root from '@/models/root.models';


// =====================
// Interface de base
// =====================

export interface ILoginAttempt extends Document {
    id: Types.ObjectId | string;
    user: Types.ObjectId | string;
    attempts: number;
    lastAttempt: Date
}


// ==================
// Schéma Mongoose
// ==================

const LoginAttemptSchema: Schema<ILoginAttempt> = new Schema(
    {
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        attempts: { type: Number, default: 0 },
        lastAttempt: { type: Date }
    },
    {
        timestamps: true,
    }
)


// ========================
// Appliquer les plugins
// ========================
LoginAttemptSchema.plugin(root);


// ==================
// Modèle Mongoose
// ==================

const LoginAttempt = mongoose.model('LoginAttempt', LoginAttemptSchema);

export default LoginAttempt;
