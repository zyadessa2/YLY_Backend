import { Response } from "express";
export declare const successResponse: <T = any>({ res, message, statusCode, data }: {
    res: Response;
    message?: string;
    statusCode?: number;
    data?: T;
}) => Response;
//# sourceMappingURL=success.response.d.ts.map