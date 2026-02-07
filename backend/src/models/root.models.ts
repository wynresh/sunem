// ======================
// Root Models: 
// 
// configuration commune à tous les modèles Mongoose pour utiliser id au lieu de _id,
// et pour configurer la sérialisation JSON et Object.
// ======================

import { Schema } from "mongoose";

const root = (schema: Schema) => {
    // Virtual id
    schema.virtual("id").get(function (this: Document & { _id: any }) {
        return this._id.toHexString();
    });

    // toJSON config
    schema.set("toJSON", {
        virtuals: true,
        versionKey: false,
        transform: (_, ret) => {
            delete ret._id;  // masquer _id
        },
    });

    // toObject config (optional)
    schema.set("toObject", {
        virtuals: true,
        versionKey: false,
    });
};

export default root;
