import { IEvent } from "../models/event.model";
import { DBRepo } from "./DBRepo";
export declare class EventRepo extends DBRepo<IEvent> {
    constructor();
    /**
     * Find event by slug
     */
    findBySlug(slug: string): Promise<(import("mongoose").Document<unknown, {}, IEvent, {}, {}> & IEvent & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }) | (import("mongoose").Document<unknown, {}, import("mongoose").FlattenMaps<IEvent>, {}, {}> & import("mongoose").FlattenMaps<IEvent> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }) | null>;
    /**
     * Get featured events
     */
    getFeaturedEvents(governorateId?: string, limit?: number): Promise<(import("mongoose").Document<unknown, {}, IEvent, {}, {}> & IEvent & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[] | (import("mongoose").Document<unknown, {}, import("mongoose").FlattenMaps<IEvent>, {}, {}> & import("mongoose").FlattenMaps<IEvent> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    /**
     * Get upcoming events
     */
    getUpcomingEvents(governorateId?: string, limit?: number): Promise<(import("mongoose").Document<unknown, {}, IEvent, {}, {}> & IEvent & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[] | (import("mongoose").Document<unknown, {}, import("mongoose").FlattenMaps<IEvent>, {}, {}> & import("mongoose").FlattenMaps<IEvent> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    /**
     * Increment participant count
     */
    incrementParticipants(eventId: string): Promise<import("mongoose").UpdateWriteOpResult>;
    /**
     * Decrement participant count
     */
    decrementParticipants(eventId: string): Promise<import("mongoose").UpdateWriteOpResult>;
}
//# sourceMappingURL=Event.Repo.d.ts.map