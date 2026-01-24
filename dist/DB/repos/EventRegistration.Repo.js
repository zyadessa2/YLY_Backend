import { EventRegistrationModel } from '../models/eventRegistration.model.js';
import { DBRepo } from './DBRepo.js';
export class EventRegistrationRepo extends DBRepo {
    constructor() {
        super(EventRegistrationModel);
    }
    /**
     * Check if user already registered
     */
    async isUserRegistered(eventId, email) {
        return await this.exists({
            filter: { eventId, email }
        });
    }
    /**
     * Get registrations by event
     */
    async getByEvent(eventId, status) {
        const filter = { eventId };
        if (status)
            filter.status = status;
        return this.find({
            filter,
            sort: { registeredAt: -1 }
        });
    }
    /**
     * Count registrations by status
     */
    async countByStatus(eventId) {
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
//# sourceMappingURL=EventRegistration.Repo.js.map