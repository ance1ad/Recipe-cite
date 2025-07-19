import { Router } from 'express';
import { CookingStepController } from '../controllers/cookingStepController.js';

const router = new Router();
const cookingStepController = new CookingStepController();

router.post('/', cookingStepController.create);
router.get('/:id', cookingStepController.getOne);
router.get('/', cookingStepController.getAll);
router.delete('/:id', cookingStepController.delete);
router.delete('/recipe/:recipeId', cookingStepController.deleteByRecipeId);

export default router;