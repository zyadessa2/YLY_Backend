import { IGovernorate } from "../models/governorate.model";
import { DBRepo } from "./DBRepo";
export declare class GovernorateRepo extends DBRepo<IGovernorate> {
    constructor();
    /**
     * Find governorate by slug
     */
    findBySlug(slug: string): Promise<any>;
    /**
     * Find governorate by name
     */
    findByName(name: string): Promise<any>;
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