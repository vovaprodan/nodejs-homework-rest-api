import { ctrlWrapper } from "../decorators/index.js";
import Contacts from "../models/contacts.js";

const getAll = async (req, res) => {
  const { _id: owner } = req.user;

  const contactList = await Contacts.find(owner);
  
   res.json(contactList)
}
const getById = async (req, res) => {
 
  const { contactId } = req.params;
   const { _id: owner } = req.user;
  const oneContact = await Contacts.findById({_id:contactId,owner});
    if (!oneContact) {
     return res.status(404).json({ messege : "Not found"})
  }
     res.json(oneContact)
}
const add = async (req, res) => {
  const { _id: owner } = req.user;
    const newContact = await Contacts.create({...req.body,owner});
    res.status(201).json(newContact)
}

const updateById = async (req, res) => {
 
  const { contactId } = req.params;
   const { _id: owner } = req.user;
    const resalt = await Contacts.findOneAndUpdate({_id: contactId,owner}, req.body);
    if (!resalt) {
      return res.status(404).json({ messege : "Not found"})
    }
    res.json(resalt)
}
 
const updateFavorite = async (req, res) => { 
  const { contactId } = req.params;
  const { _id: owner } = req.user;
    const result = await Contacts.findOneAndUpdate({_id: contactId,owner}, req.body);
    if (!result) {
      return res.status(404).json({ messege : " Not found "})
    }
    res.json(result);
}

const deleteById = async (req, res) => {
  const { contactId } = req.params;
    const resalt = await Contacts.findOneAndDelete({_id: contactId});
    if (!resalt) {
      return res.status(404).json({ messege : "Not found"})
    }
    res.json({
      message :"contact deleted"
    }) 
}

export default {
    getAll: ctrlWrapper(getAll),
    getById: ctrlWrapper(getById),
    add: ctrlWrapper(add),
    updateById: ctrlWrapper(updateById),
    updateFavorite: ctrlWrapper(updateFavorite),
    deleteById:ctrlWrapper(deleteById)
}