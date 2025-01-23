const express = require('express')
const { register } = require('../Controllers/Company/employee')
const { createDepartment, getDepartments, updateDepartment, deleteDepartment } = require('../Controllers/Company/department')
const router = express.Router()

router.post('/register',register)
router.post('/create-department',createDepartment)
router.post('/get-department',getDepartments)
router.post('/update-department',updateDepartment)
router.post('/delete-department',deleteDepartment)


module.exports = router