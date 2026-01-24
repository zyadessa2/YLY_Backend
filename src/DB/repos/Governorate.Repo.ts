import { GovernorateModel, IGovernorate } from '../models/governorate.model.js';
import { DBRepo } from './DBRepo.js';

export class GovernorateRepo extends DBRepo<IGovernorate> {
    constructor() {
        super(GovernorateModel);
    }

    /**
     * Find governorate by slug
     */
    async findBySlug(slug: string) {
        return this.findOne({
            filter: { slug }
        });
    }

    /**
     * Find governorate by name
     */
    async findByName(name: string) {
        return this.findOne({
            filter: { name }
        });
    }

    /**
     * Get governorates with statistics
     */
    async getGovernoratesWithStats() {
        return await this.aggregate([
            {
                $lookup: {
                    from: 'news',
                    localField: '_id',
                    foreignField: 'governorateId',
                    as: 'news'
                }
            },
            {
                $lookup: {
                    from: 'events',
                    localField: '_id',
                    foreignField: 'governorateId',
                    as: 'events'
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: '_id',
                    foreignField: 'governorateId',
                    as: 'users'
                }
            },
            {
                $addFields: {
                    totalNews: {
                        $size: {
                            $filter: {
                                input: '$news',
                                as: 'item',
                                cond: { $eq: ['$$item.deletedAt', null] }
                            }
                        }
                    },
                    publishedNews: {
                        $size: {
                            $filter: {
                                input: '$news',
                                as: 'item',
                                cond: { 
                                    $and: [
                                        { $eq: ['$$item.published', true] },
                                        { $eq: ['$$item.deletedAt', null] }
                                    ]
                                }
                            }
                        }
                    },
                    totalEvents: {
                        $size: {
                            $filter: {
                                input: '$events',
                                as: 'item',
                                cond: { $eq: ['$$item.deletedAt', null] }
                            }
                        }
                    },
                    publishedEvents: {
                        $size: {
                            $filter: {
                                input: '$events',
                                as: 'item',
                                cond: { 
                                    $and: [
                                        { $eq: ['$$item.published', true] },
                                        { $eq: ['$$item.deletedAt', null] }
                                    ]
                                }
                            }
                        }
                    },
                    upcomingEvents: {
                        $size: {
                            $filter: {
                                input: '$events',
                                as: 'item',
                                cond: { 
                                    $and: [
                                        { $eq: ['$$item.published', true] },
                                        { $gte: ['$$item.eventDate', new Date()] },
                                        { $eq: ['$$item.deletedAt', null] }
                                    ]
                                }
                            }
                        }
                    },
                    activeUsers: {
                        $size: {
                            $filter: {
                                input: '$users',
                                as: 'user',
                                cond: { 
                                    $and: [
                                        { $eq: ['$$user.isActive', true] },
                                        { $eq: ['$$user.deletedAt', null] }
                                    ]
                                }
                            }
                        }
                    }
                }
            },
            {
                $project: {
                    news: 0,
                    events: 0,
                    users: 0
                }
            },
            {
                $sort: { name: 1 }
            }
        ]);
    }

    /**
     * Check if slug exists
     */
    async slugExists(slug: string, excludeId?: string): Promise<boolean> {
        const filter: any = { slug };
        if (excludeId) {
            filter._id = { $ne: excludeId };
        }
        return await this.exists({ filter });
    }

    /**
     * Check if name exists
     */
    async nameExists(name: string, excludeId?: string): Promise<boolean> {
        const filter: any = { name };
        if (excludeId) {
            filter._id = { $ne: excludeId };
        }
        return await this.exists({ filter });
    }
}
