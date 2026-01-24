"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventRegistrationModel = void 0;
const mongoose_1 = require("mongoose");
const eventRegistrationSchema = new mongoose_1.Schema({
    eventId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Event',
        required: [true, 'Event is required'],
        index: true,
    },
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        minlength: [2, 'Name must be at least 2 characters'],
        maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        trim: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
        index: true,
    },
    phone: {
        type: String,
        required: [true, 'Phone is required'],
        trim: true,
        match: [/^(\+?20)?1[0125]\d{8}$/, 'Please provide a valid Egyptian phone number'],
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected', 'cancelled'],
        default: 'pending',
        index: true,
    },
    notes: {
        type: String,
        trim: true,
        maxlength: [500, 'Notes cannot exceed 500 characters'],
    },
    registeredAt: {
        type: Date,
        default: Date.now,
        index: true,
    },
    approvedAt: {
        type: Date,
    },
    rejectedAt: {
        type: Date,
    },
    cancelledAt: {
        type: Date,
    },
}, {
    timestamps: true,
});
// Compound indexes
eventRegistrationSchema.index({ eventId: 1, email: 1 }, { unique: true });
eventRegistrationSchema.index({ eventId: 1, status: 1 });
eventRegistrationSchema.index({ email: 1, status: 1 });
// Virtuals
eventRegistrationSchema.virtual('event', {
    ref: 'Event',
    localField: 'eventId',
    foreignField: '_id',
    justOne: true,
});
exports.EventRegistrationModel = mongoose_1.models.EventRegistration || (0, mongoose_1.model)('EventRegistration', eventRegistrationSchema);
//# sourceMappingURL=eventRegistration.model.js.map