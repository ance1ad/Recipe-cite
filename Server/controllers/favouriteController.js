import { Recept } from '../models/models.js';
import { Favourite } from '../models/models.js';

export class FavouriteController {
    async create(req, resp) {
        const { favouriteCategoryId, userId, receptId } = req.body;

        // Проверка на наличие
        const existing = await Favourite.findOne({
            where: { favouriteCategoryId, receptId }
        });

        if (existing) {
            return resp.status(400).json({
                message: 'Этот рецепт уже добавлен в данный список.'
            });
        }

        const favourite = await Favourite.create({ favouriteCategoryId, userId, receptId });
        return resp.status(201).json(favourite);
    }


    // поменять список
    async update(req,resp){
        try {
            const { id, favouriteCategoryId} = req.body;

            const favouriteToUpdate = await Favourite.findOne({ where: { id } });
            if (!favouriteToUpdate) {
                return next(ApiError.badRequest("Избранное не найдено"));
            }

            favouriteToUpdate.favouriteCategoryId = favouriteCategoryId;
            await favouriteToUpdate.save();
            return resp.json(favouriteToUpdate);
        } catch (e) {
            // next(ApiError.badRequest(e.message));
            console.log(ошибка);
        }
    }


    async delete(req, resp) {
        const { id, receptId, favouriteCategoryId } = req.query;

        if (id) {
            await Favourite.destroy({ where: { id } });
            return resp.json({ message: `Избранное с id ${id} успешно удалено.` });
        }

        if (receptId) {
            await Favourite.destroy({ where: { receptId } });
            return resp.json({ message: `Избранное с receptId ${receptId} успешно удалено.` });
        }

        if (favouriteCategoryId) {
            await Favourite.destroy({ where: { favouriteCategoryId } });
            return resp.json({ message: `Избранное с favouriteCategoryId ${favouriteCategoryId} успешно удалено.` });
        }

        return resp.status(400).json({ message: 'Не передан id или receptId для удаления.' });
    }

    async getAll(req,resp){
        const { id } = req.params;
        const  categories = await Favourite.findAll({ where: { userId: id }, include: [Recept] }  );
        return resp.json(categories);
    }
}

export const favouriteController = new FavouriteController();