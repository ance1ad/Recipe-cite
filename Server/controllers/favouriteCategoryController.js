import { Recept } from '../models/models.js';
import { Favourite } from '../models/models.js';
import { FavouriteCategory } from '../models/models.js';



export class FavouriteCategoryController {
    async create(req,resp){
        const { name, userId } = req.body;

        const existing = await FavouriteCategory.findOne({ where: { name, userId } });
        if (existing) {
            return resp.status(400).json({ message: 'Такой список уже существует' });
        }

        const favourite = await FavouriteCategory.create({  userId, name });
        return resp.json(favourite);

    }


    async update(req,resp){
        try {
            const { id, name } = req.body;

            const favouriteToUpdate = await FavouriteCategory.findOne({ where: { id } });
            if (!favouriteToUpdate) {
                return next(ApiError.badRequest("Список избранного не найден"));
            }

            favouriteToUpdate.name = name;
            await favouriteToUpdate.save();
            return resp.json(favouriteToUpdate);
        } catch (e) {
            // next(ApiError.badRequest(e.message));
            console.log("ошибка");
        }
    }


    async delete(req, resp) {
            const { id } = req.params;

            const result = await FavouriteCategory.destroy({ where: { id } });

            if (!result) {
                return resp.status(404).json({ message: `Элемент с id ${id} не найден в категориях избранного.` });
            }

            return resp.json({ message: `Категория избранного с id ${id} успешно удалено.` });
    }


    async getAll(req,resp){
        const { id } = req.params;
        const  categories = await FavouriteCategory.findAll({ where: { userId: id } } );
        return resp.json(categories);

    }
}

export const favouriteCategoryController = new FavouriteCategoryController();