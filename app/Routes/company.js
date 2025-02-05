const express = require('express')

// const { register,departmentDesignationBasedEmployee, getReportDepartmentAndDesignation } = require('../Controllers/Company/employee')

// const { createDepartment, getDepartments, updateDepartment, deleteDepartment } = require('../Controllers/Company/department')
// const { createDesignation,updateDesignation, deleteDesignation, designationsList } = require('../Controllers/Company/designation')
const { registerHierarchy } = require('../Controllers/Company/company')
const { createBoard, boardList, updateBoard,deleteBoard } = require('../Controllers/Company/board')

const { register, departmentDesignationBasedEmployee,getReportDepartmentAndDesignation, employeeList, employeeDashboard } = require('../Controllers/Company/employee')

const { createDepartment, getDepartments, updateDepartment, deleteDepartment, getDepartmentNameById } = require('../Controllers/Company/department')
const { createDesignation, updateDesignation, deleteDesignation, designationsList } = require('../Controllers/Company/designation')

const { createCompanyStructure, getAllCompanyLevels, updateCompanyStructure, deleteCompanyStructure, companyLevels } = require('../Controllers/Company/company')
const { createProject, getProject, deleteProject, updateProject, projectListDropDown, getUserListProject } = require('../Controllers/Company/project')
const { createPriority, getPriority, deletePriority, updatePriority, prioritiesDropDown } = require('../Controllers/Company/priority')
const { createTask, getTask, deleteTask, updateTask } = require('../Controllers/Company/task')
const { authenticate, Employee } = require('../middleware/auth')

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
router.post('/delete-board',deleteBoard)


//Employee
router.post('/get-designation-by-department',departmentDesignationBasedEmployee)
router.post('/get-report-to-by-department-and-designation-id',getReportDepartmentAndDesignation)
router.post('/employee-list',employeeList)
router.post('/employee-dashboard',authenticate,Employee,employeeDashboard)



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
router.post('/get-project-dd',projectListDropDown)
router.post('/get-user-by-project-dd',getUserListProject)


//Priority
router.post('/create-priority',createPriority);
router.post('/priority-list',getPriority);
router.post('/delete-priority',deletePriority);
router.post('/update-priority',updatePriority);
router.post('/get-priority-dd',prioritiesDropDown)


//Task
router.post('/create-task',createTask);
router.get('/get-task',getTask);
router.delete('/delete-task',deleteTask);
router.post('/update-task',updateTask);



module.exports = router