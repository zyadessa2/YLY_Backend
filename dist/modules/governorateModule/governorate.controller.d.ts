import { Request, Response, NextFunction } from 'express';
export declare class GovernorateController {
    private governorateService;
    /**
     * Create Governorate (Admin only)
     * POST /api/governorates
     */
    createGovernorate: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * Get All Governorates with pagination
     * GET /api/governorates?page=1&limit=10&search=keyword
     */
    getAllGovernorates: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * Get All Governorates (No pagination) - for dropdowns
     * GET /api/governorates/all
     */
    getAllGovernoratesNoPagination: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * Get Governorate by ID
     * GET /api/governorates/:id
     */
    getGovernorateById: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * Get Governorate by Slug
     * GET /api/governorates/slug/:slug
     */
    getGovernorateBySlug: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * Get Governorate Details
     * GET /api/governorates/:id/details
     */
    getGovernorateDetails: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * Update Governorate (Admin only)
     * PATCH /api/governorates/:id
     */
    updateGovernorate: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * Delete Governorate (Admin only)
     * DELETE /api/governorates/:id
     */
    deleteGovernorate: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * Get Governorates with Statistics
     * GET /api/governorates/stats/all
     */
    getGovernoratesWithStats: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * Get Governorate News
     * GET /api/governorates/:id/news?page=1&limit=10&published=true
     */
    getGovernorateNews: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * Get Governorate Events
     * GET /api/governorates/:id/events?page=1&limit=10&published=true&upcoming=true
     */
    getGovernorateEvents: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * Get Governorate Statistics
     * GET /api/governorates/:id/stats
     */
    getGovernorateStats: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
//# sourceMappingURL=governorate.controller.d.ts.map