const express = require("express");
const { login } = require("../Controllers/Auth/login");
const { companyRegister } = require("../Controllers/Auth/register");

const router = express.Router();

router.post('/login',login)
router.post('/company-register',companyRegister)
module.exports = router;