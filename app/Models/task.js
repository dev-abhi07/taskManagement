const { DataTypes } = require("sequelize");
const sequelize = require("../Connection/sequelize");

const task = sequelize.define('task',{
    company_id:{
        type:DataTypes.BIGINT,
        allowNull:false
    },
    user_id:{
        type:DataTypes.BIGINT,
        allowNull:false
    },
    task_title:{
        type:DataTypes.STRING,
        allowNull:false
    },
    task_description:{
        type:DataTypes.TEXT,
        allowNull:false
    },
    project_id:{
        type:DataTypes.BIGINT,
        allowNull:false
    },
    assign_id:{
        type:DataTypes.ARRAY(DataTypes.BIGINT),
        allowNull:false
    },
    priority:{
        type:DataTypes.BIGINT,
        allowNull:false
    },
    start_date:{
        type:DataTypes.STRING(25),
        allowNull:false
    },
    end_date:{
        type:DataTypes.STRING(25),
        allowNull:false
    },
    board_id:{
        type:DataTypes.BIGINT,
        allowNull:false
    },
    task_order:{
        type:DataTypes.ARRAY(DataTypes.TEXT),
        allowNull: false,
        defaultValue: [],
    },
    status:{
        type:DataTypes.BOOLEAN,
        allowNull:false,
        defaultValue:false
    },
})

module.exports = task