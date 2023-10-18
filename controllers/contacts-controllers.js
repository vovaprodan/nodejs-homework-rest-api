import { ctrlWrapper } from "../decorators/index.js";
import Contacts from "../models/contacts.js";

const getAll = async (req, res) => {
const contactList = await Contacts.find();
   res.json(contactList)
}
const getById = async (req, res) => {
    const { contactId } = req.params;
  const oneContact = await Contacts.findById(contactId);
    if (!oneContact) {
     return res.status(404).json({ messege : "Not found"})
  }
     res.json(oneContact)
}
 const add = async (req, res) => {
    const newContact = await Contacts.create(req.body);
    res.status(201).json(newContact)
}

const updateById = async (req, res) => {
    const { contactId } = req.params;
    const resalt = await Contacts.findByIdAndUpdate(contactId, req.body, {new: true});
    if (!resalt) {
      return res.status(404).json({ messege : "Not found"})
    }
    res.json(resalt)
}
 
const updateFavorite =  async (req, res) => { 
    const { contactId } = req.params;
    const result = await Contacts.findByIdAndUpdate(contactId, req.body);
    if (!result) {
      return res.status(404).json({ messege : " Not found "})
    }
    res.json(result);
}

const deleteById = async (req, res) => {
    const { contactId } = req.params;
    const resalt = await Contacts.findByIdAndDelete(contactId);
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