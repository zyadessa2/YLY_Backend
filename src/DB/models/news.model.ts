import mongoose, { Document, HydratedDocument, model, models, Schema } from 'mongoose';
import slugify from 'slugify';

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

const newsSchema = new Schema<INews>(
  {
    governorateId: {
      type: Schema.Types.ObjectId,
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
        validator: function (images: string[]) {
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
        validator: function (this: INews, value: Date | null) {
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
        validator: function (tags: string[]) {
          return tags.length <= 20;
        },
        message: 'Cannot have more than 20 tags',
      },
    },
    arabicTags: {
      type: [String],
      default: [],
      validate: {
        validator: function (tags: string[]) {
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
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Creator is required'],
      index: true,
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Updater is required'],
    },
    deletedAt: {
      type: Date,
      default: null,
      index: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

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
    let baseSlug = slugify(this.title, {
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

export const NewsModel = models.News || model<INews>('News', newsSchema);
export type HNewsDocument = HydratedDocument<INews>

