import { EventModel, IEvent } from "../models/event.model";
import { DBRepo } from "./DBRepo";

export class EventRepo extends DBRepo<IEvent> {
    constructor() {
        super(EventModel);
    }

    /**
     * Find event by slug
     */
    async findBySlug(slug: string) {
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
    async getFeaturedEvents(governorateId?: string, limit: number = 5) {
        const filter: any = { 
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
    async getUpcomingEvents(governorateId?: string, limit: number = 10) {
        const filter: any = {
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
    async incrementParticipants(eventId: string) {
        return await this.updateOne({
            filter: { _id: eventId },
            data: { $inc: { currentParticipants: 1 } } as any
        });
    }

    /**
     * Decrement participant count
     */
    async decrementParticipants(eventId: string) {
        return await this.updateOne({
            filter: { _id: eventId },
            data: { $inc: { currentParticipants: -1 } } as any
        });
    }
}
