import { connect, connection } from 'mongoose';
import { UserModel } from '../models/user.model.js';
import { GovernorateModel } from '../models/governorate.model.js';
import { NewsModel } from '../models/news.model.js';
import { EventModel } from '../models/event.model.js';
import { TokenModel } from '../models/token.model.js';
import { AnalyticsModel } from '../models/analytics.model.js';
import { EventRegistrationModel } from '../models/eventRegistration.model.js';

let connectPromise: Promise<void> | null = null;
let indexesSynced = false;

const syncAllIndexes = async (): Promise<void> => {
    if (indexesSynced) return;

    await UserModel.syncIndexes();
    await GovernorateModel.syncIndexes();
    await NewsModel.syncIndexes();
    await EventModel.syncIndexes();
    await EventRegistrationModel.syncIndexes();
    await TokenModel.syncIndexes();
    await AnalyticsModel.syncIndexes();

    indexesSynced = true;
};

export const DBConnection = async (): Promise<void> => {
    const mongoUri = process.env.MONGODB_URI;

    if (!mongoUri) {
        throw new Error('MONGODB_URI is missing');
    }

    if (connection.readyState === 1) {
        return;
    }

    if (connectPromise) {
        return connectPromise;
    }

    connectPromise = (async () => {
        await connect(mongoUri);

        const shouldSyncIndexes = process.env.NODE_ENV !== 'production' || process.env.SYNC_INDEXES === 'true';
        if (shouldSyncIndexes) {
            await syncAllIndexes();
        }

        console.log('✅ DB Connected Successfully');
    })();

    try {
        await connectPromise;
    } catch (error) {
        connectPromise = null;
        throw error;
    }
};
