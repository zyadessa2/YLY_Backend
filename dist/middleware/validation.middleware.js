import z from 'zod';
import { BadRequestException } from '../utils/response/error.response.js';
export const validation = (schema) => {
    return (req, res, next) => {
        console.log(schema);
        console.log(Object.keys(schema));
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
            throw new BadRequestException('Validation Error', {
                validationErrors
            });
        }
        return next();
    };
};
export default validation;
// general fields to be used in different schemas 
export const generalFeilds = {
    name: z.string().min(2).max(100),
    email: z.email(),
    password: z.string(),
    confirmPassword: z.string(),
    otp: z.string().length(6),
};
//# sourceMappingURL=validation.middleware.js.map