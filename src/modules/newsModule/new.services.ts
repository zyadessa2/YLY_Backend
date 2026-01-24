import { 
    BadRequestException,
    NotFoundException,
    ForbidenException
} from '../../utils/response/error.response.js';
import { createNewsDTO, updateNewsDTO, getNewsQueryDTO } from './news.DTO.js';
import { AnalyticsModel } from '../../DB/models/analytics.model.js';
import { GovernorateModel } from '../../DB/models/governorate.model.js';
import { NewsRepo } from '../../DB/repos/News.Repo.js';
import { IPaginationResult } from '../../DB/repos/DBRepo.js';

export class NewsService {
    private newsRepo = new NewsRepo();

    constructor() {}

    /**
     * Create News
     */
    createNews = async (newsData: createNewsDTO, userId: string, userRole: string, userGovernorateId?: string): Promise<any> => {
        // If user is governorate_user, force their governorateId
        if (userRole === 'governorate_user') {
            if (!userGovernorateId) {
                throw new ForbidenException("Governorate user must have a governorate assigned");
            }
            newsData.governorateId = userGovernorateId;
        }

        // Validate governorate exists
        const governorate = await GovernorateModel.findById(newsData.governorateId);
        if (!governorate) {
            throw new NotFoundException("Governorate not found");
        }

        // Create news
        const newNews = await this.newsRepo.create({
            ...newsData,
            createdBy: userId as any,
            updatedBy: userId as any,
            viewCount: 0
        } as any);

        // Handle create return (can be single or array)
        const createdNews = Array.isArray(newNews) ? newNews[0] : newNews;
        
        if (!createdNews) {
            throw new BadRequestException("Failed to create news");
        }

        // Populate and return
        const populatedNews = await this.newsRepo.findById({
            id: createdNews._id as any,
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
    getAllNews = async (query: getNewsQueryDTO, userRole?: string, userGovernorateId?: string): Promise<IPaginationResult<any>> => {
        const { page, limit, governorateId, published, featured, search, tags, sortBy, sortOrder } = query;

        // Build filter
        const filter: any = { deletedAt: null };

        // If governorate_user, filter by their governorate
        if (userRole === 'governorate_user' && userGovernorateId) {
            filter.governorateId = userGovernorateId;
        } else if (governorateId) {
            filter.governorateId = governorateId;
        }

        if (published !== undefined) filter.published = published;
        if (featured !== undefined) filter.featured = featured;

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
        const sort: any = {};
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
    getNewsById = async (newsId: string): Promise<any> => {
        const news = await this.newsRepo.findById({
            id: newsId,
            populate: [
                { path: 'governorateId', select: 'name arabicName slug logo coverImage description' },
                { path: 'createdBy', select: 'email role' },
                { path: 'updatedBy', select: 'email role' }
            ]
        });

        if (!news) {
            throw new NotFoundException("News not found");
        }

        return news;
    };

    /**
     * Get News by Slug (Public)
     */
    getNewsBySlug = async (slug: string): Promise<any> => {
        const news = await this.newsRepo.findBySlug(slug);

        if (!news) {
            throw new NotFoundException("News not found");
        }

        // Only return if published (for public access)
        if (!news.published) {
            throw new NotFoundException("News not found");
        }

        return news;
    };

    /**
     * Update News
     */
    updateNews = async (
        newsId: string, 
        updateData: updateNewsDTO, 
        userId: string,
        userRole: string,
        userGovernorateId?: string
    ): Promise<any> => {
        const news = await this.newsRepo.findById({ id: newsId });

        if (!news) {
            throw new NotFoundException("News not found");
        }

        // Check permissions
        if (userRole === 'governorate_user') {
            // User can only update news from their governorate
            if (news.governorateId.toString() !== userGovernorateId) {
                throw new ForbidenException("You can only update news from your governorate");
            }
            // User can only update news they created
            if (news.createdBy.toString() !== userId) {
                throw new ForbidenException("You can only update news you created");
            }
        }

        // If changing governorate, validate
        if (updateData.governorateId && updateData.governorateId !== news.governorateId.toString()) {
            const governorate = await GovernorateModel.findById(updateData.governorateId);
            if (!governorate) {
                throw new NotFoundException("Governorate not found");
            }
        }

        // Validate published/publishedAt relation
        if (updateData.published && !updateData.publishedAt && !news.publishedAt) {
            throw new BadRequestException("Published date is required when publishing news");
        }

        // Update news
        const updatePayload = {
            ...updateData,
            updatedBy: userId
        } as any;

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
    deleteNews = async (
        newsId: string, 
        userId: string,
        userRole: string,
        userGovernorateId?: string
    ): Promise<void> => {
        const news = await this.newsRepo.findById({ id: newsId });

        if (!news) {
            throw new NotFoundException("News not found");
        }

        // Check permissions
        if (userRole === 'governorate_user') {
            // User can only delete news from their governorate
            if (news.governorateId.toString() !== userGovernorateId) {
                throw new ForbidenException("You can only delete news from your governorate");
            }
            // User can only delete news they created
            if (news.createdBy.toString() !== userId) {
                throw new ForbidenException("You can only delete news you created");
            }
        }

        // Soft delete
        await this.newsRepo.softDeleteById({ id: newsId });
    };

    /**
     * Increment View Count
     */
    incrementViewCount = async (newsId: string): Promise<void> => {
        const news = await this.newsRepo.findById({ id: newsId });

        if (!news) {
            throw new NotFoundException("News not found");
        }

        // Increment view count
        await this.newsRepo.incrementViewCount(newsId);

        // Track in analytics
        await AnalyticsModel.incrementNewsView(news.governorateId.toString());
    };

    /**
     * Get Featured News
     */
    getFeaturedNews = async (governorateId?: string, limit: number = 5): Promise<any[]> => {
        return await this.newsRepo.getFeaturedNews(governorateId, limit);
    };

    /**
     * Get Related News
     */
    getRelatedNews = async (newsId: string, limit: number = 5): Promise<any[]> => {
        const news = await this.newsRepo.findById({ id: newsId });

        if (!news) {
            throw new NotFoundException("News not found");
        }

        return await this.newsRepo.getRelatedNews(
            newsId, 
            news.tags || [], 
            limit
        );
    };

    /**
     * Get News Statistics
     */
    getNewsStats = async (): Promise<any> => {
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
    toggleFeatured = async (newsId: string, userId: string): Promise<any> => {
        const news = await this.newsRepo.findById({ id: newsId });

        if (!news) {
            throw new NotFoundException("News not found");
        }

        await this.newsRepo.updateOne({
            filter: { _id: newsId },
            data: { 
                featured: !news.featured,
                updatedBy: userId
            } as any
        });

        return this.getNewsById(newsId);
    };

    /**
     * Toggle Published Status
     */
    togglePublished = async (newsId: string, userId: string): Promise<any> => {
        const news = await this.newsRepo.findById({ id: newsId });

        if (!news) {
            throw new NotFoundException("News not found");
        }

        // If publishing and no publishedAt, set it to now
        const updateData: any = {
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
