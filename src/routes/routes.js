
const express = require("express");
const router = express.Router();

const login = require("app/controllers/web/public/login.js");

// Specific middlewares for each module
router.use("/tests", require("./tests/routes.js"));
router.use("/uae", login.auth, require("./uae/routes.js"));
router.use("", require("./web/routes.js"));

module.exports = router;
