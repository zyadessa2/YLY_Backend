"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewsController = void 0;
const new_services_js_1 = require("./new.services.js");
const success_response_js_1 = require("../../utils/response/success.response.js");
class NewsController {
    constructor() {
        this.newsService = new new_services_js_1.NewsService();
        /**
         * Create News
         * POST /api/news
         */
        this.createNews = async (req, res, next) => {
            try {
                const newsData = req.body;
                const userId = req.user?._id?.toString();
                const userRole = req.user?.role;
                const userGovernorateId = req.user?.governorateId?.toString();
                if (!userId) {
                    throw new Error("User ID is required");
                }
                const result = await this.newsService.createNews(newsData, userId, userRole || 'admin', userGovernorateId);
                (0, success_response_js_1.successResponse)({
                    res,
                    message: "News created successfully",
                    data: result,
                    statusCode: 201
                });
            }
            catch (error) {
                next(error);
            }
        };
        /**
         * Get All News
         * GET /api/news?page=1&limit=10&governorateId=xxx&published=true&featured=false&search=keyword&tags=tag1,tag2
         */
        this.getAllNews = async (req, res, next) => {
            try {
                const query = req.query;
                const userRole = req.user?.role;
                const userGovernorateId = req.user?.governorateId?.toString();
                const result = await this.newsService.getAllNews(query, userRole, userGovernorateId);
                (0, success_response_js_1.successResponse)({
                    res,
                    message: "News retrieved successfully",
                    data: result
                });
            }
            catch (error) {
                next(error);
            }
        };
        /**
         * Get News by ID
         * GET /api/news/:id
         */
        this.getNewsById = async (req, res, next) => {
            try {
                const newsId = req.params.id;
                if (!newsId) {
                    throw new Error("News ID is required");
                }
                const result = await this.newsService.getNewsById(newsId);
                (0, success_response_js_1.successResponse)({
                    res,
                    message: "News retrieved successfully",
                    data: result
                });
            }
            catch (error) {
                next(error);
            }
        };
        /**
         * Get News by Slug (Public)
         * GET /api/news/slug/:slug
         */
        this.getNewsBySlug = async (req, res, next) => {
            try {
                const slug = req.params.slug;
                if (!slug) {
                    throw new Error("Slug is required");
                }
                const result = await this.newsService.getNewsBySlug(slug);
                (0, success_response_js_1.successResponse)({
                    res,
                    message: "News retrieved successfully",
                    data: result
                });
            }
            catch (error) {
                next(error);
            }
        };
        /**
         * Update News
         * PATCH /api/news/:id
         */
        this.updateNews = async (req, res, next) => {
            try {
                const newsId = req.params.id;
                const updateData = req.body;
                const userId = req.user?._id?.toString();
                const userRole = req.user?.role;
                const userGovernorateId = req.user?.governorateId?.toString();
                if (!newsId) {
                    throw new Error("News ID is required");
                }
                if (!userId) {
                    throw new Error("User ID is required");
                }
                const result = await this.newsService.updateNews(newsId, updateData, userId, userRole || 'admin', userGovernorateId);
                (0, success_response_js_1.successResponse)({
                    res,
                    message: "News updated successfully",
                    data: result
                });
            }
            catch (error) {
                next(error);
            }
        };
        /**
         * Delete News
         * DELETE /api/news/:id
         */
        this.deleteNews = async (req, res, next) => {
            try {
                const newsId = req.params.id;
                const userId = req.user?._id?.toString();
                const userRole = req.user?.role;
                const userGovernorateId = req.user?.governorateId?.toString();
                if (!newsId) {
                    throw new Error("News ID is required");
                }
                if (!userId) {
                    throw new Error("User ID is required");
                }
                await this.newsService.deleteNews(newsId, userId, userRole || 'admin', userGovernorateId);
                (0, success_response_js_1.successResponse)({
                    res,
                    message: "News deleted successfully",
                    data: null
                });
            }
            catch (error) {
                next(error);
            }
        };
        /**
         * Increment View Count
         * PATCH /api/news/:id/view
         */
        this.incrementViewCount = async (req, res, next) => {
            try {
                const newsId = req.params.id;
                if (!newsId) {
                    throw new Error("News ID is required");
                }
                await this.newsService.incrementViewCount(newsId);
                (0, success_response_js_1.successResponse)({
                    res,
                    message: "View count incremented",
                    data: null
                });
            }
            catch (error) {
                next(error);
            }
        };
        /**
         * Get Featured News
         * GET /api/news/featured?governorateId=xxx&limit=5
         */
        this.getFeaturedNews = async (req, res, next) => {
            try {
                const governorateId = req.query.governorateId;
                const limit = parseInt(req.query.limit) || 5;
                const result = await this.newsService.getFeaturedNews(governorateId, limit);
                (0, success_response_js_1.successResponse)({
                    res,
                    message: "Featured news retrieved successfully",
                    data: result
                });
            }
            catch (error) {
                next(error);
            }
        };
        /**
         * Get Related News
         * GET /api/news/:id/related?limit=5
         */
        this.getRelatedNews = async (req, res, next) => {
            try {
                const newsId = req.params.id;
                if (!newsId) {
                    throw new Error("News ID is required");
                }
                const limit = parseInt(req.query.limit) || 5;
                const result = await this.newsService.getRelatedNews(newsId, limit);
                (0, success_response_js_1.successResponse)({
                    res,
                    message: "Related news retrieved successfully",
                    data: result
                });
            }
            catch (error) {
                next(error);
            }
        };
        /**
         * Get News Statistics
         * GET /api/news/stats
         */
        this.getNewsStats = async (req, res, next) => {
            try {
                const result = await this.newsService.getNewsStats();
                (0, success_response_js_1.successResponse)({
                    res,
                    message: "News statistics retrieved successfully",
                    data: result
                });
            }
            catch (error) {
                next(error);
            }
        };
        /**
         * Toggle Featured Status
         * PATCH /api/news/:id/toggle-featured
         */
        this.toggleFeatured = async (req, res, next) => {
            try {
                const newsId = req.params.id;
                const userId = req.user?._id?.toString();
                if (!newsId) {
                    throw new Error("News ID is required");
                }
                if (!userId) {
                    throw new Error("User ID is required");
                }
                const result = await this.newsService.toggleFeatured(newsId, userId);
                (0, success_response_js_1.successResponse)({
                    res,
                    message: `News ${result.featured ? 'featured' : 'unfeatured'} successfully`,
                    data: result
                });
            }
            catch (error) {
                next(error);
            }
        };
        /**
         * Toggle Published Status
         * PATCH /api/news/:id/toggle-published
         */
        this.togglePublished = async (req, res, next) => {
            try {
                const newsId = req.params.id;
                const userId = req.user?._id?.toString();
                if (!newsId) {
                    throw new Error("News ID is required");
                }
                if (!userId) {
                    throw new Error("User ID is required");
                }
                const result = await this.newsService.togglePublished(newsId, userId);
                (0, success_response_js_1.successResponse)({
                    res,
                    message: `News ${result.published ? 'published' : 'unpublished'} successfully`,
                    data: result
                });
            }
            catch (error) {
                next(error);
            }
        };
    }
}
exports.NewsController = NewsController;
//# sourceMappingURL=news.controller.js.map