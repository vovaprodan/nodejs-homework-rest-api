import express from "express";
import { contactAddSchema ,contactFavoriteSchema} from "../../models/contacts.js";
import contactsControllers from "../../controllers/contacts-controllers.js";
import {authenticate,isValidId,isEmptyBody,} from '../../middlwares/index.js'
import validateBody from "../../decorators/validateBody.js";

const contactAddValidate = validateBody(contactAddSchema)
const contactFavoriteAddValidate = validateBody(contactFavoriteSchema)


const router = express.Router();

router.use(authenticate)

router.get('/',contactsControllers.getAll )

router.get('/:contactId', isValidId , contactsControllers.getById )

router.post('/', isEmptyBody, contactAddValidate, contactsControllers.add )

router.delete('/:contactId',isValidId, contactsControllers.deleteById )

router.put('/:contactId',isEmptyBody,isValidId,contactAddValidate, contactsControllers.updateById)

router.patch('/:contactId/favorite',isEmptyBody, isValidId,contactFavoriteAddValidate, contactsControllers.updateFavorite)


export default router;
