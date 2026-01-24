"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const governorate_controller_js_1 = require("./governorate.controller.js");
const governorate_validation_js_1 = require("./governorate.validation.js");
const validation_middleware_js_1 = __importDefault(require("../../middleware/validation.middleware.js"));
const auth_middelware_js_1 = require("../../middleware/auth.middelware.js");
const router = (0, express_1.Router)();
const governorateController = new governorate_controller_js_1.GovernorateController();
// Public routes
router.get('/all', governorateController.getAllGovernoratesNoPagination);
router.get('/slug/:slug', (0, validation_middleware_js_1.default)({ params: governorate_validation_js_1.governorateSlugParamSchema }), governorateController.getGovernorateBySlug);
// Governorate content (public)
router.get('/:id/news', (0, validation_middleware_js_1.default)({ params: governorate_validation_js_1.governorateIdParamSchema }), governorateController.getGovernorateNews);
router.get('/:id/events', (0, validation_middleware_js_1.default)({ params: governorate_validation_js_1.governorateIdParamSchema }), governorateController.getGovernorateEvents);
router.get('/:id/stats', (0, validation_middleware_js_1.default)({ params: governorate_validation_js_1.governorateIdParamSchema }), governorateController.getGovernorateStats);
// Statistics (Admin only)
router.get('/stats/all', (0, auth_middelware_js_1.authenticate)(), (0, auth_middelware_js_1.authorize)(['admin']), governorateController.getGovernoratesWithStats);
// CRUD operations (Admin only)
router.post('/', (0, auth_middelware_js_1.authenticate)(), (0, auth_middelware_js_1.authorize)(['admin']), (0, validation_middleware_js_1.default)({ body: governorate_validation_js_1.createGovernorateSchema }), governorateController.createGovernorate);
router.get('/', (0, validation_middleware_js_1.default)({ query: governorate_validation_js_1.getGovernoratesQuerySchema }), governorateController.getAllGovernorates);
router.get('/:id', (0, validation_middleware_js_1.default)({ params: governorate_validation_js_1.governorateIdParamSchema }), governorateController.getGovernorateById);
router.get('/:id/details', (0, validation_middleware_js_1.default)({ params: governorate_validation_js_1.governorateIdParamSchema }), governorateController.getGovernorateDetails);
router.patch('/:id', (0, auth_middelware_js_1.authenticate)(), (0, auth_middelware_js_1.authorize)(['admin']), (0, validation_middleware_js_1.default)({ params: governorate_validation_js_1.governorateIdParamSchema, body: governorate_validation_js_1.updateGovernorateSchema }), governorateController.updateGovernorate);
router.delete('/:id', (0, auth_middelware_js_1.authenticate)(), (0, auth_middelware_js_1.authorize)(['admin']), (0, validation_middleware_js_1.default)({ params: governorate_validation_js_1.governorateIdParamSchema }), governorateController.deleteGovernorate);
exports.default = router;
//# sourceMappingURL=governorate.routes.js.map