import {Ingredient} from '../models/models.js';
import { ApiError } from '../error/apiError.js';


export class IngredientController {
    async create(req,resp,next){
        try{
            const {name, brand, calories, protein, fat, carbs, receptId, unit, baseAmount, selectedAmount} = req.body;    
            console.log(req.body);        
            const ingredient = await Ingredient.create({name, brand, calories, fat, carbs, protein, receptId, unit, baseAmount, selectedAmount});
            return resp.json(ingredient);
        }
        catch(e){
            next(ApiError.badRequest(e.message));
        }
    }


    async delete(req, resp) {
        const { id } = req.params;
        const result = await Ingredient.destroy({ where: { receptId: id } });
        return resp.json({ message: `Ингредиент ${id} удален, ${result}` });
    }


    async getOne(req,resp){
        const { id } = req.params; 
        let ingredient = await Ingredient.findOne({ where: { id }});
        return resp.json(ingredient);
    }

    async getAll(req,resp){
        const { id } = req.query; 
        let ingredient = await Ingredient.findAll({ where: { receptId:id }});
        return resp.json(ingredient);
    }   


    async update(req, resp, next) {
        try {
            const { id, name, selectedAmount } = req.body;

            const ingredientToUpdate = await Ingredient.findOne({ where: { id } });
            if (!ingredientToUpdate) {
                return next(ApiError.badRequest("Ингредиент не найден"));
            }
            ingredientToUpdate.selectedAmount  = selectedAmount;
            ingredientToUpdate.name             = name;

            await ingredientToUpdate.save();

            return resp.json(ingredientToUpdate);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

}

export const ingredientController = new IngredientController();