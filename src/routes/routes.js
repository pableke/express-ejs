
const express = require("express");
const router = express.Router();

router.use("/tests", require("./tests/routes.js"));
router.use("/uae", require("./uae/routes.js"));
router.use(require("./web/routes.js"));

module.exports = router;
