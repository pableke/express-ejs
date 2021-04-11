
const express = require("express");
const router = express.Router();

const valid = require("../../controllers/validators.js");

router.use(require("./public.js"));
router.use("/user", valid.auth, require("./user.js"));

module.exports = router;
