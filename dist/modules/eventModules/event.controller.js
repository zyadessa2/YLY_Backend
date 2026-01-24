import { EventService } from './event.service.js';
import { successResponse } from '../../utils/response/success.response.js';
export class EventController {
    constructor() {
        this.eventService = new EventService();
        /**
         * Create Event
         * POST /api/events
         */
        this.createEvent = async (req, res, next) => {
            try {
                const eventData = req.body;
                const userId = req.user?._id?.toString();
                const userRole = req.user?.role;
                const userGovernorateId = req.user?.governorateId?.toString();
                if (!userId || !userRole)
                    throw Error("User ID and role are required");
                const result = await this.eventService.createEvent(eventData, userId, userRole, userGovernorateId);
                successResponse({
                    res,
                    message: "Event created successfully",
                    data: result,
                    statusCode: 201
                });
            }
            catch (error) {
                next(error);
            }
        };
        /**
         * Get All Events
         * GET /api/events
         */
        this.getAllEvents = async (req, res, next) => {
            try {
                const query = req.query;
                const userRole = req.user?.role;
                const userGovernorateId = req.user?.governorateId?.toString();
                const result = await this.eventService.getAllEvents(query, userRole, userGovernorateId);
                successResponse({
                    res,
                    message: "Events retrieved successfully",
                    data: result
                });
            }
            catch (error) {
                next(error);
            }
        };
        /**
         * Get Event by ID
         * GET /api/events/:id
         */
        this.getEventById = async (req, res, next) => {
            try {
                const eventId = req.params.id;
                if (!eventId)
                    throw Error("Event ID is required");
                const result = await this.eventService.getEventById(eventId);
                successResponse({
                    res,
                    message: "Event retrieved successfully",
                    data: result
                });
            }
            catch (error) {
                next(error);
            }
        };
        /**
         * Get Event by Slug
         * GET /api/events/slug/:slug
         */
        this.getEventBySlug = async (req, res, next) => {
            try {
                const slug = req.params.slug;
                if (!slug)
                    throw Error("Slug is required");
                const result = await this.eventService.getEventBySlug(slug);
                successResponse({
                    res,
                    message: "Event retrieved successfully",
                    data: result
                });
            }
            catch (error) {
                next(error);
            }
        };
        /**
         * Update Event
         * PATCH /api/events/:id
         */
        this.updateEvent = async (req, res, next) => {
            try {
                const eventId = req.params.id;
                const updateData = req.body;
                const userId = req.user?._id?.toString();
                const userRole = req.user?.role;
                const userGovernorateId = req.user?.governorateId?.toString();
                if (!eventId || !userId || !userRole)
                    throw Error("Event ID, user ID and role are required");
                const result = await this.eventService.updateEvent(eventId, updateData, userId, userRole, userGovernorateId);
                successResponse({
                    res,
                    message: "Event updated successfully",
                    data: result
                });
            }
            catch (error) {
                next(error);
            }
        };
        /**
         * Delete Event
         * DELETE /api/events/:id
         */
        this.deleteEvent = async (req, res, next) => {
            try {
                const eventId = req.params.id;
                const userId = req.user?._id?.toString();
                const userRole = req.user?.role;
                const userGovernorateId = req.user?.governorateId?.toString();
                if (!eventId || !userId || !userRole)
                    throw Error("Event ID, user ID and role are required");
                await this.eventService.deleteEvent(eventId, userId, userRole, userGovernorateId);
                successResponse({
                    res,
                    message: "Event deleted successfully",
                    data: null
                });
            }
            catch (error) {
                next(error);
            }
        };
        /**
         * Get Featured Events
         * GET /api/events/featured
         */
        this.getFeaturedEvents = async (req, res, next) => {
            try {
                const governorateId = req.query.governorateId;
                const limit = parseInt(req.query.limit) || 5;
                const result = await this.eventService.getFeaturedEvents(governorateId, limit);
                successResponse({
                    res,
                    message: "Featured events retrieved successfully",
                    data: result
                });
            }
            catch (error) {
                next(error);
            }
        };
        /**
         * Get Upcoming Events
         * GET /api/events/upcoming
         */
        this.getUpcomingEvents = async (req, res, next) => {
            try {
                const governorateId = req.query.governorateId;
                const limit = req.query.limit ? parseInt(req.query.limit) : undefined;
                const result = await this.eventService.getUpcomingEvents(governorateId, limit);
                successResponse({
                    res,
                    message: "Upcoming events retrieved successfully",
                    data: result
                });
            }
            catch (error) {
                next(error);
            }
        };
        /**
         * Toggle Featured Status
         * PATCH /api/events/:id/toggle-featured
         */
        this.toggleFeatured = async (req, res, next) => {
            try {
                const eventId = req.params.id;
                const userId = req.user?._id?.toString();
                if (!eventId || !userId)
                    throw Error("Event ID and user ID are required");
                const result = await this.eventService.toggleFeatured(eventId, userId);
                successResponse({
                    res,
                    message: `Event ${result.featured ? 'featured' : 'unfeatured'} successfully`,
                    data: result
                });
            }
            catch (error) {
                next(error);
            }
        };
        /**
         * Toggle Published Status
         * PATCH /api/events/:id/toggle-published
         */
        this.togglePublished = async (req, res, next) => {
            try {
                const eventId = req.params.id;
                const userId = req.user?._id?.toString();
                if (!eventId || !userId)
                    throw Error("Event ID and user ID are required");
                const result = await this.eventService.togglePublished(eventId, userId);
                successResponse({
                    res,
                    message: `Event ${result.published ? 'published' : 'unpublished'} successfully`,
                    data: result
                });
            }
            catch (error) {
                next(error);
            }
        };
        /**
         * Toggle Registration Status
         * PATCH /api/events/:id/toggle-registration
         */
        this.toggleRegistration = async (req, res, next) => {
            try {
                const eventId = req.params.id;
                const userId = req.user?._id?.toString();
                const userRole = req.user?.role;
                const userGovernorateId = req.user?.governorateId?.toString();
                if (!eventId || !userId || !userRole)
                    throw Error("Event ID, user ID and role are required");
                const result = await this.eventService.toggleRegistration(eventId, userId, userRole, userGovernorateId);
                successResponse({
                    res,
                    message: `Event registration ${result.registrationEnabled ? 'opened' : 'closed'} successfully`,
                    data: result
                });
            }
            catch (error) {
                next(error);
            }
        };
        /**
         * Register for Event (Public)
         * POST /api/events/:id/register
         */
        this.registerForEvent = async (req, res, next) => {
            try {
                const eventId = req.params.id;
                const registrationData = req.body;
                if (!eventId)
                    throw Error("Event ID is required");
                const result = await this.eventService.registerForEvent(eventId, registrationData);
                successResponse({
                    res,
                    message: "Registration submitted successfully",
                    data: result,
                    statusCode: 201
                });
            }
            catch (error) {
                next(error);
            }
        };
        /**
         * Get Event Registrations
         * GET /api/events/:id/registrations
         */
        this.getEventRegistrations = async (req, res, next) => {
            try {
                const eventId = req.params.id;
                const userId = req.user?._id?.toString();
                const userRole = req.user?.role;
                const userGovernorateId = req.user?.governorateId?.toString();
                const status = req.query.status;
                if (!eventId || !userId || !userRole)
                    throw Error("Event ID, user ID and role are required");
                const result = await this.eventService.getEventRegistrations(eventId, userId, userRole, userGovernorateId, status);
                successResponse({
                    res,
                    message: "Event registrations retrieved successfully",
                    data: result
                });
            }
            catch (error) {
                next(error);
            }
        };
        /**
         * Update Registration Status
         * PATCH /api/events/registrations/:registrationId
         */
        this.updateRegistrationStatus = async (req, res, next) => {
            try {
                const registrationId = req.params.registrationId;
                const statusData = req.body;
                const userId = req.user?._id?.toString();
                const userRole = req.user?.role;
                const userGovernorateId = req.user?.governorateId?.toString();
                if (!registrationId || !userId || !userRole)
                    throw Error("Registration ID, user ID and role are required");
                const result = await this.eventService.updateRegistrationStatus(registrationId, statusData, userId, userRole, userGovernorateId);
                successResponse({
                    res,
                    message: "Registration status updated successfully",
                    data: result
                });
            }
            catch (error) {
                next(error);
            }
        };
        /**
         * Cancel Registration (Public)
         * DELETE /api/events/:id/register
         */
        this.cancelRegistration = async (req, res, next) => {
            try {
                const eventId = req.params.id;
                const { email } = req.body;
                if (!eventId || !email)
                    throw Error("Event ID and email are required");
                await this.eventService.cancelRegistration(eventId, email);
                successResponse({
                    res,
                    message: "Registration cancelled successfully",
                    data: null
                });
            }
            catch (error) {
                next(error);
            }
        };
        /**
         * Get Registration Statistics
         * GET /api/events/:id/registrations/stats
         */
        this.getRegistrationStats = async (req, res, next) => {
            try {
                const eventId = req.params.id;
                if (!eventId)
                    throw Error("Event ID is required");
                const result = await this.eventService.getRegistrationStats(eventId);
                successResponse({
                    res,
                    message: "Registration statistics retrieved successfully",
                    data: result
                });
            }
            catch (error) {
                next(error);
            }
        };
        /**
         * Get Events Statistics
         * GET /api/events/stats
         */
        this.getEventsStats = async (req, res, next) => {
            try {
                const result = await this.eventService.getEventsStats();
                successResponse({
                    res,
                    message: "Events statistics retrieved successfully",
                    data: result
                });
            }
            catch (error) {
                next(error);
            }
        };
    }
}
//# sourceMappingURL=event.controller.js.map