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
    getByEvent(eventId: string, status?: string): Promise<HydratedDocument<T>[] | HydratedDocument<FlattenMaps<T_1>>[]>;
    /**
     * Count registrations by status
     */
    countByStatus(eventId: string): Promise<any[]>;
}
//# sourceMappingURL=EventRegistration.Repo.d.ts.map