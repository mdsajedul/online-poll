const express = require('express')
const morgan = require('morgan')
const mongoose = require('mongoose')
const pollController = require('./controller/pollController')

const app = express();

app.set('view engine','ejs')

app.use(morgan('dev'))
app.use(express.urlencoded({extended:true}))
app.use(express.json())

app.get('/',(req,res)=>{
    res.render('home')
})
app.get('/create',pollController.createPollGetController)
app.post('/create',pollController.createPollPostController)
app.get('/polls',pollController.getAllPolls)
app.get('/polls/:id',pollController.viewPollGetController)
app.post('/polls/:id',pollController.viewPollPostController)

mongoose.connect('mongodb://localhost:27017/onlinePool',{useNewUrlParser:true})
    .then(()=>{
        app.listen(8080,()=>{
            console.log('App is running on PORT 8080');
        })
    })
    .catch(e=>{
        console.log(e);
    })