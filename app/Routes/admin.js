const express = require("express");
const { planList} = require("../Controllers/Admin/plan");
const router = express.Router();

router.post('/plan-list',planList)
// router.post('/demo-plan',demoPlan)



module.exports = router;