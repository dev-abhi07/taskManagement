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

module.exports = Helper;
