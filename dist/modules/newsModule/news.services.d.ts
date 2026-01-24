import { createNewsDTO, updateNewsDTO, getNewsQueryDTO } from './news.DTO.js';
import { IPaginationResult } from '../../DB/repos/DBRepo.js';
export declare class NewsService {
    private newsRepo;
    constructor();
    /**
     * Create News
     */
    createNews: (newsData: createNewsDTO, userId: string, userRole: string, userGovernorateId?: string) => Promise<any>;
    /**
     * Get All News with filters and pagination
     */
    getAllNews: (query: getNewsQueryDTO, userRole?: string, userGovernorateId?: string) => Promise<IPaginationResult<any>>;
    /**
     * Get News by ID
     */
    getNewsById: (newsId: string) => Promise<any>;
    /**
     * Get News by Slug (Public)
     */
    getNewsBySlug: (slug: string) => Promise<any>;
    /**
     * Update News
     */
    updateNews: (newsId: string, updateData: updateNewsDTO, userId: string, userRole: string, userGovernorateId?: string) => Promise<any>;
    /**
     * Delete News (Soft Delete)
     */
    deleteNews: (newsId: string, userId: string, userRole: string, userGovernorateId?: string) => Promise<void>;
    /**
     * Increment View Count
     */
    incrementViewCount: (newsId: string) => Promise<void>;
    /**
     * Get Featured News
     */
    getFeaturedNews: (governorateId?: string, limit?: number) => Promise<any[]>;
    /**
     * Get Related News
     */
    getRelatedNews: (newsId: string, limit?: number) => Promise<any[]>;
    /**
     * Get News Statistics
     */
    getNewsStats: () => Promise<any>;
    /**
     * Toggle Featured Status
     */
    toggleFeatured: (newsId: string, userId: string) => Promise<any>;
    /**
     * Toggle Published Status
     */
    togglePublished: (newsId: string, userId: string) => Promise<any>;
}
//# sourceMappingURL=news.services.d.ts.map