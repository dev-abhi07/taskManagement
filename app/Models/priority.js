const { DataTypes } = require("sequelize");
const sequelize = require("../Connection/sequelize");

const priority = sequelize.define('priority',{
    company_id:{
        type:DataTypes.BIGINT,
        allowNull:false
    },
    priority_name:{
        type:DataTypes.STRING(50),
        allowNull:false
    },
    color_code:{
        type:DataTypes.STRING(10),
        allowNull:false
    },
    created_by:{
        type:DataTypes.BIGINT,
        allowNull:false
    },
    status:{
        type:DataTypes.BOOLEAN,
        allowNull:false,
        defaultValue:true
    }

})
module.exports = priority