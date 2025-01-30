const { DataTypes } = require("sequelize");
const sequelize = require("../Connection/sequelize");

const board = sequelize.define('board', {
    company_id: {
        type: DataTypes.BIGINT,
        allowNull: false
    },
    user_id:{
        type:DataTypes.BIGINT,
        allowNull:false
    },
    board_name: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    board_color: {
        type: DataTypes.STRING(10),
        allowNull: false
    },
    board_order: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    created_by: {
        type: DataTypes.BIGINT,
        allowNull: false
    },
    status: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    }
})
module.exports = board