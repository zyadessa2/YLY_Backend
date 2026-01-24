import { IPaginationResult } from '../../DB/repos/DBRepo.js';
import { createGovernorateDTO, updateGovernorateDTO, getGovernoratesQueryDTO } from './governorate.DTO.js';
export declare class GovernorateService {
    private governorateRepo;
    constructor();
    /**
     * Create Governorate (Admin only)
     */
    createGovernorate: (governorateData: createGovernorateDTO) => Promise<any>;
    /**
     * Get All Governorates with pagination
     */
    getAllGovernorates: (query: getGovernoratesQueryDTO) => Promise<IPaginationResult<any>>;
    /**
     * Get All Governorates (No pagination)
     */
    getAllGovernoratesNoPagination: () => Promise<any[]>;
    /**
     * Get Governorate by ID
     */
    getGovernorateById: (governorateId: string) => Promise<any>;
    /**
     * Get Governorate by Slug
     */
    getGovernorateBySlug: (slug: string) => Promise<any>;
    /**
     * Get Governorate with Details (News, Events, Users)
     */
    getGovernorateDetails: (governorateId: string) => Promise<any>;
    /**
     * Update Governorate (Admin only)
     */
    updateGovernorate: (governorateId: string, updateData: updateGovernorateDTO) => Promise<any>;
    /**
     * Delete Governorate (Admin only)
     */
    deleteGovernorate: (governorateId: string) => Promise<void>;
    /**
     * Get Governorates with Statistics
     */
    getGovernoratesWithStats: () => Promise<any[]>;
    /**
     * Get Governorate News
     */
    getGovernorateNews: (governorateId: string, page?: number, limit?: number, published?: boolean) => Promise<any>;
    /**
     * Get Governorate Events
     */
    getGovernorateEvents: (governorateId: string, page?: number, limit?: number, published?: boolean, upcoming?: boolean) => Promise<any>;
    /**
     * Get Governorate Statistics
     */
    getGovernorateStats: (governorateId: string) => Promise<any>;
}
//# sourceMappingURL=governorate.service.d.ts.map