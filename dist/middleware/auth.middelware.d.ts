import { NextFunction, Response, Request } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import { TokenTypeEnum } from '../utils/security/token.security.js';
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
export declare const authenticate: (tokenType?: TokenTypeEnum) => (req: Request, res: Response, next: NextFunction) => Promise<void>;
/**
 * Authorization Middleware
 * Checks if authenticated user has required role
 * Must be used AFTER authenticate middleware
 */
export declare const authorize: (allowedRoles: string[]) => (req: Request, res: Response, next: NextFunction) => Promise<void>;
/**
 * Check Governorate Access Middleware
 * Ensures governorate users can only access their own governorate data
 * Admin users bypass this check
 */
export declare const checkGovernorateAccess: (governorateIdParam?: string) => (req: Request, res: Response, next: NextFunction) => Promise<void>;
/**
 * Check Resource Ownership Middleware
 * Ensures users can only modify their own created resources
 * Admin users bypass this check
 */
export declare const checkOwnership: (model: any, resourceIdParam?: string) => (req: Request, res: Response, next: NextFunction) => Promise<void>;
/**
 * Optional Authentication Middleware
 * Attaches user if token is valid, but doesn't throw error if missing
 * Useful for public endpoints that need user context when available
 */
export declare const optionalAuthenticate: (tokenType?: TokenTypeEnum) => (req: Request, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=auth.middelware.d.ts.map