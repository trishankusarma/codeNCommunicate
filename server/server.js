const express =  require("express")

//for backend framework for making http request and response

const cors = require('cors')

// cross origin resource sharing

const cookieParser = require("cookie-parser")

const app = express()

require("dotenv").config()

// process.env.VARIABLE_NAME

require('./db/db')

const { PORT , CLIENT_URL , SECRET } = process.env

//MIDDLE_WARE

app.use(express.urlencoded({extended:false}))
app.use(express.json())

app.use(
    cors({
      origin: CLIENT_URL,
      credentials: true,
    })
)

app.use(cookieParser(SECRET))

const routes = require('./routes')

app.use('/',routes)

app.listen(PORT ,()=>{
    console.log(`Server is running on port ${PORT}`)
})