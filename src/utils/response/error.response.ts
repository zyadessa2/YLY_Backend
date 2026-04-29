import { Request, Response, NextFunction } from 'express';

export interface IError extends Error {
    statusCode?: number;
}

// we extend the built-in Error class to create a custom AppError class
//we make this for more control over the error handling
export class AppError extends Error {
    // statusCode is public so we can access it outside the class
    constructor( message: string, public statusCode: number = 400 , cause?: unknown ) {
        super(message , {cause});
        // to know if error is from application or system error 
        // response will return application error not just error
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}

export class BadRequestException extends AppError {
    constructor( message: string, cause?: unknown ) {
        super(message , 400 , cause);
    }
}

export class NotFoundException extends AppError {
    constructor( message: string, cause?: unknown ) {
        super(message , 404 , cause);
    }
}

export class UnAuthorizedException extends AppError {
    constructor( message: string, cause?: unknown ) {
        super(message , 401 , cause);
    }
}
export class ForbidenException extends AppError {
    constructor( message: string, cause?: unknown ) {
        super(message , 403 , cause);
    }
}

export class ConflictException extends AppError {
    constructor( message: string, cause?: unknown ) {
        super(message , 409 , cause);
    }
}

export const globalErrorHandler = (
    error: IError,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const statusCode = error.statusCode || 500;
    const isProduction = process.env.NODE_ENV === 'production';

    // Extract validation errors from cause if present
    const cause = error.cause as Record<string, unknown> | undefined;
    const validationErrors = cause?.validationErrors as Array<{
        key: string;
        issue: Array<{ message: string; path: string | number | symbol | undefined }>;
    }> | undefined;

    // Flatten validation errors into a simple field → message map
    const fields: Record<string, string> = {};
    if (validationErrors?.length) {
        for (const ve of validationErrors) {
            for (const issue of ve.issue) {
                const fieldKey = issue.path ? `${ve.key}.${String(issue.path)}` : ve.key;
                fields[fieldKey] = issue.message;
            }
        }
    }

    const response: Record<string, unknown> = {
        success: false,
        statusCode,
        message: error.message || 'Internal Server Error',
    };

    if (validationErrors?.length) {
        response['validationErrors'] = fields;
    }

    // Only expose stack trace in development
    if (!isProduction) {
        response['stack'] = error.stack;
    }

    return res.status(statusCode).json(response);
}

