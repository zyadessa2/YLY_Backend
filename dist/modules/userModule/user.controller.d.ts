import { Request, Response, NextFunction } from "express";
export declare class UserController {
    private userService;
    /**
     * Create new user (Admin only)
     * POST /api/users
     */
    createUser: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * Get all users with optional filters
     * GET /api/users?page=1&limit=10&role=governorate_user&isActive=true&governorateId=xxx
     */
    getAllUsers: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * Get user by ID
     * GET /api/users/:id
     */
    getUserById: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * Update user
     * PATCH /api/users/:id
     */
    updateUser: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * Delete user (Soft delete)
     * DELETE /api/users/:id
     */
    deleteUser: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * Toggle user active status
     * PATCH /api/users/:id/toggle-status
     */
    toggleUserStatus: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * Get users statistics
     * GET /api/users/stats
     */
    getUserStats: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * Get users by governorate
     * GET /api/users/governorate/:governorateId
     */
    getUsersByGovernorate: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * Reset user password (Admin only)
     * PATCH /api/users/:id/reset-password
     */
    resetUserPassword: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * Restore soft deleted user
     * PATCH /api/users/:id/restore
     */
    restoreUser: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
//# sourceMappingURL=user.controller.d.ts.map