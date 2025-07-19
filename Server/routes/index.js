import { Router } from 'express';


import commentRouter     from './commentRouter.js';
import cookingStepRouter from './cookingStepRouter.js';
// import equipmentRouter   from './equipmentRouter.js';
import favouriteCategoryRouter   from './favouriteCategoryRouter.js';
import favouriteRouter   from './favouriteRouter.js';
import ingredientRouter  from './ingredientRouter.js';
import nationalityRouter from './nationalityRouter.js';
import receptRouter      from './receptRouter.js';
import tagsRouter        from './tagsRouter.js';
import userRouter        from './userRouter.js';
import fatsecretAuth from './fatsecret-auth.js'
import fatsecretRouter from './fatsecretSearch.js'
import uniqueIngredientRouter from './uniqueIngredientRouter.js'
import userTagsRouter from './userTagsRouter.js'

export const router = Router();

router.use('/comment',      commentRouter);
router.use('/cookingStep',  cookingStepRouter);
router.use('/favouriteCategory',    favouriteCategoryRouter);
router.use('/favourite',    favouriteRouter);
router.use('/ingredient',   ingredientRouter);
router.use('/uniqueIngredient',   uniqueIngredientRouter);
router.use('/nationality',  nationalityRouter);
router.use('/recept',       receptRouter);
router.use('/tags',         tagsRouter);
router.use('/user',         userRouter);
router.use('/userTags',     userTagsRouter);
// API
router.use('/fatsecret/auth',fatsecretAuth);
router.use('/fatsecret',fatsecretRouter);




