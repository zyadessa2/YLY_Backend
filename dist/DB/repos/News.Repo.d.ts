import { INews } from '../models/news.model.js';
import { DBRepo } from './DBRepo.js';
export declare class NewsRepo extends DBRepo<INews> {
    constructor();
    /**
     * Find news by slug
     */
    findBySlug(slug: string): Promise<(import("mongoose").Document<unknown, {}, INews, {}, {}> & INews & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }) | (import("mongoose").Document<unknown, {}, import("mongoose").FlattenMaps<INews>, {}, {}> & import("mongoose").FlattenMaps<INews> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }) | null>;
    /**
     * Increment view count
     */
    incrementViewCount(newsId: string): Promise<import("mongoose").UpdateWriteOpResult>;
    /**
     * Get featured news
     */
    getFeaturedNews(governorateId?: string, limit?: number): Promise<(import("mongoose").Document<unknown, {}, INews, {}, {}> & INews & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[] | (import("mongoose").Document<unknown, {}, import("mongoose").FlattenMaps<INews>, {}, {}> & import("mongoose").FlattenMaps<INews> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    /**
     * Get related news by tags
     */
    getRelatedNews(newsId: string, tags: string[], limit?: number): Promise<(import("mongoose").Document<unknown, {}, INews, {}, {}> & INews & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[] | (import("mongoose").Document<unknown, {}, import("mongoose").FlattenMaps<INews>, {}, {}> & import("mongoose").FlattenMaps<INews> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    /**
     * Get news statistics by governorate
     */
    getNewsStatsByGovernorate(): Promise<any[]>;
}
//# sourceMappingURL=News.Repo.d.ts.map