import { Router } from 'express';
import { nationalityController } from '../controllers/nationalityController.js';
const router = new Router();
import CheckRoleMiddleware from '../middleware/CheckRoleMiddleware.js';


router.post('/',CheckRoleMiddleware('ADMIN'), nationalityController.create);
router.delete('/',CheckRoleMiddleware('ADMIN'), nationalityController.delete);
router.get('/',nationalityController.getAll);
router.put('/', nationalityController.update );

export default router;
