require('dotenv').config()

const express = require('express')
const app = express()
const mongoose = require('mongoose')
const userRoute = require('./routes/users')
const cookieParser = require('cookie-parser')
const path = require('path')
const blogModel = require('./models/blogs')
const {checkAuth} = require('./middlewares/authenticaton')
const blogRoute = require('./routes/blogs')

const PORT = process.env.PORT;

mongoose.connect(process.env.MONGO_URL)
.then((e)=> console.log("Connected Mongoooooose"))

app.set("view engine", "ejs")
app.use(express.urlencoded({extended: false}))
app.use(cookieParser())
app.use(express.static(path.resolve('./public')))


app.use(checkAuth("token"))
app.use('/users', userRoute)
app.use('/blogs', blogRoute)

app.get('/', async (req, res)=>{
    const allblogs = await blogModel.find({})
    res.render('home', {
        user: req.user,
        blogs: allblogs
    })
})

app.listen(PORT, ()=>{
    console.log('Listening at PORT http://localhost:3000')
})