const express = require("express");
const { login } = require("../Controllers/Auth/login");
const router = express.Router();
const { Register } = require("../Controllers/Auth/register");
const { companyRegister } = require("../Controllers/Auth/register");

router.post('/login',login)
router.post('/company-register',companyRegister)

module.exports = router;