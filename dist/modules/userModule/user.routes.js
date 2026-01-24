// user.routes.ts
import { Router } from 'express';
import { UserController } from './user.controller';
import { createUserSchema, updateUserSchema, userIdParamSchema, resetPasswordSchema } from './user.validation';
import validation from '../../middleware/validation.middleware';
import { authenticate, authorize } from '../../middleware/auth.middelware';
const router = Router();
const userController = new UserController();
// All routes are admin-only
router.use(authenticate(), authorize(['admin']));
// Statistics
router.get('/stats', userController.getUserStats);
// Governorate users
router.get('/governorate/:governorateId', userController.getUsersByGovernorate);
// CRUD operations
router.post('/', validation({ body: createUserSchema }), userController.createUser);
router.get('/', userController.getAllUsers);
router.get('/:id', validation({ params: userIdParamSchema }), userController.getUserById);
router.patch('/:id', validation({ params: userIdParamSchema, body: updateUserSchema }), userController.updateUser);
router.delete('/:id', validation({ params: userIdParamSchema }), userController.deleteUser);
// User management
router.patch('/:id/toggle-status', validation({ params: userIdParamSchema }), userController.toggleUserStatus);
router.patch('/:id/reset-password', validation({ params: userIdParamSchema, body: resetPasswordSchema }), userController.resetUserPassword);
router.patch('/:id/restore', validation({ params: userIdParamSchema }), userController.restoreUser);
export default router;
//# sourceMappingURL=user.routes.js.map