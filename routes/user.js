const express = require('express');
const userController = require('../controllers/user');
const userValidation = require('../validation/userValidator')

const router = express.Router();

// /POST/auth/signup
router.post('/signup', userValidation, userController.registerUser);

// /POST/auth/signup
router.post('/signin', userController.loginUser);


module.exports = router;