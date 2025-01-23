const sequelize = require("../../Connection/sequelize");
const department = require("../../Models/department");
const users = require("../../Models/users");

exports.login = async (req, res) => {
    
    const data = req.body
    const user = await users.findOne({
        where: {
        [Op.or]: [{ username: req.body.login_id }, { email: req.body.login_id }],
        },
    });

    console.log(user,255);
        
}