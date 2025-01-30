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

module.exports = role;
