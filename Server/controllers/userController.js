import { User, Recept, CookingStep, UserTags, Tags } from '../models/models.js';
import { v4 as uuidv4 } from 'uuid'; // генерация id
import { ApiError } from '../error/apiError.js';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import AuthMiddleware from '../middleware/AuthMiddleware.js';
import fs from 'fs';
import { dirname } from 'path';
import { config } from 'dotenv';

config();

const generateJwt = (id, email, role) => {
    return jwt.sign(
        { id, email, role },
        process.env.SECRET_KEY,
        { expiresIn: '24h' }
    )
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export class UserController {
    async registration(req, res) {
        try {
            const { email, password, name, status } = req.body;
            const candidate = await User.findOne({ where: { email } });
            if (candidate) {
                return res.status(400).json({ message: "Пользователь с таким email уже существует" });
            }
            const hashPassword = await bcrypt.hash(password, 5);
            const user = await User.create({ email, password: hashPassword, name, status });
            const token = generateJwt(user.id, user.email, user.role);
            return res.json({ token });
        } catch (e) {
            console.log(e);
            return res.status(500).json({ message: "Ошибка при регистрации" });
        }
    }


    async login(req, res) {
        try {
            const { email, password } = req.body;
            const user = await User.findOne({ where: { email } });
            if (!user) {
                return res.status(400).json({ message: "Пользователь не найден" });
            }
            let comparePassword = bcrypt.compareSync(password, user.password);
            if (!comparePassword) {
                return res.status(400).json({ message: "Указан неверный пароль" });
            }
            const token = generateJwt(user.id, user.email, user.role);
            return res.json({ token });
        } catch (e) {
            console.log(e);
            return res.status(500).json({ message: "Ошибка при входе" });
        }
    }


    async check(req, res) {
        const token = generateJwt(req.user.id, req.user.email, req.user.role);
        return res.json({ token });
    }


    async update(req, res) {
        try {
            const { id } = req.params;
            const { name, experience, status, description } = req.body;

            let imagePath = null;

            if (req.files && req.files.image) {
                const { image } = req.files;
                const fileName = `${Date.now()}-${image.name}`;
                const uploadPath = path.join(__dirname, '..', 'static', 'img', 'users', fileName);

                const dir = path.join(__dirname, '..', 'static', 'img', 'users');
                if (!fs.existsSync(dir)) {
                    fs.mkdirSync(dir, { recursive: true });
                }

                await image.mv(uploadPath);
                imagePath = fileName;
            }

            const user = await User.findByPk(id);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            const updateData = {
                name: name || user.name,
                experience: experience || user.experience,
                status: status || user.status,
                description: description || user.description,
            };

            if (imagePath) {
                if (user.image && user.image !== "path-to-default-img") {
                    const oldImagePath = path.join(__dirname, '..', 'static', 'img', 'users', user.image);
                    if (fs.existsSync(oldImagePath)) {
                        fs.unlinkSync(oldImagePath);
                    }
                }
                updateData.image = imagePath;
            }

            await user.update(updateData);

            return res.json(user);
        } catch (e) {
            console.log(e);
            return res.status(500).json({ message: "Error updating user" });
        }
    }

    async getOne(req, res) {
        try {
            const { id } = req.params;
            const user = await User.findByPk(id, {
                include: [{
                    model: Recept,
                    required: false,
                    include: [{ model: CookingStep, as: "steps" },  { model: Tags }]
                }]
            });

            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            return res.json(user);
        } catch (e) {
            console.log(e);
            return res.status(500).json({ message: "Error getting user" });
        }
    }

    async getAll(req, res) {
        try {
            const users = await User.findAll();
            return res.json(users);
        } catch (e) {
            console.log(e);
            return res.status(500).json({ message: "Error getting users" });
        }
    }

    async delete(req, res) {
        try {
            const { id } = req.params;
            const user = await User.findByPk(id);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            if (user.image && user.image !== "path-to-default-img") {
                const imagePath = path.join(__dirname, '..', 'static', 'img', 'users', user.image);
                if (fs.existsSync(imagePath)) {
                    fs.unlinkSync(imagePath);
                }
            }

            await user.destroy();
            await UserTags.destroy({ where: { userId: id } });

            return res.json({ message: "User deleted successfully" });
        } catch (e) {
            console.log(e);
            return res.status(500).json({ message: "Error deleting user" });
        }
    }
}

export const userController = new UserController();