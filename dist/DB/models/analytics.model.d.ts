import mongoose, { Document, HydratedDocument } from 'mongoose';
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
export declare const AnalyticsModel: any;
export type HAnalyticsDocument = HydratedDocument<IAnalytics>;
//# sourceMappingURL=analytics.model.d.ts.map