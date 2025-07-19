import {ApiError} from '../error/apiError.js';

// перехват ошибок
const errorMiddleware = (err, req, res, next) => {
    if(err instanceof ApiError){
        return res.status(err.status).json({
            message: err.message
        });
    }
    // Другие ошибки
    return res.status(500).json({
        message: "Непредвиденная ошибка"
    });
};

export default errorMiddleware;