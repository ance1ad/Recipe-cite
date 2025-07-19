import Router from 'express';
import { analyzeIngredients } from '../controllers/spoonacularController.js';

const router = new Router();

router.post('/analyze', analyzeIngredients);

export default router;
