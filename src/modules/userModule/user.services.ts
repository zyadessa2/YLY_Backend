// user.service.ts
import { 
    BadRequestException,
    ConflictException,
    NotFoundException 
} from '../../utils/response/error.response.js';
import { generateHash } from '../../utils/security/hash.security.js';
import { createUserDTO, updateUserDTO } from './user.DTO.js';
import { GovernorateModel } from '../../DB/models/governorate.model.js';
import { UserRepo } from '../../DB/repos/User.Repo.js';
import { IPaginationResult } from '../../DB/repos/DBRepo.js';

export class UserService {
    private userRepo = new UserRepo();

    constructor() {}

    /**
     * Create User (Admin only)
     */
    createUser = async (userData: createUserDTO, adminId: string): Promise<any> => {
        const { email, password, role, governorateId } = userData;

        // Check if email already exists
        const existingUser = await this.userRepo.findOne({
            filter: { email }
        });

        if (existingUser) {
            throw new ConflictException("Email already exists");
        }

        // Validate governorate for governorate_user
        if (role === 'governorate_user') {
            if (!governorateId) {
                throw new BadRequestException("Governorate ID is required for governorate users");
            }

            // Check if governorate exists
            const governorate = await GovernorateModel.findById(governorateId);
            if (!governorate) {
                throw new NotFoundException("Governorate not found");
            }

            // Check if governorate already has a user
            const existingGovernorateUser = await this.userRepo.findOne({
                filter: { governorateId, deletedAt: null }
            });

            if (existingGovernorateUser) {
                throw new ConflictException("This governorate already has an assigned user");
            }
        } else if (role === 'admin' && governorateId) {
            throw new BadRequestException("Admin users cannot have a governorate assigned");
        }

        // Hash password
        const hashedPassword = await generateHash(password);

        // Create user
        const newUser = await this.userRepo.create({
            email,
            password: hashedPassword,
            role: role as any,
            governorateId: role === 'governorate_user' ? (governorateId as any) : null,
            isActive: true
        });

        // Handle array result from create
        const createdUser = Array.isArray(newUser) ? newUser[0] : newUser;
        
        if (!createdUser) {
            throw new BadRequestException("Failed to create user");
        }

        // Populate and return
        const populatedUser = await this.userRepo.findById({
            id: createdUser._id,
            populate: [{ path: 'governorateId', select: 'name arabicName slug logo' }]
        });

        const userResponse = populatedUser!.toObject() as any;
        const { password: _, refreshToken: __, ...safeUserResponse } = userResponse;

        return safeUserResponse;
    };

    /**
     * Get All Users with pagination
     */
    getAllUsers = async (
        filters: any = {}, 
        page: number = 1, 
        limit: number = 10
    ): Promise<IPaginationResult<any>> => {
        const result = await this.userRepo.findWithPagination({
            filter: { ...filters, deletedAt: null },
            populate: [{ path: 'governorateId', select: 'name arabicName slug logo' }],
            sort: { createdAt: -1 },
            page,
            limit
        });

        // Remove sensitive data
        result.data = result.data.map((user: any) => {
            const userObj = user.toObject ? (user.toObject() as any) : (user as any);
            const { password: _, refreshToken: __, ...safeUser } = userObj;
            return safeUser;
        });

        return result;
    };

    /**
     * Get User By ID
     */
    getUserById = async (userId: string): Promise<any> => {
        const user = await this.userRepo.findById({
            id: userId,
            populate: [{ path: 'governorateId', select: 'name arabicName slug logo coverImage description' }]
        });

        if (!user) {
            throw new NotFoundException("User not found");
        }

        const userResponse = (user.toObject() as any);
        const { password: _, refreshToken: __, ...safeUserResponse } = userResponse;

        return safeUserResponse;
    };

    /**
     * Update User
     */
    updateUser = async (userId: string, updateData: updateUserDTO): Promise<any> => {
        const user = await this.userRepo.findById({ id: userId });

        if (!user) {
            throw new NotFoundException("User not found");
        }

        // Check email uniqueness if changing email
        if (updateData.email && updateData.email !== user.email) {
            const existingUser = await this.userRepo.findOne({
                filter: { 
                    email: updateData.email,
                    _id: { $ne: userId }  // Exclude current user from uniqueness check
                }
            });

            if (existingUser) {
                throw new ConflictException("Email already exists");
            }
        }

        // Validate governorate change
        if (updateData.governorateId) {
            const governorate = await GovernorateModel.findById(updateData.governorateId);
            if (!governorate) {
                throw new NotFoundException("Governorate not found");
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
                throw new ConflictException("This governorate already has an assigned user");
            }
        }

        // Hash password if provided
        if (updateData.password) {
            updateData.password = await generateHash(updateData.password);
            // Note: refreshToken will be cleared by auth middleware on next login
        }

        // Update user
        await this.userRepo.updateOne({
            filter: { _id: userId },
            data: updateData as any
        });

        // Return updated user
        return this.getUserById(userId);
    };

    /**
     * Delete User (Soft Delete)
     */
    deleteUser = async (userId: string): Promise<void> => {
        const user = await this.userRepo.findById({ id: userId });

        if (!user) {
            throw new NotFoundException("User not found");
        }

        // Soft delete
        await this.userRepo.softDeleteById({ id: userId });
    };

    /**
     * Toggle User Active Status
     */
    toggleUserStatus = async (userId: string): Promise<any> => {
        const user = await this.userRepo.findById({ id: userId });

        if (!user) {
            throw new NotFoundException("User not found");
        }

        // Toggle status
        await this.userRepo.updateOne({
            filter: { _id: userId },
            data: { 
                isActive: !user.isActive,
                refreshToken: !user.isActive ? user.refreshToken : null // Clear token if deactivating
            } as any
        });

        return this.getUserById(userId);
    };

    /**
     * Get User Statistics
     */
    getUserStats = async (): Promise<any> => {
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
    getUsersByGovernorate = async (governorateId: string): Promise<any[]> => {
        const users = await this.userRepo.find({
            filter: { governorateId, deletedAt: null },
            populate: [{ path: 'governorateId', select: 'name arabicName slug' }],
            sort: { createdAt: -1 }
        });

        return users.map((user: any) => {
            const userObj = user.toObject() as any;
            const { password: _, refreshToken: __, ...safeUser } = userObj;
            return safeUser;
        });
    };

    /**
     * Reset User Password (Admin only)
     */
    resetUserPassword = async (userId: string, newPassword: string): Promise<void> => {
        const user = await this.userRepo.findById({ id: userId });

        if (!user) {
            throw new NotFoundException("User not found");
        }

        // Hash new password
        const hashedPassword = await generateHash(newPassword);

        // Update password and clear refresh token
        await this.userRepo.updateOne({
            filter: { _id: userId },
            data: { 
                password: hashedPassword,
                refreshToken: null 
            } as any
        });
    };

    /**
     * Restore Soft Deleted User
     */
    restoreUser = async (userId: string): Promise<any> => {
        const user = await this.userRepo.findOne({
            filter: { _id: userId },
            options: { includeDeleted: true } as any
        });

        if (!user) {
            throw new NotFoundException("User not found");
        }

        if (!user.deletedAt) {
            throw new BadRequestException("User is not deleted");
        }

        // Restore user
        await this.userRepo.restore({ filter: { _id: userId } });

        return this.getUserById(userId);
    };
}
