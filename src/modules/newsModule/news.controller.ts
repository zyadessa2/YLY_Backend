import { Request, Response, NextFunction } from 'express';
import { NewsService } from './new.services.js';
import { successResponse } from '../../utils/response/success.response.js';
import { createNewsDTO, updateNewsDTO, getNewsQueryDTO } from './news.DTO.js';

export class NewsController {
    private newsService = new NewsService();

    /**
     * Create News
     * POST /api/news
     */
    createNews = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const newsData: createNewsDTO = req.body;
            const userId = req.user?._id?.toString();
            const userRole = req.user?.role;
            const userGovernorateId = req.user?.governorateId?.toString();

            if (!userId) {
                throw new Error("User ID is required");
            }

            const result = await this.newsService.createNews(newsData, userId, userRole as string, userGovernorateId);

            successResponse({
                res,
                message: "News created successfully",
                data: result,
                statusCode: 201
            });
        } catch (error) {
            next(error);
        }
    };

    /**
     * Get All News
     * GET /api/news?page=1&limit=10&governorateId=xxx&published=true&featured=false&search=keyword&tags=tag1,tag2
     */
    getAllNews = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const query = req.query as unknown as getNewsQueryDTO;
            const userRole = req.user?.role;
            const userGovernorateId = req.user?.governorateId?.toString();

            const result = await this.newsService.getAllNews(query, userRole, userGovernorateId);

            successResponse({
                res,
                message: "News retrieved successfully",
                data: result
            });
        } catch (error) {
            next(error);
        }
    };

    /**
     * Get News by ID
     * GET /api/news/:id
     */
    getNewsById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const newsId = req.params.id;
            
            if (!newsId) {
                throw new Error("News ID is required");
            }

            const result = await this.newsService.getNewsById(newsId);

            successResponse({
                res,
                message: "News retrieved successfully",
                data: result
            });
        } catch (error) {
            next(error);
        }
    };

    /**
     * Get News by Slug (Public)
     * GET /api/news/slug/:slug
     */
    getNewsBySlug = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const slug = req.params.slug;
            
            if (!slug) {
                throw new Error("Slug is required");
            }

            const result = await this.newsService.getNewsBySlug(slug);

            successResponse({
                res,
                message: "News retrieved successfully",
                data: result
            });
        } catch (error) {
            next(error);
        }
    };

    /**
     * Update News
     * PATCH /api/news/:id
     */
    updateNews = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const newsId = req.params.id;
            const updateData: updateNewsDTO = req.body;
            const userId = req.user?._id?.toString();
            const userRole = req.user?.role;
            const userGovernorateId = req.user?.governorateId?.toString();

            if (!newsId) {
                throw new Error("News ID is required");
            }

            if (!userId) {
                throw new Error("User ID is required");
            }

            const result = await this.newsService.updateNews(newsId, updateData, userId, userRole as string, userGovernorateId);

            successResponse({
                res,
                message: "News updated successfully",
                data: result
            });
        } catch (error) {
            next(error);
        }
    };

    /**
     * Delete News
     * DELETE /api/news/:id
     */
    deleteNews = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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

            await this.newsService.deleteNews(newsId, userId, userRole as string, userGovernorateId);

            successResponse({
                res,
                message: "News deleted successfully",
                data: null
            });
        } catch (error) {
            next(error);
        }
    };

    /**
     * Increment View Count
     * PATCH /api/news/:id/view
     */
    incrementViewCount = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const newsId = req.params.id;
            
            if (!newsId) {
                throw new Error("News ID is required");
            }

            await this.newsService.incrementViewCount(newsId);

            successResponse({
                res,
                message: "View count incremented",
                data: null
            });
        } catch (error) {
            next(error);
        }
    };

    /**
     * Get Featured News
     * GET /api/news/featured?governorateId=xxx&limit=5
     */
    getFeaturedNews = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const governorateId = req.query.governorateId as string;
            const limit = parseInt(req.query.limit as string) || 5;

            const result = await this.newsService.getFeaturedNews(governorateId, limit);

            successResponse({
                res,
                message: "Featured news retrieved successfully",
                data: result
            });
        } catch (error) {
            next(error);
        }
    };

    /**
     * Get Related News
     * GET /api/news/:id/related?limit=5
     */
    getRelatedNews = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const newsId = req.params.id;
            
            if (!newsId) {
                throw new Error("News ID is required");
            }
            
            const limit = parseInt(req.query.limit as string) || 5;

            const result = await this.newsService.getRelatedNews(newsId, limit);

            successResponse({
                res,
                message: "Related news retrieved successfully",
                data: result
            });
        } catch (error) {
            next(error);
        }
    };

    /**
     * Get News Statistics
     * GET /api/news/stats
     */
    getNewsStats = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const result = await this.newsService.getNewsStats();

            successResponse({
                res,
                message: "News statistics retrieved successfully",
                data: result
            });
        } catch (error) {
            next(error);
        }
    };

    /**
     * Toggle Featured Status
     * PATCH /api/news/:id/toggle-featured
     */
    toggleFeatured = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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

            successResponse({
                res,
                message: `News ${result.featured ? 'featured' : 'unfeatured'} successfully`,
                data: result
            });
        } catch (error) {
            next(error);
        }
    };

    /**
     * Toggle Published Status
     * PATCH /api/news/:id/toggle-published
     */
    togglePublished = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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

            successResponse({
                res,
                message: `News ${result.published ? 'published' : 'unpublished'} successfully`,
                data: result
            });
        } catch (error) {
            next(error);
        }
    };
}
