
const express = require("express");
const router = express.Router();

const ctrl = require("app/controllers/index.js");
const login = require("app/controllers/web/public/login.js");

// Specific middlewares for each module
router.use("/tests", ctrl.lang, require("./tests/routes.js"));
router.use("/uae", ctrl.lang, login.auth, require("./uae/routes.js"));
router.use("/", ctrl.lang, require("./web/routes.js"));

module.exports = router;
