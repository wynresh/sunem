// ============================
// Session Models
//
// permet de suvegarder les infos sur une session de connexion
// ============================

import mongoose, { Schema, Document, Types, PaginateModel } from 'mongoose';
import paginate from 'mongoose-paginate-v2';
import { z } from "zod";

import root from '@/models/root.models';


// ==================
// Interface de base
// =================

export interface ISession extends Document {
    id: Types.ObjectId | string;
    user: Types.ObjectId | string;
    token: string;
    ipAddress: string;
    userAgent: string;
    createdAt?: Date;
    updatedAt?: Date;
}


// ==================
// Schéma Mongoose
// ==================

const SessionSchema: Schema<ISession> = new Schema(
    {
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        token: { type: String, required: true, unique: true },
        ipAddress: { type: String, required: true },
        userAgent: { type: String, required: true },
    },
    {
        timestamps: true,
    }
);

// ========================
// Appliquer les plugins
// ========================

SessionSchema.plugin(paginate);
SessionSchema.plugin(root);

// ==================
// Modèle Mongoose
// ==================

interface SessionModel<T extends Document> extends PaginateModel<T> {}

const Session: SessionModel<ISession> = mongoose.model<ISession, SessionModel<ISession>>('Session', SessionSchema);

export default Session;
