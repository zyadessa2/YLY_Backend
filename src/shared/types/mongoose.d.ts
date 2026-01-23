import { Query } from 'mongoose';

declare module 'mongoose' {
  interface QueryOptions {
    includeDeleted?: boolean;
  }
  
  interface Model<T> {
    incrementVisit?(governorateId?: string): Promise<void>;
    incrementNewsView?(governorateId: string): Promise<void>;
    incrementEventView?(governorateId: string): Promise<void>;
    getDateRangeStats?(startDate: Date, endDate: Date): Promise<any>;
    getTopGovernoratesByVisits?(limit?: number): Promise<any[]>;
  }
}

