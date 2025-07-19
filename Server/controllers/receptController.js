import { UUIDV4 } from 'sequelize';

import { Recept } from '../models/models.js';
import { CookingStep } from '../models/models.js';
import { Tags } from '../models/models.js';
import { Ingredient, RecipeTags } from '../models/models.js';
import { v4 as uuidv4 } from 'uuid'; // генерация id
import { ApiError } from '../error/apiError.js';
import path from 'path';
import { fileURLToPath } from 'url';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class ReceptController {
    async create(req, resp, next) {
        try {
            const { title, description, cookingTime, userId, nationalityId, equipmentIds, tagsId, ingredientsId } = req.body;
            const { image } = req.files;

            let fileName = uuidv4() + ".jpg" // генерация названия изображения
            image.mv(path.resolve(__dirname, '..', 'static/img', fileName)); // перенос файла в папку
            const recept = await Recept.create({ image: fileName, title, description, cookingTime, userId, nationalityId });

            if (equipmentIds) {
                let parsedEquipmentIds;
                try {
                    parsedEquipmentIds = typeof equipmentIds === "string" ? JSON.parse(equipmentIds) : equipmentIds;
                } catch (error) {
                    return next(ApiError.badRequest("Неверный формат equipmentIds, ожидается массив."));
                }

                if (Array.isArray(parsedEquipmentIds) && parsedEquipmentIds.length > 0) {
                    await recept.addEquipment(parsedEquipmentIds);
                }
            }

            if (tagsId) {
                let parsedtagsId;
                try {
                    parsedtagsId = typeof tagsId === "string" ? JSON.parse(tagsId) : tagsId;
                } catch (error) {
                    return next(ApiError.badRequest("Неверный формат parsedtagsId, ожидается массив."));
                }

                if (Array.isArray(parsedtagsId) && parsedtagsId.length > 0) {
                    await recept.addTags(parsedtagsId);
                }
            }

            if (ingredientsId) {
                let parsedIngredientsId;
                try {
                    parsedIngredientsId = typeof ingredientsId === "string" ? JSON.parse(ingredientsId) : ingredientsId;
                } catch (error) {
                    return next(ApiError.badRequest("Неверный формат parsedIngredientsId, ожидается массив."));
                }

                if (Array.isArray(parsedIngredientsId) && parsedIngredientsId.length > 0) {
                    await recept.addIngredients(parsedIngredientsId);
                }
            }

            // Загружаем рецепт с прикрепленными полями
            const fullRecept = await Recept.findOne({
                where: { id: recept.id },
                include: [{ model: Tags }, { model: Ingredient, as: "ingredients" }]
            });

            return resp.json(fullRecept);
        }
        catch (e) {
            next(ApiError.badRequest(e.message));
        }

    }


    async update(req, resp, next) {
        try {
            console.log('Запрос на обновление:', req.params, req.body); 
            const { id } = req.params;
            const { title, description, cookingTime, nationalityId } = req.body;

            // Проверяем, что req.files существует, и что в нем есть изображение
            let fileName = null;
            if (req.files && req.files.image) {
                const { image } = req.files; // Деструктурируем изображение
                try {
                    fileName = uuidv4() + ".jpg";  // Генерация нового имени для изображения
                    await image.mv(path.resolve(__dirname, '..', 'static/img', fileName)); // Перемещение файла
                } catch (error) {
                    console.error("Ошибка при загрузке изображения:", error.message);
                    return next(ApiError.badRequest("Не удалось загрузить изображение"));
                }
            }

            const recept = await Recept.findOne({ where: { id } });
            if (!recept) {
                return next(ApiError.badRequest("Рецепт не найден"));
            }

            await recept.update({
                title,
                description,
                cookingTime,
                nationalityId,
                image: fileName || recept.image // Если новое изображение не передано, сохраняем старое
            });

            return resp.json(recept);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }



    async delete(req, resp) {
        const { id } = req.params;

        await RecipeTags.destroy({ where: { receptId: id } });
        const result = await CookingStep.destroy({ where: { receptId: id } });
        if (result === 0) {
            console.log(`Шаги для рецепта с ID: ${id} не найдены`);
        }
        const deletedCount = await Recept.destroy({ where: { id } });
        if (!deletedCount) {
            return resp.status(404).json({ message: "Рецепт не найден" });
        }
        return resp.json({ message: `Рецепт ${id} удален` });
    }

    async getOne(req, resp) {
        const { id } = req.params;
        let recept = await Recept.findOne({
            where: { id },
            include: [
                { model: CookingStep, as: "steps" },
                { 
                    model: Tags,
                    through: { attributes: [] } // Исключаем поля из промежуточной таблицы
                },
                { model: Ingredient, as: "ingredients" }
            ]
        });
        console.log("Ассоциации рецепта" + Recept.associations);

        return resp.json(recept);
    }


    async getAll(req, res, next) {
    try {
        let { userId, nationalityId, limit, page } = req.query;
        page = page || 1;
        limit = limit || 10;
        let offset = page * limit - limit;
        
        const includeOptions = [
            { model: CookingStep, as: "steps" },
            { model: Tags },
            { model: Ingredient, as: "ingredients" }
        ];

        // Базовые параметры запроса
        const queryOptions = {
            limit,
            offset,
            include: includeOptions,
            distinct: true
        };

        let recepts;
        
        if (!userId && !nationalityId) {
            recepts = await Recept.findAndCountAll(queryOptions);
        }
        else if (userId && !nationalityId) {
            recepts = await Recept.findAndCountAll({
                ...queryOptions,
                where: { userId }
            });
        }
        else if (!userId && nationalityId) {
            recepts = await Recept.findAndCountAll({
                ...queryOptions,
                where: { nationalityId }
            });
        }
        else if (userId && nationalityId) {
            recepts = await Recept.findAndCountAll({
                ...queryOptions,
                where: { userId, nationalityId }
            });
        }

        return res.json(recepts);
    }
    catch (e) {
        next(ApiError.badRequest(e.message));
    }
}


}

export const receptController = new ReceptController();