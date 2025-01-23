const express = require('express')
const { register } = require('../Controllers/Company/employee')
const router = express.Router()

router.post('/register',register)


module.exports = router