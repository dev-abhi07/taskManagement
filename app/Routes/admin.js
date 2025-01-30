const express = require("express");
router.post('/plan-list',planList)
const { planList, demoPlan } = require("../Controllers/Admin/plan");
const router = express.Router();

router.post('/plan-list',planList)
router.post('/demo-plan',demoPlan)



module.exports = router;