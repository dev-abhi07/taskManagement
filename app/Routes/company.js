const express = require('express')

// const { register,departmentDesignationBasedEmployee, getReportDepartmentAndDesignation } = require('../Controllers/Company/employee')

// const { createDepartment, getDepartments, updateDepartment, deleteDepartment } = require('../Controllers/Company/department')
// const { createDesignation,updateDesignation, deleteDesignation, designationsList } = require('../Controllers/Company/designation')
const { registerHierarchy } = require('../Controllers/Company/company')
const { createBoard, boardList, updateBoard,deleteBoard } = require('../Controllers/Company/board')

const { register, departmentDesignationBasedEmployee,getReportDepartmentAndDesignation, employeeList } = require('../Controllers/Company/employee')

const { createDepartment, getDepartments, updateDepartment, deleteDepartment, getDepartmentNameById, departmentListDropDown } = require('../Controllers/Company/department')
const { createDesignation, updateDesignation, deleteDesignation, designationsList } = require('../Controllers/Company/designation')

const { createCompanyStructure, getAllCompanyLevels, updateCompanyStructure, deleteCompanyStructure, companyLevels } = require('../Controllers/Company/company')
const { createProject, getProject, deleteProject, updateProject, projectListDropDown, getUserListProject } = require('../Controllers/Company/project')
const { createPriority, getPriority, deletePriority, updatePriority, prioritiesDropDown } = require('../Controllers/Company/priority')
const { createTask, getTask, deleteTask, updateTask, taskList } = require('../Controllers/Company/task')
const { authenticate, Employee } = require('../middleware/auth')
const { employeeDashboard } = require('../Controllers/Company/dashboard')

const router = express.Router()


//Department
router.post('/create-department',authenticate,createDepartment)
router.post('/department-list',authenticate,getDepartments)
router.post('/update-department',authenticate,updateDepartment)
router.post('/delete-department',authenticate,deleteDepartment)
router.post('/get-team-by-department-dd',authenticate,Employee,getDepartmentNameById)
router.post('/get-department-dd',authenticate,Employee,departmentListDropDown)

//Employee
router.post('/register-employee',authenticate,register)



//Designation

router.post('/create-designation',authenticate,createDesignation)
router.post('/designation-list',authenticate,designationsList)
router.post('/update-designation',authenticate,updateDesignation)
router.post('/delete-designation',authenticate,deleteDesignation)


//boards
router.post('/create-board',authenticate,Employee,createBoard)
router.post('/board-list',authenticate,Employee,boardList)
router.post('/update-board',authenticate,Employee,updateBoard)
router.post('/delete-board',authenticate,Employee,deleteBoard)


//Employee
router.post('/get-designation-by-department',authenticate,departmentDesignationBasedEmployee)
router.post('/get-report-to-by-department-and-designation-id',authenticate,getReportDepartmentAndDesignation)
router.post('/employee-list',authenticate,employeeList)



//Company Structure
router.post('/create-company-structure',createCompanyStructure)
router.post("/company-structure-list", getAllCompanyLevels);
router.post("/update-company-structure", updateCompanyStructure);
router.post("/delete-company-structure", deleteCompanyStructure);
router.post("/get-company-level-dd",companyLevels)

//

//Project
router.post('/create-project',authenticate,Employee,createProject);
router.post('/project-list',authenticate,Employee,getProject);
router.delete('/delete-project',deleteProject);
router.post('/update-project',updateProject);
router.post('/get-project-dd',authenticate,Employee,projectListDropDown)
router.post('/get-user-by-project-dd',authenticate,Employee,getUserListProject)


//Priority
router.post('/create-priority',authenticate,createPriority);
router.post('/priority-list',authenticate,getPriority);
router.post('/delete-priority',authenticate,deletePriority);
router.post('/update-priority',authenticate,updatePriority);
router.post('/get-priority-dd',authenticate,Employee,prioritiesDropDown)


//Task
router.post('/create-task',authenticate,Employee,createTask);
router.get('/get-task',authenticate,Employee,getTask);
router.delete('/delete-task',authenticate,Employee,deleteTask);
router.post('/update-task',authenticate,Employee,updateTask);
router.post('/task-list',authenticate,Employee,taskList)



module.exports = router