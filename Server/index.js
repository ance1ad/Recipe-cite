import express from 'express';
import 'dotenv/config'
import sequelize from './db.js';
import * as models from './models/models.js';
import cors from 'cors';

import fileUpload from 'express-fileupload';
import {router} from './routes/index.js';
import errorMiddleware from './middleware/ErrorHandlingMiddleware.js';
import path from 'path';
import { fileURLToPath } from 'url';

// Это вместо __dirname из CommonJS для путей
const __filename = fileURLToPath(import.meta.url); 
const __dirname = path.dirname(__filename);




const PORT = process.env.PORT || 5000;

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.resolve(__dirname, 'static/img'))); // указываем что серверу можно брать папку со статикой
app.use(fileUpload({}));
app.use('/api', router);
app.use('/static', express.static('static'));



app.use(cors({
    origin: 'http://localhost:3000',  // Разрешаем доступ только с фронтенда
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
}));


// Middleware работающий с ошибками вызывается в самом конце
app.use(errorMiddleware);



const start = async () => {
    try {
        // Подключение
        await sequelize.authenticate();
        await sequelize.sync({ alter: true }); //для синхронизации, однако лучше через миграцию это делать
        // await sequelize.sync();
        console.log(app._router.stack.map(r => r.route && r.route.path));

        app.listen(PORT, () =>  console.log(`Сервер на http://localhost:${PORT}`));
    } catch (error) {
        // console.log(error);
        console.error(JSON.stringify(error, null, 2));
    }
}

start();



