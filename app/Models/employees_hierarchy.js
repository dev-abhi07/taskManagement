const { DataTypes } = require("sequelize");
const sequelize = require("../Connection/sequelize");

const emp_hierarchy = sequelize.define('emp_hierarchy',{
    employee_id:{
        type:DataTypes.BIGINT,
        allowNull:false
    },
    manager_id:{
        type:DataTypes.BIGINT,
        allowNull:false,        
    },
    role_id:{
        type:DataTypes.BIGINT,
        allowNull:false
    },
    department_id:{
        type:DataTypes.BIGINT,
        allowNull:false
    },
    created_by:{
        type:DataTypes.BIGINT,
        allowNull:false
    }
})
sequelize
  .sync({force:true})
  .then(() => {
    console.log("Database & tables created!");
  })
  .catch((error) => {
    console.error("Error creating database & tables:", error);
  });

module.exports = emp_hierarchy