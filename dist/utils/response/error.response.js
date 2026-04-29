"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalErrorHandler = exports.ConflictException = exports.ForbidenException = exports.UnAuthorizedException = exports.NotFoundException = exports.BadRequestException = exports.AppError = void 0;
// we extend the built-in Error class to create a custom AppError class
//we make this for more control over the error handling
class AppError extends Error {
    // statusCode is public so we can access it outside the class
    constructor(message, statusCode = 400, cause) {
        super(message, { cause });
        this.statusCode = statusCode;
        // to know if error is from application or system error 
        // response will return application error not just error
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.AppError = AppError;
class BadRequestException extends AppError {
    constructor(message, cause) {
        super(message, 400, cause);
    }
}
exports.BadRequestException = BadRequestException;
class NotFoundException extends AppError {
    constructor(message, cause) {
        super(message, 404, cause);
    }
}
exports.NotFoundException = NotFoundException;
class UnAuthorizedException extends AppError {
    constructor(message, cause) {
        super(message, 401, cause);
    }
}
exports.UnAuthorizedException = UnAuthorizedException;
class ForbidenException extends AppError {
    constructor(message, cause) {
        super(message, 403, cause);
    }
}
exports.ForbidenException = ForbidenException;
class ConflictException extends AppError {
    constructor(message, cause) {
        super(message, 409, cause);
    }
}
exports.ConflictException = ConflictException;
const globalErrorHandler = (error, req, res, next) => {
    const statusCode = error.statusCode || 500;
    const isProduction = process.env.NODE_ENV === 'production';
    // Extract validation errors from cause if present
    const cause = error.cause;
    const validationErrors = cause?.validationErrors;
    // Flatten validation errors into a simple field → message map
    const fields = {};
    if (validationErrors?.length) {
        for (const ve of validationErrors) {
            for (const issue of ve.issue) {
                const fieldKey = issue.path ? `${ve.key}.${String(issue.path)}` : ve.key;
                fields[fieldKey] = issue.message;
            }
        }
    }
    const response = {
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
};
exports.globalErrorHandler = globalErrorHandler;
//# sourceMappingURL=error.response.js.map