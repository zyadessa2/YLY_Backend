import { connect } from "mongoose";
import { UserModel } from "../models/user.model";
import { GovernorateModel } from "../models/governorate.model";
import { NewsModel } from "../models/news.model";
import { EventModel } from "../models/event.model";
import { TokenModel } from "../models/token.model";
import { AnalyticsModel } from "../models/analytics.model";
import { EventRegistrationModel } from "../models/eventRegistration.model";
export const DBConnection = async () => {
    return await connect(process.env.MONGODB_URI)
        .then(async () => {
        await UserModel.syncIndexes();
        await GovernorateModel.syncIndexes();
        await NewsModel.syncIndexes();
        await EventModel.syncIndexes();
        await EventRegistrationModel.syncIndexes();
        await TokenModel.syncIndexes();
        await AnalyticsModel.syncIndexes();
        console.log("DB Connected Successfully");
    }).catch((error) => {
        console.log("DB Connection Failed", error);
    });
};
//# sourceMappingURL=connectDB.js.map