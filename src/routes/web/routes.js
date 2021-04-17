
const express = require("express");
const router = express.Router();

const web = require("../../controllers/web/index.js");

router.get("/", web.index).get("/index.html", web.index).get("/home.html", web.index).get("/inicio.html", web.index);
router.use("/user", require("./user.js"));

module.exports = router;
