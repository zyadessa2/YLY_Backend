import mongoose, { Document, HydratedDocument } from 'mongoose';
export interface INews extends Document {
    _id: mongoose.Types.ObjectId;
    governorateId: mongoose.Types.ObjectId;
    title: string;
    arabicTitle?: string;
    description: string;
    arabicDescription?: string;
    content: string;
    arabicContent?: string;
    author: string;
    arabicAuthor?: string;
    coverImage: string;
    contentImages: string[];
    slug: string;
    published: boolean;
    publishedAt: Date | null;
    featured: boolean;
    viewCount: number;
    tags: string[];
    arabicTags: string[];
    metaTitle?: string;
    arabicMetaTitle?: string;
    metaDescription?: string;
    arabicMetaDescription?: string;
    createdBy: mongoose.Types.ObjectId;
    updatedBy?: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt?: Date;
    deletedAt?: Date | null;
}
export declare const NewsModel: any;
export type HNewsDocument = HydratedDocument<INews>;
//# sourceMappingURL=news.model.d.ts.map