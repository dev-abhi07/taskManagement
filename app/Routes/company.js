const express = require('express')

const { register,departmentDesignationBasedEmployee, getReportDepartmentAndDesignation } = require('../Controllers/Company/employee')

const { createDepartment, getDepartments, updateDepartment, deleteDepartment } = require('../Controllers/Company/department')
const { createDesignation, getDesignations, updateDesignation, deleteDesignation, designationsList } = require('../Controllers/Company/designation')
const { registerHierarchy } = require('../Controllers/Company/company')
const { createBoard, boardList, updateBoard, deleteboard } = require('../Controllers/Company/board')
const router = express.Router()

router.post('/register-employee',register)
// router.post('/create-department',createDepartment)
// router.post('/get-department',getDepartments)
// router.post('/update-department',updateDepartment)
// router.post('/delete-department',deleteDepartment)
// router.post('/create-designation',createDesignation)
// // router.post('/designation-list',getDesignations)
// router.post('/update-designation',updateDesignation)
// router.post('/delete-designation',deleteDesignation)

const { register, departmentDesignationBasedEmployee,getReportDepartmentAndDesignation } = require('../Controllers/Company/employee')

const { createDepartment, getDepartments, updateDepartment, deleteDepartment, getDepartmentNameById } = require('../Controllers/Company/department')
const { createDesignation, updateDesignation, deleteDesignation, designationsList } = require('../Controllers/Company/designation')

const { createCompanyStructure, getAllCompanyLevels, updateCompanyStructure, deleteCompanyStructure, companyLevels } = require('../Controllers/Company/company')
const { createProject, getProject, deleteProject, updateProject } = require('../Controllers/Company/project')
const { createPriority, getPriority, deletePriority, updatePriority } = require('../Controllers/Company/priority')
const { createTask, getTask, deleteTask, updateTask } = require('../Controllers/Company/task')

const router = express.Router()


//Department
router.post('/create-department',createDepartment)
router.post('/department-list',getDepartments)
router.post('/update-department',updateDepartment)
router.post('/delete-department',deleteDepartment)
router.post('/get-team-by-department-dd',getDepartmentNameById)

//Employee
router.post('/register-employee',register)



//Designation

router.post('/create-designation',createDesignation)
router.post('/designation-list',designationsList)
router.post('/update-designation',updateDesignation)
router.post('/delete-designation',deleteDesignation)


//boards
router.post('/create-board',createBoard)
router.post('/board-list',boardList)
router.post('/update-board',updateBoard)
router.post('/delete-board',deleteboard)


//Employee
router.post('/get-designation-by-department',departmentDesignationBasedEmployee)
router.post('/get-report-to-by-department-and-designation-id',getReportDepartmentAndDesignation)



//Company Structure
router.post('/create-company-structure',createCompanyStructure)
router.post("/company-structure-list", getAllCompanyLevels);
router.post("/update-company-structure", updateCompanyStructure);
router.post("/delete-company-structure", deleteCompanyStructure);
router.post("/get-company-level-dd",companyLevels)

//

//Project
router.post('/create-project',createProject);
router.get('/get-project',getProject);
router.delete('/delete-project',deleteProject);
router.post('/update-project',updateProject);


//Priority
router.post('/create-priority',createPriority);
router.get('/get-priority',getPriority);
router.delete('/delete-priority',deletePriority);
router.post('/update-priority',updatePriority);


//Task
router.post('/create-task',createTask);
router.get('/get-task',getTask);
router.delete('/delete-task',deleteTask);
router.post('/update-task',updateTask);



module.exports = router

