import { Request, Response, NextFunction } from 'express';
export declare class NewsController {
    private newsService;
    /**
     * Create News
     * POST /api/news
     */
    createNews: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * Get All News
     * GET /api/news?page=1&limit=10&governorateId=xxx&published=true&featured=false&search=keyword&tags=tag1,tag2
     */
    getAllNews: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * Get News by ID
     * GET /api/news/:id
     */
    getNewsById: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * Get News by Slug (Public)
     * GET /api/news/slug/:slug
     */
    getNewsBySlug: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * Update News
     * PATCH /api/news/:id
     */
    updateNews: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * Delete News
     * DELETE /api/news/:id
     */
    deleteNews: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * Increment View Count
     * PATCH /api/news/:id/view
     */
    incrementViewCount: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * Get Featured News
     * GET /api/news/featured?governorateId=xxx&limit=5
     */
    getFeaturedNews: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * Get Related News
     * GET /api/news/:id/related?limit=5
     */
    getRelatedNews: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * Get News Statistics
     * GET /api/news/stats
     */
    getNewsStats: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * Toggle Featured Status
     * PATCH /api/news/:id/toggle-featured
     */
    toggleFeatured: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * Toggle Published Status
     * PATCH /api/news/:id/toggle-published
     */
    togglePublished: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
//# sourceMappingURL=news.controller.d.ts.map