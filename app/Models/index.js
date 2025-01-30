const sequelize = require("../Connection/sequelize");
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