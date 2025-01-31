const Helper = {};
const CryptoJS = require("crypto-js");
const users = require("../Models/users");
Helper.response = (status, message, data = [], res, statusCode) => {
  res.status(statusCode).json({
    status: status,
    message: message,
    data: data,
  });
};

Helper.encryptPassword = (password) => {
  console.log("Password:", password);
  var pass = CryptoJS.AES.encrypt(password, process.env.SECRET_KEY).toString();
  return pass;
};

Helper.decryptPassword = (password) => {
  var bytes = CryptoJS.AES.decrypt(password, process.env.SECRET_KEY);
  var originalPassword = bytes.toString(CryptoJS.enc.Utf8);
  return originalPassword;
};

Helper.getUserId = async (req) => {
  const token = req.headers['authorization'];
  const string = token.split(" ");
  const user = await users.findOne({ where: { token: string[1] } });
}

Helper.dateFormat = async (date) => {
  const istDate = new Date(date).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true, // Use 12-hour format
    timeZone: "Asia/Kolkata",
  });

  return istDate
}

module.exports = Helper;
