const express = require('express')
const { register, departmentDesignationBasedEmployee,getReportDepartmentAndDesignation } = require('../Controllers/Company/employee')

const { createDepartment, getDepartments, updateDepartment, deleteDepartment } = require('../Controllers/Company/department')
const { createDesignation, updateDesignation, deleteDesignation, designationsList } = require('../Controllers/Company/designation')
const { registerHierarchy } = require('../Controllers/Company/company')
const router = express.Router()


//Department
router.post('/create-department',createDepartment)
router.post('/department-list',getDepartments)
router.post('/update-department',updateDepartment)
router.post('/delete-department',deleteDepartment)

router.post('/register-employee',register)
router.post('/register-hierarchy',registerHierarchy)


//Designation

router.post('/create-designation',createDesignation)
router.post('/designation-list',designationsList)
router.post('/update-designation',updateDesignation)
router.post('/delete-designation',deleteDesignation)


//Employee
router.post('/get-designation-by-department',departmentDesignationBasedEmployee)
router.post('/get-report-to-by-department-and-designation-id',getReportDepartmentAndDesignation)

module.exports = router
