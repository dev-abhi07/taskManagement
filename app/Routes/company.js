const express = require('express')
const { register, departmentDesignationBasedEmployee,getReportDepartmentAndDesignation } = require('../Controllers/Company/employee')

const { createDepartment, getDepartments, updateDepartment, deleteDepartment, getDepartmentNameById } = require('../Controllers/Company/department')
const { createDesignation, updateDesignation, deleteDesignation, designationsList } = require('../Controllers/Company/designation')

const { createCompanyStructure, getAllCompanyLevels, updateCompanyStructure, deleteCompanyStructure, companyLevels } = require('../Controllers/Company/company')
const { createProject, getProject, deleteProject, updateProject } = require('../Controllers/Company/project')
const { createPriority, getPriority, deletePriority, updatePriority } = require('../Controllers/Company/priority')
const { createTask, getTask, deleteTask, updateTask } = require('../Controllers/Company/task')
const { createBoard, boardList, updateBoard, deleteBoard } = require('../Controllers/Company/board')




//Department
router.post('/create-department',createDepartment)
router.post('/department-list',getDepartments)
router.post('/update-department',updateDepartment)
router.post('/delete-department',deleteDepartment)
router.post('/get-team-by-department-dd',getDepartmentNameById)


//boards
router.post('/create-board',createBoard)
router.post('/board-list',boardList)
router.post('/update-board',updateBoard)
router.post('/delete-board',deleteBoard)

//Employee
router.post('/register-employee',register)



//Designation

router.post('/create-designation',createDesignation)
router.post('/designation-list',designationsList)
router.post('/update-designation',updateDesignation)
router.post('/delete-designation',deleteDesignation)


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
router.post('/project-list',getProject);
router.post('/delete-project',deleteProject);
router.post('/update-project',updateProject);


//Priority
router.post('/create-priority',createPriority);
router.post('/get-priority',getPriority);
router.post('/delete-priority',deletePriority);
router.post('/update-priority',updatePriority);


//Task
router.post('/create-task',createTask);
router.post('/get-task',getTask);
router.post('/delete-task',deleteTask);
router.post('/update-task',updateTask);


module.exports = router

