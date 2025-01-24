const express = require('express')
const { register } = require('../Controllers/Company/employee')
const { registerHierarchy } = require('../Controllers/Company/company')
const router = express.Router()

router.post('/register',register)
router.post('/register-hierarchy',registerHierarchy)

module.exports = router