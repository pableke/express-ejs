
const express = require("express");
const router = express.Router();

const ctrl = require("app/controllers/index.js");
const login = require("app/controllers/web/public/login.js");

// Commons middlewares for all modules
router.use("/tests", ctrl.lang, ctrl.tests);
router.use("/", ctrl.lang, ctrl.web);

// Specific middlewares for each module
router.use("/tests", require("./tests/routes.js"));
router.use("/uae", login.auth, require("./uae/routes.js"));
router.use(require("./web/routes.js"));

module.exports = router;
