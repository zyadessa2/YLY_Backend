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
    return res.status(error.statusCode || 500).json({
        err_message: error.message || "Internal Server Error",
        stack: error.stack || "No stack trace available",
        cause: error.cause
    });
};
exports.globalErrorHandler = globalErrorHandler;
//# sourceMappingURL=error.response.js.map