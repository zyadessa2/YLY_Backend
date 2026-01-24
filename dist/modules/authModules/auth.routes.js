"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// auth.routes.ts
const express_1 = require("express");
const auth_controller_js_1 = require("./auth.controller.js");
const auth_validation_js_1 = require("./auth.validation.js");
const auth_middelware_js_1 = require("../../middleware/auth.middelware.js");
const validation_middleware_js_1 = require("../../middleware/validation.middleware.js");
const router = (0, express_1.Router)();
const authController = new auth_controller_js_1.AuthController();
// Public routes
router.post('/login', (0, validation_middleware_js_1.validation)(auth_validation_js_1.loginSchema), authController.login);
router.post('/refresh', (0, validation_middleware_js_1.validation)(auth_validation_js_1.refreshTokenSchema), authController.refreshToken);
// Protected routes - All authenticated users
router.post('/logout', (0, auth_middelware_js_1.authenticate)(), authController.logout);
exports.default = router;
//# sourceMappingURL=auth.routes.js.map