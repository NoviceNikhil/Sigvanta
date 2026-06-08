const { getDashboard } = require("../controllers/dashboardController");
const express = require("express");
const router = express.Router();

router.get("/stats", getDashboard);

module.exports = router;
