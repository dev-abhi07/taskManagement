const { DataTypes } = require("sequelize");
const sequelize = require("../Connection/sequelize");

const role = sequelize.define("role", {
  name: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
});
// sequelize
//   .sync()
//   .then(() => {
//     console.log("Database & tables created!");
//   })
//   .catch((error) => {
//     console.error("Error creating database & tables:", error);
//   });
module.exports = role;
