"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventService = void 0;
const analytics_model_js_1 = require("../../DB/models/analytics.model.js");
const governorate_model_js_1 = require("../../DB/models/governorate.model.js");
const Event_Repo_js_1 = require("../../DB/repos/Event.Repo.js");
const EventRegistration_Repo_js_1 = require("../../DB/repos/EventRegistration.Repo.js");
const error_response_js_1 = require("../../utils/response/error.response.js");
class EventService {
    constructor() {
        this.eventRepo = new Event_Repo_js_1.EventRepo();
        this.registrationRepo = new EventRegistration_Repo_js_1.EventRegistrationRepo();
        /**
         * Create Event
         */
        this.createEvent = async (eventData, userId, userRole, userGovernorateId) => {
            // If user is governorate_user, force their governorateId
            if (userRole === 'governorate_user') {
                if (!userGovernorateId) {
                    throw new error_response_js_1.ForbidenException("Governorate user must have a governorate assigned");
                }
                eventData.governorateId = userGovernorateId;
            }
            // Validate governorate exists
            const governorate = await governorate_model_js_1.GovernorateModel.findById(eventData.governorateId);
            if (!governorate) {
                throw new error_response_js_1.NotFoundException("Governorate not found");
            }
            // Create event
            const newEvent = await this.eventRepo.create({
                ...eventData,
                createdBy: userId,
                updatedBy: userId,
                currentParticipants: 0
            });
            // Handle create return (can be single or array)
            const createdEvent = Array.isArray(newEvent) ? newEvent[0] : newEvent;
            if (!createdEvent) {
                throw new error_response_js_1.BadRequestException("Failed to create event");
            }
            // Populate and return
            const populatedEvent = await this.eventRepo.findById({
                id: createdEvent._id,
                populate: [
                    { path: 'governorateId', select: 'name arabicName slug logo' },
                    { path: 'createdBy', select: 'email role' }
                ]
            });
            return populatedEvent;
        };
        /**
         * Get All Events with filters and pagination
         */
        this.getAllEvents = async (query, userRole, userGovernorateId) => {
            const { page, limit, governorateId, published, featured, upcoming, registrationEnabled, search, tags, sortBy, sortOrder } = query;
            // Build filter
            const filter = { deletedAt: null };
            // If governorate_user, filter by their governorate
            if (userRole === 'governorate_user' && userGovernorateId) {
                filter.governorateId = userGovernorateId;
            }
            else if (governorateId) {
                filter.governorateId = governorateId;
            }
            if (published !== undefined)
                filter.published = published;
            if (featured !== undefined)
                filter.featured = featured;
            if (registrationEnabled !== undefined)
                filter.registrationEnabled = registrationEnabled;
            // Filter upcoming events
            if (upcoming) {
                filter.eventDate = { $gte: new Date() };
            }
            // Search in title, description, location
            if (search) {
                filter.$or = [
                    { title: { $regex: search, $options: 'i' } },
                    { arabicTitle: { $regex: search, $options: 'i' } },
                    { description: { $regex: search, $options: 'i' } },
                    { arabicDescription: { $regex: search, $options: 'i' } },
                    { location: { $regex: search, $options: 'i' } },
                    { arabicLocation: { $regex: search, $options: 'i' } }
                ];
            }
            // Filter by tags
            if (tags) {
                const tagArray = tags.split(',').map(tag => tag.trim());
                filter.tags = { $in: tagArray };
            }
            // Build sort
            const sort = {};
            sort[sortBy || 'eventDate'] = sortOrder === 'asc' ? 1 : -1;
            // Get paginated results
            const result = await this.eventRepo.findWithPagination({
                filter,
                populate: [
                    { path: 'governorateId', select: 'name arabicName slug logo' },
                    { path: 'createdBy', select: 'email role' },
                    { path: 'updatedBy', select: 'email role' }
                ],
                sort,
                page: page || 1,
                limit: limit || 10
            });
            return result;
        };
        /**
         * Get Event by ID
         */
        this.getEventById = async (eventId) => {
            const event = await this.eventRepo.findById({
                id: eventId,
                populate: [
                    { path: 'governorateId', select: 'name arabicName slug logo coverImage description' },
                    { path: 'createdBy', select: 'email role' },
                    { path: 'updatedBy', select: 'email role' }
                ]
            });
            if (!event) {
                throw new error_response_js_1.NotFoundException("Event not found");
            }
            return event;
        };
        /**
         * Get Event by Slug (Public)
         */
        this.getEventBySlug = async (slug) => {
            const event = await this.eventRepo.findBySlug(slug);
            if (!event) {
                throw new error_response_js_1.NotFoundException("Event not found");
            }
            // Only return if published (for public access)
            if (!event.published) {
                throw new error_response_js_1.NotFoundException("Event not found");
            }
            return event;
        };
        /**
         * Update Event
         */
        this.updateEvent = async (eventId, updateData, userId, userRole, userGovernorateId) => {
            const event = await this.eventRepo.findById({ id: eventId });
            if (!event) {
                throw new error_response_js_1.NotFoundException("Event not found");
            }
            // Check permissions
            if (userRole === 'governorate_user') {
                // User can only update events from their governorate
                if (event.governorateId.toString() !== userGovernorateId) {
                    throw new error_response_js_1.ForbidenException("You can only update events from your governorate");
                }
                // User can only update events they created
                if (event.createdBy.toString() !== userId) {
                    throw new error_response_js_1.ForbidenException("You can only update events you created");
                }
            }
            // If changing governorate, validate
            if (updateData.governorateId && updateData.governorateId !== event.governorateId.toString()) {
                const governorate = await governorate_model_js_1.GovernorateModel.findById(updateData.governorateId);
                if (!governorate) {
                    throw new error_response_js_1.NotFoundException("Governorate not found");
                }
            }
            // Validate published/publishedAt relation
            if (updateData.published && !updateData.publishedAt && !event.publishedAt) {
                throw new error_response_js_1.BadRequestException("Published date is required when publishing event");
            }
            // Validate max participants vs current participants
            if (updateData.maxParticipants && updateData.maxParticipants < event.currentParticipants) {
                throw new error_response_js_1.BadRequestException(`Cannot set max participants to ${updateData.maxParticipants}. Current participants: ${event.currentParticipants}`);
            }
            // Update event
            const updatePayload = {
                ...updateData,
                updatedBy: userId
            };
            await this.eventRepo.updateOne({
                filter: { _id: eventId },
                data: updatePayload
            });
            // Return updated event
            return this.getEventById(eventId);
        };
        /**
         * Delete Event (Soft Delete)
         */
        this.deleteEvent = async (eventId, userId, userRole, userGovernorateId) => {
            const event = await this.eventRepo.findById({ id: eventId });
            if (!event) {
                throw new error_response_js_1.NotFoundException("Event not found");
            }
            // Check permissions
            if (userRole === 'governorate_user') {
                // User can only delete events from their governorate
                if (event.governorateId.toString() !== userGovernorateId) {
                    throw new error_response_js_1.ForbidenException("You can only delete events from your governorate");
                }
                // User can only delete events they created
                if (event.createdBy.toString() !== userId) {
                    throw new error_response_js_1.ForbidenException("You can only delete events you created");
                }
            }
            // Soft delete
            await this.eventRepo.softDeleteById({ id: eventId });
        };
        /**
         * Get Featured Events
         */
        this.getFeaturedEvents = async (governorateId, limit = 5) => {
            return await this.eventRepo.getFeaturedEvents(governorateId, limit);
        };
        /**
         * Get Upcoming Events
         */
        this.getUpcomingEvents = async (governorateId, limit) => {
            return await this.eventRepo.getUpcomingEvents(governorateId, limit);
        };
        /**
         * Toggle Featured Status
         */
        this.toggleFeatured = async (eventId, userId) => {
            const event = await this.eventRepo.findById({ id: eventId });
            if (!event) {
                throw new error_response_js_1.NotFoundException("Event not found");
            }
            await this.eventRepo.updateOne({
                filter: { _id: eventId },
                data: {
                    featured: !event.featured,
                    updatedBy: userId
                }
            });
            return this.getEventById(eventId);
        };
        /**
         * Toggle Published Status
         */
        this.togglePublished = async (eventId, userId) => {
            const event = await this.eventRepo.findById({ id: eventId });
            if (!event) {
                throw new error_response_js_1.NotFoundException("Event not found");
            }
            // If publishing and no publishedAt, set it to now
            const updateData = {
                published: !event.published,
                updatedBy: userId
            };
            if (!event.published && !event.publishedAt) {
                updateData.publishedAt = new Date();
            }
            await this.eventRepo.updateOne({
                filter: { _id: eventId },
                data: updateData
            });
            return this.getEventById(eventId);
        };
        /**
         * Toggle Registration Status
         */
        this.toggleRegistration = async (eventId, userId, userRole, userGovernorateId) => {
            const event = await this.eventRepo.findById({ id: eventId });
            if (!event) {
                throw new error_response_js_1.NotFoundException("Event not found");
            }
            // Check permissions
            if (userRole === 'governorate_user') {
                if (event.governorateId.toString() !== userGovernorateId) {
                    throw new error_response_js_1.ForbidenException("You can only modify events from your governorate");
                }
                if (event.createdBy.toString() !== userId) {
                    throw new error_response_js_1.ForbidenException("You can only modify events you created");
                }
            }
            await this.eventRepo.updateOne({
                filter: { _id: eventId },
                data: {
                    registrationEnabled: !event.registrationEnabled,
                    updatedBy: userId
                }
            });
            return this.getEventById(eventId);
        };
        /**
         * Register for Event
         */
        this.registerForEvent = async (eventId, registrationData) => {
            const event = await this.eventRepo.findById({ id: eventId });
            if (!event) {
                throw new error_response_js_1.NotFoundException("Event not found");
            }
            // Check if event is published
            if (!event.published) {
                throw new error_response_js_1.BadRequestException("Cannot register for unpublished event");
            }
            // Check if registration is enabled
            if (!event.registrationEnabled) {
                throw new error_response_js_1.BadRequestException("Registration is not enabled for this event");
            }
            // Check if registration deadline passed
            if (event.registrationDeadline && new Date() > event.registrationDeadline) {
                throw new error_response_js_1.BadRequestException("Registration deadline has passed");
            }
            // Check if event already passed
            if (event.eventDate < new Date()) {
                throw new error_response_js_1.BadRequestException("Cannot register for past events");
            }
            // Check if max participants reached
            if (event.maxParticipants && event.currentParticipants >= event.maxParticipants) {
                throw new error_response_js_1.BadRequestException("Event is full. Maximum participants reached");
            }
            // Check if user already registered
            const alreadyRegistered = await this.registrationRepo.isUserRegistered(eventId, registrationData.email);
            if (alreadyRegistered) {
                throw new error_response_js_1.ConflictException("You are already registered for this event");
            }
            // Create registration
            const registration = await this.registrationRepo.create({
                eventId: eventId,
                ...registrationData,
                status: 'pending',
                registeredAt: new Date()
            });
            // Increment participant count
            await this.eventRepo.incrementParticipants(eventId);
            // Track in analytics; failures shouldn't block registration flow
            try {
                await analytics_model_js_1.AnalyticsModel.incrementEventView(event.governorateId.toString());
            }
            catch (err) {
                console.error('Failed to track event view in analytics', err);
            }
            return registration;
        };
        /**
         * Get Event Registrations
         */
        this.getEventRegistrations = async (eventId, userId, userRole, userGovernorateId, status) => {
            const event = await this.eventRepo.findById({ id: eventId });
            if (!event) {
                throw new error_response_js_1.NotFoundException("Event not found");
            }
            // Check permissions
            if (userRole === 'governorate_user') {
                if (event.governorateId.toString() !== userGovernorateId) {
                    throw new error_response_js_1.ForbidenException("You can only view registrations from your governorate events");
                }
                if (event.createdBy.toString() !== userId) {
                    throw new error_response_js_1.ForbidenException("You can only view registrations for events you created");
                }
            }
            return await this.registrationRepo.getByEvent(eventId, status);
        };
        /**
         * Update Registration Status
         */
        this.updateRegistrationStatus = async (registrationId, statusData, userId, userRole, userGovernorateId) => {
            const registration = await this.registrationRepo.findById({ id: registrationId });
            if (!registration) {
                throw new error_response_js_1.NotFoundException("Registration not found");
            }
            const event = await this.eventRepo.findById({ id: registration.eventId.toString() });
            if (!event) {
                throw new error_response_js_1.NotFoundException("Event not found");
            }
            // Check permissions
            if (userRole === 'governorate_user') {
                if (event.governorateId.toString() !== userGovernorateId) {
                    throw new error_response_js_1.ForbidenException("You can only modify registrations from your governorate events");
                }
                if (event.createdBy.toString() !== userId) {
                    throw new error_response_js_1.ForbidenException("You can only modify registrations for events you created");
                }
            }
            const updateData = {
                status: statusData.status
            };
            // Set timestamp based on status
            if (statusData.status === 'approved') {
                updateData.approvedAt = new Date();
            }
            else if (statusData.status === 'rejected') {
                updateData.rejectedAt = new Date();
                // Decrement participant count
                await this.eventRepo.decrementParticipants(registration.eventId.toString());
            }
            else if (statusData.status === 'cancelled') {
                updateData.cancelledAt = new Date();
                // Decrement participant count
                await this.eventRepo.decrementParticipants(registration.eventId.toString());
            }
            await this.registrationRepo.updateOne({
                filter: { _id: registrationId },
                data: updateData
            });
            return await this.registrationRepo.findById({ id: registrationId });
        };
        /**
         * Cancel Registration (by user)
         */
        this.cancelRegistration = async (eventId, email) => {
            const registration = await this.registrationRepo.findOne({
                filter: { eventId, email }
            });
            if (!registration) {
                throw new error_response_js_1.NotFoundException("Registration not found");
            }
            if (registration.status === 'cancelled') {
                throw new error_response_js_1.BadRequestException("Registration is already cancelled");
            }
            await this.registrationRepo.updateOne({
                filter: { _id: registration._id },
                data: {
                    status: 'cancelled',
                    cancelledAt: new Date()
                }
            });
            // Decrement participant count
            await this.eventRepo.decrementParticipants(eventId);
        };
        /**
         * Get Registration Statistics
         */
        this.getRegistrationStats = async (eventId) => {
            const stats = await this.registrationRepo.countByStatus(eventId);
            const result = {
                total: 0,
                pending: 0,
                approved: 0,
                rejected: 0,
                cancelled: 0
            };
            stats.forEach((stat) => {
                result[stat._id] = stat.count;
                result.total += stat.count;
            });
            return result;
        };
        /**
         * Get Events Statistics
         */
        this.getEventsStats = async () => {
            const totalStats = await this.eventRepo.aggregate([
                { $match: { deletedAt: null } },
                {
                    $group: {
                        _id: null,
                        totalEvents: { $sum: 1 },
                        publishedEvents: {
                            $sum: { $cond: [{ $eq: ['$published', true] }, 1, 0] }
                        },
                        featuredEvents: {
                            $sum: { $cond: [{ $eq: ['$featured', true] }, 1, 0] }
                        },
                        upcomingEvents: {
                            $sum: { $cond: [{ $gte: ['$eventDate', new Date()] }, 1, 0] }
                        },
                        totalParticipants: { $sum: '$currentParticipants' }
                    }
                }
            ]);
            const governorateStats = await this.eventRepo.aggregate([
                { $match: { deletedAt: null } },
                {
                    $group: {
                        _id: '$governorateId',
                        totalEvents: { $sum: 1 },
                        publishedEvents: {
                            $sum: { $cond: [{ $eq: ['$published', true] }, 1, 0] }
                        },
                        totalParticipants: { $sum: '$currentParticipants' }
                    }
                },
                {
                    $lookup: {
                        from: 'governorates',
                        localField: '_id',
                        foreignField: '_id',
                        as: 'governorate'
                    }
                },
                { $unwind: '$governorate' },
                {
                    $project: {
                        governorateId: '$_id',
                        governorateName: '$governorate.name',
                        governorateArabicName: '$governorate.arabicName',
                        totalEvents: 1,
                        publishedEvents: 1,
                        totalParticipants: 1
                    }
                },
                { $sort: { totalEvents: -1 } }
            ]);
            return {
                overall: totalStats[0] || {
                    totalEvents: 0,
                    publishedEvents: 0,
                    featuredEvents: 0,
                    upcomingEvents: 0,
                    totalParticipants: 0
                },
                byGovernorate: governorateStats
            };
        };
        /**
         * Get All Registrations by Governorate
         * Admin can see all registrations across all governorates
         * Governorate user can only see registrations for events in their governorate
         */
        this.getAllRegistrationsByGovernorate = async (userRole, userGovernorateId, status, page = 1, limit = 10) => {
            const { ObjectId } = await import('mongoose').then(m => m.Types);
            // Build match stage based on user role
            const eventMatch = { deletedAt: null };
            // If governorate_user, filter by their governorate
            if (userRole === 'governorate_user') {
                if (!userGovernorateId) {
                    throw new error_response_js_1.ForbidenException("Governorate user must have a governorate assigned");
                }
                eventMatch.governorateId = new ObjectId(userGovernorateId);
            }
            // Build registration match
            const registrationMatch = {};
            if (status) {
                registrationMatch['registrations.status'] = status;
            }
            // Aggregation pipeline to get registrations grouped by governorate and event
            const pipeline = [
                // Match events
                { $match: eventMatch },
                // Lookup registrations for each event
                {
                    $lookup: {
                        from: 'eventregistrations',
                        localField: '_id',
                        foreignField: 'eventId',
                        as: 'registrations'
                    }
                },
                // Only include events with registrations
                { $match: { 'registrations.0': { $exists: true } } },
                // Apply status filter if provided
                ...(status ? [{
                        $addFields: {
                            registrations: {
                                $filter: {
                                    input: '$registrations',
                                    as: 'reg',
                                    cond: { $eq: ['$$reg.status', status] }
                                }
                            }
                        }
                    }] : []),
                // Filter out events with no registrations after status filter
                ...(status ? [{ $match: { 'registrations.0': { $exists: true } } }] : []),
                // Lookup governorate info
                {
                    $lookup: {
                        from: 'governorates',
                        localField: 'governorateId',
                        foreignField: '_id',
                        as: 'governorate'
                    }
                },
                { $unwind: '$governorate' },
                // Group by governorate
                {
                    $group: {
                        _id: '$governorateId',
                        governorateName: { $first: '$governorate.name' },
                        governorateArabicName: { $first: '$governorate.arabicName' },
                        governorateSlug: { $first: '$governorate.slug' },
                        events: {
                            $push: {
                                eventId: '$_id',
                                title: '$title',
                                arabicTitle: '$arabicTitle',
                                eventDate: '$eventDate',
                                location: '$location',
                                arabicLocation: '$arabicLocation',
                                coverImage: '$coverImage',
                                registrationCount: { $size: '$registrations' },
                                registrations: '$registrations'
                            }
                        },
                        totalRegistrations: { $sum: { $size: '$registrations' } }
                    }
                },
                // Sort by governorate name
                { $sort: { governorateName: 1 } }
            ];
            const results = await this.eventRepo.aggregate(pipeline);
            // Calculate overall statistics
            const overallStats = {
                totalGovernorates: results.length,
                totalEvents: results.reduce((acc, gov) => acc + gov.events.length, 0),
                totalRegistrations: results.reduce((acc, gov) => acc + gov.totalRegistrations, 0)
            };
            // Apply pagination to governorates
            const startIndex = (page - 1) * limit;
            const paginatedResults = results.slice(startIndex, startIndex + limit);
            return {
                data: paginatedResults,
                statistics: overallStats,
                pagination: {
                    page,
                    limit,
                    totalItems: results.length,
                    totalPages: Math.ceil(results.length / limit),
                    hasNextPage: startIndex + limit < results.length,
                    hasPrevPage: page > 1
                }
            };
        };
    }
}
exports.EventService = EventService;
//# sourceMappingURL=event.service.js.map