import express from "express";
import usersControllers from '../../controllers/user-controllers.js';
import isEmptyBody from "../../middlwares/isEmptyBody.js";
import validateBody from "../../decorators/validateBody.js";
import { userSignupSchema,userAvatarSchema,userEmailSchema } from "../../models/Users.js";
import {authenticate ,upload} from "../../middlwares/index.js";

const userSingupValidate = validateBody(userSignupSchema)
const userAvatarValidate = validateBody(userAvatarSchema)
const userEmailValidate = validateBody(userEmailSchema)


const authRouter = express.Router();

authRouter.post('/register', isEmptyBody, userSingupValidate, usersControllers.singup)
authRouter.get('/verify/:verificationToken', usersControllers.verify)
authRouter.post('/verify',isEmptyBody,userEmailValidate,usersControllers.resendVerify)
authRouter.post('/login',isEmptyBody,userSingupValidate,usersControllers.singin)
authRouter.get('/current',authenticate, usersControllers.getCurrent)
authRouter.post('/logout',authenticate, usersControllers.logout)
authRouter.patch('/avatars',upload.single('avatar'),authenticate,userAvatarValidate, usersControllers.updateAvatar)

export default authRouter;