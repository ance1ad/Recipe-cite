import {Tags, RecipeTags, UserTags} from '../models/models.js';
import { ApiError } from '../error/apiError.js';
import { Op } from 'sequelize'; 


export class UserTagsController {

    async create(req, resp, next) {
        try {
            const { type, userId, tagId } = req.body;
            console.log(req.body);
            if (!type || !userId || !tagId) {
                return resp.status(400).json({ message: "Ошибка: отсутствуют обязательные параметры." });
            }
            const existing = await UserTags.findOne({
                where: { userId, tagId }
            });

            if (existing) {
                return resp.status(200).json({ message: "Такая запись уже существует.", data: existing });
            }

            const userTag = await UserTags.create({ type, userId, tagId });
            return resp.status(201).json(userTag);

        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }


    async getAll(req, resp) {
        const { userId } = req.query;

        if (!userId) {
            return resp.status(400).json({ message: 'Параметр userId обязателен' });
        }

        const userTags = await UserTags.findAll({
            where: { userId },
            include: [
                {
                    model: Tags,
                    attributes: ['id', 'name']
                }
            ]
        });

        return resp.json(userTags);
    }

    async delete(req, resp) {
        const { id } = req.query;

        if (!id) {
            return resp.status(400).json({ message: 'Не указан ID связи' });
        }
        const deleted = await UserTags.destroy({ where: { id } });
        if (deleted) {
            return resp.json({ message: `Связь с ID ${id} удалена` });
        }
        return resp.status(404).json({ message: 'Связь не найдена' });
    }
}

export const userTagsController = new UserTagsController();