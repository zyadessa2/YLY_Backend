import mongoose, { Document, HydratedDocument, model, models, Schema } from 'mongoose';
import slugify from 'slugify';

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

const governorateSchema = new Schema<IGovernorate>(
  {
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
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Pre-save middleware to generate slug
governorateSchema.pre('save', function (next) {
  if (this.isModified('name') || !this.slug) {
    this.slug = slugify(this.name, {
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


export const GovernorateModel = models.Governorate || model<IGovernorate>('Governorate', governorateSchema);
export type HGovernorateDocument = HydratedDocument<IGovernorate>

