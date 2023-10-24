import jwt from 'jsonwebtoken';
import Users from '../models/Users.js';

const {JWT_SECRET} = process.env

const authenticate = async (req, res, next) => {
    const { authorization = '' } = req.headers;
    const [bearer, token] = authorization.split(' ');
    if (bearer !== 'Bearer') {
        return next(res.status(401));
    }
    try {
        const { id } = jwt.verify(token, JWT_SECRET);
        const user = await Users.findById(id);
        if (!user || !user.token) {
             return next(res.status(401).json({ message : "Not authorized"}));
        }
        req.user = user;
        next()

    } catch(error) {
    return next(res.status(401).json({ message : "Not authorized"}));
    }

} 

export default authenticate;