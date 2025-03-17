import { Router } from 'express';
import { UserController } from './user.controller';
import { authenticate, authorize } from '../../middlewares/auth.middleware';
import { Role } from '../../types';

const router = Router();
const userController = new UserController();

router.get('/', userController.getAllUsers);

// Protected routes
router.use(authenticate);
router.get('/me', userController.getProfile);
router.get('/:id', authorize(Role.ADMIN, Role.EMPLOYEE), userController.getUserById);
router.patch('/:id/role', authorize(Role.ADMIN), userController.updateUserRole);
router.patch('/:id/status', authorize(Role.ADMIN), userController.updateUserStatus);

export default router;
