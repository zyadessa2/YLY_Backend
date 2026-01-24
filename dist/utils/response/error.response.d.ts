import { Request, Response, NextFunction } from 'express';
export interface IError extends Error {
    statusCode?: number;
}
export declare class AppError extends Error {
    statusCode: number;
    constructor(message: string, statusCode?: number, cause?: unknown);
}
export declare class BadRequestException extends AppError {
    constructor(message: string, cause?: unknown);
}
export declare class NotFoundException extends AppError {
    constructor(message: string, cause?: unknown);
}
export declare class UnAuthorizedException extends AppError {
    constructor(message: string, cause?: unknown);
}
export declare class ForbidenException extends AppError {
    constructor(message: string, cause?: unknown);
}
export declare class ConflictException extends AppError {
    constructor(message: string, cause?: unknown);
}
export declare const globalErrorHandler: (error: IError, req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>>;
//# sourceMappingURL=error.response.d.ts.map