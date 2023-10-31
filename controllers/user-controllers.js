import { ctrlWrapper } from "../decorators/index.js";
import Users from "../models/Users.js";
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import gravatar from 'gravatar';
import fs from 'fs/promises';
import path from "path";
import Jimp from "jimp";
import sendEmail from "../helpers/sendEmail.js";
import { nanoid } from "nanoid";

const avatarPath = path.resolve('public', 'avatars');


const {JWT_SECRET,BASE_URL} = process.env

const singup = async (req, res) => { 
    const {email, password} = req.body;
    const user = await Users.findOne({email});
    if (user) {
        return res.status(409).json({ messege : "Email in use"})
      
    }
    const hashPassword = await bcryptjs.hash(password, 10);
    const verificationToken = nanoid()
    const avatarUrl = gravatar.url(email, { protocol: 'http'});

    const newUser = await Users.create({...req.body, password: hashPassword,avatarUrl,verificationToken });
    
    const verifyEmail = {
        to: email,
        subject: 'Verify email',
        html: `<a target='_blank' href='${BASE_URL}/api/users/verify/${verificationToken}'>Click to verify emil</a>`

    }
    await sendEmail(verifyEmail)

    res.status(201).json({
        user: {
            email: newUser.email,
            avatarUrl: newUser.avatarUrl,
            subscription: newUser.subscription
        }
    })
}

const verify = async (req, res) => {
    const { verificationToken } = req.params;
    const user = await Users.findOne({ verificationToken })
    
    if (!user) {
         return res.status(404).json({ messege : "User not found"})
    }

    await Users.findByIdAndUpdate(user._id,{verify: true, })
    
    res.json({
        messege:'Verification successful'
    })
}

const resendVerify = async (req, res) => {
    const { email } = req.body;
    const user = await Users.findOne({ email });
    if (!user) {
         return res.status(404).json({ messege : "User not found"})
    } 
    if (user.verify) {
         return res.status(400).json({ messege : "Verification has already been passed"})
    }
    const verifyEmail = {
        to: email,
        subject: 'Verify email',
        html: `<a target='_blank' href='${BASE_URL}/api/users/verify/${user.verificationToken}'>Click to verify emil</a>`

    }
    await sendEmail(verifyEmail);

    res.json({
        messege: 'Verification email sent'
    })

}

const singin = async (req, res) => {
    const { email, password } = req.body;
    const user = await Users.findOne({ email });
    if (!user) {
        return res.status(401).json({ messege : "Email or password is wrong"})
    }

    if (!user.verify) {
        return res.status(401).json({ messege : "Email not verify"})
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
    verify : ctrlWrapper(verify),
    resendVerify : ctrlWrapper(resendVerify),
    singin: ctrlWrapper(singin),
    getCurrent: ctrlWrapper(getCurrent),
    logout : ctrlWrapper(logout),
    updateAvatar : ctrlWrapper(updateAvatar),
  

}