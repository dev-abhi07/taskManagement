const { DataTypes } = require("sequelize");
const sequelize = require("../Connection/sequelize");
const users = sequelize.define("users", {
  name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  company_id:{
    type:DataTypes.BIGINT,
    allowNull:false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },  
  mobile: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type:DataTypes.ENUM('admin', 'company', 'employee'),
    allowNull:false
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  auth_key:{
    type:DataTypes.TEXT,
    allowNull:true
  },
  created_by: {
    type: DataTypes.BIGINT,
    defaultValue: 0,
  },
  status:{
    type:DataTypes.BOOLEAN,
    defaultValue:true,
    allowNull:false
  }
});

module.exports = users;