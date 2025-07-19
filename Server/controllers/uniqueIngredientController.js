import { UniqueIngredient } from '../models/models.js';
import { ApiError } from '../error/apiError.js';
import sequelize from '../db.js';


export class UniqueIngredientController {
    async create(req, res, next) {
        try {
            const { name } = req.body;
            
            if (!name || typeof name !== 'string' || name.trim() === '') {
                return next(ApiError.badRequest('Название ингредиента обязательно'));
            }
            const findIngredient = await UniqueIngredient.findOne({ 
                where: sequelize.where(
                    sequelize.fn('lower', sequelize.col('name')),
                    sequelize.fn('lower', name.trim())
                )
            });

            if (findIngredient) {
                return res.status(200).json({
                    message: 'Ингредиент уже существует',
                    ingredient: findIngredient
                });
            }

            const ingredient = await UniqueIngredient.create({ 
                name: name.trim(),
            });

            return res.status(201).json(ingredient);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }


    async delete(req, resp) {
        const { id } = req.params;
        const result = await UniqueIngredient.destroy({ where: { id } });
        return resp.json({ message: `Ингредиент ${id} удален` });
    }


    async getOne(req,resp){
        const { id } = req.params; 
        let ingredient = await UniqueIngredient.findOne({ where: { id }});
        return resp.json(ingredient);
    }


    async getAll(req,resp){
        let ingredients = await UniqueIngredient.findAll();
        return resp.json(ingredients);
    } 


    async update(req, resp, next) {
        try {
            const { id, name } = req.body;

            const ingredientToUpdate = await UniqueIngredient.findOne({ where: { id } });
            if (!ingredientToUpdate) {
                return next(ApiError.badRequest("Ингредиент не найден"));
            }

            ingredientToUpdate.name = name;

            await ingredientToUpdate.save();

            return resp.json(ingredientToUpdate);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }
}

export const uniqueIngredientController = new UniqueIngredientController();