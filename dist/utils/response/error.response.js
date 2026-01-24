// we extend the built-in Error class to create a custom AppError class
//we make this for more control over the error handling
export class AppError extends Error {
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
export class BadRequestException extends AppError {
    constructor(message, cause) {
        super(message, 400, cause);
    }
}
export class NotFoundException extends AppError {
    constructor(message, cause) {
        super(message, 404, cause);
    }
}
export class UnAuthorizedException extends AppError {
    constructor(message, cause) {
        super(message, 401, cause);
    }
}
export class ForbidenException extends AppError {
    constructor(message, cause) {
        super(message, 403, cause);
    }
}
export class ConflictException extends AppError {
    constructor(message, cause) {
        super(message, 409, cause);
    }
}
export const globalErrorHandler = (error, req, res, next) => {
    return res.status(error.statusCode || 500).json({
        err_message: error.message || "Internal Server Error",
        stack: error.stack || "No stack trace available",
        cause: error.cause
    });
};
//# sourceMappingURL=error.response.js.map