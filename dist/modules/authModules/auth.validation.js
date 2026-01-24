import z from 'zod';
import { generalFeilds } from '../../middleware/validation.middleware';
export const loginSchema = {
    body: z.strictObject({
        email: generalFeilds.email,
        password: generalFeilds.password,
    })
};
export const refreshTokenSchema = {
    headers: z.object({
        authorization: z.string()
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