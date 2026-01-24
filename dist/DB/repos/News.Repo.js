import { NewsModel } from '../models/news.model.js';
import { DBRepo } from './DBRepo.js';
export class NewsRepo extends DBRepo {
    constructor() {
        super(NewsModel);
    }
    /**
     * Find news by slug
     */
    async findBySlug(slug) {
        return this.findOne({
            filter: { slug },
            populate: [
                { path: 'governorateId', select: 'name arabicName slug logo' },
                { path: 'createdBy', select: 'email role' },
                { path: 'updatedBy', select: 'email role' }
            ]
        });
    }
    /**
     * Increment view count
     */
    async incrementViewCount(newsId) {
        return await this.updateOne({
            filter: { _id: newsId },
            data: { $inc: { viewCount: 1 } }
        });
    }
    /**
     * Get featured news
     */
    async getFeaturedNews(governorateId, limit = 5) {
        const filter = {
            featured: true,
            published: true,
            deletedAt: null
        };
        if (governorateId) {
            filter.governorateId = governorateId;
        }
        return this.find({
            filter,
            populate: [
                { path: 'governorateId', select: 'name arabicName slug logo' }
            ],
            sort: { publishedAt: -1 },
            limit
        });
    }
    /**
     * Get related news by tags
     */
    async getRelatedNews(newsId, tags, limit = 5) {
        return this.find({
            filter: {
                _id: { $ne: newsId },
                tags: { $in: tags },
                published: true,
                deletedAt: null
            },
            populate: [
                { path: 'governorateId', select: 'name arabicName slug logo' }
            ],
            sort: { publishedAt: -1 },
            limit
        });
    }
    /**
     * Get news statistics by governorate
     */
    async getNewsStatsByGovernorate() {
        return await this.aggregate([
            { $match: { deletedAt: null } },
            {
                $group: {
                    _id: '$governorateId',
                    totalNews: { $sum: 1 },
                    publishedNews: {
                        $sum: { $cond: [{ $eq: ['$published', true] }, 1, 0] }
                    },
                    totalViews: { $sum: '$viewCount' }
                }
            },
            {
                $lookup: {
                    from: 'governorates',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'governorate'
                }
            },
            { $unwind: '$governorate' },
            {
                $project: {
                    governorateId: '$_id',
                    governorateName: '$governorate.name',
                    governorateArabicName: '$governorate.arabicName',
                    totalNews: 1,
                    publishedNews: 1,
                    totalViews: 1
                }
            },
            { $sort: { totalNews: -1 } }
        ]);
    }
}
//# sourceMappingURL=News.Repo.js.map