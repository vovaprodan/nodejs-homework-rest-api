const validateBody = schema => {
    const func = (req, res, next) => {
        const { error } = schema.validate(req.body);
        if (error) {
            return next(res.status(400).json(error.message));
        }
        next()
    }

    return func;
}

export default validateBody;