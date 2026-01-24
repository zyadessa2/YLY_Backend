import mongoose, { Document, HydratedDocument } from 'mongoose';
export interface IEventRegistration extends Document {
    _id: mongoose.Types.ObjectId;
    eventId: mongoose.Types.ObjectId;
    name: string;
    email: string;
    phone: string;
    status: 'pending' | 'approved' | 'rejected' | 'cancelled';
    notes?: string;
    registeredAt: Date;
    approvedAt?: Date;
    rejectedAt?: Date;
    cancelledAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}
export declare const EventRegistrationModel: any;
export type HEventRegistrationDocument = HydratedDocument<IEventRegistration>;
//# sourceMappingURL=eventRegistration.model.d.ts.map