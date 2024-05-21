const Joi = require('joi');

const ValidationMiddleware = async (req, res, next) =>{
    const payLoad = req.body;
    try{
        await blogValidator.validateAsync(payLoad);
        next()
    }
    catch(err){
        return res.status(422).send(err.details[0].message)
    }
}


const blogValidator = Joi.object({

    title: Joi.string()
    .min(3)
    .max(30)
    .required(),

    description: Joi.string()
        .min(15)
        .max(100)
        .required(),

    tag: Joi.string()
        .min(3)
        .max(30)
        .required(),

    body: Joi.string()
        .min(20)
        .max(300)
        .required(),
})


module.exports = ValidationMiddleware;