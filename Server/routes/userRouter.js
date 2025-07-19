import { Router } from 'express';
import { userController } from '../controllers/userController.js';
import AuthMiddleware from '../middleware/AuthMiddleware.js';
import CheckRoleMiddleware from '../middleware/CheckRoleMiddleware.js';

const router = new Router();

// Маршруты для аутентификации
router.post('/registration', userController.registration);
router.post('/login', userController.login);
router.get('/auth', AuthMiddleware, userController.check);

// Маршруты для работы с пользователями
router.get('/', userController.getAll);
router.get('/:id', userController.getOne);
router.put('/:id', AuthMiddleware, userController.update);
router.delete('/:id', AuthMiddleware, CheckRoleMiddleware('ADMIN'), userController.delete);

export default router;