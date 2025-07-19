import { Router } from 'express';
import { receptController } from '../controllers/receptController.js'; 
const router = new Router();


router.post('/',receptController.create);
router.get('/:id', receptController.getOne);
router.get('/', receptController.getAll);
router.put('/:id',receptController.update);
router.delete('/:id',receptController.delete);


export default router;
