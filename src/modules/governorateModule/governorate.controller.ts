import { Request, Response, NextFunction } from 'express';
import { GovernorateService } from './governorate.service.js';
import { successResponse } from '../../utils/response/success.response.js';
import { 
    createGovernorateDTO, 
    updateGovernorateDTO, 
    getGovernoratesQueryDTO 
} from './governorate.DTO.js';

export class GovernorateController {
    private governorateService = new GovernorateService();

    /**
     * Create Governorate (Admin only)
     * POST /api/governorates
     */
    createGovernorate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const governorateData: createGovernorateDTO = req.body;

            const result = await this.governorateService.createGovernorate(governorateData);

            successResponse({
                res,
                message: "Governorate created successfully",
                data: result,
                statusCode: 201
            });
        } catch (error) {
            next(error);
        }
    };

    /**
     * Get All Governorates with pagination
     * GET /api/governorates?page=1&limit=10&search=keyword
     */
    getAllGovernorates = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const query = req.query as unknown as getGovernoratesQueryDTO;

            const result = await this.governorateService.getAllGovernorates(query);

            successResponse({
                res,
                message: "Governorates retrieved successfully",
                data: result
            });
        } catch (error) {
            next(error);
        }
    };

    /**
     * Get All Governorates (No pagination) - for dropdowns
     * GET /api/governorates/all
     */
    getAllGovernoratesNoPagination = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const result = await this.governorateService.getAllGovernoratesNoPagination();

            successResponse({
                res,
                message: "Governorates retrieved successfully",
                data: result
            });
        } catch (error) {
            next(error);
        }
    };

    /**
     * Get Governorate by ID
     * GET /api/governorates/:id
     */
    getGovernorateById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const governorateId = req.params.id;
            if (!governorateId) throw Error("Governorate ID is required");

            const result = await this.governorateService.getGovernorateById(governorateId);

            successResponse({
                res,
                message: "Governorate retrieved successfully",
                data: result
            });
        } catch (error) {
            next(error);
        }
    };

    /**
     * Get Governorate by Slug
     * GET /api/governorates/slug/:slug
     */
    getGovernorateBySlug = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const slug = req.params.slug;
            if (!slug) throw Error("Slug is required");

            const result = await this.governorateService.getGovernorateBySlug(slug);

            successResponse({
                res,
                message: "Governorate retrieved successfully",
                data: result
            });
        } catch (error) {
            next(error);
        }
    };

    /**
     * Get Governorate Details
     * GET /api/governorates/:id/details
     */
    getGovernorateDetails = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const governorateId = req.params.id;
            if (!governorateId) throw Error("Governorate ID is required");

            const result = await this.governorateService.getGovernorateDetails(governorateId);

            successResponse({
                res,
                message: "Governorate details retrieved successfully",
                data: result
            });
        } catch (error) {
            next(error);
        }
    };

    /**
     * Update Governorate (Admin only)
     * PATCH /api/governorates/:id
     */
    updateGovernorate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const governorateId = req.params.id;
            const updateData: updateGovernorateDTO = req.body;
            if (!governorateId) throw Error("Governorate ID is required");

            const result = await this.governorateService.updateGovernorate(governorateId, updateData);

            successResponse({
                res,
                message: "Governorate updated successfully",
                data: result
            });
        } catch (error) {
            next(error);
        }
    };

    /**
     * Delete Governorate (Admin only)
     * DELETE /api/governorates/:id
     */
    deleteGovernorate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const governorateId = req.params.id;
            if (!governorateId) throw Error("Governorate ID is required");

            await this.governorateService.deleteGovernorate(governorateId);

            successResponse({
                res,
                message: "Governorate deleted successfully",
                data: null
            });
        } catch (error) {
            next(error);
        }
    };

    /**
     * Get Governorates with Statistics
     * GET /api/governorates/stats/all
     */
    getGovernoratesWithStats = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const result = await this.governorateService.getGovernoratesWithStats();

            successResponse({
                res,
                message: "Governorates statistics retrieved successfully",
                data: result
            });
        } catch (error) {
            next(error);
        }
    };

    /**
     * Get Governorate News
     * GET /api/governorates/:id/news?page=1&limit=10&published=true
     */
    getGovernorateNews = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const governorateId = req.params.id;
            if (!governorateId) throw Error("Governorate ID is required");
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const published = req.query.published === 'true' ? true : 
                             req.query.published === 'false' ? false : undefined;

            const result = await this.governorateService.getGovernorateNews(
                governorateId, 
                page, 
                limit,
                published
            );

            successResponse({
                res,
                message: "Governorate news retrieved successfully",
                data: result
            });
        } catch (error) {
            next(error);
        }
    };

    /**
     * Get Governorate Events
     * GET /api/governorates/:id/events?page=1&limit=10&published=true&upcoming=true
     */
    getGovernorateEvents = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const governorateId = req.params.id;
            if (!governorateId) throw Error("Governorate ID is required");
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const published = req.query.published === 'true' ? true : 
                             req.query.published === 'false' ? false : undefined;
            const upcoming = req.query.upcoming === 'true';

            const result = await this.governorateService.getGovernorateEvents(
                governorateId, 
                page, 
                limit,
                published,
                upcoming
            );

            successResponse({
                res,
                message: "Governorate events retrieved successfully",
                data: result
            });
        } catch (error) {
            next(error);
        }
    };

    /**
     * Get Governorate Statistics
     * GET /api/governorates/:id/stats
     */
    getGovernorateStats = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const governorateId = req.params.id;
            if (!governorateId) throw Error("Governorate ID is required");

            const result = await this.governorateService.getGovernorateStats(governorateId);

            successResponse({
                res,
                message: "Governorate statistics retrieved successfully",
                data: result
            });
        } catch (error) {
            next(error);
        }
    };
}
