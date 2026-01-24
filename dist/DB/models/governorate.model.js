"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GovernorateModel = void 0;
const mongoose_1 = require("mongoose");
const slugify_1 = __importDefault(require("slugify"));
const governorateSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, 'Governorate name is required'],
        unique: true,
        trim: true,
        maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    arabicName: {
        type: String,
        required: [true, 'Arabic name is required'],
        trim: true,
        maxlength: [100, 'Arabic name cannot exceed 100 characters'],
        index: true,
    },
    description: {
        type: String,
        trim: true,
        maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    arabicDescription: {
        type: String,
        trim: true,
        maxlength: [1000, 'Arabic description cannot exceed 1000 characters'],
    },
    slug: {
        type: String,
        unique: true,
        lowercase: true,
        trim: true,
        index: true,
    },
    coverImage: {
        type: String,
        trim: true,
        match: [/^https?:\/\/.+/, 'Cover image must be a valid URL'],
    },
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
// Pre-save middleware to generate slug
governorateSchema.pre('save', function (next) {
    if (this.isModified('name') || !this.slug) {
        this.slug = (0, slugify_1.default)(this.name, {
            lower: true,
            strict: true,
            trim: true,
        });
    }
    next();
});
// Virtual for news count
governorateSchema.virtual('newsCount', {
    ref: 'News',
    localField: '_id',
    foreignField: 'governorateId',
    count: true,
});
// Virtual for events count
governorateSchema.virtual('eventsCount', {
    ref: 'Event',
    localField: '_id',
    foreignField: 'governorateId',
    count: true,
});
exports.GovernorateModel = mongoose_1.models.Governorate || (0, mongoose_1.model)('Governorate', governorateSchema);
//# sourceMappingURL=governorate.model.js.map