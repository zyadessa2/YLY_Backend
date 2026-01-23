import mongoose, { Document, HydratedDocument, models, Schema } from 'mongoose';
import { model } from 'mongoose';

export interface IAnalytics extends Document {
  _id: mongoose.Types.ObjectId;
  date: Date;
  totalVisits: number;
  visitsByGovernorate: Map<string, number>;
  newsViews: number;
  newsViewsByGovernorate: Map<string, number>;
  eventsViews: number;
  eventsViewsByGovernorate: Map<string, number>;
  createdAt: Date;
  updatedAt?: Date;
}

const analyticsSchema = new Schema<IAnalytics>(
  {
    date: {
      type: Date,
      required: [true, 'Date is required'],
      unique: true,
      index: true,
    },
    totalVisits: {
      type: Number,
      default: 0,
      min: [0, 'Total visits cannot be negative'],
    },
    visitsByGovernorate: {
      type: Map,
      of: Number,
      default: new Map(),
    },
    newsViews: {
      type: Number,
      default: 0,
      min: [0, 'News views cannot be negative'],
    },
    newsViewsByGovernorate: {
      type: Map,
      of: Number,
      default: new Map(),
    },
    eventsViews: {
      type: Number,
      default: 0,
      min: [0, 'Events views cannot be negative'],
    },
    eventsViewsByGovernorate: {
      type: Map,
      of: Number,
      default: new Map(),
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for efficient queries
analyticsSchema.index({ date: -1 });
analyticsSchema.index({ createdAt: -1 });

// Static method to increment visit count
analyticsSchema.statics.incrementVisit = async function (
  governorateId?: string
): Promise<void> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const update: any = {
    $inc: { totalVisits: 1 },
    $setOnInsert: { date: today },
  };

  if (governorateId) {
    update.$inc[`visitsByGovernorate.${governorateId}`] = 1;
  }

  await this.findOneAndUpdate(
    { date: today },
    update,
    { upsert: true, new: true }
  );
};

// Static method to increment news view count
analyticsSchema.statics.incrementNewsView = async function (
  governorateId: string
): Promise<void> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  await this.findOneAndUpdate(
    { date: today },
    {
      $inc: {
        newsViews: 1,
        [`newsViewsByGovernorate.${governorateId}`]: 1,
      },
      $setOnInsert: { date: today },
    },
    { upsert: true, new: true }
  );
};

// Static method to increment event view count
analyticsSchema.statics.incrementEventView = async function (
  governorateId: string
): Promise<void> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  await this.findOneAndUpdate(
    { date: today },
    {
      $inc: {
        eventsViews: 1,
        [`eventsViewsByGovernorate.${governorateId}`]: 1,
      },
      $setOnInsert: { date: today },
    },
    { upsert: true, new: true }
  );
};

// Static method to get date range stats
analyticsSchema.statics.getDateRangeStats = async function (
  startDate: Date,
  endDate: Date
): Promise<any> {
  const stats = await this.aggregate([
    {
      $match: {
        date: { $gte: startDate, $lte: endDate },
      },
    },
    {
      $group: {
        _id: null,
        totalVisits: { $sum: '$totalVisits' },
        totalNewsViews: { $sum: '$newsViews' },
        totalEventsViews: { $sum: '$eventsViews' },
        records: { $push: '$$ROOT' },
      },
    },
  ]);

  return stats.length > 0 ? stats[0] : null;
};

// Static method to get top governorates by visits
analyticsSchema.statics.getTopGovernoratesByVisits = async function (
  limit: number = 10
): Promise<any[]> {
  const today = new Date();
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  startOfMonth.setHours(0, 0, 0, 0);

  const result = await this.aggregate([
    {
      $match: {
        date: { $gte: startOfMonth },
      },
    },
    {
      $project: {
        governorateVisits: { $objectToArray: '$visitsByGovernorate' },
      },
    },
    {
      $unwind: '$governorateVisits',
    },
    {
      $group: {
        _id: '$governorateVisits.k',
        totalVisits: { $sum: '$governorateVisits.v' },
      },
    },
    {
      $sort: { totalVisits: -1 },
    },
    {
      $limit: limit,
    },
    {
      $lookup: {
        from: 'governorates',
        localField: '_id',
        foreignField: '_id',
        as: 'governorate',
      },
    },
    {
      $unwind: '$governorate',
    },
    {
      $project: {
        governorateId: '$_id',
        governorateName: '$governorate.name',
        governorateArabicName: '$governorate.arabicName',
        totalVisits: 1,
      },
    },
  ]);

  return result;
};

export const AnalyticsModel = models.Analytics || model<IAnalytics>('Analytics', analyticsSchema);
export type HAnalyticsDocument = HydratedDocument<IAnalytics>
