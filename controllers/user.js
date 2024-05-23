const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

require('../Integrations/loggers')
const wiston = require('winston');
const authLogger = wiston.loggers.get('authLogger');

exports.registerUser = async (req, res, next) => {
    try{
        const { first_name, last_name, email, password } = req.body;

        const userEx = await User.findOne({ email: email});
        if(userEx){
            const error = new Error('User with the email already exits.')
            error.statusCode = 400;
            authLogger.error(error)
            throw error
        }
        const hashedPw = await bcrypt.hash(password, 12);

        const user = await User.create({
            first_name: first_name,
            last_name: last_name,
            email: email,
            password: hashedPw
        })

        console.log(user, 'user details')

        authLogger.info('User created successfully')
        res.status(201).json({
            message: 'user created',
            data: { 
                id: user._id,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                updatedAt: user.updatedAt,
                createdAt: user.createdAt
              }  

        })
    }catch(err){
        if (!err.statusCode){
            err.statusCode = 500;
        }
        authLogger.error(err)
        next(err);

    }
}


exports.loginUser = async (req, res, next)=>{
    try{
        const { email, password } = req.body;

        const user = await User.findOne({email: email});
    
        if (!user){
            const error = new Error('No user is associated with this email');
            error.statusCode = 401;
            // authLogger.error(error)
            throw error;
        }
    
       const isEqual = await bcrypt.compare(password, user.password)
       if(!isEqual){
            const error = new Error('Wrong password')
            error.statusCode = 401;
            // authLogger.error(error)
            throw error;
       }
       const token = jwt.sign(
        { email: user.email, userId: user._id},
        process.env.JWT_SECRET,
        { expiresIn: '1hr'}
      );
      console.log()
      authLogger.info('login successful')
      res.status(200).json({
        message: 'Login Successfull',
        data: {
            accessToken: 'Bearer ' + token,
            user: {
                id: user._id,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                updatedAt: user.updatedAt,
                createdAt: user.createdAt
            } 
            }
        })
    }catch(err){
        if (!err.statusCode){
            err.statusCode = 500;
        }
        authLogger.error(err)
        next(err);
    }
}