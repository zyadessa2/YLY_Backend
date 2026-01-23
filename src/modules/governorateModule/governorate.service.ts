import { EventModel } from "../../DB/models/event.model";
import { NewsModel } from "../../DB/models/news.model";
import { UserModel } from "../../DB/models/user.model";
import { IPaginationResult } from "../../DB/repos/DBRepo";
import { GovernorateRepo } from "../../DB/repos/Governorate.Repo";
import { 
    BadRequestException,
    NotFoundException,
    ConflictException
} from "../../utils/response/error.response";
import { 
    createGovernorateDTO, 
    updateGovernorateDTO, 
    getGovernoratesQueryDTO 
} from "./governorate.DTO";

export class GovernorateService {
    private governorateRepo = new GovernorateRepo();

    constructor() {}

    /**
     * Create Governorate (Admin only)
     */
    createGovernorate = async (governorateData: createGovernorateDTO): Promise<any> => {
        // Check if name already exists
        const nameExists = await this.governorateRepo.nameExists(governorateData.name);
        if (nameExists) {
            throw new ConflictException("Governorate name already exists");
        }

        // Create governorate
        const newGovernorate = await this.governorateRepo.create(governorateData as any);

        return newGovernorate;
    };

    /**
     * Get All Governorates with pagination
     */
    getAllGovernorates = async (query: getGovernoratesQueryDTO): Promise<IPaginationResult<any>> => {
        const { page, limit, search, sortBy, sortOrder } = query;

        // Build filter
        const filter: any = {};

        // Search in name and arabic name
        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: 'i' } },
                { arabicName: { $regex: search, $options: 'i' } },
                { slug: { $regex: search, $options: 'i' } }
            ];
        }

        // Build sort
        const sort: any = {};
        sort[sortBy || 'name'] = sortOrder === 'asc' ? 1 : -1;

        // Get paginated results
        const result = await this.governorateRepo.findWithPagination({
            filter,
            sort,
            page: page || 1,
            limit: limit || 10
        });

        return result;
    };

    /**
     * Get All Governorates (No pagination)
     */
    getAllGovernoratesNoPagination = async (): Promise<any[]> => {
        return await this.governorateRepo.find({
            filter: {},
            sort: { name: 1 }
        });
    };

    /**
     * Get Governorate by ID
     */
    getGovernorateById = async (governorateId: string): Promise<any> => {
        const governorate = await this.governorateRepo.findById({
            id: governorateId
        });

        if (!governorate) {
            throw new NotFoundException("Governorate not found");
        }

        return governorate;
    };

    /**
     * Get Governorate by Slug
     */
    getGovernorateBySlug = async (slug: string): Promise<any> => {
        const governorate = await this.governorateRepo.findBySlug(slug);

        if (!governorate) {
            throw new NotFoundException("Governorate not found");
        }

        return governorate;
    };

    /**
     * Get Governorate with Details (News, Events, Users)
     */
    getGovernorateDetails = async (governorateId: string): Promise<any> => {
        const governorate = await this.governorateRepo.findById({
            id: governorateId
        });

        if (!governorate) {
            throw new NotFoundException("Governorate not found");
        }

        // Get statistics
        const [newsCount, publishedNewsCount, eventsCount, publishedEventsCount, upcomingEventsCount, usersCount] = await Promise.all([
            NewsModel.countDocuments({ governorateId, deletedAt: null }),
            NewsModel.countDocuments({ governorateId, published: true, deletedAt: null }),
            EventModel.countDocuments({ governorateId, deletedAt: null }),
            EventModel.countDocuments({ governorateId, published: true, deletedAt: null }),
            EventModel.countDocuments({ 
                governorateId, 
                published: true, 
                eventDate: { $gte: new Date() },
                deletedAt: null 
            }),
            UserModel.countDocuments({ governorateId, isActive: true, deletedAt: null })
        ]);

        return {
            ...governorate.toObject(),
            statistics: {
                totalNews: newsCount,
                publishedNews: publishedNewsCount,
                totalEvents: eventsCount,
                publishedEvents: publishedEventsCount,
                upcomingEvents: upcomingEventsCount,
                activeUsers: usersCount
            }
        };
    };

    /**
     * Update Governorate (Admin only)
     */
    updateGovernorate = async (
        governorateId: string, 
        updateData: updateGovernorateDTO
    ): Promise<any> => {
        const governorate = await this.governorateRepo.findById({
            id: governorateId
        });

        if (!governorate) {
            throw new NotFoundException("Governorate not found");
        }

        // Check if name already exists (if changing name)
        if (updateData.name && updateData.name !== governorate.name) {
            const nameExists = await this.governorateRepo.nameExists(updateData.name, governorateId);
            if (nameExists) {
                throw new ConflictException("Governorate name already exists");
            }
        }

        // Update governorate
        await this.governorateRepo.updateOne({
            filter: { _id: governorateId },
            data: updateData as any
        });

        // Return updated governorate
        return this.getGovernorateById(governorateId);
    };

    /**
     * Delete Governorate (Admin only)
     */
    deleteGovernorate = async (governorateId: string): Promise<void> => {
        const governorate = await this.governorateRepo.findById({
            id: governorateId
        });

        if (!governorate) {
            throw new NotFoundException("Governorate not found");
        }

        // Check if governorate has users
        const usersCount = await UserModel.countDocuments({ 
            governorateId, 
            deletedAt: null 
        });

        if (usersCount > 0) {
            throw new BadRequestException(
                `Cannot delete governorate. It has ${usersCount} assigned user(s). Please reassign or delete users first.`
            );
        }

        // Check if governorate has news or events
        const [newsCount, eventsCount] = await Promise.all([
            NewsModel.countDocuments({ governorateId, deletedAt: null }),
            EventModel.countDocuments({ governorateId, deletedAt: null })
        ]);

        if (newsCount > 0 || eventsCount > 0) {
            throw new BadRequestException(
                `Cannot delete governorate. It has ${newsCount} news and ${eventsCount} events. Please delete them first.`
            );
        }

        // Delete governorate
        await this.governorateRepo.deleteOne({
            filter: { _id: governorateId }
        });
    };

    /**
     * Get Governorates with Statistics
     */
    getGovernoratesWithStats = async (): Promise<any[]> => {
        return await this.governorateRepo.getGovernoratesWithStats();
    };

    /**
     * Get Governorate News
     */
    getGovernorateNews = async (
        governorateId: string, 
        page: number = 1, 
        limit: number = 10,
        published?: boolean
    ): Promise<any> => {
        const governorate = await this.governorateRepo.findById({
            id: governorateId
        });

        if (!governorate) {
            throw new NotFoundException("Governorate not found");
        }

        const filter: any = { 
            governorateId, 
            deletedAt: null 
        };

        if (published !== undefined) {
            filter.published = published;
        }

        const [news, total] = await Promise.all([
            NewsModel.find(filter)
                .populate('createdBy', 'email role')
                .sort({ publishedAt: -1, createdAt: -1 })
                .skip((page - 1) * limit)
                .limit(limit)
                .lean(),
            NewsModel.countDocuments(filter)
        ]);

        const totalPages = Math.ceil(total / limit);

        return {
            data: news,
            pagination: {
                page,
                limit,
                total,
                totalPages,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1
            }
        };
    };

    /**
     * Get Governorate Events
     */
    getGovernorateEvents = async (
        governorateId: string, 
        page: number = 1, 
        limit: number = 10,
        published?: boolean,
        upcoming?: boolean
    ): Promise<any> => {
        const governorate = await this.governorateRepo.findById({
            id: governorateId
        });

        if (!governorate) {
            throw new NotFoundException("Governorate not found");
        }

        const filter: any = { 
            governorateId, 
            deletedAt: null 
        };

        if (published !== undefined) {
            filter.published = published;
        }

        if (upcoming) {
            filter.eventDate = { $gte: new Date() };
        }

        const [events, total] = await Promise.all([
            EventModel.find(filter)
                .populate('createdBy', 'email role')
                .sort({ eventDate: 1 })
                .skip((page - 1) * limit)
                .limit(limit)
                .lean(),
            EventModel.countDocuments(filter)
        ]);

        const totalPages = Math.ceil(total / limit);

        return {
            data: events,
            pagination: {
                page,
                limit,
                total,
                totalPages,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1
            }
        };
    };

    /**
     * Get Governorate Statistics
     */
    getGovernorateStats = async (governorateId: string): Promise<any> => {
        const governorate = await this.governorateRepo.findById({
            id: governorateId
        });

        if (!governorate) {
            throw new NotFoundException("Governorate not found");
        }

        // Get detailed statistics
        const [
            newsStats,
            eventsStats,
            usersStats,
            topNews,
            upcomingEvents
        ] = await Promise.all([
            // News statistics
            NewsModel.aggregate([
                { $match: { governorateId: governorate._id, deletedAt: null } },
                {
                    $group: {
                        _id: null,
                        total: { $sum: 1 },
                        published: {
                            $sum: { $cond: [{ $eq: ['$published', true] }, 1, 0] }
                        },
                        featured: {
                            $sum: { $cond: [{ $eq: ['$featured', true] }, 1, 0] }
                        },
                        totalViews: { $sum: '$viewCount' }
                    }
                }
            ]),
            // Events statistics
            EventModel.aggregate([
                { $match: { governorateId: governorate._id, deletedAt: null } },
                {
                    $group: {
                        _id: null,
                        total: { $sum: 1 },
                        published: {
                            $sum: { $cond: [{ $eq: ['$published', true] }, 1, 0] }
                        },
                        upcoming: {
                            $sum: { $cond: [{ $gte: ['$eventDate', new Date()] }, 1, 0] }
                        },
                        totalParticipants: { $sum: '$currentParticipants' }
                    }
                }
            ]),
            // Users statistics
            UserModel.aggregate([
                { $match: { governorateId: governorate._id, deletedAt: null } },
                {
                    $group: {
                        _id: null,
                        total: { $sum: 1 },
                        active: {
                            $sum: { $cond: [{ $eq: ['$isActive', true] }, 1, 0] }
                        }
                    }
                }
            ]),
            // Top 5 news by views
            NewsModel.find({ 
                governorateId, 
                published: true, 
                deletedAt: null 
            })
                .select('title arabicTitle viewCount coverImage slug')
                .sort({ viewCount: -1 })
                .limit(5)
                .lean(),
            // Upcoming events
            EventModel.find({ 
                governorateId, 
                published: true,
                eventDate: { $gte: new Date() },
                deletedAt: null 
            })
                .select('title arabicTitle eventDate eventTime location coverImage slug')
                .sort({ eventDate: 1 })
                .limit(5)
                .lean()
        ]);

        return {
            governorate: {
                _id: governorate._id,
                name: governorate.name,
                arabicName: governorate.arabicName,
                slug: governorate.slug,
                coverImage: governorate.coverImage
            },
            news: newsStats[0] || {
                total: 0,
                published: 0,
                featured: 0,
                totalViews: 0
            },
            events: eventsStats[0] || {
                total: 0,
                published: 0,
                upcoming: 0,
                totalParticipants: 0
            },
            users: usersStats[0] || {
                total: 0,
                active: 0
            },
            topNews,
            upcomingEvents
        };
    };
}
