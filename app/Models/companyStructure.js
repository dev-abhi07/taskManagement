const { DataTypes } = require("sequelize");
const sequelize = require("../Connection/sequelize");


const companyStructure = sequelize.define(
    "companyLevel",
    {
        company_id:{
            type:DataTypes.BIGINT,
            allowNull:false,
        },
        name: {
            type: DataTypes.STRING(255),
            allowNull: false,            
            comment: "Entry Level, Mid-Level, Senior-Level, Executive",
        },
        level: {
            type: DataTypes.INTEGER,
            allowNull: false,            
            comment: "Defines company hierarchy levels (1 = Entry, 2 = Mid, 3 = Senior, 4 = Executive)",
        },
        created_by:{
            type:DataTypes.INTEGER,
            allowNull:false
        }

    }
    
);

module.exports = companyStructure;
