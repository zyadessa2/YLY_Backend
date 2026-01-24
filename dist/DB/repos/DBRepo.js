/**
 * Generic Database Repository
 * Abstract class to be extended by specific model repositories
 * Provides common CRUD operations and query methods
 */
export class DBRepo {
    constructor(model) {
        this.model = model;
    }
    /**
     * Create one or multiple documents
     */
    async create(data, options) {
        if (Array.isArray(data)) {
            return await this.model.create(data, options);
        }
        const result = await this.model.create([data], options);
        return result[0];
    }
    /**
     * Find a single document
     */
    async findOne({ filter, select, populate, sort, options }) {
        const query = this.model.findOne(filter || {});
        if (select)
            query.select(select);
        if (sort)
            query.sort(sort);
        if (options?.lean)
            query.lean(options.lean);
        if (populate)
            query.populate(populate);
        return query.exec();
    }
    /**
     * Find document by ID
     */
    async findById({ id, select, populate, options }) {
        const query = this.model.findById(id);
        if (select)
            query.select(select);
        if (options?.lean)
            query.lean(options.lean);
        if (populate)
            query.populate(populate);
        return query.exec();
    }
    /**
     * Find multiple documents
     */
    async find({ filter, select, populate, sort, limit, skip, options }) {
        const query = this.model.find(filter || {});
        if (select)
            query.select(select);
        if (sort)
            query.sort(sort);
        if (limit)
            query.limit(limit);
        if (skip)
            query.skip(skip);
        if (options?.lean)
            query.lean(options.lean);
        if (populate)
            query.populate(populate);
        return query.exec();
    }
    /**
     * Find with pagination
     */
    async findWithPagination({ filter, select, populate, sort, page = 1, limit = 10, options }) {
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
            this.count(filter !== undefined ? { filter } : {})
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
    async updateOne({ filter, data, options }) {
        return await this.model.updateOne(filter, {
            ...data,
            $inc: { __v: 1 } // Increment version
        }, options);
    }
    /**
     * Update multiple documents
     */
    async updateMany({ filter, data, options }) {
        return await this.model.updateMany(filter, {
            ...data,
            $inc: { __v: 1 }
        }, options);
    }
    /**
     * Find by ID and update
     */
    async findByIdAndUpdate({ id, data, options }) {
        return this.model.findByIdAndUpdate(id, {
            ...data,
            $inc: { __v: 1 }
        }, { new: true, ...options } // Return updated document by default
        ).exec();
    }
    /**
     * Find one and update
     */
    async findOneAndUpdate({ filter, data, options }) {
        return this.model.findOneAndUpdate(filter, {
            ...data,
            $inc: { __v: 1 }
        }, { new: true, ...options }).exec();
    }
    /**
     * Delete a single document
     */
    async deleteOne({ filter }) {
        return await this.model.deleteOne(filter);
    }
    /**
     * Delete multiple documents
     */
    async deleteMany({ filter }) {
        return await this.model.deleteMany(filter);
    }
    /**
     * Delete by ID
     */
    async findByIdAndDelete({ id }) {
        return await this.model.findByIdAndDelete(id).exec();
    }
    /**
     * Soft delete a document
     */
    async softDelete({ filter }) {
        return await this.updateOne({
            filter,
            data: {
                deletedAt: new Date()
            }
        });
    }
    /**
     * Soft delete by ID
     */
    async softDeleteById({ id }) {
        return await this.findByIdAndUpdate({
            id,
            data: {
                deletedAt: new Date()
            }
        });
    }
    /**
     * Restore soft deleted document
     */
    async restore({ filter }) {
        return await this.updateOne({
            filter,
            data: {
                deletedAt: null
            }
        });
    }
    /**
     * Count documents
     */
    async count({ filter }) {
        return await this.model.countDocuments(filter || {});
    }
    /**
     * Check if document exists
     */
    async exists({ filter }) {
        const result = await this.model.exists(filter);
        return result !== null;
    }
    /**
     * Find distinct values
     */
    async distinct({ field, filter }) {
        return await this.model.distinct(field, filter || {});
    }
    /**
     * Aggregate query
     */
    async aggregate(pipeline) {
        return await this.model.aggregate(pipeline).exec();
    }
    /**
     * Bulk write operations
     */
    async bulkWrite(operations) {
        return await this.model.bulkWrite(operations);
    }
    /**
     * Execute within a transaction
     */
    async withTransaction(callback) {
        const session = await this.model.db.startSession();
        try {
            session.startTransaction();
            const result = await callback(session);
            await session.commitTransaction();
            return result;
        }
        catch (error) {
            await session.abortTransaction();
            throw error;
        }
        finally {
            session.endSession();
        }
    }
    /**
     * Get model reference (for advanced operations)
     */
    getModel() {
        return this.model;
    }
}
//# sourceMappingURL=DBRepo.js.map