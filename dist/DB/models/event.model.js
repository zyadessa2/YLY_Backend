"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventModel = void 0;
// event.model.ts
const mongoose_1 = __importStar(require("mongoose"));
const slugify_1 = __importDefault(require("slugify"));
const eventSchema = new mongoose_1.Schema({
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
    location: {
        type: String,
        required: [true, 'Location is required'],
        trim: true,
        maxlength: [500, 'Location cannot exceed 500 characters'],
    },
    arabicLocation: {
        type: String,
        trim: true,
        maxlength: [500, 'Arabic location cannot exceed 500 characters'],
    },
    eventDate: {
        type: Date,
        required: [true, 'Event date is required'],
        index: true,
    },
    eventTime: {
        type: String,
        trim: true,
        match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Event time must be in HH:MM format'],
    },
    endDate: {
        type: Date,
        validate: {
            validator: function (value) {
                if (value && this.eventDate) {
                    return value >= this.eventDate;
                }
                return true;
            },
            message: 'End date must be after or equal to event date',
        },
    },
    endTime: {
        type: String,
        trim: true,
        match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'End time must be in HH:MM format'],
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
    // Registration fields
    registrationEnabled: {
        type: Boolean,
        default: false,
        index: true,
    },
    registrationDeadline: {
        type: Date,
        validate: {
            validator: function (value) {
                if (value && this.eventDate) {
                    return value <= this.eventDate;
                }
                return true;
            },
            message: 'Registration deadline must be before event date',
        },
    },
    maxParticipants: {
        type: Number,
        min: [1, 'Max participants must be at least 1'],
        validate: {
            validator: function (value) {
                if (value !== undefined && this.currentParticipants > value) {
                    return false;
                }
                return true;
            },
            message: 'Max participants cannot be less than current participants',
        },
    },
    currentParticipants: {
        type: Number,
        default: 0,
        min: [0, 'Current participants cannot be negative'],
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
            message: 'Published date is required when event is published',
        },
    },
    featured: {
        type: Boolean,
        default: false,
        index: true,
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
    contactEmail: {
        type: String,
        trim: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
    },
    contactPhone: {
        type: String,
        trim: true,
        match: [/^(\+?20)?1[0125]\d{8}$/, 'Please provide a valid phone number'],
    },
    requirements: {
        type: String,
        trim: true,
        maxlength: [1000, 'Requirements cannot exceed 1000 characters'],
    },
    arabicRequirements: {
        type: String,
        trim: true,
        maxlength: [1000, 'Arabic requirements cannot exceed 1000 characters'],
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
// Compound indexes
eventSchema.index({ governorateId: 1, published: 1, deletedAt: 1 });
eventSchema.index({ governorateId: 1, featured: 1, published: 1, deletedAt: 1 });
eventSchema.index({ published: 1, eventDate: 1, deletedAt: 1 });
eventSchema.index({ createdBy: 1, deletedAt: 1 });
eventSchema.index({ slug: 1, deletedAt: 1 });
eventSchema.index({ tags: 1, published: 1, deletedAt: 1 });
eventSchema.index({ eventDate: 1, published: 1, deletedAt: 1 });
eventSchema.index({ registrationEnabled: 1, eventDate: 1, deletedAt: 1 });
// Pre-save middleware
eventSchema.pre('save', async function (next) {
    if (this.isModified('title') || !this.slug) {
        let baseSlug = (0, slugify_1.default)(this.title, {
            lower: true,
            strict: true,
            trim: true,
        });
        let slug = baseSlug;
        let counter = 1;
        while (await mongoose_1.default.models.Event.findOne({ slug, _id: { $ne: this._id } })) {
            slug = `${baseSlug}-${counter}`;
            counter++;
        }
        this.slug = slug;
    }
    if (!this.metaTitle) {
        this.metaTitle = this.title.substring(0, 150);
    }
    if (!this.metaDescription) {
        this.metaDescription = this.description.substring(0, 300);
    }
    next();
});
// Global query middleware
eventSchema.pre(/^find/, function (next) {
    // @ts-ignore
    if (!this.getOptions().includeDeleted) {
        // @ts-ignore
        this.where({ deletedAt: null });
    }
    next();
});
// Virtuals
eventSchema.virtual('governorate', {
    ref: 'Governorate',
    localField: 'governorateId',
    foreignField: '_id',
    justOne: true,
});
eventSchema.virtual('creator', {
    ref: 'User',
    localField: 'createdBy',
    foreignField: '_id',
    justOne: true,
});
eventSchema.virtual('isUpcoming').get(function () {
    return this.eventDate > new Date();
});
eventSchema.virtual('isRegistrationOpen').get(function () {
    if (!this.registrationEnabled)
        return false;
    const now = new Date();
    // Check if registration deadline passed
    if (this.registrationDeadline && now > this.registrationDeadline) {
        return false;
    }
    // Check if event already passed
    if (this.eventDate < now) {
        return false;
    }
    // Check if max participants reached
    if (this.maxParticipants && this.currentParticipants >= this.maxParticipants) {
        return false;
    }
    return true;
});
exports.EventModel = mongoose_1.models.Event || (0, mongoose_1.model)('Event', eventSchema);
//# sourceMappingURL=event.model.js.map