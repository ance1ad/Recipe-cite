import { Router } from 'express';
import { favouriteController } from '../controllers/favouriteController.js';
const router = new Router();


router.post('/',favouriteController.create);
router.get('/:id',favouriteController.getAll);
router.delete('/',favouriteController.delete);
router.put('/', favouriteController.update);



export default router;
