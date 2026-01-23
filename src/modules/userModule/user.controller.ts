// user.controller.ts
import { Request, Response, NextFunction } from "express";
import { UserService } from "./user.services";
import { successResponse } from "../../utils/response/success.response";
import { createUserDTO, updateUserDTO } from "./user.DTO";

export class UserController {
    private userService = new UserService();

    /**
     * Create new user (Admin only)
     * POST /api/users
     */
    createUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userData: createUserDTO = req.body;
            const adminId = req.user?._id?.toString();
            
            if (!adminId) {
                throw new Error("Admin ID is required");
            }

            const result = await this.userService.createUser(userData, adminId);

            successResponse({
                res,
                message: "User created successfully",
                data: result,
                statusCode: 201
            });
        } catch (error) {
            next(error);
        }
    };

    /**
     * Get all users with optional filters
     * GET /api/users?page=1&limit=10&role=governorate_user&isActive=true&governorateId=xxx
     */
    getAllUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const role = req.query.role as string;
            const isActive = req.query.isActive as string;
            const governorateId = req.query.governorateId as string;
            const search = req.query.search as string;

            // Build filter
            const filter: any = {};
            if (role) filter.role = role;
            if (isActive !== undefined) filter.isActive = isActive === 'true';
            if (governorateId) filter.governorateId = governorateId;
            if (search) {
                filter.$or = [
                    { email: { $regex: search, $options: 'i' } }
                ];
            }

            const result = await this.userService.getAllUsers(filter, page, limit);

            successResponse({
                res,
                message: "Users retrieved successfully",
                data: result
            });
        } catch (error) {
            next(error);
        }
    };

    /**
     * Get user by ID
     * GET /api/users/:id
     */
    getUserById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userId = req.params.id;
            
            if (!userId) {
                throw new Error("User ID is required");
            }

            const result = await this.userService.getUserById(userId);

            successResponse({
                res,
                message: "User retrieved successfully",
                data: result
            });
        } catch (error) {
            next(error);
        }
    };

    /**
     * Update user
     * PATCH /api/users/:id
     */
    updateUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userId = req.params.id;
            const updateData: updateUserDTO = req.body;
            
            if (!userId) {
                throw new Error("User ID is required");
            }

            const result = await this.userService.updateUser(userId, updateData);

            successResponse({
                res,
                message: "User updated successfully",
                data: result
            });
        } catch (error) {
            next(error);
        }
    };

    /**
     * Delete user (Soft delete)
     * DELETE /api/users/:id
     */
    deleteUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userId = req.params.id;
            
            if (!userId) {
                throw new Error("User ID is required");
            }
            const adminId = req.user?._id?.toString();
            
            if (!adminId) {
                throw new Error("Admin ID is required");
            }

            // Prevent admin from deleting themselves
            if (userId === adminId) {
                successResponse({
                    res,
                    message: "Cannot delete your own account",
                    data: null,
                    statusCode: 400
                });
                return;
            }

            await this.userService.deleteUser(userId);

            successResponse({
                res,
                message: "User deleted successfully",
                data: null
            });
        } catch (error) {
            next(error);
        }
    };

    /**
     * Toggle user active status
     * PATCH /api/users/:id/toggle-status
     */
    toggleUserStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userId = req.params.id;
            const adminId = req.user?._id?.toString();
            
            if (!userId) {
                throw new Error("User ID is required");
            }
            if (!adminId) {
                throw new Error("Admin ID is required");
            }

            // Prevent admin from deactivating themselves
            if (userId === adminId) {
                successResponse({
                    res,
                    message: "Cannot deactivate your own account",
                    data: null,
                    statusCode: 400
                });
                return;
            }

            const result = await this.userService.toggleUserStatus(userId);

            successResponse({
                res,
                message: `User ${result.isActive ? 'activated' : 'deactivated'} successfully`,
                data: result
            });
        } catch (error) {
            next(error);
        }
    };

    /**
     * Get users statistics
     * GET /api/users/stats
     */
    getUserStats = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const result = await this.userService.getUserStats();

            successResponse({
                res,
                message: "User statistics retrieved successfully",
                data: result
            });
        } catch (error) {
            next(error);
        }
    };

    /**
     * Get users by governorate
     * GET /api/users/governorate/:governorateId
     */
    getUsersByGovernorate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const governorateId = req.params.governorateId;
            
            if (!governorateId) {
                throw new Error("Governorate ID is required");
            }

            const result = await this.userService.getUsersByGovernorate(governorateId);

            successResponse({
                res,
                message: "Governorate users retrieved successfully",
                data: result
            });
        } catch (error) {
            next(error);
        }
    };

    /**
     * Reset user password (Admin only)
     * PATCH /api/users/:id/reset-password
     */
    resetUserPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userId = req.params.id;
            const { newPassword } = req.body;
            
            if (!userId) {
                throw new Error("User ID is required");
            }
            if (!newPassword) {
                throw new Error("New password is required");
            }

            await this.userService.resetUserPassword(userId, newPassword);

            successResponse({
                res,
                message: "User password reset successfully",
                data: null
            });
        } catch (error) {
            next(error);
        }
    };

    /**
     * Restore soft deleted user
     * PATCH /api/users/:id/restore
     */
    restoreUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userId = req.params.id;
            
            if (!userId) {
                throw new Error("User ID is required");
            }

            const result = await this.userService.restoreUser(userId);

            successResponse({
                res,
                message: "User restored successfully",
                data: result
            });
        } catch (error) {
            next(error);
        }
    };
}
