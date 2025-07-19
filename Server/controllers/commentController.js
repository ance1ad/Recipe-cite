import { Comment, User } from '../models/models.js';
import { ApiError } from '../error/apiError.js';


export class CommentController {

    async create(req,resp, next){
        const { text, grade, userId, receptId } = req.body;
        try{
            const comment = await Comment.create({text, grade, userId, receptId});

            const created = await Comment.findOne({
                where: { id: comment.id },
                include: [{ model: User }]
            });
            resp.json(created);
        }
        catch(e){
            next(ApiError.badRequest(e.message));
        }
    }

    async getAll(req,resp){
        const { receptId } = req.params;
        const comment = await Comment.findAll({ 
            where: { receptId },
            include: [
                { model: User },
            ]
        
        
        } );
        return resp.json(comment);
    }

    async update(req, resp, next) {
        try {
            const { id, text, grade } = req.body;

            const commentToUpdate = await Comment.findOne({ where: { id } });
            if (!commentToUpdate) {
                return next(ApiError.badRequest("Комментарий не найден"));
            }

            commentToUpdate.text = text;
            commentToUpdate.grade = grade;

            await commentToUpdate.save();

            const updated = await Comment.findOne({
                where: { id },
                include: [{ model: User }]
            });
            return updated;
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }



    async delete(req, resp) {
        try {
            const { id } = req.query;
    
            // Находим национальность по имени или другому параметру
            const commentToDelete = await Comment.findOne({ where: { id } });
    
            if (!commentToDelete) {
                return resp.status(404).json({ message: 'Комментарий не найдена' });
            }
    
            await commentToDelete.destroy();
    
            return resp.status(200).json({ message: 'Комментарий успешно удален' });
        } catch (error) {
            console.error(error);
            return resp.status(500).json({ message: 'Ошибка при удалении комментария' });
        }
    }
}

export const commentController = new CommentController();