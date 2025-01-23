const { DataTypes } = require("sequelize");
const sequelize = require("../Connection/sequelize");

const employee = sequelize.define("employee", {
  company_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
  user_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  department_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  designation_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});
// sequelize
//   .sync({force:true})
//   .then(() => {
//     console.log("Database & tables created!");
//   })
//   .catch((error) => {
//     console.error("Error creating database & tables:", error);
//   });
module.exports = employee