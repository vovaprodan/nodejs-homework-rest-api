import { ctrlWrapper } from "../decorators/index.js";
import Users from "../models/Users.js";
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import gravatar from 'gravatar';
import fs from 'fs/promises';
import path from "path";
import Jimp from "jimp";

const avatarPath = path.resolve('public', 'avatars');


const {JWT_SECRET} = process.env

const singup = async (req, res) => { 
    const {email, password} = req.body;
    const user = await Users.findOne({email});
    if (user) {
        return res.status(409).json({ messege : "Email in use"})
      
    }
    const hashPassword = await bcryptjs.hash(password, 10);
    const avatarUrl = gravatar.url(email, { protocol: 'http'});

    const newUser = await Users.create({...req.body, password: hashPassword,avatarUrl});
    res.status(201).json({
        user: {
            email: newUser.email,
            avatarUrl: newUser.avatarUrl,
            subscription: newUser.subscription
        }
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
         user: {
            email: user.email,
            subscription: user.subscription
        }
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

const updateAvatar = async (req, res) => {

    const { _id: owner} = req.user;
    const { path: oldPath, filename } = req.file;
    const newPath = path.join(avatarPath,filename)
    const avatar = await Jimp.read(oldPath);
    avatar.resize(250, 250).write(oldPath);
    await fs.rename(oldPath,newPath)
    const avatarUrl = path.join('avatars', filename);

    const result = await Users.findOneAndUpdate({...req.body ,avatarUrl, owner});
    if (!result) {
      return res.status(401).json({ messege : "Not authorized"})
    }
    res.status(200).json({
        avatarUrl: result.avatarUrl
    });
}

export default {
    singup: ctrlWrapper(singup),
    singin: ctrlWrapper(singin),
    getCurrent: ctrlWrapper(getCurrent),
    logout : ctrlWrapper(logout),
    updateAvatar : ctrlWrapper(updateAvatar),

}