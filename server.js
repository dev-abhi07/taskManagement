const express = require('express')
const { readdirSync } = require('fs')
const app = express()
const cookieParser = require('cookie-parser')
const { configDotenv } = require('dotenv').config()
const cors = require('cors')
const body = require('body-parser')
// const synchronize = require('./app/Models/index')


const port = process.env.SERVER_PORT || 9000

app.use(express.json())
app.use(
    cors({
        origin: '*',
    }),
)


app.use(body.json({ limit: '5mb' }))
app.use(body.urlencoded({ extended: true }))


readdirSync('./app/Routes').map((route) =>

    app.use('/api', require('./app/Routes/' + route))
)

app.listen(port, () => console.log(`listening to port:${process.env.BASE_URL} `))