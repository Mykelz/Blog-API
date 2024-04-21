const express = require('express');

const blogController = require('../controllers/blog');
const isAuth = require('../middlewares/isAuth');
const { body } = require('express-validator');

const router = express.Router();


router.post('/blog', [
    body('title')
    .not().isEmpty().withMessage('Email is a required field'),
    body('description')
    .not().isEmpty().withMessage('Email is a required field'),
    body('tag')
    .not().isEmpty().withMessage('Email is a required field'),
    body('body')
    .not().isEmpty().withMessage('Email is a required field'),
  
    ],isAuth, blogController.createBlog);

router.get('/blog', blogController.getBlogs);

router.get('/blog/:blogId', blogController.getABlog);

router.put('/blog/:blogId/state', isAuth, blogController.updateState);

router.put('/blog/:blogId', isAuth, blogController.editBlog);

router.delete('/blog/:blogId', isAuth, blogController.deleteBlog);

router.get('/blog/author/blogs', isAuth, blogController.authorBlog)


module.exports = router;
