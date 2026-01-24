// auth.routes.ts
import { Router } from 'express';
import { AuthController } from './auth.controller.js';
import { loginSchema, refreshTokenSchema } from './auth.validation.js';
import { authenticate } from '../../middleware/auth.middelware.js';
import { validation } from '../../middleware/validation.middleware.js';

const router = Router();
const authController = new AuthController();

// Public routes
router.post('/login', validation(loginSchema), authController.login);
router.post('/refresh', validation(refreshTokenSchema), authController.refreshToken);

// Protected routes - All authenticated users
router.post('/logout', authenticate(), authController.logout);

export default router;
