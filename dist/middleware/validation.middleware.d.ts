import z, { ZodType } from "zod";
import { Request, Response, NextFunction } from "express";
type KeyReqType = keyof Request;
type schemaType = Partial<Record<KeyReqType, ZodType>>;
export declare const validation: (schema: schemaType) => (req: Request, res: Response, next: NextFunction) => NextFunction;
export default validation;
export declare const generalFeilds: {
    name: z.ZodString;
    email: z.ZodEmail;
    password: z.ZodString;
    confirmPassword: z.ZodString;
    otp: z.ZodString;
};
//# sourceMappingURL=validation.middleware.d.ts.map