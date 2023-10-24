import { ctrlWrapper } from "../decorators/index.js";
import Users from "../models/Users.js";
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';

const {JWT_SECRET} = process.env

const singup = async (req, res) => { 
    const {email, password} = req.body;
    const user = await Users.findOne({email});
    if (user) {
        return res.status(409).json({ messege : "Email in use"})
      
    }
    const hashPassword = await bcryptjs.hash(password,10)

    const newUser = await Users.create({...req.body,  password: hashPassword});
    res.status(201).json({
        email: newUser.email,
         subscription: newUser.subscription
    })
}

const singin = async (req, res) => {
    const { email, password } = req.body;
    const user = await Users.findOne({ email });
    if (!user) {
        return res.status(401).json({ messege : "Email or password is wrong"})
    }

    const passwordCompare = await bcryptjs.compare(password, user.password);

    if (!passwordCompare) {
         return res.status(401).json({ messege : "Email or password is wrong"})
    }

    const payload = {
        id: user._id
    }

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '23h' });
    await Users.findByIdAndUpdate(user._id, {token})

    res.json({
        token,
    })
}

const getCurrent = async (req, res) => {
    const { email, subscription } = req.user;

    res.json({
        email,
        subscription
    })

}

const logout = async (req, res) => {
    const { _id } = req.user;
    await Users.findByIdAndUpdate(_id, { token: '' });
    res.json({
        messege: 'Logout success'
    })
}

export default {
    singup: ctrlWrapper(singup),
    singin: ctrlWrapper(singin),
    getCurrent: ctrlWrapper(getCurrent),
    logout : ctrlWrapper(logout)

}