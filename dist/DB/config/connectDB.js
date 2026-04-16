"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DBConnection = void 0;
const mongoose_1 = require("mongoose");
const user_model_js_1 = require("../models/user.model.js");
const governorate_model_js_1 = require("../models/governorate.model.js");
const news_model_js_1 = require("../models/news.model.js");
const event_model_js_1 = require("../models/event.model.js");
const token_model_js_1 = require("../models/token.model.js");
const analytics_model_js_1 = require("../models/analytics.model.js");
const eventRegistration_model_js_1 = require("../models/eventRegistration.model.js");
let connectPromise = null;
let indexesSynced = false;
const syncAllIndexes = async () => {
    if (indexesSynced)
        return;
    await user_model_js_1.UserModel.syncIndexes();
    await governorate_model_js_1.GovernorateModel.syncIndexes();
    await news_model_js_1.NewsModel.syncIndexes();
    await event_model_js_1.EventModel.syncIndexes();
    await eventRegistration_model_js_1.EventRegistrationModel.syncIndexes();
    await token_model_js_1.TokenModel.syncIndexes();
    await analytics_model_js_1.AnalyticsModel.syncIndexes();
    indexesSynced = true;
};
const DBConnection = async () => {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
        throw new Error('MONGODB_URI is missing');
    }
    if (mongoose_1.connection.readyState === 1) {
        return;
    }
    if (connectPromise) {
        return connectPromise;
    }
    connectPromise = (async () => {
        await (0, mongoose_1.connect)(mongoUri);
        const shouldSyncIndexes = process.env.NODE_ENV !== 'production' || process.env.SYNC_INDEXES === 'true';
        if (shouldSyncIndexes) {
            await syncAllIndexes();
        }
        console.log('✅ DB Connected Successfully');
    })();
    try {
        await connectPromise;
    }
    catch (error) {
        connectPromise = null;
        throw error;
    }
};
exports.DBConnection = DBConnection;
//# sourceMappingURL=connectDB.js.map