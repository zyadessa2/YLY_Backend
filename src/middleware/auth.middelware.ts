import { NextFunction, Response, Request } from "express";
import { JwtPayload } from "jsonwebtoken";
import { 
    BadRequestException, 
    ForbidenException,
    UnAuthorizedException 
} from "../utils/response/error.response";
import { decodeToken, TokenTypeEnum } from "../utils/security/token.security";
import { UserModel } from "../DB/models/user.model";

// Extend Express Request type
declare global {
    namespace Express {
        interface Request {
            user?: any;
            decoded?: JwtPayload;
            resource?: any;
        }
    }
}

/**
 * Authentication Middleware
 * Verifies JWT token and attaches user to request
 * Checks if user is active and not deleted
 */
export const authenticate = (tokenType: TokenTypeEnum = TokenTypeEnum.Access) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            // Check if authorization header exists
            if (!req.headers.authorization) {
                throw new BadRequestException("Missing authorization header", {
                    key: "headers",
                    issue: [{ path: "authorization", message: "Authorization header is required" }]
                });
            }

            // Decode and verify token
            const { user, decoded } = await decodeToken({
                authorization: req.headers.authorization,
                tokenType
            });

            // Check if user still exists in database
            const existingUser = await UserModel.findById(user._id)
                .select('+refreshToken')
                .lean();

            if (!existingUser) {
                throw new UnAuthorizedException("User no longer exists");
            }

            // Check if user is active
            if (!existingUser.isActive) {
                throw new ForbidenException("Your account has been deactivated");
            }

            // Check if user is soft deleted
            if (existingUser.deletedAt) {
                throw new ForbidenException("Your account has been deleted");
            }

            // Attach user and decoded token to request
            req.user = existingUser;
            req.decoded = decoded;

            next();
        } catch (error) {
            next(error);
        }
    };
};

/**
 * Authorization Middleware
 * Checks if authenticated user has required role
 * Must be used AFTER authenticate middleware
 */
export const authorize = (allowedRoles: string[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            // Check if user is authenticated
            if (!req.user) {
                throw new UnAuthorizedException("Authentication required");
            }

            // Check if user has required role
            if (!allowedRoles.includes(req.user.role)) {
                throw new ForbidenException(
                    `Access denied. Required roles: ${allowedRoles.join(', ')}`
                );
            }

            next();
        } catch (error) {
            next(error);
        }
    };
};

/**
 * Check Governorate Access Middleware
 * Ensures governorate users can only access their own governorate data
 * Admin users bypass this check
 */
export const checkGovernorateAccess = (governorateIdParam: string = 'governorateId') => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            // Check if user is authenticated
            if (!req.user) {
                throw new UnAuthorizedException("Authentication required");
            }

            // Admin can access all governorates
            if (req.user.role === 'admin') {
                return next();
            }

            // Get governorateId from request (params, body, or query)
            const requestedGovernorateId = 
                req.params[governorateIdParam] || 
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
                throw new ForbidenException(
                    "You can only access data from your assigned governorate"
                );
            }

            next();
        } catch (error) {
            next(error);
        }
    };
};

/**
 * Check Resource Ownership Middleware
 * Ensures users can only modify their own created resources
 * Admin users bypass this check
 */
export const checkOwnership = (model: any, resourceIdParam: string = 'id') => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            // Check if user is authenticated
            if (!req.user) {
                throw new UnAuthorizedException("Authentication required");
            }

            // Admin can access all resources
            if (req.user.role === 'admin') {
                return next();
            }

            // Get resource ID from params
            const resourceId = req.params[resourceIdParam];

            if (!resourceId) {
                throw new BadRequestException("Resource ID is required");
            }

            // Find resource
            const resource = await model.findById(resourceId);

            if (!resource) {
                throw new BadRequestException("Resource not found");
            }

            // Check if user is the creator
            if (resource.createdBy.toString() !== req.user._id.toString()) {
                throw new ForbidenException(
                    "You can only modify resources you created"
                );
            }

            // Attach resource to request for use in controller
            req.resource = resource;

            next();
        } catch (error) {
            next(error);
        }
    };
};

/**
 * Optional Authentication Middleware
 * Attaches user if token is valid, but doesn't throw error if missing
 * Useful for public endpoints that need user context when available
 */
export const optionalAuthenticate = (tokenType: TokenTypeEnum = TokenTypeEnum.Access) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            // If no authorization header, skip authentication
            if (!req.headers.authorization) {
                return next();
            }

            // Try to decode token
            const { user, decoded } = await decodeToken({
                authorization: req.headers.authorization,
                tokenType
            });

            // Check if user still exists and is active
            const existingUser = await UserModel.findById(user._id).lean();

            if (existingUser && existingUser.isActive && !existingUser.deletedAt) {
                req.user = existingUser;
                req.decoded = decoded;
            }

            next();
        } catch (error) {
            // Silently fail for optional authentication
            next();
        }
    };
};
