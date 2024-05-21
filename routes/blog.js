const express = require('express');

const blogController = require('../controllers/blog');
const isAuth = require('../middlewares/isAuth');
const blogValidation = require('../validation/bodyValidator')
const router = express.Router();


router.post('/blog', blogValidation, isAuth, blogController.createBlog);

router.get('/blog', blogController.getBlogs);

router.get('/blog/:blogId', blogController.getABlog);

router.put('/blog/:blogId/state', blogValidation, isAuth, blogController.updateState);

router.patch('/blog/:blogId',  isAuth, blogController.editBlog);

router.delete('/blog/:blogId', isAuth, blogController.deleteBlog);

router.get('/blog/author/blogs', isAuth, blogController.authorBlog)


module.exports = router;
