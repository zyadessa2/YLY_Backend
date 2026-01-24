"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventRegistrationRepo = void 0;
const eventRegistration_model_js_1 = require("../models/eventRegistration.model.js");
const DBRepo_js_1 = require("./DBRepo.js");
class EventRegistrationRepo extends DBRepo_js_1.DBRepo {
    constructor() {
        super(eventRegistration_model_js_1.EventRegistrationModel);
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
exports.EventRegistrationRepo = EventRegistrationRepo;
//# sourceMappingURL=EventRegistration.Repo.js.map