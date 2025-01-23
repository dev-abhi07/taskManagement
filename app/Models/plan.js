const { DataTypes } = require("sequelize");
const sequelize = require("../Connection/sequelize");

const plan = sequelize.define("plan", {
    plan_name: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    plan_type:{
        type:DataTypes.BIGINT,
        defaultValue:0
    },
    plan_description:{
        type:DataTypes.TEXT,
        allowNull:false
    },
    max_users: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    billing_cycle:{
        type:DataTypes.STRING,
        allowNull:false
    },
    trial_period:{
        type:DataTypes.BIGINT,
        allowNull:false
    },
    price: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    created_by: {
        type: DataTypes.BIGINT,
        defaultValue: 0,
    },
    status:{
        type:DataTypes.BOOLEAN,
        allowNull:false,
        defaultValue:false
    }
});
// sequelize
//     .sync()
//     .then(() => {
//         console.log("Database & tables created!");
//     })
//     .catch((error) => {
//         console.error("Error creating database & tables:", error);
//     });
module.exports = plan