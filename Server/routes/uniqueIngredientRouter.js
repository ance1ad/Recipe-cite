import { Router } from 'express';
import { uniqueIngredientController } from '../controllers/uniqueIngredientController.js'; 
const router = new Router();


router.post('/',uniqueIngredientController.create);
router.get('/:id', uniqueIngredientController.getOne);
router.get('/', uniqueIngredientController.getAll);
router.delete('/:id', uniqueIngredientController.delete);
router.put('/',uniqueIngredientController.update);


export default router;