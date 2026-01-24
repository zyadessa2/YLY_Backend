import z, { ZodError, ZodObject, ZodType } from 'zod';

import { Request, Response, NextFunction } from 'express';
import { BadRequestException } from '../utils/response/error.response.js';

type KeyReqType = keyof Request;
type schemaType = Partial<Record<KeyReqType, ZodType>>
type validationErrorsType = Array<{
    key: KeyReqType,
    issue: Array<{
        message: string,
        path: string | number | symbol | undefined;
    }>
}>

export const validation = (schema: schemaType) => {
    return (req: Request, res: Response, next: NextFunction): NextFunction => {
        const validationErrors: validationErrorsType = []

        for (const key of Object.keys(schema) as KeyReqType[]) {
            if (!schema[key]) continue;

            const validationResult = schema[key]!.safeParse(req[key]);
            if (!validationResult.success) {
                const errors = validationResult.error as ZodError

                validationErrors.push({
                    key,
                    issue: errors.issues.map((issue) => {
                        return { message: issue.message, path: issue.path[0] }
                    })
                });
            }
        }

        if (validationErrors.length) {
            throw new BadRequestException('Validation Error', {
                validationErrors
            });
        }

        return next() as unknown as NextFunction;
    }
}

export default validation;


// general fields to be used in different schemas 
export const generalFeilds = {
    name: z.string().min(2).max(100),
    email: z.email(),
    password: z.string(),
    confirmPassword: z.string(),
    otp: z.string().length(6),
}
