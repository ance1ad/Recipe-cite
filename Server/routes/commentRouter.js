import { Router } from 'express';
import { CommentController } from '../controllers/commentController.js';

const router = new Router();
const comment = new CommentController();


router.post('/', comment.create);
router.get('/:receptId', comment.getAll);
router.put('/', comment.update);
router.delete('/', comment.delete);


export default router;