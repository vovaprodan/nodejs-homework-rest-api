import express from "express";
import usersControllers from '../../controllers/user-controllers.js';
import isEmptyBody from "../../middlwares/isEmptyBody.js";
import validateBody from "../../decorators/validateBody.js";
import { userSignupSchema } from "../../models/Users.js";
import authenticate from "../../middlwares/authenticate.js";

const userSingupValidate = validateBody(userSignupSchema)


const authRouter = express.Router();

authRouter.post('/register',isEmptyBody,userSingupValidate,usersControllers.singup)
authRouter.post('/login',isEmptyBody,userSingupValidate,usersControllers.singin)
authRouter.get('/current',authenticate, usersControllers.getCurrent)
authRouter.post('/logout',authenticate, usersControllers.logout)

export default authRouter;