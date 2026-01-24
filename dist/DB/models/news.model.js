"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewsModel = void 0;
const mongoose_1 = require("mongoose");
const slugify_1 = __importDefault(require("slugify"));
const newsSchema = new mongoose_1.Schema({
    governorateId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Governorate',
        required: [true, 'Governorate is required'],
        index: true,
    },
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true,
        minlength: [5, 'Title must be at least 5 characters'],
        maxlength: [500, 'Title cannot exceed 500 characters'],
    },
    arabicTitle: {
        type: String,
        trim: true,
        maxlength: [500, 'Arabic title cannot exceed 500 characters'],
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
        trim: true,
        minlength: [10, 'Description must be at least 10 characters'],
        maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    arabicDescription: {
        type: String,
        trim: true,
        maxlength: [2000, 'Arabic description cannot exceed 2000 characters'],
    },
    content: {
        type: String,
        required: [true, 'Content is required'],
        minlength: [50, 'Content must be at least 50 characters'],
    },
    arabicContent: {
        type: String,
    },
    author: {
        type: String,
        required: [true, 'Author is required'],
        trim: true,
        maxlength: [200, 'Author name cannot exceed 200 characters'],
    },
    arabicAuthor: {
        type: String,
        trim: true,
        maxlength: [200, 'Arabic author name cannot exceed 200 characters'],
    },
    coverImage: {
        type: String,
        required: [true, 'Cover image is required'],
        trim: true,
        match: [/^https?:\/\/.+/, 'Cover image must be a valid URL'],
    },
    contentImages: {
        type: [String],
        default: [],
        validate: {
            validator: function (images) {
                return images.every((img) => /^https?:\/\/.+/.test(img));
            },
            message: 'All content images must be valid URLs',
        },
    },
    slug: {
        type: String,
        unique: true,
        lowercase: true,
        trim: true,
        index: true,
    },
    published: {
        type: Boolean,
        default: false,
        index: true,
    },
    publishedAt: {
        type: Date,
        default: null,
        index: true,
        validate: {
            validator: function (value) {
                if (this.published && !value) {
                    return false;
                }
                return true;
            },
            message: 'Published date is required when news is published',
        },
    },
    featured: {
        type: Boolean,
        default: false,
        index: true,
    },
    viewCount: {
        type: Number,
        default: 0,
        min: [0, 'View count cannot be negative'],
    },
    tags: {
        type: [String],
        default: [],
        validate: {
            validator: function (tags) {
                return tags.length <= 20;
            },
            message: 'Cannot have more than 20 tags',
        },
    },
    arabicTags: {
        type: [String],
        default: [],
        validate: {
            validator: function (tags) {
                return tags.length <= 20;
            },
            message: 'Cannot have more than 20 Arabic tags',
        },
    },
    metaTitle: {
        type: String,
        trim: true,
        maxlength: [150, 'Meta title cannot exceed 150 characters'],
    },
    arabicMetaTitle: {
        type: String,
        trim: true,
        maxlength: [150, 'Arabic meta title cannot exceed 150 characters'],
    },
    metaDescription: {
        type: String,
        trim: true,
        maxlength: [300, 'Meta description cannot exceed 300 characters'],
    },
    arabicMetaDescription: {
        type: String,
        trim: true,
        maxlength: [300, 'Arabic meta description cannot exceed 300 characters'],
    },
    createdBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Creator is required'],
        index: true,
    },
    updatedBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Updater is required'],
    },
    deletedAt: {
        type: Date,
        default: null,
        index: true,
    },
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
// Compound indexes for efficient queries
newsSchema.index({ governorateId: 1, published: 1, deletedAt: 1 });
newsSchema.index({ governorateId: 1, featured: 1, published: 1, deletedAt: 1 });
newsSchema.index({ published: 1, publishedAt: -1, deletedAt: 1 });
newsSchema.index({ createdBy: 1, deletedAt: 1 });
newsSchema.index({ slug: 1, deletedAt: 1 });
newsSchema.index({ tags: 1, published: 1, deletedAt: 1 });
// Pre-save middleware to generate slug
newsSchema.pre('save', async function (next) {
    if (this.isModified('title') || !this.slug) {
        let baseSlug = (0, slugify_1.default)(this.title, {
            lower: true,
            strict: true,
            trim: true,
        });
        let slug = baseSlug;
        this.slug = slug;
    }
    // Auto-set metaTitle and metaDescription if not provided
    if (!this.metaTitle) {
        this.metaTitle = this.title.substring(0, 150);
    }
    if (!this.metaDescription) {
        this.metaDescription = this.description.substring(0, 300);
    }
    next();
});
// // Global query middleware to exclude soft-deleted documents
// newsSchema.pre(/^find/, function (next) {
//   // @ts-ignore
//   if (!this.getOptions().includeDeleted) {
//     this.where({ deletedAt: null });
//   }
//   next();
// });
// Virtual for governorate details
// to populate governorate information
newsSchema.virtual('governorate', {
    ref: 'Governorate',
    localField: 'governorateId',
    foreignField: '_id',
    justOne: true,
});
// Virtual for creator details
newsSchema.virtual('creator', {
    ref: 'User',
    localField: 'createdBy',
    foreignField: '_id',
    justOne: true,
});
exports.NewsModel = mongoose_1.models.News || (0, mongoose_1.model)('News', newsSchema);
//# sourceMappingURL=news.model.js.map