import { Router } from 'express';
import { tagsController } from '../controllers/tagsController.js'; 

const router = new Router();


router.post('/',tagsController.create);
router.get('/:name', tagsController.getOne);
router.get('/', tagsController.getAll);
router.delete('/',tagsController.delete);



export default router;
