import { Request, Response, NextFunction } from 'express';
export declare class EventController {
    private eventService;
    /**
     * Create Event
     * POST /api/events
     */
    createEvent: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * Get All Events
     * GET /api/events
     */
    getAllEvents: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * Get Event by ID
     * GET /api/events/:id
     */
    getEventById: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * Get Event by Slug
     * GET /api/events/slug/:slug
     */
    getEventBySlug: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * Update Event
     * PATCH /api/events/:id
     */
    updateEvent: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * Delete Event
     * DELETE /api/events/:id
     */
    deleteEvent: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * Get Featured Events
     * GET /api/events/featured
     */
    getFeaturedEvents: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * Get Upcoming Events
     * GET /api/events/upcoming
     */
    getUpcomingEvents: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * Toggle Featured Status
     * PATCH /api/events/:id/toggle-featured
     */
    toggleFeatured: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * Toggle Published Status
     * PATCH /api/events/:id/toggle-published
     */
    togglePublished: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * Toggle Registration Status
     * PATCH /api/events/:id/toggle-registration
     */
    toggleRegistration: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * Register for Event (Public)
     * POST /api/events/:id/register
     */
    registerForEvent: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * Get Event Registrations
     * GET /api/events/:id/registrations
     */
    getEventRegistrations: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * Update Registration Status
     * PATCH /api/events/registrations/:registrationId
     */
    updateRegistrationStatus: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * Cancel Registration (Public)
     * DELETE /api/events/:id/register
     */
    cancelRegistration: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * Get Registration Statistics
     * GET /api/events/:id/registrations/stats
     */
    getRegistrationStats: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * Get Events Statistics
     * GET /api/events/stats
     */
    getEventsStats: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
//# sourceMappingURL=event.controller.d.ts.map