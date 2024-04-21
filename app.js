const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const userRoute = require('./routes/user');
const blogRoute = require('./routes/blog');

const app = express()

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