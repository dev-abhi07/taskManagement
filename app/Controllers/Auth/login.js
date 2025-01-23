const sequelize = require("../../Connection/sequelize");
const users = require("../../Models/users");


exports.login = async (req, res) => {
    
    const data = req.body
    const usersData = users.findOne({
        where:{
            
        }
    }) 
}