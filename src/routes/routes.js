
const express = require("express");
const router = express.Router();

const ctrl = require("../controllers/index.js");

router.use("/tests", require("./tests/routes.js"));
router.use("/uae", ctrl.auth, require("./uae/routes.js"));
router.use(require("./web/routes.js"));

module.exports = router;
