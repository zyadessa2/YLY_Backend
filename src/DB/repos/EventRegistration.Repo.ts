import { EventRegistrationModel, IEventRegistration } from "../models/eventRegistration.model";
import { DBRepo } from "./DBRepo";

export class EventRegistrationRepo extends DBRepo<IEventRegistration> {
    constructor() {
        super(EventRegistrationModel);
    }

    /**
     * Check if user already registered
     */
    async isUserRegistered(eventId: string, email: string): Promise<boolean> {
        return await this.exists({
            filter: { eventId, email }
        });
    }

    /**
     * Get registrations by event
     */
    async getByEvent(eventId: string, status?: string) {
        const filter: any = { eventId };
        if (status) filter.status = status;

        return this.find({
            filter,
            sort: { registeredAt: -1 }
        });
    }

    /**
     * Count registrations by status
     */
    async countByStatus(eventId: string) {
        return await this.aggregate([
            { $match: { eventId: eventId } },
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            }
        ]);
    }
}
