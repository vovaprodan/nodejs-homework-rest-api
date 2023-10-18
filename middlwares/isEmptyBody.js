const isEmptyBody = (req, res, next)=> {
    if (!Object.keys(req.body).length) {
        return next(res.status(400).json({ message : "All fields empty"}));
    }
    next();
}

export default isEmptyBody;