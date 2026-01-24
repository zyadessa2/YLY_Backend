import { EventModel } from "../models/event.model";
import { DBRepo } from "./DBRepo";
export class EventRepo extends DBRepo {
    constructor() {
        super(EventModel);
    }
    /**
     * Find event by slug
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
     * Get featured events
     */
    async getFeaturedEvents(governorateId, limit = 5) {
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
            sort: { eventDate: 1 },
            limit
        });
    }
    /**
     * Get upcoming events
     */
    async getUpcomingEvents(governorateId, limit = 10) {
        const filter = {
            published: true,
            eventDate: { $gte: new Date() },
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
            sort: { eventDate: 1 },
            limit
        });
    }
    /**
     * Increment participant count
     */
    async incrementParticipants(eventId) {
        return await this.updateOne({
            filter: { _id: eventId },
            data: { $inc: { currentParticipants: 1 } }
        });
    }
    /**
     * Decrement participant count
     */
    async decrementParticipants(eventId) {
        return await this.updateOne({
            filter: { _id: eventId },
            data: { $inc: { currentParticipants: -1 } }
        });
    }
}
//# sourceMappingURL=Event.Repo.js.map