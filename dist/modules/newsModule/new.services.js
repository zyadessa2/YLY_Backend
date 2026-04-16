"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewsService = void 0;
const error_response_js_1 = require("../../utils/response/error.response.js");
const analytics_model_js_1 = require("../../DB/models/analytics.model.js");
const governorate_model_js_1 = require("../../DB/models/governorate.model.js");
const News_Repo_js_1 = require("../../DB/repos/News.Repo.js");
class NewsService {
    constructor() {
        this.newsRepo = new News_Repo_js_1.NewsRepo();
        /**
         * Create News
         */
        this.createNews = async (newsData, userId, userRole, userGovernorateId) => {
            // If user is governorate_user, force their governorateId
            if (userRole === 'governorate_user') {
                if (!userGovernorateId) {
                    throw new error_response_js_1.ForbidenException("Governorate user must have a governorate assigned");
                }
                newsData.governorateId = userGovernorateId;
            }
            // Validate governorate exists
            const governorate = await governorate_model_js_1.GovernorateModel.findById(newsData.governorateId);
            if (!governorate) {
                throw new error_response_js_1.NotFoundException("Governorate not found");
            }
            if (newsData.published && !newsData.publishedAt) {
                newsData.publishedAt = new Date();
            }
            // Create news
            const newNews = await this.newsRepo.create({
                ...newsData,
                createdBy: userId,
                updatedBy: userId,
                viewCount: 0
            });
            // Handle create return (can be single or array)
            const createdNews = Array.isArray(newNews) ? newNews[0] : newNews;
            if (!createdNews) {
                throw new error_response_js_1.BadRequestException("Failed to create news");
            }
            // Populate and return
            const populatedNews = await this.newsRepo.findById({
                id: createdNews._id,
                populate: [
                    { path: 'governorateId', select: 'name arabicName slug logo' },
                    { path: 'createdBy', select: 'email role' }
                ]
            });
            return populatedNews;
        };
        /**
         * Get All News with filters and pagination
         */
        this.getAllNews = async (query, userRole, userGovernorateId) => {
            const { page, limit, governorateId, published, featured, search, tags, sortBy, sortOrder } = query;
            // Build filter
            const filter = { deletedAt: null };
            // If governorate_user, filter by their governorate
            if (userRole === 'governorate_user' && userGovernorateId) {
                filter.governorateId = userGovernorateId;
            }
            else if (governorateId) {
                filter.governorateId = governorateId;
            }
            if (published !== undefined)
                filter.published = published;
            if (featured !== undefined)
                filter.featured = featured;
            // Search in title, description, content
            if (search) {
                filter.$or = [
                    { title: { $regex: search, $options: 'i' } },
                    { arabicTitle: { $regex: search, $options: 'i' } },
                    { description: { $regex: search, $options: 'i' } },
                    { arabicDescription: { $regex: search, $options: 'i' } }
                ];
            }
            // Filter by tags
            if (tags) {
                const tagArray = tags.split(',').map(tag => tag.trim());
                filter.tags = { $in: tagArray };
            }
            // Build sort
            const sort = {};
            sort[sortBy || 'createdAt'] = sortOrder === 'asc' ? 1 : -1;
            // Get paginated results
            const result = await this.newsRepo.findWithPagination({
                filter,
                populate: [
                    { path: 'governorateId', select: 'name arabicName slug logo' },
                    { path: 'createdBy', select: 'email role' },
                    { path: 'updatedBy', select: 'email role' }
                ],
                sort,
                page: page || 1,
                limit: limit || 10
            });
            return result;
        };
        /**
         * Get News by ID
         */
        this.getNewsById = async (newsId) => {
            const news = await this.newsRepo.findById({
                id: newsId,
                populate: [
                    { path: 'governorateId', select: 'name arabicName slug logo coverImage description' },
                    { path: 'createdBy', select: 'email role' },
                    { path: 'updatedBy', select: 'email role' }
                ]
            });
            if (!news) {
                throw new error_response_js_1.NotFoundException("News not found");
            }
            return news;
        };
        /**
         * Get News by Slug (Public)
         */
        this.getNewsBySlug = async (slug) => {
            const news = await this.newsRepo.findBySlug(slug);
            if (!news) {
                throw new error_response_js_1.NotFoundException("News not found");
            }
            // Only return if published (for public access)
            if (!news.published) {
                throw new error_response_js_1.NotFoundException("News not found");
            }
            return news;
        };
        /**
         * Update News
         */
        this.updateNews = async (newsId, updateData, userId, userRole, userGovernorateId) => {
            const news = await this.newsRepo.findById({ id: newsId });
            if (!news) {
                throw new error_response_js_1.NotFoundException("News not found");
            }
            // Check permissions
            if (userRole === 'governorate_user') {
                // User can only update news from their governorate
                if (news.governorateId.toString() !== userGovernorateId) {
                    throw new error_response_js_1.ForbidenException("You can only update news from your governorate");
                }
                // User can only update news they created
                if (news.createdBy.toString() !== userId) {
                    throw new error_response_js_1.ForbidenException("You can only update news you created");
                }
            }
            // If changing governorate, validate
            if (updateData.governorateId && updateData.governorateId !== news.governorateId.toString()) {
                const governorate = await governorate_model_js_1.GovernorateModel.findById(updateData.governorateId);
                if (!governorate) {
                    throw new error_response_js_1.NotFoundException("Governorate not found");
                }
            }
            // Auto-populate publishedAt when publishing without explicit date
            if (updateData.published === true && !updateData.publishedAt && !news.publishedAt) {
                updateData.publishedAt = new Date();
            }
            // Update news
            const updatePayload = {
                ...updateData,
                updatedBy: userId
            };
            await this.newsRepo.updateOne({
                filter: { _id: newsId },
                data: updatePayload
            });
            // Return updated news
            return this.getNewsById(newsId);
        };
        /**
         * Delete News (Soft Delete)
         */
        this.deleteNews = async (newsId, userId, userRole, userGovernorateId) => {
            const news = await this.newsRepo.findById({ id: newsId });
            if (!news) {
                throw new error_response_js_1.NotFoundException("News not found");
            }
            // Check permissions
            if (userRole === 'governorate_user') {
                // User can only delete news from their governorate
                if (news.governorateId.toString() !== userGovernorateId) {
                    throw new error_response_js_1.ForbidenException("You can only delete news from your governorate");
                }
                // User can only delete news they created
                if (news.createdBy.toString() !== userId) {
                    throw new error_response_js_1.ForbidenException("You can only delete news you created");
                }
            }
            // Soft delete
            await this.newsRepo.softDeleteById({ id: newsId });
        };
        /**
         * Increment View Count
         */
        this.incrementViewCount = async (newsId) => {
            const news = await this.newsRepo.findById({ id: newsId });
            if (!news) {
                throw new error_response_js_1.NotFoundException("News not found");
            }
            // Increment view count
            await this.newsRepo.incrementViewCount(newsId);
            // Track in analytics
            await analytics_model_js_1.AnalyticsModel.incrementNewsView(news.governorateId.toString());
        };
        /**
         * Get Featured News
         */
        this.getFeaturedNews = async (governorateId, limit = 5) => {
            return await this.newsRepo.getFeaturedNews(governorateId, limit);
        };
        /**
         * Get Related News
         */
        this.getRelatedNews = async (newsId, limit = 5) => {
            const news = await this.newsRepo.findById({ id: newsId });
            if (!news) {
                throw new error_response_js_1.NotFoundException("News not found");
            }
            return await this.newsRepo.getRelatedNews(newsId, news.tags || [], limit);
        };
        /**
         * Get News Statistics
         */
        this.getNewsStats = async () => {
            const [totalStats, governorateStats] = await Promise.all([
                this.newsRepo.aggregate([
                    { $match: { deletedAt: null } },
                    {
                        $group: {
                            _id: null,
                            totalNews: { $sum: 1 },
                            publishedNews: {
                                $sum: { $cond: [{ $eq: ['$published', true] }, 1, 0] }
                            },
                            featuredNews: {
                                $sum: { $cond: [{ $eq: ['$featured', true] }, 1, 0] }
                            },
                            totalViews: { $sum: '$viewCount' }
                        }
                    }
                ]),
                this.newsRepo.getNewsStatsByGovernorate()
            ]);
            return {
                overall: totalStats[0] || {
                    totalNews: 0,
                    publishedNews: 0,
                    featuredNews: 0,
                    totalViews: 0
                },
                byGovernorate: governorateStats
            };
        };
        /**
         * Toggle Featured Status
         */
        this.toggleFeatured = async (newsId, userId) => {
            const news = await this.newsRepo.findById({ id: newsId });
            if (!news) {
                throw new error_response_js_1.NotFoundException("News not found");
            }
            await this.newsRepo.updateOne({
                filter: { _id: newsId },
                data: {
                    featured: !news.featured,
                    updatedBy: userId
                }
            });
            return this.getNewsById(newsId);
        };
        /**
         * Toggle Published Status
         */
        this.togglePublished = async (newsId, userId) => {
            const news = await this.newsRepo.findById({ id: newsId });
            if (!news) {
                throw new error_response_js_1.NotFoundException("News not found");
            }
            // If publishing and no publishedAt, set it to now
            const updateData = {
                published: !news.published,
                updatedBy: userId
            };
            if (!news.published && !news.publishedAt) {
                updateData.publishedAt = new Date();
            }
            await this.newsRepo.updateOne({
                filter: { _id: newsId },
                data: updateData
            });
            return this.getNewsById(newsId);
        };
    }
}
exports.NewsService = NewsService;
//# sourceMappingURL=new.services.js.map