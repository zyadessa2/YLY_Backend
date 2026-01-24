import { IPaginationResult } from "../../DB/repos/DBRepo";
import { createEventDTO, updateEventDTO, getEventsQueryDTO, eventRegistrationDTO, updateRegistrationStatusDTO } from "./event.DTO";
export declare class EventService {
    private eventRepo;
    private registrationRepo;
    constructor();
    /**
     * Create Event
     */
    createEvent: (eventData: createEventDTO, userId: string, userRole: string, userGovernorateId?: string) => Promise<any>;
    /**
     * Get All Events with filters and pagination
     */
    getAllEvents: (query: getEventsQueryDTO, userRole?: string, userGovernorateId?: string) => Promise<IPaginationResult<any>>;
    /**
     * Get Event by ID
     */
    getEventById: (eventId: string) => Promise<any>;
    /**
     * Get Event by Slug (Public)
     */
    getEventBySlug: (slug: string) => Promise<any>;
    /**
     * Update Event
     */
    updateEvent: (eventId: string, updateData: updateEventDTO, userId: string, userRole: string, userGovernorateId?: string) => Promise<any>;
    /**
     * Delete Event (Soft Delete)
     */
    deleteEvent: (eventId: string, userId: string, userRole: string, userGovernorateId?: string) => Promise<void>;
    /**
     * Get Featured Events
     */
    getFeaturedEvents: (governorateId?: string, limit?: number) => Promise<any[]>;
    /**
     * Get Upcoming Events
     */
    getUpcomingEvents: (governorateId?: string, limit?: number) => Promise<any[]>;
    /**
     * Toggle Featured Status
     */
    toggleFeatured: (eventId: string, userId: string) => Promise<any>;
    /**
     * Toggle Published Status
     */
    togglePublished: (eventId: string, userId: string) => Promise<any>;
    /**
     * Toggle Registration Status
     */
    toggleRegistration: (eventId: string, userId: string, userRole: string, userGovernorateId?: string) => Promise<any>;
    /**
     * Register for Event
     */
    registerForEvent: (eventId: string, registrationData: eventRegistrationDTO) => Promise<any>;
    /**
     * Get Event Registrations
     */
    getEventRegistrations: (eventId: string, userId: string, userRole: string, userGovernorateId?: string, status?: string) => Promise<any[]>;
    /**
     * Update Registration Status
     */
    updateRegistrationStatus: (registrationId: string, statusData: updateRegistrationStatusDTO, userId: string, userRole: string, userGovernorateId?: string) => Promise<any>;
    /**
     * Cancel Registration (by user)
     */
    cancelRegistration: (eventId: string, email: string) => Promise<void>;
    /**
     * Get Registration Statistics
     */
    getRegistrationStats: (eventId: string) => Promise<any>;
    /**
     * Get Events Statistics
     */
    getEventsStats: () => Promise<any>;
}
//# sourceMappingURL=event.service.d.ts.map