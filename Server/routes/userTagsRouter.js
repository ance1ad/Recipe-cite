import { Router } from 'express';
import { userTagsController } from '../controllers/userTagsController.js'; 

const router = new Router();


router.post('/',userTagsController.create);
router.get('/', userTagsController.getAll); 
router.delete('/',userTagsController.delete);


export default router;
