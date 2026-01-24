// auth.routes.ts
import { Router } from 'express';
import { AuthController } from './auth.controller';
import { loginSchema, refreshTokenSchema } from './auth.validation';
import { authenticate } from '../../middleware/auth.middelware';
import { validation } from '../../middleware/validation.middleware';
const router = Router();
const authController = new AuthController();
// Public routes
router.post('/login', validation(loginSchema), authController.login);
router.post('/refresh', validation(refreshTokenSchema), authController.refreshToken);
// Protected routes - All authenticated users
router.post('/logout', authenticate(), authController.logout);
export default router;
//# sourceMappingURL=auth.routes.js.map