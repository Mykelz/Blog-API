const Blog = require('../models/blog');
const User = require('../models/user');
require('../Integrations/loggers')
const wiston = require('winston');
const blogLogger = wiston.loggers.get('blogLogger');
const redisClient = require('../Integrations/redis');




exports.createBlog = async (req, res, next )=>{

    try{
        const { title, description, tag, body } = req.body;

        const BodyLength = body.trim().split(" ").length
        const wordsPerMin = 150;
        const readingTime = (BodyLength/wordsPerMin)
    

        const user = await User.findById(req.user)
        
        const blog = await Blog.create({
            title: title,
            description: description,
            tag: tag,
            creator: req.user,
            author: user.first_name,
            body: body,
            reading_time: `${readingTime} min`,
        })
      

        await redisClient.DEL('/blogs')
        user.blogs.push(blog)
        const updatedUser = await user.save();
        blogLogger.info('Blog created successfully');

        res.status(201).json({
            message: 'Blog created', 
            data: { 
              id: blog.id,
              title: blog.title,
              descripton: blog.description,
              tag: blog.tag,
              body: blog.body,
              author: user.first_name,
              updatedAt: blog.updatedAt,
              createdAt: blog.createdAt
            }  
        })
        
    }catch(err){
        if (!err.statusCode){
            err.statusCode = 500
        }
        blogLogger.error(err);
        next(err)
    }

    }

exports.getBlogs = async (req, res, next) =>{
    try{
        const { limit = 20, page = 1, author, title, tag, order, orderBy} = req.query;
        let sortQ = {};
        
        if(orderBy === "read_count" && order === "asc"){
            sortQ["read_count"] = 'asc'

        }
        else if(orderBy === "read_count" && order === "desc"){
            sortQ["read_count"] = 'desc'
        }
        if(orderBy === "createdAt" && order === "asc"){
            sortQ["createdAt"] = 'asc'

        }
        else if(orderBy === "createdAt" && order === "desc"){
            sortQ["createdAt"] = 'desc'
        }
        if(orderBy === "reading_time" && order === "asc"){
            sortQ["reading_time"] = 'asc'

        }
        else if(orderBy === "reading_time" && order === "desc"){
            sortQ["reading_time"] = 'desc'
        }

        let filterQ = {
            state: 'published'
        };

        if (author){
            filterQ["author"] = { $regex: author}
        }
        else if(title){
            filterQ["title"] = { $regex: title} 
        }
        else if(tag){
            filterQ["tag"] = { $regex: tag} 
        }

        const cacheKey = `blogs:${JSON.stringify(sortQ)}:${JSON.stringify(filterQ)}:${limit}:${page}`

        const data = await redisClient.get(cacheKey);
        if (data){
            blogLogger.info('cache hit')
            return res.status(200).json({
                message: 'All blogs',
                data: JSON.parse(data)
            })
        }
        const blogs = await Blog.find(filterQ)
            .sort(sortQ)
            .skip( (page - 1) * limit)
            .limit(limit)
            .populate('creator', 'first_name email')
            .exec()

        await redisClient.setEx(cacheKey, 10 * 60, JSON.stringify(blogs));
        blogLogger.info('cache miss')
        // blogLogger.info('All blogs', blogs)    
        res.status(200).json({
            message: 'All blogs',
            data: blogs
        })

    }catch(err){
        if (!err.statusCode){
            err.statusCode = 500
        }
        blogLogger.error(err);
        next(err)
    }
}

exports.getABlog = async (req, res, next) =>{

    try{
        const blogId = req.params.blogId;

        const blog = await Blog.findById(blogId).populate('creator', 'first_name last_name email')
        if (!blogId){
            const error = new Error('Blog with not found')
            error.statusCode = 404;
            blogLogger.error(error)
            throw error
        }
        blog.read_count += 1
        blog.save()
        res.status(200).json({
            message: 'Blog',
            data: blog
        })
    }catch(err){
        if(!err.statusCode){
            err.statusCode = 500;
        }
        blogLogger.error(err)
        next(err)
    }
}

exports.updateState = async (req, res, next) =>{
    try{
        const blogId = req.params.blogId;
        const state = req.query.state;
        const blog = await Blog.findById(blogId).populate('creator', 'id, email')
        if (!blog){
            const error = new Error('Blog doesnt exist');
            error.statusCode = 400;
            blogLogger.error(error)
            throw error
        }
        console.log(blog, 'blogIDddddd')
        if (blog.creator._id.toString() !== req.user.toString()){
            const error = new Error('Only authors who created a blog can change its state');
            error.statusCode = 401;
            blogLogger.error(error)
            throw error;
        }
        if (blog.state === 'published'){
            const error = new Error('Blog is already published');
            error.statusCode = 400;
            blogLogger.error(error)
            throw error;
        }
        blog.state = state
        const updatedBlogState = await blog.save();

        blogLogger.info('state updated successfully')
        res.status(200).json({
            message: 'Blog state updated successfully', 
            data: { 
              id: updatedBlogState.id,
              title: updatedBlogState.title,
              body: updatedBlogState.body,
              state: updatedBlogState.state,
              author: updatedBlogState.author,
              updatedAt: updatedBlogState.updatedAt,
              createdAt: updatedBlogState.createdAt
            }  
        })
    }catch(err){
        if(!err.statusCode){
            err.statusCode = 500;
        }
        blogLogger.error(err)
        next(err)

    }

}

exports.editBlog = async (req, res, next) =>{
    try{
        const blogId = req.params.blogId;
        const blog = await Blog.findById(blogId);
        if (!blog){
            const error = new Error ('Blog not found');
            error.statusCode = 404;
            blogLogger.error(error)
            throw error;
        }
        if (blog.creator.toString() !== req.user.toString()){
            const error = new Error ('Only authors of a blog are allowed to edit it');
            error.statusCode = 401;
            blogLogger.error(error)
            throw error;
        }
        const { title, description, tag, state, body} = req.body;
    
        blog.title = title || blog.title;
        blog.description = description || blog.description;
        blog.tag = tag || blog.tag;
        blog.state = state || blog.state;
        blog.body = body || blog.body;
    
        const updatedBlog = await blog.save();
        blogLogger.info('blog updated successfully')
        res.status(200).json({
            message: 'Blog edited and updated successfuly',
            data: updatedBlog
        })
    }catch(err){
        if (!err.statusCode){
            err.statusCode = 500;
        }
        blogLogger.error(err)
        next(err)
    }

}

exports.deleteBlog = async (req, res, next)=>{
    try{
        const blogId = req.params.blogId;
        const blog = await Blog.findById(blogId);
        if (blog.creator.toString() !== req.user.toString()){
            const error = new Error ('Only authors of a blog are allowed to delete it');
            error.statusCode = 401;
            blogLogger.error(error)
            throw error;
        }
        const deletedBlog = await Blog.findByIdAndDelete(blogId);
        await User.updateOne({ _id: req.user}, {$pull: { blogs: blogId}})

        blogLogger.info('blog deleted sucessfully')
        res.status(200).json({
            message: 'Blog deleted',
            data: deletedBlog
        })
    }catch(err){
        if(!err.statusCode){
            err.statusCode = 500;
        }
        blogLogger.error(err)
        next(err)
    }
}

exports.authorBlog = async (req, res, next) =>{

    try{
        let authorblog;
        const { state, limit = 20, page = 1} = req.query;

        if (state){
            const allAuthorBlog = await Blog.find({ author: req.user});
            const blogInState = allAuthorBlog.filter(blog => blog.state === state);
            const paginate = (blogInState, limit, page) => {
                return blogInState.slice((page - 1) * limit, page * limit);
            };            
            const paginatedResults = paginate(blogInState, limit, page);
            authorblog = paginatedResults
        }
        else{
            authorblog = await Blog.find({ author: req.user})
            .skip( (page - 1) * limit)
            .limit(limit)
            .exec()
        }
        blogLogger.error('All author blogs')
        res.status(200).json({
            message: 'All author blogs',
            data: authorblog
    })
    }catch(err){
        if(!err.statusCode){
            err.statusCode = 500;
        }
        blogLoggger.error(err)
        next(err)
        
    }
    
}