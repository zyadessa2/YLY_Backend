"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const user_services_js_1 = require("./user.services.js");
const success_response_js_1 = require("../../utils/response/success.response.js");
class UserController {
    constructor() {
        this.userService = new user_services_js_1.UserService();
        /**
         * Create new user (Admin only)
         * POST /api/users
         */
        this.createUser = async (req, res, next) => {
            try {
                const userData = req.body;
                const adminId = req.user?._id?.toString();
                if (!adminId) {
                    throw new Error("Admin ID is required");
                }
                const result = await this.userService.createUser(userData, adminId);
                (0, success_response_js_1.successResponse)({
                    res,
                    message: "User created successfully",
                    data: result,
                    statusCode: 201
                });
            }
            catch (error) {
                next(error);
            }
        };
        /**
         * Get all users with optional filters
         * GET /api/users?page=1&limit=10&role=governorate_user&isActive=true&governorateId=xxx
         */
        this.getAllUsers = async (req, res, next) => {
            try {
                const page = parseInt(req.query.page) || 1;
                const limit = parseInt(req.query.limit) || 10;
                const role = req.query.role;
                const isActive = req.query.isActive;
                const governorateId = req.query.governorateId;
                const search = req.query.search;
                // Build filter
                const filter = {};
                if (role)
                    filter.role = role;
                if (isActive !== undefined)
                    filter.isActive = isActive === 'true';
                if (governorateId)
                    filter.governorateId = governorateId;
                if (search) {
                    filter.$or = [
                        { email: { $regex: search, $options: 'i' } }
                    ];
                }
                const result = await this.userService.getAllUsers(filter, page, limit);
                (0, success_response_js_1.successResponse)({
                    res,
                    message: "Users retrieved successfully",
                    data: result
                });
            }
            catch (error) {
                next(error);
            }
        };
        /**
         * Get user by ID
         * GET /api/users/:id
         */
        this.getUserById = async (req, res, next) => {
            try {
                const userId = req.params.id;
                if (!userId) {
                    throw new Error("User ID is required");
                }
                const result = await this.userService.getUserById(userId);
                (0, success_response_js_1.successResponse)({
                    res,
                    message: "User retrieved successfully",
                    data: result
                });
            }
            catch (error) {
                next(error);
            }
        };
        /**
         * Update user
         * PATCH /api/users/:id
         */
        this.updateUser = async (req, res, next) => {
            try {
                const userId = req.params.id;
                const updateData = req.body;
                if (!userId) {
                    throw new Error("User ID is required");
                }
                const result = await this.userService.updateUser(userId, updateData);
                (0, success_response_js_1.successResponse)({
                    res,
                    message: "User updated successfully",
                    data: result
                });
            }
            catch (error) {
                next(error);
            }
        };
        /**
         * Delete user (Soft delete)
         * DELETE /api/users/:id
         */
        this.deleteUser = async (req, res, next) => {
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
                    (0, success_response_js_1.successResponse)({
                        res,
                        message: "Cannot delete your own account",
                        data: null,
                        statusCode: 400
                    });
                    return;
                }
                await this.userService.deleteUser(userId);
                (0, success_response_js_1.successResponse)({
                    res,
                    message: "User deleted successfully",
                    data: null
                });
            }
            catch (error) {
                next(error);
            }
        };
        /**
         * Toggle user active status
         * PATCH /api/users/:id/toggle-status
         */
        this.toggleUserStatus = async (req, res, next) => {
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
                    (0, success_response_js_1.successResponse)({
                        res,
                        message: "Cannot deactivate your own account",
                        data: null,
                        statusCode: 400
                    });
                    return;
                }
                const result = await this.userService.toggleUserStatus(userId);
                (0, success_response_js_1.successResponse)({
                    res,
                    message: `User ${result.isActive ? 'activated' : 'deactivated'} successfully`,
                    data: result
                });
            }
            catch (error) {
                next(error);
            }
        };
        /**
         * Get users statistics
         * GET /api/users/stats
         */
        this.getUserStats = async (req, res, next) => {
            try {
                const result = await this.userService.getUserStats();
                (0, success_response_js_1.successResponse)({
                    res,
                    message: "User statistics retrieved successfully",
                    data: result
                });
            }
            catch (error) {
                next(error);
            }
        };
        /**
         * Get users by governorate
         * GET /api/users/governorate/:governorateId
         */
        this.getUsersByGovernorate = async (req, res, next) => {
            try {
                const governorateId = req.params.governorateId;
                if (!governorateId) {
                    throw new Error("Governorate ID is required");
                }
                const result = await this.userService.getUsersByGovernorate(governorateId);
                (0, success_response_js_1.successResponse)({
                    res,
                    message: "Governorate users retrieved successfully",
                    data: result
                });
            }
            catch (error) {
                next(error);
            }
        };
        /**
         * Reset user password (Admin only)
         * PATCH /api/users/:id/reset-password
         */
        this.resetUserPassword = async (req, res, next) => {
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
                (0, success_response_js_1.successResponse)({
                    res,
                    message: "User password reset successfully",
                    data: null
                });
            }
            catch (error) {
                next(error);
            }
        };
        /**
         * Restore soft deleted user
         * PATCH /api/users/:id/restore
         */
        this.restoreUser = async (req, res, next) => {
            try {
                const userId = req.params.id;
                if (!userId) {
                    throw new Error("User ID is required");
                }
                const result = await this.userService.restoreUser(userId);
                (0, success_response_js_1.successResponse)({
                    res,
                    message: "User restored successfully",
                    data: result
                });
            }
            catch (error) {
                next(error);
            }
        };
    }
}
exports.UserController = UserController;
//# sourceMappingURL=user.controller.js.map