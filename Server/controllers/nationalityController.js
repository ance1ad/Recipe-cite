import {Nationality} from '../models/models.js';
import { ApiError } from '../error/apiError.js';


export class NationalityController {
    async create(req,resp, next){
        try{
            const {nationality, description} = req.body;
            console.log(req.body);
            const nationalityFind = await Nationality.findOne({where: { nationality }})
            if(nationalityFind){
                return next(ApiError.badRequest("Такая национальность уже есть"));
            }
            const receptNation = await Nationality.create({nationality, description});
            return resp.json(receptNation);
        }
        catch(e){
            next(ApiError.badRequest(e.message));
        }
    }

    async getAll(req,resp){
        const receptNation = await Nationality.findAll();
        return resp.json(receptNation);
    }

    async update(req, resp, next) {
        try {
            const { id, nationality, description } = req.body;

            const nationalityToUpdate = await Nationality.findOne({ where: { id } });
            if (!nationalityToUpdate) {
                return next(ApiError.badRequest("Национальность не найдена"));
            }

            nationalityToUpdate.nationality = nationality;
            nationalityToUpdate.description = description;

            await nationalityToUpdate.save();

            return resp.json(nationalityToUpdate);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

  

    async getOne (req, res) {
        const { id } = req.params;
        const nationality = await Nationality.findOne({where: { id }})
        if (nationality) {
          res.json(nationality);
        } else {
          res.status(404).send("Национальность не найдена");
        }
    };
    
    async delete(req, resp) {
        try {
            const { nationality } = req.body; 
            const nationalityToDelete = await Nationality.findOne({ where: { nationality } });
            if (!nationalityToDelete) {
                return resp.status(404).json({ message: 'Национальность не найдена' });
            }
            await nationalityToDelete.destroy();
            return resp.status(200).json({ message: 'Национальность успешно удалена' });
        } catch (error) {
            console.error(error);
            return resp.status(500).json({ message: 'Ошибка при удалении национальности' });
        }
    }
}

export const nationalityController = new NationalityController();