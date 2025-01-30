const { DataTypes } = require("sequelize");
const sequelize = require("../Connection/sequelize");
const department = require("./department");


const designation = sequelize.define('designation',{
    company_id:{
        type:DataTypes.BIGINT,
        allowNull:false
    },
    name:{
        type:DataTypes.STRING(50),
        allowNull:false,
    },
    department_id:{
        type:DataTypes.BIGINT,
        allowNull:false
    },
    level:{
        type:DataTypes.BIGINT,
        allowNull:false
    },
    status:{
        type:DataTypes.BOOLEAN,
        allowNull:false,
        defaultValue:true
    },
    created_by:{
        type:DataTypes.BIGINT,
        allowNull:false
    }
})
module.exports = designation


