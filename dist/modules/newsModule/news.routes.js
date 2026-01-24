"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const news_controller_js_1 = require("./news.controller.js");
const news_validation_js_1 = require("./news.validation.js");
const validation_middleware_js_1 = __importDefault(require("../../middleware/validation.middleware.js"));
const auth_middelware_js_1 = require("../../middleware/auth.middelware.js");
const router = (0, express_1.Router)();
const newsController = new news_controller_js_1.NewsController();
// Public routes
router.get('/slug/:slug', newsController.getNewsBySlug);
router.get('/featured', newsController.getFeaturedNews);
router.patch('/:id/view', (0, validation_middleware_js_1.default)({ params: news_validation_js_1.newsIdParamSchema }), newsController.incrementViewCount);
// Statistics (Admin only)
router.get('/stats', (0, auth_middelware_js_1.authenticate)(), (0, auth_middelware_js_1.authorize)(['admin']), newsController.getNewsStats);
// Related news
router.get('/:id/related', (0, validation_middleware_js_1.default)({ params: news_validation_js_1.newsIdParamSchema }), newsController.getRelatedNews);
// CRUD operations
router.post('/', (0, auth_middelware_js_1.authenticate)(), (0, auth_middelware_js_1.authorize)(['admin', 'governorate_user']), (0, validation_middleware_js_1.default)({ body: news_validation_js_1.createNewsSchema }), newsController.createNews);
router.get('/', (0, auth_middelware_js_1.optionalAuthenticate)(), // Can be accessed with or without auth
(0, validation_middleware_js_1.default)({ query: news_validation_js_1.getNewsQuerySchema }), newsController.getAllNews);
router.get('/:id', (0, validation_middleware_js_1.default)({ params: news_validation_js_1.newsIdParamSchema }), newsController.getNewsById);
router.patch('/:id', (0, auth_middelware_js_1.authenticate)(), (0, auth_middelware_js_1.authorize)(['admin', 'governorate_user']), (0, validation_middleware_js_1.default)({ params: news_validation_js_1.newsIdParamSchema, body: news_validation_js_1.updateNewsSchema }), newsController.updateNews);
router.delete('/:id', (0, auth_middelware_js_1.authenticate)(), (0, auth_middelware_js_1.authorize)(['admin', 'governorate_user']), (0, validation_middleware_js_1.default)({ params: news_validation_js_1.newsIdParamSchema }), newsController.deleteNews);
// Admin-only operations
router.patch('/:id/toggle-featured', (0, auth_middelware_js_1.authenticate)(), (0, auth_middelware_js_1.authorize)(['admin']), (0, validation_middleware_js_1.default)({ params: news_validation_js_1.newsIdParamSchema }), newsController.toggleFeatured);
router.patch('/:id/toggle-published', (0, auth_middelware_js_1.authenticate)(), (0, auth_middelware_js_1.authorize)(['admin']), (0, validation_middleware_js_1.default)({ params: news_validation_js_1.newsIdParamSchema }), newsController.togglePublished);
exports.default = router;
//# sourceMappingURL=news.routes.js.map