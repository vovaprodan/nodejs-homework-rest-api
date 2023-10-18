import express from "express";
import { contactAddSchema ,contactFavoriteSchema} from "../../models/contacts.js";
import contactsControllers from "../../controllers/contacts-controllers.js";
import isEmptyBody from "../../middlwares/isEmptyBody.js";
import isValidId from "../../middlwares/isValidId.js";
import validateBody from "../../decorators/validateBody.js";

const contactAddValidate = validateBody(contactAddSchema)
const contactFavoriteAddValidate = validateBody(contactFavoriteSchema)


const router = express.Router();

router.get('/',contactsControllers.getAll )

router.get('/:contactId', isValidId , contactsControllers.getById )

router.post('/', isEmptyBody, contactAddValidate, contactsControllers.add )

router.delete('/:contactId',isValidId, contactsControllers.deleteById )

router.put('/:contactId',isEmptyBody,isValidId,contactAddValidate, contactsControllers.updateById)

router.patch('/:contactId/favorite',isEmptyBody, isValidId,contactFavoriteAddValidate, contactsControllers.updateFavorite)


export default router;
