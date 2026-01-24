import { model } from 'mongoose';
import { Schema, models } from 'mongoose';
const tokenSchema = new Schema({
    jti: { type: String, required: true, unique: true },
    expiresIn: { type: Number, required: true },
    userId: { type: Schema.Types.ObjectId, ref: "user", required: true }
}, { timestamps: true });
export const TokenModel = models.Token || model("Token", tokenSchema);
//# sourceMappingURL=token.model.js.map