const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { rateLimit } = require('express-rate-limit');
const userRoute = require('./routes/user');
const blogRoute = require('./routes/blog');

const app = express()


const limiter = rateLimit({
	windowMs: 0.5 * 60 * 1000, // 15 minutes
	limit: 3, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
	standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
	// store: ... , // Redis, Memcached, etc. See below.
})

// Apply the rate limiting middleware to all requests.
app.use(limiter)

app.use(bodyParser.json())

app.use('/auth', userRoute);
app.use(blogRoute);

app.use((error, req, res, next) =>{
    const data = error.data;
    const status = error.statusCode || 500;
    const message = error.message || 'an error occcured';
    res.status(status).json({ message: message, data: data})
  })

mongoose.connect(process.env.CONNECT).then(connection=>{
    app.listen(process.env.PORT, ()=>{
        console.log(`app is listening on port ${process.env.PORT}`)
    })
}).catch(err=>{
    console.log(err)
})