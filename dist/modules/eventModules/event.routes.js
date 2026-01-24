import { Router } from 'express';
import { EventController } from './event.controller.js';
import { createEventSchema, updateEventSchema, eventIdParamSchema, getEventsQuerySchema, eventRegistrationSchema, updateRegistrationStatusSchema } from './event.validation.js';
import validation from '../../middleware/validation.middleware.js';
import { authenticate, authorize, optionalAuthenticate } from '../../middleware/auth.middelware.js';
const router = Router();
const eventController = new EventController();
// Public routes
router.get('/slug/:slug', eventController.getEventBySlug);
router.get('/featured', eventController.getFeaturedEvents);
router.get('/upcoming', eventController.getUpcomingEvents);
// Public registration
router.post('/:id/register', validation({ params: eventIdParamSchema, body: eventRegistrationSchema }), eventController.registerForEvent);
router.delete('/:id/register', validation({ params: eventIdParamSchema }), eventController.cancelRegistration);
// Statistics (Admin only)
router.get('/stats', authenticate(), authorize(['admin']), eventController.getEventsStats);
// CRUD operations
router.post('/', authenticate(), authorize(['admin', 'governorate_user']), validation({ body: createEventSchema }), eventController.createEvent);
router.get('/', optionalAuthenticate(), validation({ query: getEventsQuerySchema }), eventController.getAllEvents);
router.get('/:id', validation({ params: eventIdParamSchema }), eventController.getEventById);
router.patch('/:id', authenticate(), authorize(['admin', 'governorate_user']), validation({ params: eventIdParamSchema, body: updateEventSchema }), eventController.updateEvent);
router.delete('/:id', authenticate(), authorize(['admin', 'governorate_user']), validation({ params: eventIdParamSchema }), eventController.deleteEvent);
// Admin-only operations
router.patch('/:id/toggle-featured', authenticate(), authorize(['admin']), validation({ params: eventIdParamSchema }), eventController.toggleFeatured);
router.patch('/:id/toggle-published', authenticate(), authorize(['admin']), validation({ params: eventIdParamSchema }), eventController.togglePublished);
// Event creator operations
router.patch('/:id/toggle-registration', authenticate(), authorize(['admin', 'governorate_user']), validation({ params: eventIdParamSchema }), eventController.toggleRegistration);
// Registration management
router.get('/:id/registrations', authenticate(), authorize(['admin', 'governorate_user']), validation({ params: eventIdParamSchema }), eventController.getEventRegistrations);
router.get('/:id/registrations/stats', authenticate(), authorize(['admin', 'governorate_user']), validation({ params: eventIdParamSchema }), eventController.getRegistrationStats);
router.patch('/registrations/:registrationId', authenticate(), authorize(['admin', 'governorate_user']), validation({ body: updateRegistrationStatusSchema }), eventController.updateRegistrationStatus);
export default router;
//# sourceMappingURL=event.routes.js.map