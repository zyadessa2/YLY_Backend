"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
const mongoose_1 = require("mongoose");
const user_model_js_1 = require("../DB/models/user.model.js");
const user_types_js_1 = require("../modules/userModule/user.types.js");
(0, dotenv_1.config)();
const ADMIN_EMAIL = 'ylyAdmin@gmail.com';
const ADMIN_PASSWORD = '24682468Zz@';
const createOrUpdateAdmin = async () => {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
        throw new Error('MONGODB_URI is missing in environment variables.');
    }
    await (0, mongoose_1.connect)(mongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    const existingUser = await user_model_js_1.UserModel.findOne({ email: ADMIN_EMAIL.toLowerCase() });
    if (!existingUser) {
        await user_model_js_1.UserModel.create({
            email: ADMIN_EMAIL,
            password: ADMIN_PASSWORD,
            role: user_types_js_1.RoleEnum.admin,
            governorateId: null,
            isActive: true,
            deletedAt: null,
            refreshToken: null,
        });
        console.log(`Admin account created: ${ADMIN_EMAIL}`);
        return;
    }
    existingUser.role = user_types_js_1.RoleEnum.admin;
    existingUser.governorateId = null;
    existingUser.isActive = true;
    existingUser.deletedAt = null;
    existingUser.password = ADMIN_PASSWORD;
    existingUser.refreshToken = null;
    await existingUser.save();
    console.log(`Admin account updated: ${ADMIN_EMAIL}`);
};
createOrUpdateAdmin()
    .catch((error) => {
    console.error('Failed to create/update admin account:', error);
    process.exitCode = 1;
})
    .finally(async () => {
    await (0, mongoose_1.disconnect)();
});
//# sourceMappingURL=create-admin.js.map