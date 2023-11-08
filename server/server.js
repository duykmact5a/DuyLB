const express = require('express')
require('dotenv').config()
const dbConnect = require('./config/dbconnect')
const initRouter = require('./routes')

const app = express()
const port = process.env.PORT || 8888
app.use(express.json())
app.use(express.urlencoded({extended: true}))
dbConnect()
initRouter(app)

app.use('/' , (req , res) => {res.send('SERVER ONNNN')})
app.listen(port ,() =>{
    console.log('server running on the port: ' + port);
}) 