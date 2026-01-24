"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepo = void 0;
const DBRepo_js_1 = require("./DBRepo.js");
const user_model_js_1 = require("../models/user.model.js");
class UserRepo extends DBRepo_js_1.DBRepo {
    // we make it override to provide default model and still let passing different model if needed
    constructor(model = user_model_js_1.UserModel) {
        super(model);
        this.model = model;
    }
    // this function to create user with custom logic if needed inhereted from generic create method
    async createUser({ data, options }) {
        const result = await this.create(data, options);
        const user = Array.isArray(result) ? result[0] : result;
        if (!user) {
            throw new Error("Failed to create user");
        }
        return user;
    }
}
exports.UserRepo = UserRepo;
//# sourceMappingURL=User.Repo.js.map