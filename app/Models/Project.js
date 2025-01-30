const { DataTypes } = require("sequelize");
const sequelize = require("../Connection/sequelize");

const project = sequelize.define('projects',{
    company_id:{
        type:DataTypes.BIGINT,
        allowNull:false
    },
    project_tile:{
        type:DataTypes.STRING,
        allowNull:false
    },
    project_description:{
        type:DataTypes.TEXT,
        allowNull:false
    },
    start_date:{
        type:DataTypes.STRING(25),
        allowNull:false,
    },
    end_date:{
        type:DataTypes.STRING(25),
        allowNull:false,
    },
    team_members:{
        type:DataTypes.STRING(50),
        allowNull:false
    },
    team_lead:{
        type:DataTypes.BIGINT,
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
module.exports = project
