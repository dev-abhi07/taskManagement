const { DataTypes } = require("sequelize");
const sequelize = require("../Connection/sequelize");

const company  = sequelize.define('company',{
    company_name:{
        type:DataTypes.STRING,
        allowNull:false
    },
    email:{
        type:DataTypes.STRING,
        allowNull:false
    },
    contact_number:{
        type:DataTypes.STRING,
        allowNull:false
    },
    address:{
        type:DataTypes.STRING,
        allowNull:false
    },
    subscription_plan_id:{
        type:DataTypes.STRING,
        allowNull:false
    },
    subscription_start:{
        type:DataTypes.STRING,
        allowNull:false,
    },
    subscription_end:{
        type:DataTypes.STRING,
        allowNull:false
    },
    status:{
        type:DataTypes.STRING,
        allowNull:false
    },
    created_by:{
        type:DataTypes.BIGINT,
        allowNull:false
    }
})
// sequelize
//     .sync()
//     .then(() => {
//         console.log("Database & tables created!");
//     })
//     .catch((error) => {
//         console.error("Error creating database & tables:", error);
//     });
module.exports = company