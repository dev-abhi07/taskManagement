const { DataTypes } = require("sequelize");
const sequelize = require("../Connection/sequelize");

const payment = sequelize.define('payments',{
    subscriber_id:{
        type:DataTypes.BIGINT,
        allowNull:false
    },
    subscription_plan_id:{
        type:DataTypes.BIGINT,
        allowNull:false
    },
    transaction_id	:{
        type:DataTypes.STRING,
        allowNull:false
    },
    amount:{
        type:DataTypes.DECIMAL(10,2),
        allowNull:false
    },
    payment_date:{
        type:DataTypes.STRING,
        allowNull:false
    },
    payment_method:{
        type:DataTypes.STRING,
        allowNull:false
    },
    payment_status:{
        type:DataTypes.STRING,
        allowNull:false
    }
})

module.exports = payment;

