import { Router } from 'express';
import { favouriteCategoryController } from '../controllers/favouriteCategoryController.js';
const router = new Router();


router.post('/',favouriteCategoryController.create);
router.get('/:id',favouriteCategoryController.getAll);
router.delete('/:id',favouriteCategoryController.delete);
router.put('/', favouriteCategoryController.update );



export default router;
