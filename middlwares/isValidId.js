import { isValidObjectId } from "mongoose";

const isValidId = (req, res, next)=> {
    const {contactId} = req.params;
    if (!isValidObjectId(contactId)) {
        return next(res.status(404).json({ messege: `${contactId} not valid id` }));
    }
    next();
}

export default isValidId;