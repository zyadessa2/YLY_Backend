"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generalFeilds = exports.validation = void 0;
const zod_1 = __importDefault(require("zod"));
const error_response_js_1 = require("../utils/response/error.response.js");
const validation = (schema) => {
    return (req, res, next) => {
        const validationErrors = [];
        for (const key of Object.keys(schema)) {
            if (!schema[key])
                continue;
            const validationResult = schema[key].safeParse(req[key]);
            if (!validationResult.success) {
                const errors = validationResult.error;
                validationErrors.push({
                    key,
                    issue: errors.issues.map((issue) => {
                        return { message: issue.message, path: issue.path[0] };
                    })
                });
            }
        }
        if (validationErrors.length) {
            throw new error_response_js_1.BadRequestException('Validation Error', {
                validationErrors
            });
        }
        return next();
    };
};
exports.validation = validation;
exports.default = exports.validation;
// general fields to be used in different schemas 
exports.generalFeilds = {
    name: zod_1.default.string().min(2).max(100),
    email: zod_1.default.email(),
    password: zod_1.default.string(),
    confirmPassword: zod_1.default.string(),
    otp: zod_1.default.string().length(6),
};
//# sourceMappingURL=validation.middleware.js.map