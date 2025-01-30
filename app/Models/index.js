const sequelize = require("../Connection/sequelize");
// const users = require("../Models/users");
const company = require("../Models/company");
const department = require("../Models/department");
const role = require("../Models/role");
const designation = require("../Models/designation");
const payment = require("../Models/payment");
const employee = require("../Models/employee");
const plan = require("../Models/plan");
const project = require('../Models/project');
const task = require("../Models/task");
const board = require("../Models/board");
const priority = require("./priority");
const companyStructure = require("./companyStructure");




const synchronize = sequelize.sync({ alter: true }).then(() => {
    console.log('All table connected');

}).catch((err) => {
    console.log(err.message);

})

module.exports = synchronize