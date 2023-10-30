import { Schema, model } from "mongoose";
import { handleSaveError, runValidatorsAtUpdate } from "./hooks.js";
import Joi from 'joi';

const contactsSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Set name for contact'],
    },
    email: {
        type: String,
    },
    phone: {
        type: String,
    },
    favorite: {
        type: Boolean,
        default: false,
  },
    owner: {
      type: Schema.Types.ObjectId,
        ref: "user",
        required: true     
    }
});
contactsSchema.post("save", handleSaveError);
contactsSchema.pre("findOneAndUpdate", runValidatorsAtUpdate);
contactsSchema.post("findOneAndUpdate", handleSaveError);

export const contactAddSchema = Joi.object({
   
  name: Joi.string().required().messages({
     "any.required": 
      "missing required 'name' field"
  }),
    email: Joi.string().required().messages({
    "any.required": 
      "missing required 'email' field"
  }),
    phone: Joi.string().required().messages({
    "any.required": 
      "missing required 'phone' field"
    }),
     favorite: Joi.boolean(),
})
export const contactFavoriteSchema = Joi.object({
    favorite: Joi.boolean().required(),
})

const Contacts = model("contact", contactsSchema);

export default Contacts;