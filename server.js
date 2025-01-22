const bodyParser = require('body-parser')
const express = require('express')
const { readdirSync } = require('fs')
const app = express()
const cookieParser = require('cookie-parser')
const { configDotenv } = require('dotenv').config()
const cors = require('cors')
const body = require('body-parser')

const port = process.env.SERVER_PORT || 9000


readdirSync('./app/Routes').map((route) =>

    app.use('/api', require('./app/Routes/' + route))
)

app.listen(port, () => console.log(`listening to port:${port} `))