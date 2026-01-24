"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GovernorateService = void 0;
const event_model_js_1 = require("../../DB/models/event.model.js");
const news_model_js_1 = require("../../DB/models/news.model.js");
const user_model_js_1 = require("../../DB/models/user.model.js");
const Governorate_Repo_js_1 = require("../../DB/repos/Governorate.Repo.js");
const error_response_js_1 = require("../../utils/response/error.response.js");
class GovernorateService {
    constructor() {
        this.governorateRepo = new Governorate_Repo_js_1.GovernorateRepo();
        /**
         * Create Governorate (Admin only)
         */
        this.createGovernorate = async (governorateData) => {
            // Check if name already exists
            const nameExists = await this.governorateRepo.nameExists(governorateData.name);
            if (nameExists) {
                throw new error_response_js_1.ConflictException("Governorate name already exists");
            }
            // Create governorate
            const newGovernorate = await this.governorateRepo.create(governorateData);
            return newGovernorate;
        };
        /**
         * Get All Governorates with pagination
         */
        this.getAllGovernorates = async (query) => {
            const { page, limit, search, sortBy, sortOrder } = query;
            // Build filter
            const filter = {};
            // Search in name and arabic name
            if (search) {
                filter.$or = [
                    { name: { $regex: search, $options: 'i' } },
                    { arabicName: { $regex: search, $options: 'i' } },
                    { slug: { $regex: search, $options: 'i' } }
                ];
            }
            // Build sort
            const sort = {};
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
        this.getAllGovernoratesNoPagination = async () => {
            return await this.governorateRepo.find({
                filter: {},
                sort: { name: 1 }
            });
        };
        /**
         * Get Governorate by ID
         */
        this.getGovernorateById = async (governorateId) => {
            const governorate = await this.governorateRepo.findById({
                id: governorateId
            });
            if (!governorate) {
                throw new error_response_js_1.NotFoundException("Governorate not found");
            }
            return governorate;
        };
        /**
         * Get Governorate by Slug
         */
        this.getGovernorateBySlug = async (slug) => {
            const governorate = await this.governorateRepo.findBySlug(slug);
            if (!governorate) {
                throw new error_response_js_1.NotFoundException("Governorate not found");
            }
            return governorate;
        };
        /**
         * Get Governorate with Details (News, Events, Users)
         */
        this.getGovernorateDetails = async (governorateId) => {
            const governorate = await this.governorateRepo.findById({
                id: governorateId
            });
            if (!governorate) {
                throw new error_response_js_1.NotFoundException("Governorate not found");
            }
            // Get statistics
            const [newsCount, publishedNewsCount, eventsCount, publishedEventsCount, upcomingEventsCount, usersCount] = await Promise.all([
                news_model_js_1.NewsModel.countDocuments({ governorateId, deletedAt: null }),
                news_model_js_1.NewsModel.countDocuments({ governorateId, published: true, deletedAt: null }),
                event_model_js_1.EventModel.countDocuments({ governorateId, deletedAt: null }),
                event_model_js_1.EventModel.countDocuments({ governorateId, published: true, deletedAt: null }),
                event_model_js_1.EventModel.countDocuments({
                    governorateId,
                    published: true,
                    eventDate: { $gte: new Date() },
                    deletedAt: null
                }),
                user_model_js_1.UserModel.countDocuments({ governorateId, isActive: true, deletedAt: null })
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
        this.updateGovernorate = async (governorateId, updateData) => {
            const governorate = await this.governorateRepo.findById({
                id: governorateId
            });
            if (!governorate) {
                throw new error_response_js_1.NotFoundException("Governorate not found");
            }
            // Check if name already exists (if changing name)
            if (updateData.name && updateData.name !== governorate.name) {
                const nameExists = await this.governorateRepo.nameExists(updateData.name, governorateId);
                if (nameExists) {
                    throw new error_response_js_1.ConflictException("Governorate name already exists");
                }
            }
            // Update governorate
            await this.governorateRepo.updateOne({
                filter: { _id: governorateId },
                data: updateData
            });
            // Return updated governorate
            return this.getGovernorateById(governorateId);
        };
        /**
         * Delete Governorate (Admin only)
         */
        this.deleteGovernorate = async (governorateId) => {
            const governorate = await this.governorateRepo.findById({
                id: governorateId
            });
            if (!governorate) {
                throw new error_response_js_1.NotFoundException("Governorate not found");
            }
            // Check if governorate has users
            const usersCount = await user_model_js_1.UserModel.countDocuments({
                governorateId,
                deletedAt: null
            });
            if (usersCount > 0) {
                throw new error_response_js_1.BadRequestException(`Cannot delete governorate. It has ${usersCount} assigned user(s). Please reassign or delete users first.`);
            }
            // Check if governorate has news or events
            const [newsCount, eventsCount] = await Promise.all([
                news_model_js_1.NewsModel.countDocuments({ governorateId, deletedAt: null }),
                event_model_js_1.EventModel.countDocuments({ governorateId, deletedAt: null })
            ]);
            if (newsCount > 0 || eventsCount > 0) {
                throw new error_response_js_1.BadRequestException(`Cannot delete governorate. It has ${newsCount} news and ${eventsCount} events. Please delete them first.`);
            }
            // Delete governorate
            await this.governorateRepo.deleteOne({
                filter: { _id: governorateId }
            });
        };
        /**
         * Get Governorates with Statistics
         */
        this.getGovernoratesWithStats = async () => {
            return await this.governorateRepo.getGovernoratesWithStats();
        };
        /**
         * Get Governorate News
         */
        this.getGovernorateNews = async (governorateId, page = 1, limit = 10, published) => {
            const governorate = await this.governorateRepo.findById({
                id: governorateId
            });
            if (!governorate) {
                throw new error_response_js_1.NotFoundException("Governorate not found");
            }
            const filter = {
                governorateId,
                deletedAt: null
            };
            if (published !== undefined) {
                filter.published = published;
            }
            const [news, total] = await Promise.all([
                news_model_js_1.NewsModel.find(filter)
                    .populate('createdBy', 'email role')
                    .sort({ publishedAt: -1, createdAt: -1 })
                    .skip((page - 1) * limit)
                    .limit(limit)
                    .lean(),
                news_model_js_1.NewsModel.countDocuments(filter)
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
        this.getGovernorateEvents = async (governorateId, page = 1, limit = 10, published, upcoming) => {
            const governorate = await this.governorateRepo.findById({
                id: governorateId
            });
            if (!governorate) {
                throw new error_response_js_1.NotFoundException("Governorate not found");
            }
            const filter = {
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
                event_model_js_1.EventModel.find(filter)
                    .populate('createdBy', 'email role')
                    .sort({ eventDate: 1 })
                    .skip((page - 1) * limit)
                    .limit(limit)
                    .lean(),
                event_model_js_1.EventModel.countDocuments(filter)
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
        this.getGovernorateStats = async (governorateId) => {
            const governorate = await this.governorateRepo.findById({
                id: governorateId
            });
            if (!governorate) {
                throw new error_response_js_1.NotFoundException("Governorate not found");
            }
            // Get detailed statistics
            const [newsStats, eventsStats, usersStats, topNews, upcomingEvents] = await Promise.all([
                // News statistics
                news_model_js_1.NewsModel.aggregate([
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
                event_model_js_1.EventModel.aggregate([
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
                user_model_js_1.UserModel.aggregate([
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
                news_model_js_1.NewsModel.find({
                    governorateId,
                    published: true,
                    deletedAt: null
                })
                    .select('title arabicTitle viewCount coverImage slug')
                    .sort({ viewCount: -1 })
                    .limit(5)
                    .lean(),
                // Upcoming events
                event_model_js_1.EventModel.find({
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
}
exports.GovernorateService = GovernorateService;
//# sourceMappingURL=governorate.service.js.map