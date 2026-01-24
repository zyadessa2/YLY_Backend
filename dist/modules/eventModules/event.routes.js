"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const event_controller_js_1 = require("./event.controller.js");
const event_validation_js_1 = require("./event.validation.js");
const validation_middleware_js_1 = __importDefault(require("../../middleware/validation.middleware.js"));
const auth_middelware_js_1 = require("../../middleware/auth.middelware.js");
const router = (0, express_1.Router)();
const eventController = new event_controller_js_1.EventController();
// Public routes
router.get('/slug/:slug', eventController.getEventBySlug);
router.get('/featured', eventController.getFeaturedEvents);
router.get('/upcoming', eventController.getUpcomingEvents);
// Public registration
router.post('/:id/register', (0, validation_middleware_js_1.default)({ params: event_validation_js_1.eventIdParamSchema, body: event_validation_js_1.eventRegistrationSchema }), eventController.registerForEvent);
router.delete('/:id/register', (0, validation_middleware_js_1.default)({ params: event_validation_js_1.eventIdParamSchema }), eventController.cancelRegistration);
// Statistics (Admin only)
router.get('/stats', (0, auth_middelware_js_1.authenticate)(), (0, auth_middelware_js_1.authorize)(['admin']), eventController.getEventsStats);
// CRUD operations
router.post('/', (0, auth_middelware_js_1.authenticate)(), (0, auth_middelware_js_1.authorize)(['admin', 'governorate_user']), (0, validation_middleware_js_1.default)({ body: event_validation_js_1.createEventSchema }), eventController.createEvent);
router.get('/', (0, auth_middelware_js_1.optionalAuthenticate)(), (0, validation_middleware_js_1.default)({ query: event_validation_js_1.getEventsQuerySchema }), eventController.getAllEvents);
router.get('/:id', (0, validation_middleware_js_1.default)({ params: event_validation_js_1.eventIdParamSchema }), eventController.getEventById);
router.patch('/:id', (0, auth_middelware_js_1.authenticate)(), (0, auth_middelware_js_1.authorize)(['admin', 'governorate_user']), (0, validation_middleware_js_1.default)({ params: event_validation_js_1.eventIdParamSchema, body: event_validation_js_1.updateEventSchema }), eventController.updateEvent);
router.delete('/:id', (0, auth_middelware_js_1.authenticate)(), (0, auth_middelware_js_1.authorize)(['admin', 'governorate_user']), (0, validation_middleware_js_1.default)({ params: event_validation_js_1.eventIdParamSchema }), eventController.deleteEvent);
// Admin-only operations
router.patch('/:id/toggle-featured', (0, auth_middelware_js_1.authenticate)(), (0, auth_middelware_js_1.authorize)(['admin']), (0, validation_middleware_js_1.default)({ params: event_validation_js_1.eventIdParamSchema }), eventController.toggleFeatured);
router.patch('/:id/toggle-published', (0, auth_middelware_js_1.authenticate)(), (0, auth_middelware_js_1.authorize)(['admin']), (0, validation_middleware_js_1.default)({ params: event_validation_js_1.eventIdParamSchema }), eventController.togglePublished);
// Event creator operations
router.patch('/:id/toggle-registration', (0, auth_middelware_js_1.authenticate)(), (0, auth_middelware_js_1.authorize)(['admin', 'governorate_user']), (0, validation_middleware_js_1.default)({ params: event_validation_js_1.eventIdParamSchema }), eventController.toggleRegistration);
// Registration management
router.get('/:id/registrations', (0, auth_middelware_js_1.authenticate)(), (0, auth_middelware_js_1.authorize)(['admin', 'governorate_user']), (0, validation_middleware_js_1.default)({ params: event_validation_js_1.eventIdParamSchema }), eventController.getEventRegistrations);
router.get('/:id/registrations/stats', (0, auth_middelware_js_1.authenticate)(), (0, auth_middelware_js_1.authorize)(['admin', 'governorate_user']), (0, validation_middleware_js_1.default)({ params: event_validation_js_1.eventIdParamSchema }), eventController.getRegistrationStats);
router.patch('/registrations/:registrationId', (0, auth_middelware_js_1.authenticate)(), (0, auth_middelware_js_1.authorize)(['admin', 'governorate_user']), (0, validation_middleware_js_1.default)({ body: event_validation_js_1.updateRegistrationStatusSchema }), eventController.updateRegistrationStatus);
exports.default = router;
//# sourceMappingURL=event.routes.js.map