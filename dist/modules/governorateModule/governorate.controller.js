import { GovernorateService } from "./governorate.service";
import { successResponse } from "../../utils/response/success.response";
export class GovernorateController {
    constructor() {
        this.governorateService = new GovernorateService();
        /**
         * Create Governorate (Admin only)
         * POST /api/governorates
         */
        this.createGovernorate = async (req, res, next) => {
            try {
                const governorateData = req.body;
                const result = await this.governorateService.createGovernorate(governorateData);
                successResponse({
                    res,
                    message: "Governorate created successfully",
                    data: result,
                    statusCode: 201
                });
            }
            catch (error) {
                next(error);
            }
        };
        /**
         * Get All Governorates with pagination
         * GET /api/governorates?page=1&limit=10&search=keyword
         */
        this.getAllGovernorates = async (req, res, next) => {
            try {
                const query = req.query;
                const result = await this.governorateService.getAllGovernorates(query);
                successResponse({
                    res,
                    message: "Governorates retrieved successfully",
                    data: result
                });
            }
            catch (error) {
                next(error);
            }
        };
        /**
         * Get All Governorates (No pagination) - for dropdowns
         * GET /api/governorates/all
         */
        this.getAllGovernoratesNoPagination = async (req, res, next) => {
            try {
                const result = await this.governorateService.getAllGovernoratesNoPagination();
                successResponse({
                    res,
                    message: "Governorates retrieved successfully",
                    data: result
                });
            }
            catch (error) {
                next(error);
            }
        };
        /**
         * Get Governorate by ID
         * GET /api/governorates/:id
         */
        this.getGovernorateById = async (req, res, next) => {
            try {
                const governorateId = req.params.id;
                if (!governorateId)
                    throw Error("Governorate ID is required");
                const result = await this.governorateService.getGovernorateById(governorateId);
                successResponse({
                    res,
                    message: "Governorate retrieved successfully",
                    data: result
                });
            }
            catch (error) {
                next(error);
            }
        };
        /**
         * Get Governorate by Slug
         * GET /api/governorates/slug/:slug
         */
        this.getGovernorateBySlug = async (req, res, next) => {
            try {
                const slug = req.params.slug;
                if (!slug)
                    throw Error("Slug is required");
                const result = await this.governorateService.getGovernorateBySlug(slug);
                successResponse({
                    res,
                    message: "Governorate retrieved successfully",
                    data: result
                });
            }
            catch (error) {
                next(error);
            }
        };
        /**
         * Get Governorate Details
         * GET /api/governorates/:id/details
         */
        this.getGovernorateDetails = async (req, res, next) => {
            try {
                const governorateId = req.params.id;
                if (!governorateId)
                    throw Error("Governorate ID is required");
                const result = await this.governorateService.getGovernorateDetails(governorateId);
                successResponse({
                    res,
                    message: "Governorate details retrieved successfully",
                    data: result
                });
            }
            catch (error) {
                next(error);
            }
        };
        /**
         * Update Governorate (Admin only)
         * PATCH /api/governorates/:id
         */
        this.updateGovernorate = async (req, res, next) => {
            try {
                const governorateId = req.params.id;
                const updateData = req.body;
                if (!governorateId)
                    throw Error("Governorate ID is required");
                const result = await this.governorateService.updateGovernorate(governorateId, updateData);
                successResponse({
                    res,
                    message: "Governorate updated successfully",
                    data: result
                });
            }
            catch (error) {
                next(error);
            }
        };
        /**
         * Delete Governorate (Admin only)
         * DELETE /api/governorates/:id
         */
        this.deleteGovernorate = async (req, res, next) => {
            try {
                const governorateId = req.params.id;
                if (!governorateId)
                    throw Error("Governorate ID is required");
                await this.governorateService.deleteGovernorate(governorateId);
                successResponse({
                    res,
                    message: "Governorate deleted successfully",
                    data: null
                });
            }
            catch (error) {
                next(error);
            }
        };
        /**
         * Get Governorates with Statistics
         * GET /api/governorates/stats/all
         */
        this.getGovernoratesWithStats = async (req, res, next) => {
            try {
                const result = await this.governorateService.getGovernoratesWithStats();
                successResponse({
                    res,
                    message: "Governorates statistics retrieved successfully",
                    data: result
                });
            }
            catch (error) {
                next(error);
            }
        };
        /**
         * Get Governorate News
         * GET /api/governorates/:id/news?page=1&limit=10&published=true
         */
        this.getGovernorateNews = async (req, res, next) => {
            try {
                const governorateId = req.params.id;
                if (!governorateId)
                    throw Error("Governorate ID is required");
                const page = parseInt(req.query.page) || 1;
                const limit = parseInt(req.query.limit) || 10;
                const published = req.query.published === 'true' ? true :
                    req.query.published === 'false' ? false : undefined;
                const result = await this.governorateService.getGovernorateNews(governorateId, page, limit, published);
                successResponse({
                    res,
                    message: "Governorate news retrieved successfully",
                    data: result
                });
            }
            catch (error) {
                next(error);
            }
        };
        /**
         * Get Governorate Events
         * GET /api/governorates/:id/events?page=1&limit=10&published=true&upcoming=true
         */
        this.getGovernorateEvents = async (req, res, next) => {
            try {
                const governorateId = req.params.id;
                if (!governorateId)
                    throw Error("Governorate ID is required");
                const page = parseInt(req.query.page) || 1;
                const limit = parseInt(req.query.limit) || 10;
                const published = req.query.published === 'true' ? true :
                    req.query.published === 'false' ? false : undefined;
                const upcoming = req.query.upcoming === 'true';
                const result = await this.governorateService.getGovernorateEvents(governorateId, page, limit, published, upcoming);
                successResponse({
                    res,
                    message: "Governorate events retrieved successfully",
                    data: result
                });
            }
            catch (error) {
                next(error);
            }
        };
        /**
         * Get Governorate Statistics
         * GET /api/governorates/:id/stats
         */
        this.getGovernorateStats = async (req, res, next) => {
            try {
                const governorateId = req.params.id;
                if (!governorateId)
                    throw Error("Governorate ID is required");
                const result = await this.governorateService.getGovernorateStats(governorateId);
                successResponse({
                    res,
                    message: "Governorate statistics retrieved successfully",
                    data: result
                });
            }
            catch (error) {
                next(error);
            }
        };
    }
}
//# sourceMappingURL=governorate.controller.js.map