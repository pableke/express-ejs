
const express = require("express");
const router = express.Router();

router.use(require("./web/routes.js"));
router.use("/uae", require("./uae/routes.js"));

module.exports = router;
