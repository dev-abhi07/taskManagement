const express = require("express");
const { login } = require("../Controllers/Auth/login");

const router = express.Router();

const { companyRegister } = require("../Controllers/Auth/register");

router.post('/login',login)
router.post('/demo-plan',companyRegister)

module.exports = router;