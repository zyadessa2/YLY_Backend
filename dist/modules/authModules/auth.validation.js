"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshTokenSchema = exports.loginSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const validation_middleware_js_1 = require("../../middleware/validation.middleware.js");
exports.loginSchema = {
    body: zod_1.default.strictObject({
        email: validation_middleware_js_1.generalFeilds.email,
        password: validation_middleware_js_1.generalFeilds.password,
    })
};
exports.refreshTokenSchema = {
    headers: zod_1.default.object({
        authorization: zod_1.default.string()
            .min(1, 'Authorization header is required')
            .refine(val => val.startsWith('Bearer '), 'Authorization header must start with "Bearer" - Format: Bearer <token>')
            .refine(val => val.length > 7, // "Bearer " = 7 characters
        'Token is required after "Bearer" prefix')
            .refine(val => {
            const token = val.replace('Bearer ', '');
            // التوكن يجب أن يكون JWT format (3 أجزاء مفصولة بنقاط)
            return token.split('.').length === 3;
        }, 'Invalid token format - must be a valid JWT token')
    }).transform(data => ({
        refreshToken: data.authorization.slice(7) // حذف "Bearer "
    }))
};
//# sourceMappingURL=auth.validation.js.map