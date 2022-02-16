if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const express = require('express')
const app = express()
const ejs = require('ejs')
const methodOverride = require('method-override')

const path = require('path')
const ejsMate = require('ejs-mate')

const dbURL = process.env.DB_URL

const port = process.env.PORT || 8000

// Routes
const product = require('./routes/product')
const api = require('./routes/api')
const user = require('./routes/user')

const mongoose=require('mongoose')
const Product =require('./model/product')
const User = require('./model/user')

const passport = require('passport')
const localStrategy = require('passport-local')

const session = require('express-session')
// 'mongodb://localhost:27017/shop'
mongoose.connect(dbURL)
.then(()=>{
    console.log('Connected to database')
})
.catch(e=>{
    console.log('Error', e)
})

const sessionDetail = {
    secret: 'secretCode',
    saveUninitialized: true,
    resave:false,
    cookie:{
        httpOnly: true,
        expires: Date.now() + 1000*60*60*24*7,
        maxAge:1000*60*60*24*7
    }
}
app.use(session(sessionDetail))

app.use(passport.initialize())
app.use(passport.session())
passport.use(new localStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use((req, res, next)=>{
    res.locals.currentUser = req.user
    next()
})

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({extended:true}))
app.use(methodOverride('_method'))

app.use('/product/api', api)
app.use('/product', product)
app.use('/',user)


app.listen(port, ()=>{
    console.log(`Listening to port ${port}`)
})