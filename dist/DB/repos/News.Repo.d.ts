import { INews } from '../models/news.model';
import { DBRepo } from './DBRepo';
export declare class NewsRepo extends DBRepo<INews> {
    constructor();
    /**
     * Find news by slug
     */
    findBySlug(slug: string): Promise<any>;
    /**
     * Increment view count
     */
    incrementViewCount(newsId: string): Promise<UpdateWriteOpResult>;
    /**
     * Get featured news
     */
    getFeaturedNews(governorateId?: string, limit?: number): Promise<HydratedDocument<T>[] | HydratedDocument<FlattenMaps<T_1>>[]>;
    /**
     * Get related news by tags
     */
    getRelatedNews(newsId: string, tags: string[], limit?: number): Promise<HydratedDocument<T>[] | HydratedDocument<FlattenMaps<T_1>>[]>;
    /**
     * Get news statistics by governorate
     */
    getNewsStatsByGovernorate(): Promise<any[]>;
}
//# sourceMappingURL=News.Repo.d.ts.map