const { DataTypes } = require("sequelize");
const sequelize = require("../Connection/sequelize");


const users = sequelize.define("user", {
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
    type: DataTypes.INTEGER,
    allowNull: false,
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
  }
});
// sequelize
//     .sync({force:true})
//     .then(() => {
//         console.log("Database & tables created!");
//     })
//     .catch((error) => {
//         console.error("Error creating database & tables:", error);
//     });


module.exports = users;
