// DBRepo.ts
import { 
    CreateOptions, 
    DeleteResult, 
    FlattenMaps, 
    HydratedDocument, 
    Model, 
    MongooseUpdateQueryOptions, 
    PopulateOptions, 
    ProjectionType, 
    QueryOptions, 
    RootFilterQuery, 
    Types, 
    UpdateQuery, 
    UpdateWriteOpResult,
    ClientSession,
    SortOrder,
    FilterQuery
} from 'mongoose';

export type Lean<T> = HydratedDocument<FlattenMaps<T>>;

// Pagination interface
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
export abstract class DBRepo<T> {
    constructor(protected readonly model: Model<T, {}, {}, {}, any, any, any>) {}

    /**
     * Create one or multiple documents
     */
    async create(
        data: Partial<T> | Partial<T>[],
        options?: CreateOptions
    ): Promise<HydratedDocument<T> | HydratedDocument<T>[]> {
        if (Array.isArray(data)) {
            return await this.model.create(data, options);
        }
        const result = await this.model.create([data], options);
        return result[0];
    }

    /**
     * Find a single document
     */
    async findOne({
        filter,
        select,
        populate,
        sort,
        options
    }: {
        filter?: RootFilterQuery<T>;
        select?: ProjectionType<T> | null;
        populate?: PopulateOptions | PopulateOptions[];
        sort?: Record<string, SortOrder>;
        options?: QueryOptions | null;
    }): Promise<HydratedDocument<T> | Lean<T> | null> {
        const query = this.model.findOne(filter || {});

        if (select) query.select(select);
        if (sort) query.sort(sort);
        if (options?.lean) query.lean(options.lean);
        if (populate) query.populate(populate);

        return query.exec();
    }

    /**
     * Find document by ID
     */
    async findById({
        id,
        select,
        populate,
        options
    }: {
        id: Types.ObjectId | string;
        select?: ProjectionType<T> | null;
        populate?: PopulateOptions | PopulateOptions[];
        options?: QueryOptions | null;
    }): Promise<HydratedDocument<T> | Lean<T> | null> {
        const query = this.model.findById(id);

        if (select) query.select(select);
        if (options?.lean) query.lean(options.lean);
        if (populate) query.populate(populate);

        return query.exec();
    }

    /**
     * Find multiple documents
     */
    async find({
        filter,
        select,
        populate,
        sort,
        limit,
        skip,
        options
    }: {
        filter?: RootFilterQuery<T>;
        select?: ProjectionType<T> | null;
        populate?: PopulateOptions | PopulateOptions[];
        sort?: Record<string, SortOrder>;
        limit?: number;
        skip?: number;
        options?: QueryOptions | null;
    }): Promise<HydratedDocument<T>[] | Lean<T>[]> {
        const query = this.model.find(filter || {});

        if (select) query.select(select);
        if (sort) query.sort(sort);
        if (limit) query.limit(limit);
        if (skip) query.skip(skip);
        if (options?.lean) query.lean(options.lean);
        if (populate) query.populate(populate);

        return query.exec();
    }

    /**
     * Find with pagination
     */
    async findWithPagination({
        filter,
        select,
        populate,
        sort,
        page = 1,
        limit = 10,
        options
    }: {
        filter?: RootFilterQuery<T>;
        select?: ProjectionType<T> | null;
        populate?: PopulateOptions | PopulateOptions[];
        sort?: Record<string, SortOrder>;
        page?: number;
        limit?: number;
        options?: QueryOptions | null;
    }): Promise<IPaginationResult<HydratedDocument<T> | Lean<T>>> {
        const skip = (page - 1) * limit;

        const [data, total] = await Promise.all([
            this.find({
                ...(filter !== undefined && { filter }),
                ...(select !== undefined && { select }),
                ...(populate !== undefined && { populate }),
                ...(sort !== undefined && { sort }),
                limit,
                skip,
                ...(options !== undefined && { options })
            }),
            this.count(
                filter !== undefined ? { filter } : {}
            )
        ]);

        const totalPages = Math.ceil(total / limit);

        return {
            data,
            pagination: {
                page,
                limit,
                total,
                totalPages,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1
            }
        };
    }

    /**
     * Update a single document
     */
    async updateOne({
        filter,
        data,
        options
    }: {
        filter: RootFilterQuery<T>;
        data: UpdateQuery<T>;
        options?: MongooseUpdateQueryOptions | null;
    }): Promise<UpdateWriteOpResult> {
        return await this.model.updateOne(
            filter,
            {
                ...data,
                $inc: { __v: 1 } // Increment version
            },
            options
        );
    }

    /**
     * Update multiple documents
     */
    async updateMany({
        filter,
        data,
        options
    }: {
        filter: RootFilterQuery<T>;
        data: UpdateQuery<T>;
        options?: MongooseUpdateQueryOptions | null;
    }): Promise<UpdateWriteOpResult> {
        return await this.model.updateMany(
            filter,
            {
                ...data,
                $inc: { __v: 1 }
            },
            options
        );
    }

    /**
     * Find by ID and update
     */
    async findByIdAndUpdate({
        id,
        data,
        options
    }: {
        id: Types.ObjectId | string;
        data: UpdateQuery<T>;
        options?: QueryOptions<T> | null;
    }): Promise<HydratedDocument<T> | Lean<T> | null> {
        return this.model.findByIdAndUpdate(
            id,
            {
                ...data,
                $inc: { __v: 1 }
            },
            { new: true, ...options } // Return updated document by default
        ).exec();
    }

    /**
     * Find one and update
     */
    async findOneAndUpdate({
        filter,
        data,
        options
    }: {
        filter: RootFilterQuery<T>;
        data: UpdateQuery<T>;
        options?: QueryOptions<T> | null;
    }): Promise<HydratedDocument<T> | Lean<T> | null> {
        return this.model.findOneAndUpdate(
            filter,
            {
                ...data,
                $inc: { __v: 1 }
            },
            { new: true, ...options }
        ).exec();
    }

    /**
     * Delete a single document
     */
    async deleteOne({
        filter
    }: {
        filter: RootFilterQuery<T>;
    }): Promise<DeleteResult> {
        return await this.model.deleteOne(filter);
    }

    /**
     * Delete multiple documents
     */
    async deleteMany({
        filter
    }: {
        filter: RootFilterQuery<T>;
    }): Promise<DeleteResult> {
        return await this.model.deleteMany(filter);
    }

    /**
     * Delete by ID
     */
    async findByIdAndDelete({
        id
    }: {
        id: Types.ObjectId | string;
    }): Promise<HydratedDocument<T> | null> {
        return await this.model.findByIdAndDelete(id).exec();
    }

    /**
     * Soft delete a document
     */
    async softDelete({
        filter
    }: {
        filter: RootFilterQuery<T>;
    }): Promise<UpdateWriteOpResult> {
        return await this.updateOne({
            filter,
            data: {
                deletedAt: new Date()
            } as UpdateQuery<T>
        });
    }

    /**
     * Soft delete by ID
     */
    async softDeleteById({
        id
    }: {
        id: Types.ObjectId | string;
    }): Promise<HydratedDocument<T> | Lean<T> | null> {
        return await this.findByIdAndUpdate({
            id,
            data: {
                deletedAt: new Date()
            } as UpdateQuery<T>
        });
    }

    /**
     * Restore soft deleted document
     */
    async restore({
        filter
    }: {
        filter: RootFilterQuery<T>;
    }): Promise<UpdateWriteOpResult> {
        return await this.updateOne({
            filter,
            data: {
                deletedAt: null
            } as UpdateQuery<T>
        });
    }

    /**
     * Count documents
     */
    async count({
        filter
    }: {
        filter?: RootFilterQuery<T>;
    }): Promise<number> {
        return await this.model.countDocuments(filter || {});
    }

    /**
     * Check if document exists
     */
    async exists({
        filter
    }: {
        filter: RootFilterQuery<T>;
    }): Promise<boolean> {
        const result = await this.model.exists(filter);
        return result !== null;
    }

    /**
     * Find distinct values
     */
    async distinct({
        field,
        filter
    }: {
        field: string;
        filter?: RootFilterQuery<T>;
    }): Promise<any[]> {
        return await this.model.distinct(field, filter || {});
    }

    /**
     * Aggregate query
     */
    async aggregate(pipeline: any[]): Promise<any[]> {
        return await this.model.aggregate(pipeline).exec();
    }

    /**
     * Bulk write operations
     */
    async bulkWrite(operations: any[]): Promise<any> {
        return await this.model.bulkWrite(operations);
    }

    /**
     * Execute within a transaction
     */
    async withTransaction<R>(
        callback: (session: ClientSession) => Promise<R>
    ): Promise<R> {
        const session = await this.model.db.startSession();
        try {
            session.startTransaction();
            const result = await callback(session);
            await session.commitTransaction();
            return result;
        } catch (error) {
            await session.abortTransaction();
            throw error;
        } finally {
            session.endSession();
        }
    }

    /**
     * Get model reference (for advanced operations)
     */
    getModel(): Model<T, {}, {}, {}, any, any, any> {
        return this.model;
    }
}
