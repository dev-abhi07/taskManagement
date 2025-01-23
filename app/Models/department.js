const { DataTypes } = require("sequelize");
const sequelize = require("../Connection/sequelize");

const department = sequelize.define('',{
    company_id:{
        type:DataTypes.BIGINT,
        allowNull:false
    },
    name:{
        type:DataTypes.STRING,
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
// sequelize
//   .sync({alter:true})
//   .then(() => {
//     console.log("Database & tables created!");
//   })
//   .catch((error) => {
//     console.error("Error creating database & tables:", error);
//   });
module.exports = department;