"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
// user.service.ts
const error_response_js_1 = require("../../utils/response/error.response.js");
const hash_security_js_1 = require("../../utils/security/hash.security.js");
const governorate_model_js_1 = require("../../DB/models/governorate.model.js");
const User_Repo_js_1 = require("../../DB/repos/User.Repo.js");
class UserService {
    constructor() {
        this.userRepo = new User_Repo_js_1.UserRepo();
        /**
         * Create User (Admin only)
         */
        this.createUser = async (userData, adminId) => {
            const { email, password, role, governorateId } = userData;
            // Check if email already exists
            const existingUser = await this.userRepo.findOne({
                filter: { email }
            });
            if (existingUser) {
                throw new error_response_js_1.ConflictException("Email already exists");
            }
            // Validate governorate for governorate_user
            if (role === 'governorate_user') {
                if (!governorateId) {
                    throw new error_response_js_1.BadRequestException("Governorate ID is required for governorate users");
                }
                // Check if governorate exists
                const governorate = await governorate_model_js_1.GovernorateModel.findById(governorateId);
                if (!governorate) {
                    throw new error_response_js_1.NotFoundException("Governorate not found");
                }
                // Check if governorate already has a user
                const existingGovernorateUser = await this.userRepo.findOne({
                    filter: { governorateId, deletedAt: null }
                });
                if (existingGovernorateUser) {
                    throw new error_response_js_1.ConflictException("This governorate already has an assigned user");
                }
            }
            else if (role === 'admin' && governorateId) {
                throw new error_response_js_1.BadRequestException("Admin users cannot have a governorate assigned");
            }
            // Hash password
            const hashedPassword = await (0, hash_security_js_1.generateHash)(password);
            // Create user
            const newUser = await this.userRepo.create({
                email,
                password: hashedPassword,
                role: role,
                governorateId: role === 'governorate_user' ? governorateId : null,
                isActive: true
            });
            // Handle array result from create
            const createdUser = Array.isArray(newUser) ? newUser[0] : newUser;
            if (!createdUser) {
                throw new error_response_js_1.BadRequestException("Failed to create user");
            }
            // Populate and return
            const populatedUser = await this.userRepo.findById({
                id: createdUser._id,
                populate: [{ path: 'governorateId', select: 'name arabicName slug logo' }]
            });
            const userResponse = populatedUser.toObject();
            const { password: _, refreshToken: __, ...safeUserResponse } = userResponse;
            return safeUserResponse;
        };
        /**
         * Get All Users with pagination
         */
        this.getAllUsers = async (filters = {}, page = 1, limit = 10) => {
            const result = await this.userRepo.findWithPagination({
                filter: { ...filters, deletedAt: null },
                populate: [{ path: 'governorateId', select: 'name arabicName slug logo' }],
                sort: { createdAt: -1 },
                page,
                limit
            });
            // Remove sensitive data
            result.data = result.data.map((user) => {
                const userObj = user.toObject ? user.toObject() : user;
                const { password: _, refreshToken: __, ...safeUser } = userObj;
                return safeUser;
            });
            return result;
        };
        /**
         * Get User By ID
         */
        this.getUserById = async (userId) => {
            const user = await this.userRepo.findById({
                id: userId,
                populate: [{ path: 'governorateId', select: 'name arabicName slug logo coverImage description' }]
            });
            if (!user) {
                throw new error_response_js_1.NotFoundException("User not found");
            }
            const userResponse = user.toObject();
            const { password: _, refreshToken: __, ...safeUserResponse } = userResponse;
            return safeUserResponse;
        };
        /**
         * Update User
         */
        this.updateUser = async (userId, updateData) => {
            const user = await this.userRepo.findById({ id: userId });
            if (!user) {
                throw new error_response_js_1.NotFoundException("User not found");
            }
            // Check email uniqueness if changing email
            if (updateData.email && updateData.email !== user.email) {
                const existingUser = await this.userRepo.findOne({
                    filter: {
                        email: updateData.email,
                        _id: { $ne: userId } // Exclude current user from uniqueness check
                    }
                });
                if (existingUser) {
                    throw new error_response_js_1.ConflictException("Email already exists");
                }
            }
            // Validate governorate change
            if (updateData.governorateId) {
                const governorate = await governorate_model_js_1.GovernorateModel.findById(updateData.governorateId);
                if (!governorate) {
                    throw new error_response_js_1.NotFoundException("Governorate not found");
                }
                // Check if another user is assigned to this governorate
                const existingGovernorateUser = await this.userRepo.findOne({
                    filter: {
                        governorateId: updateData.governorateId,
                        _id: { $ne: userId },
                        deletedAt: null
                    }
                });
                if (existingGovernorateUser) {
                    throw new error_response_js_1.ConflictException("This governorate already has an assigned user");
                }
            }
            // Hash password if provided
            if (updateData.password) {
                updateData.password = await (0, hash_security_js_1.generateHash)(updateData.password);
                // Note: refreshToken will be cleared by auth middleware on next login
            }
            // Update user
            await this.userRepo.updateOne({
                filter: { _id: userId },
                data: updateData
            });
            // Return updated user
            return this.getUserById(userId);
        };
        /**
         * Delete User (Soft Delete)
         */
        this.deleteUser = async (userId) => {
            const user = await this.userRepo.findById({ id: userId });
            if (!user) {
                throw new error_response_js_1.NotFoundException("User not found");
            }
            // Soft delete
            await this.userRepo.softDeleteById({ id: userId });
        };
        /**
         * Toggle User Active Status
         */
        this.toggleUserStatus = async (userId) => {
            const user = await this.userRepo.findById({ id: userId });
            if (!user) {
                throw new error_response_js_1.NotFoundException("User not found");
            }
            // Toggle status
            await this.userRepo.updateOne({
                filter: { _id: userId },
                data: {
                    isActive: !user.isActive,
                    refreshToken: !user.isActive ? user.refreshToken : null // Clear token if deactivating
                }
            });
            return this.getUserById(userId);
        };
        /**
         * Get User Statistics
         */
        this.getUserStats = async () => {
            const stats = await this.userRepo.aggregate([
                { $match: { deletedAt: null } },
                {
                    $group: {
                        _id: null,
                        totalUsers: { $sum: 1 },
                        activeUsers: {
                            $sum: { $cond: [{ $eq: ['$isActive', true] }, 1, 0] }
                        },
                        inactiveUsers: {
                            $sum: { $cond: [{ $eq: ['$isActive', false] }, 1, 0] }
                        },
                        adminUsers: {
                            $sum: { $cond: [{ $eq: ['$role', 'admin'] }, 1, 0] }
                        },
                        governorateUsers: {
                            $sum: { $cond: [{ $eq: ['$role', 'governorate_user'] }, 1, 0] }
                        }
                    }
                }
            ]);
            return stats[0] || {
                totalUsers: 0,
                activeUsers: 0,
                inactiveUsers: 0,
                adminUsers: 0,
                governorateUsers: 0
            };
        };
        /**
         * Get Users by Governorate
         */
        this.getUsersByGovernorate = async (governorateId) => {
            const users = await this.userRepo.find({
                filter: { governorateId, deletedAt: null },
                populate: [{ path: 'governorateId', select: 'name arabicName slug' }],
                sort: { createdAt: -1 }
            });
            return users.map((user) => {
                const userObj = user.toObject();
                const { password: _, refreshToken: __, ...safeUser } = userObj;
                return safeUser;
            });
        };
        /**
         * Reset User Password (Admin only)
         */
        this.resetUserPassword = async (userId, newPassword) => {
            const user = await this.userRepo.findById({ id: userId });
            if (!user) {
                throw new error_response_js_1.NotFoundException("User not found");
            }
            // Hash new password
            const hashedPassword = await (0, hash_security_js_1.generateHash)(newPassword);
            // Update password and clear refresh token
            await this.userRepo.updateOne({
                filter: { _id: userId },
                data: {
                    password: hashedPassword,
                    refreshToken: null
                }
            });
        };
        /**
         * Restore Soft Deleted User
         */
        this.restoreUser = async (userId) => {
            const user = await this.userRepo.findOne({
                filter: { _id: userId },
                options: { includeDeleted: true }
            });
            if (!user) {
                throw new error_response_js_1.NotFoundException("User not found");
            }
            if (!user.deletedAt) {
                throw new error_response_js_1.BadRequestException("User is not deleted");
            }
            // Restore user
            await this.userRepo.restore({ filter: { _id: userId } });
            return this.getUserById(userId);
        };
    }
}
exports.UserService = UserService;
//# sourceMappingURL=user.services.js.map