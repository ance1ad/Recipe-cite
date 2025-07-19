import { UUIDV4 } from 'sequelize';
import { Recept } from '../models/models.js';
import { CookingStep } from '../models/models.js';
import { v4 as uuidv4 } from 'uuid'; // генерация id
import { ApiError } from '../error/apiError.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class CookingStepController {
    async create(req, resp, next) {
        try {
            console.log('Запрос на добавление:', req.params, req.body);

            const { number, title, text, receptId } = req.body;
            const image = req.files?.image ?? req.body.image;

            let fileName = null;

            if (image && typeof image === 'object' && image.name && image.mv) {
                fileName = uuidv4() + ".jpg";
                await image.mv(path.resolve(__dirname, '..', 'static/img', fileName));
            }
            else if (typeof image === 'string') {
                fileName = image;
            }

            const cookingStep = await CookingStep.create({
                photo: fileName,
                number,
                title,
                text,
                receptId
            });

            return resp.json(cookingStep);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }



    async getAll(req, resp) {
        let сookingSteps = await CookingStep.findAll();
        return resp.json(сookingSteps);
    }


    async getOne(req, resp) {
        const { id } = req.params;
        let сookingStep = await CookingStep.findOne({ where: { id } });
        return resp.json(сookingStep);
    }



    async delete(req, res) {
        try {
            const { id } = req.params;

            console.log(`Удаление шагов для рецепта с ID: ${id}`);

            // Проверяем, что id действительно передано
            if (!id) {
                console.error("Нет ID рецепта в запросе");
                return res.status(400).json({ error: "Не указан ID рецепта" });
            }

            // Удаляем шаги из базы данных по id
            const result = await CookingStep.destroy({ where: { receptId: id } });

            // Если шаги не были удалены, возвращаем ошибку
            if (result === 0) {
                console.log(`Шаги для рецепта с ID: ${id} не найдены`);
                return res.status(404).json({ error: "Шаги не найдены" });
            }

            // Выводим количество удаленных шагов
            console.log(`${result} шагов для рецепта с ID: ${id} успешно удалено`);

            return res.json({ message: "Steps deleted successfully" });
        } catch (err) {
            // Логируем ошибку сервера
            console.error("Ошибка при удалении шагов:", err);
            res.status(500).json({ error: "Failed to delete steps" });
        }
    };

    async deleteByRecipeId(req, res) {
        try {
            const { recipeId } = req.params;

            console.log(`Удаление шагов для рецепта с ID: ${recipeId}`);

            if (!recipeId) {
                console.error("Нет ID рецепта в запросе");
                return res.status(400).json({ error: "Не указан ID рецепта" });
            }

            const result = await CookingStep.destroy({ where: { receptId: recipeId } });

            // Не возвращаем ошибку, если шаги не найдены
            console.log(`${result} шагов для рецепта с ID: ${recipeId} удалено`);

            return res.json({ message: "Steps deleted successfully" });
        } catch (err) {
            console.error("Ошибка при удалении шагов:", err);
            res.status(500).json({ error: "Failed to delete steps" });
        }
    }
}

export const cookingStepController = new CookingStepController();