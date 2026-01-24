import { AnalyticsModel } from '../../DB/models/analytics.model.js';
import { GovernorateModel } from '../../DB/models/governorate.model.js';
import { EventRepo } from '../../DB/repos/Event.Repo.js';
import { EventRegistrationRepo } from '../../DB/repos/EventRegistration.Repo.js';
import { BadRequestException, NotFoundException, ForbidenException, ConflictException } from '../../utils/response/error.response.js';
export class EventService {
    constructor() {
        this.eventRepo = new EventRepo();
        this.registrationRepo = new EventRegistrationRepo();
        /**
         * Create Event
         */
        this.createEvent = async (eventData, userId, userRole, userGovernorateId) => {
            // If user is governorate_user, force their governorateId
            if (userRole === 'governorate_user') {
                if (!userGovernorateId) {
                    throw new ForbidenException("Governorate user must have a governorate assigned");
                }
                eventData.governorateId = userGovernorateId;
            }
            // Validate governorate exists
            const governorate = await GovernorateModel.findById(eventData.governorateId);
            if (!governorate) {
                throw new NotFoundException("Governorate not found");
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
                throw new BadRequestException("Failed to create event");
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
                throw new NotFoundException("Event not found");
            }
            return event;
        };
        /**
         * Get Event by Slug (Public)
         */
        this.getEventBySlug = async (slug) => {
            const event = await this.eventRepo.findBySlug(slug);
            if (!event) {
                throw new NotFoundException("Event not found");
            }
            // Only return if published (for public access)
            if (!event.published) {
                throw new NotFoundException("Event not found");
            }
            return event;
        };
        /**
         * Update Event
         */
        this.updateEvent = async (eventId, updateData, userId, userRole, userGovernorateId) => {
            const event = await this.eventRepo.findById({ id: eventId });
            if (!event) {
                throw new NotFoundException("Event not found");
            }
            // Check permissions
            if (userRole === 'governorate_user') {
                // User can only update events from their governorate
                if (event.governorateId.toString() !== userGovernorateId) {
                    throw new ForbidenException("You can only update events from your governorate");
                }
                // User can only update events they created
                if (event.createdBy.toString() !== userId) {
                    throw new ForbidenException("You can only update events you created");
                }
            }
            // If changing governorate, validate
            if (updateData.governorateId && updateData.governorateId !== event.governorateId.toString()) {
                const governorate = await GovernorateModel.findById(updateData.governorateId);
                if (!governorate) {
                    throw new NotFoundException("Governorate not found");
                }
            }
            // Validate published/publishedAt relation
            if (updateData.published && !updateData.publishedAt && !event.publishedAt) {
                throw new BadRequestException("Published date is required when publishing event");
            }
            // Validate max participants vs current participants
            if (updateData.maxParticipants && updateData.maxParticipants < event.currentParticipants) {
                throw new BadRequestException(`Cannot set max participants to ${updateData.maxParticipants}. Current participants: ${event.currentParticipants}`);
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
                throw new NotFoundException("Event not found");
            }
            // Check permissions
            if (userRole === 'governorate_user') {
                // User can only delete events from their governorate
                if (event.governorateId.toString() !== userGovernorateId) {
                    throw new ForbidenException("You can only delete events from your governorate");
                }
                // User can only delete events they created
                if (event.createdBy.toString() !== userId) {
                    throw new ForbidenException("You can only delete events you created");
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
                throw new NotFoundException("Event not found");
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
                throw new NotFoundException("Event not found");
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
                throw new NotFoundException("Event not found");
            }
            // Check permissions
            if (userRole === 'governorate_user') {
                if (event.governorateId.toString() !== userGovernorateId) {
                    throw new ForbidenException("You can only modify events from your governorate");
                }
                if (event.createdBy.toString() !== userId) {
                    throw new ForbidenException("You can only modify events you created");
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
                throw new NotFoundException("Event not found");
            }
            // Check if event is published
            if (!event.published) {
                throw new BadRequestException("Cannot register for unpublished event");
            }
            // Check if registration is enabled
            if (!event.registrationEnabled) {
                throw new BadRequestException("Registration is not enabled for this event");
            }
            // Check if registration deadline passed
            if (event.registrationDeadline && new Date() > event.registrationDeadline) {
                throw new BadRequestException("Registration deadline has passed");
            }
            // Check if event already passed
            if (event.eventDate < new Date()) {
                throw new BadRequestException("Cannot register for past events");
            }
            // Check if max participants reached
            if (event.maxParticipants && event.currentParticipants >= event.maxParticipants) {
                throw new BadRequestException("Event is full. Maximum participants reached");
            }
            // Check if user already registered
            const alreadyRegistered = await this.registrationRepo.isUserRegistered(eventId, registrationData.email);
            if (alreadyRegistered) {
                throw new ConflictException("You are already registered for this event");
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
            // Track in analytics
            await AnalyticsModel.incrementEventsView(event.governorateId.toString());
            return registration;
        };
        /**
         * Get Event Registrations
         */
        this.getEventRegistrations = async (eventId, userId, userRole, userGovernorateId, status) => {
            const event = await this.eventRepo.findById({ id: eventId });
            if (!event) {
                throw new NotFoundException("Event not found");
            }
            // Check permissions
            if (userRole === 'governorate_user') {
                if (event.governorateId.toString() !== userGovernorateId) {
                    throw new ForbidenException("You can only view registrations from your governorate events");
                }
                if (event.createdBy.toString() !== userId) {
                    throw new ForbidenException("You can only view registrations for events you created");
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
                throw new NotFoundException("Registration not found");
            }
            const event = await this.eventRepo.findById({ id: registration.eventId.toString() });
            if (!event) {
                throw new NotFoundException("Event not found");
            }
            // Check permissions
            if (userRole === 'governorate_user') {
                if (event.governorateId.toString() !== userGovernorateId) {
                    throw new ForbidenException("You can only modify registrations from your governorate events");
                }
                if (event.createdBy.toString() !== userId) {
                    throw new ForbidenException("You can only modify registrations for events you created");
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
                throw new NotFoundException("Registration not found");
            }
            if (registration.status === 'cancelled') {
                throw new BadRequestException("Registration is already cancelled");
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
    }
}
//# sourceMappingURL=event.service.js.map