
const express = require("express");
const router = express.Router();

const ctrl = require("../controllers/index.js");

// Commons middlewares for all modules
router.use("/tests", ctrl.lang, ctrl.tests);
router.use("/", ctrl.lang, ctrl.web);
router.post("*", ctrl.post);

// Specific middlewares for each module
router.use("/tests", require("./tests/routes.js"));
router.use("/uae", ctrl.auth, require("./uae/routes.js"));
router.use(require("./web/routes.js"));

module.exports = router;
