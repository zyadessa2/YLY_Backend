import mongoose, { Document, HydratedDocument } from 'mongoose';
export interface IGovernorate extends Document {
    _id: mongoose.Types.ObjectId;
    name: string;
    arabicName?: string;
    description: string;
    arabicDescription?: string;
    slug: string;
    coverImage?: string;
    createdAt: Date;
    updatedAt?: Date;
}
export declare const GovernorateModel: any;
export type HGovernorateDocument = HydratedDocument<IGovernorate>;
//# sourceMappingURL=governorate.model.d.ts.map