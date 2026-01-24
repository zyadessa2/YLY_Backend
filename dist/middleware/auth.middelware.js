"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.optionalAuthenticate = exports.checkOwnership = exports.checkGovernorateAccess = exports.authorize = exports.authenticate = void 0;
const error_response_js_1 = require("../utils/response/error.response.js");
const token_security_js_1 = require("../utils/security/token.security.js");
const user_model_js_1 = require("../DB/models/user.model.js");
/**
 * Authentication Middleware
 * Verifies JWT token and attaches user to request
 * Checks if user is active and not deleted
 */
const authenticate = (tokenType = token_security_js_1.TokenTypeEnum.Access) => {
    return async (req, res, next) => {
        try {
            // Check if authorization header exists
            if (!req.headers.authorization) {
                throw new error_response_js_1.BadRequestException("Missing authorization header", {
                    key: "headers",
                    issue: [{ path: "authorization", message: "Authorization header is required" }]
                });
            }
            // Decode and verify token
            const { user, decoded } = await (0, token_security_js_1.decodeToken)({
                authorization: req.headers.authorization,
                tokenType
            });
            // Check if user still exists in database
            const existingUser = await user_model_js_1.UserModel.findById(user._id)
                .select('+refreshToken')
                .lean();
            if (!existingUser) {
                throw new error_response_js_1.UnAuthorizedException("User no longer exists");
            }
            // Check if user is active
            if (!existingUser.isActive) {
                throw new error_response_js_1.ForbidenException("Your account has been deactivated");
            }
            // Check if user is soft deleted
            if (existingUser.deletedAt) {
                throw new error_response_js_1.ForbidenException("Your account has been deleted");
            }
            // Attach user and decoded token to request
            req.user = existingUser;
            req.decoded = decoded;
            next();
        }
        catch (error) {
            next(error);
        }
    };
};
exports.authenticate = authenticate;
/**
 * Authorization Middleware
 * Checks if authenticated user has required role
 * Must be used AFTER authenticate middleware
 */
const authorize = (allowedRoles) => {
    return async (req, res, next) => {
        try {
            // Check if user is authenticated
            if (!req.user) {
                throw new error_response_js_1.UnAuthorizedException("Authentication required");
            }
            // Check if user has required role
            if (!allowedRoles.includes(req.user.role)) {
                throw new error_response_js_1.ForbidenException(`Access denied. Required roles: ${allowedRoles.join(', ')}`);
            }
            next();
        }
        catch (error) {
            next(error);
        }
    };
};
exports.authorize = authorize;
/**
 * Check Governorate Access Middleware
 * Ensures governorate users can only access their own governorate data
 * Admin users bypass this check
 */
const checkGovernorateAccess = (governorateIdParam = 'governorateId') => {
    return async (req, res, next) => {
        try {
            // Check if user is authenticated
            if (!req.user) {
                throw new error_response_js_1.UnAuthorizedException("Authentication required");
            }
            // Admin can access all governorates
            if (req.user.role === 'admin') {
                return next();
            }
            // Get governorateId from request (params, body, or query)
            const requestedGovernorateId = req.params[governorateIdParam] ||
                req.body.governorateId ||
                req.query.governorateId;
            // If no governorateId in request, user can only access their own
            if (!requestedGovernorateId) {
                // Attach user's governorateId to request for filtering
                req.body.governorateId = req.user.governorateId;
                return next();
            }
            // Convert to ObjectId for comparison
            const userGovernorateId = req.user.governorateId?.toString();
            const targetGovernorateId = requestedGovernorateId.toString();
            // Check if user is trying to access their own governorate
            if (userGovernorateId !== targetGovernorateId) {
                throw new error_response_js_1.ForbidenException("You can only access data from your assigned governorate");
            }
            next();
        }
        catch (error) {
            next(error);
        }
    };
};
exports.checkGovernorateAccess = checkGovernorateAccess;
/**
 * Check Resource Ownership Middleware
 * Ensures users can only modify their own created resources
 * Admin users bypass this check
 */
const checkOwnership = (model, resourceIdParam = 'id') => {
    return async (req, res, next) => {
        try {
            // Check if user is authenticated
            if (!req.user) {
                throw new error_response_js_1.UnAuthorizedException("Authentication required");
            }
            // Admin can access all resources
            if (req.user.role === 'admin') {
                return next();
            }
            // Get resource ID from params
            const resourceId = req.params[resourceIdParam];
            if (!resourceId) {
                throw new error_response_js_1.BadRequestException("Resource ID is required");
            }
            // Find resource
            const resource = await model.findById(resourceId);
            if (!resource) {
                throw new error_response_js_1.BadRequestException("Resource not found");
            }
            // Check if user is the creator
            if (resource.createdBy.toString() !== req.user._id.toString()) {
                throw new error_response_js_1.ForbidenException("You can only modify resources you created");
            }
            // Attach resource to request for use in controller
            req.resource = resource;
            next();
        }
        catch (error) {
            next(error);
        }
    };
};
exports.checkOwnership = checkOwnership;
/**
 * Optional Authentication Middleware
 * Attaches user if token is valid, but doesn't throw error if missing
 * Useful for public endpoints that need user context when available
 */
const optionalAuthenticate = (tokenType = token_security_js_1.TokenTypeEnum.Access) => {
    return async (req, res, next) => {
        try {
            // If no authorization header, skip authentication
            if (!req.headers.authorization) {
                return next();
            }
            // Try to decode token
            const { user, decoded } = await (0, token_security_js_1.decodeToken)({
                authorization: req.headers.authorization,
                tokenType
            });
            // Check if user still exists and is active
            const existingUser = await user_model_js_1.UserModel.findById(user._id).lean();
            if (existingUser && existingUser.isActive && !existingUser.deletedAt) {
                req.user = existingUser;
                req.decoded = decoded;
            }
            next();
        }
        catch (error) {
            // Silently fail for optional authentication
            next();
        }
    };
};
exports.optionalAuthenticate = optionalAuthenticate;
//# sourceMappingURL=auth.middelware.js.map