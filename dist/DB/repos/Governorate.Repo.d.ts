import { IGovernorate } from '../models/governorate.model.js';
import { DBRepo } from './DBRepo.js';
export declare class GovernorateRepo extends DBRepo<IGovernorate> {
    constructor();
    /**
     * Find governorate by slug
     */
    findBySlug(slug: string): Promise<(import("mongoose").Document<unknown, {}, IGovernorate, {}, {}> & IGovernorate & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }) | (import("mongoose").Document<unknown, {}, import("mongoose").FlattenMaps<IGovernorate>, {}, {}> & import("mongoose").FlattenMaps<IGovernorate> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }) | null>;
    /**
     * Find governorate by name
     */
    findByName(name: string): Promise<(import("mongoose").Document<unknown, {}, IGovernorate, {}, {}> & IGovernorate & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }) | (import("mongoose").Document<unknown, {}, import("mongoose").FlattenMaps<IGovernorate>, {}, {}> & import("mongoose").FlattenMaps<IGovernorate> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }) | null>;
    /**
     * Get governorates with statistics
     */
    getGovernoratesWithStats(): Promise<any[]>;
    /**
     * Check if slug exists
     */
    slugExists(slug: string, excludeId?: string): Promise<boolean>;
    /**
     * Check if name exists
     */
    nameExists(name: string, excludeId?: string): Promise<boolean>;
}
//# sourceMappingURL=Governorate.Repo.d.ts.map