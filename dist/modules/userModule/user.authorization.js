"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.endPoint = void 0;
const user_types_js_1 = require("./user.types.js");
// define access roles for each endpoint in user module
exports.endPoint = {
    profile: [user_types_js_1.RoleEnum.user],
    restoreAccount: [user_types_js_1.RoleEnum.admin],
    hardDelete: [user_types_js_1.RoleEnum.admin]
};
//# sourceMappingURL=user.authorization.js.map