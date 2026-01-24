import { IEventRegistration } from "../models/eventRegistration.model";
import { DBRepo } from "./DBRepo";
export declare class EventRegistrationRepo extends DBRepo<IEventRegistration> {
    constructor();
    /**
     * Check if user already registered
     */
    isUserRegistered(eventId: string, email: string): Promise<boolean>;
    /**
     * Get registrations by event
     */
    getByEvent(eventId: string, status?: string): Promise<(import("mongoose").Document<unknown, {}, IEventRegistration, {}, {}> & IEventRegistration & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[] | (import("mongoose").Document<unknown, {}, import("mongoose").FlattenMaps<IEventRegistration>, {}, {}> & import("mongoose").FlattenMaps<IEventRegistration> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    /**
     * Count registrations by status
     */
    countByStatus(eventId: string): Promise<any[]>;
}
//# sourceMappingURL=EventRegistration.Repo.d.ts.map