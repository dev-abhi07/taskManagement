const express = require("express");
const router = express.Router();
const { planList, demoPlan } = require("../Controllers/Admin/plan");


router.post('/plan-list',planList)


module.exports = router;