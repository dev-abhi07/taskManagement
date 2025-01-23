const { DataTypes } = require("sequelize");
const sequelize = require("../Connection/sequelize");

const users = sequelize.define("user", {
    name: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    created_by: {
        type: DataTypes.BIGINT,
        defaultValue: 0,
    },
    mobile: {
        type: DataTypes.STRING,
        allowNull: false,
    },
});
// sequelize
//     .sync()
//     .then(() => {
//         console.log("Database & tables created!");
//     })
//     .catch((error) => {
//         console.error("Error creating database & tables:", error);
//     });
module.exports = users