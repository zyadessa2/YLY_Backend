import { createUserDTO, updateUserDTO } from './user.DTO.js';
import { IPaginationResult } from '../../DB/repos/DBRepo.js';
export declare class UserService {
    private userRepo;
    constructor();
    /**
     * Create User (Admin only)
     */
    createUser: (userData: createUserDTO, adminId: string) => Promise<any>;
    /**
     * Get All Users with pagination
     */
    getAllUsers: (filters?: any, page?: number, limit?: number) => Promise<IPaginationResult<any>>;
    /**
     * Get User By ID
     */
    getUserById: (userId: string) => Promise<any>;
    /**
     * Update User
     */
    updateUser: (userId: string, updateData: updateUserDTO) => Promise<any>;
    /**
     * Delete User (Soft Delete)
     */
    deleteUser: (userId: string) => Promise<void>;
    /**
     * Toggle User Active Status
     */
    toggleUserStatus: (userId: string) => Promise<any>;
    /**
     * Get User Statistics
     */
    getUserStats: () => Promise<any>;
    /**
     * Get Users by Governorate
     */
    getUsersByGovernorate: (governorateId: string) => Promise<any[]>;
    /**
     * Reset User Password (Admin only)
     */
    resetUserPassword: (userId: string, newPassword: string) => Promise<void>;
    /**
     * Restore Soft Deleted User
     */
    restoreUser: (userId: string) => Promise<any>;
}
//# sourceMappingURL=user.services.d.ts.map