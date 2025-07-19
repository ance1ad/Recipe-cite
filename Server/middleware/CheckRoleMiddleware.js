import jwt from 'jsonwebtoken';


// проверка токена
export default function (role){
    return function (req,resp, next) {
        if(req.method === "OPTIONS"){ next() }

        try{
            const token = req.headers.authorization.split(' ')[1] // Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
            if(!token){
                return resp.status(401).json({message: "Не авторизован"})
            }
            
            const decoded = jwt.verify(token, process.env.SECRET_KEY)
            if(decoded.role !== role){
                return resp.status(403).json({message: "Нет доступа"})
            }
            req.user = decoded;
    
            next();
        }catch (e){
            resp.status(401).json({message: "Не авторизован"})
        }
    }
}