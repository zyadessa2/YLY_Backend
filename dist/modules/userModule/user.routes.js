"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// user.routes.ts
const express_1 = require("express");
const user_controller_js_1 = require("./user.controller.js");
const user_validation_js_1 = require("./user.validation.js");
const validation_middleware_js_1 = __importDefault(require("../../middleware/validation.middleware.js"));
const auth_middelware_js_1 = require("../../middleware/auth.middelware.js");
const router = (0, express_1.Router)();
const userController = new user_controller_js_1.UserController();
// All routes are admin-only
router.use((0, auth_middelware_js_1.authenticate)(), (0, auth_middelware_js_1.authorize)(['admin']));
// Statistics
router.get('/stats', userController.getUserStats);
// Governorate users
router.get('/governorate/:governorateId', userController.getUsersByGovernorate);
// CRUD operations
router.post('/', (0, validation_middleware_js_1.default)({ body: user_validation_js_1.createUserSchema }), userController.createUser);
router.get('/', userController.getAllUsers);
router.get('/:id', (0, validation_middleware_js_1.default)({ params: user_validation_js_1.userIdParamSchema }), userController.getUserById);
router.patch('/:id', (0, validation_middleware_js_1.default)({ params: user_validation_js_1.userIdParamSchema, body: user_validation_js_1.updateUserSchema }), userController.updateUser);
router.delete('/:id', (0, validation_middleware_js_1.default)({ params: user_validation_js_1.userIdParamSchema }), userController.deleteUser);
// User management
router.patch('/:id/toggle-status', (0, validation_middleware_js_1.default)({ params: user_validation_js_1.userIdParamSchema }), userController.toggleUserStatus);
router.patch('/:id/reset-password', (0, validation_middleware_js_1.default)({ params: user_validation_js_1.userIdParamSchema, body: user_validation_js_1.resetPasswordSchema }), userController.resetUserPassword);
router.patch('/:id/restore', (0, validation_middleware_js_1.default)({ params: user_validation_js_1.userIdParamSchema }), userController.restoreUser);
exports.default = router;
//# sourceMappingURL=user.routes.js.map