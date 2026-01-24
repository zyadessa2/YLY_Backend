import { ZodType } from "zod";
import { Request, Response, NextFunction } from "express";
type KeyReqType = keyof Request;
type schemaType = Partial<Record<KeyReqType, ZodType>>;
export declare const validation: (schema: schemaType) => (req: Request, res: Response, next: NextFunction) => NextFunction;
export default validation;
export declare const generalFeilds: {
    name: any;
    email: any;
    password: any;
    confirmPassword: any;
    otp: any;
};
//# sourceMappingURL=validation.middleware.d.ts.map