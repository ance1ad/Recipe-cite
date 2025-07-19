import { Router } from 'express';
import { ingredientController } from '../controllers/ingredientController.js'; 
const router = new Router();


router.post('/',ingredientController.create);
router.get('/:id', ingredientController.getOne);
router.get('/', ingredientController.getAll);
router.delete('/:id', ingredientController.delete);
router.put('/',ingredientController.update);




export default router;