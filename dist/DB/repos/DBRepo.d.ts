import { CreateOptions, DeleteResult, FlattenMaps, HydratedDocument, Model, MongooseUpdateQueryOptions, PopulateOptions, ProjectionType, QueryOptions, RootFilterQuery, Types, UpdateQuery, UpdateWriteOpResult, ClientSession, SortOrder } from 'mongoose';
export type Lean<T> = HydratedDocument<FlattenMaps<T>>;
export interface IPaginationOptions {
    page?: number;
    limit?: number;
    sort?: Record<string, SortOrder>;
}
export interface IPaginationResult<T> {
    data: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
        hasNextPage: boolean;
        hasPrevPage: boolean;
    };
}
/**
 * Generic Database Repository
 * Abstract class to be extended by specific model repositories
 * Provides common CRUD operations and query methods
 */
export declare abstract class DBRepo<T> {
    protected readonly model: Model<T, {}, {}, {}, any, any, any>;
    constructor(model: Model<T, {}, {}, {}, any, any, any>);
    /**
     * Create one or multiple documents
     */
    create(data: Partial<T> | Partial<T>[], options?: CreateOptions): Promise<HydratedDocument<T> | HydratedDocument<T>[]>;
    /**
     * Find a single document
     */
    findOne({ filter, select, populate, sort, options }: {
        filter?: RootFilterQuery<T>;
        select?: ProjectionType<T> | null;
        populate?: PopulateOptions | PopulateOptions[];
        sort?: Record<string, SortOrder>;
        options?: QueryOptions | null;
    }): Promise<HydratedDocument<T> | Lean<T> | null>;
    /**
     * Find document by ID
     */
    findById({ id, select, populate, options }: {
        id: Types.ObjectId | string;
        select?: ProjectionType<T> | null;
        populate?: PopulateOptions | PopulateOptions[];
        options?: QueryOptions | null;
    }): Promise<HydratedDocument<T> | Lean<T> | null>;
    /**
     * Find multiple documents
     */
    find({ filter, select, populate, sort, limit, skip, options }: {
        filter?: RootFilterQuery<T>;
        select?: ProjectionType<T> | null;
        populate?: PopulateOptions | PopulateOptions[];
        sort?: Record<string, SortOrder>;
        limit?: number;
        skip?: number;
        options?: QueryOptions | null;
    }): Promise<HydratedDocument<T>[] | Lean<T>[]>;
    /**
     * Find with pagination
     */
    findWithPagination({ filter, select, populate, sort, page, limit, options }: {
        filter?: RootFilterQuery<T>;
        select?: ProjectionType<T> | null;
        populate?: PopulateOptions | PopulateOptions[];
        sort?: Record<string, SortOrder>;
        page?: number;
        limit?: number;
        options?: QueryOptions | null;
    }): Promise<IPaginationResult<HydratedDocument<T> | Lean<T>>>;
    /**
     * Update a single document
     */
    updateOne({ filter, data, options }: {
        filter: RootFilterQuery<T>;
        data: UpdateQuery<T>;
        options?: MongooseUpdateQueryOptions | null;
    }): Promise<UpdateWriteOpResult>;
    /**
     * Update multiple documents
     */
    updateMany({ filter, data, options }: {
        filter: RootFilterQuery<T>;
        data: UpdateQuery<T>;
        options?: MongooseUpdateQueryOptions | null;
    }): Promise<UpdateWriteOpResult>;
    /**
     * Find by ID and update
     */
    findByIdAndUpdate({ id, data, options }: {
        id: Types.ObjectId | string;
        data: UpdateQuery<T>;
        options?: QueryOptions<T> | null;
    }): Promise<HydratedDocument<T> | Lean<T> | null>;
    /**
     * Find one and update
     */
    findOneAndUpdate({ filter, data, options }: {
        filter: RootFilterQuery<T>;
        data: UpdateQuery<T>;
        options?: QueryOptions<T> | null;
    }): Promise<HydratedDocument<T> | Lean<T> | null>;
    /**
     * Delete a single document
     */
    deleteOne({ filter }: {
        filter: RootFilterQuery<T>;
    }): Promise<DeleteResult>;
    /**
     * Delete multiple documents
     */
    deleteMany({ filter }: {
        filter: RootFilterQuery<T>;
    }): Promise<DeleteResult>;
    /**
     * Delete by ID
     */
    findByIdAndDelete({ id }: {
        id: Types.ObjectId | string;
    }): Promise<HydratedDocument<T> | null>;
    /**
     * Soft delete a document
     */
    softDelete({ filter }: {
        filter: RootFilterQuery<T>;
    }): Promise<UpdateWriteOpResult>;
    /**
     * Soft delete by ID
     */
    softDeleteById({ id }: {
        id: Types.ObjectId | string;
    }): Promise<HydratedDocument<T> | Lean<T> | null>;
    /**
     * Restore soft deleted document
     */
    restore({ filter }: {
        filter: RootFilterQuery<T>;
    }): Promise<UpdateWriteOpResult>;
    /**
     * Count documents
     */
    count({ filter }: {
        filter?: RootFilterQuery<T>;
    }): Promise<number>;
    /**
     * Check if document exists
     */
    exists({ filter }: {
        filter: RootFilterQuery<T>;
    }): Promise<boolean>;
    /**
     * Find distinct values
     */
    distinct({ field, filter }: {
        field: string;
        filter?: RootFilterQuery<T>;
    }): Promise<any[]>;
    /**
     * Aggregate query
     */
    aggregate(pipeline: any[]): Promise<any[]>;
    /**
     * Bulk write operations
     */
    bulkWrite(operations: any[]): Promise<any>;
    /**
     * Execute within a transaction
     */
    withTransaction<R>(callback: (session: ClientSession) => Promise<R>): Promise<R>;
    /**
     * Get model reference (for advanced operations)
     */
    getModel(): Model<T, {}, {}, {}, any, any, any>;
}
//# sourceMappingURL=DBRepo.d.ts.map