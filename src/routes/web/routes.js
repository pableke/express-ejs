
const express = require("express");
const router = express.Router();

const valid = require("../../controllers/validators.js");

router.use(require("./tests/routes.js"));
router.use("/user", valid.auth, require("./user/routes.js"));

module.exports = router;
