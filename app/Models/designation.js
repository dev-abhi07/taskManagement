const { DataTypes } = require("sequelize");
const sequelize = require("../Connection/sequelize");
const department = require("./department");


const designation = sequelize.define('designation',{
    company_id:{
        type:DataTypes.BIGINT,
        allowNull:false
    },

    department_id:{
        type:DataTypes.BIGINT,
        allowNull:false
    },

    name:{
        type:DataTypes.STRING,
        allowNull:false
    },

    status:{
        type:DataTypes.STRING,
        allowNull:false,
        defaultValue:true
    },
    created_by:{
        type:DataTypes.BIGINT,
        allowNull:false
    }
})

// sequelize
//   .sync({force:true})
//   .then(() => {
//     console.log("Database & tables created!");
//   })
//   .catch((error) => {
//     console.error("Error creating database & tables:", error);
//   });


module.exports = designation


