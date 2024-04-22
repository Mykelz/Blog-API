const express = require('express');
const userController = require('../controllers/user');
const { body } = require('express-validator');


const router = express.Router();

// /POST/auth/signup
router.post('/signup', [
    body('email')
    .not().isEmpty().withMessage('Email is a required field')
    .isEmail().withMessage('Please enter a valid email'),
    body('first_name')
    .trim().not().isEmpty().withMessage('please Enter your first name'),
    body('last_name')
    .trim().not().isEmpty().withMessage('please Enter your lastname'),
    body('password')
    .trim().not().isEmpty().withMessage('please Enter password')
], userController.registerUser);

// /POST/auth/signup
router.post('/signin', userController.loginUser);


module.exports = router;