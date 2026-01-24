import { IEvent } from "../models/event.model";
import { DBRepo } from "./DBRepo";
export declare class EventRepo extends DBRepo<IEvent> {
    constructor();
    /**
     * Find event by slug
     */
    findBySlug(slug: string): Promise<any>;
    /**
     * Get featured events
     */
    getFeaturedEvents(governorateId?: string, limit?: number): Promise<HydratedDocument<T>[] | HydratedDocument<FlattenMaps<T_1>>[]>;
    /**
     * Get upcoming events
     */
    getUpcomingEvents(governorateId?: string, limit?: number): Promise<HydratedDocument<T>[] | HydratedDocument<FlattenMaps<T_1>>[]>;
    /**
     * Increment participant count
     */
    incrementParticipants(eventId: string): Promise<UpdateWriteOpResult>;
    /**
     * Decrement participant count
     */
    decrementParticipants(eventId: string): Promise<UpdateWriteOpResult>;
}
//# sourceMappingURL=Event.Repo.d.ts.map