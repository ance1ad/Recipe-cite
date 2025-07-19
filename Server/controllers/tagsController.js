import {Tags, RecipeTags, UserTags} from '../models/models.js';
import { ApiError } from '../error/apiError.js';
import { Op } from 'sequelize'; 


export class TagsController {

    async create(req,resp,next){
        try{
            const { name, receptId, tagId } = req.body;    
            console.log(req.body);  

            if(name){
                const tagExist = await Tags.findOne({where: {name}});
                if(tagExist){
                    return resp.json(`Тег ${name} уже создан`);
                }
                const tags = await Tags.create({name});
                return resp.json(tags);
            }  
            if(receptId && tagId) {
                const tags = await RecipeTags.create({receptId, tagId});
                return resp.json(tags);
            }   
            
            return resp.json("Ошибка в создании тега");
        }
        catch(e){
            next(ApiError.badRequest(e.message));
        }
    }


    async getOne(req, resp) {
        const { name } = req.params;
        
        if (!name) {
            return resp.status(400).json({ message: 'Параметр name обязателен' });
        }

        const tags = await Tags.findAll({ 
            where: { 
                name: { 
                    [Op.iLike]: `%${name}%`
                } 
            } 
        });
        
        return resp.json(tags);
    }

    async getAll(req, resp) {
        const { receptId } = req.query;

        if (!receptId) {
            return resp.status(400).json({ message: 'Параметр receptId обязателен' });
        }

        const tags = await RecipeTags.findAll({
            where: { receptId },
            include: [
                {
                    model: Tags,
                    attributes: ['id', 'name'] // получаем только нужные поля
                }
            ]
        });

        return resp.json(tags);
    }


    async delete(req, resp) {

        const { id, tagId, receptId } = req.query;

        if (id) {
            await RecipeTags.destroy({ where: { tagId: id } });
            await UserTags.destroy({ where: { tagId: id } });
            await Tags.destroy({ where: { id } });

            return resp.json({ message: `Удален уникальный тег с id ${id}.` });
        }

        if (receptId) {
            await RecipeTags.destroy({ where: { receptId: receptId } });
            return resp.json({ message: 'Удалён рецепт, соответствующие теги удалены' });
        }

        if (tagId) {
            await RecipeTags.destroy({ where: { tagId } });
            return resp.json({ message: 'У рецепта убран тег' });
        }
        return resp.status(400).json({ message: 'Неправильно переданы параметры' });
    }
}

export const tagsController = new TagsController();