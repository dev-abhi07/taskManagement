const sequelize = require("../Connection/sequelize");
// const users = require("../Models/users");
const company = require("../Models/company");
const department = require("../Models/department");
const role = require("../Models/role");
const designation = require("../Models/designation");
const payment = require("../Models/payment");
const employee = require("../Models/employee");
const plan = require("../Models/plan");
const emp_hierarchy = require("../Models/employees_hierarchy");









const synchronize = sequelize.sync({alter:true}).then(()=>{
    console.log('All table connected');
    
   }).catch((err)=>{
   console.log(err.message);
   
   })
   
module.exports = synchronize