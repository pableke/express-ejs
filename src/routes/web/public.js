
const express = require("express");
const router = express.Router();

const basename = "../../controllers/";
const main = require(basename + "web/public/index.js");
const login = require(basename + "web/public/login.js");

router.get("/", main.index).get("/index.html", main.index)
	.get("/home.html", main.index).get("/inicio.html", main.index);
router.get("/login.html", login.login).post("/login.html", login.auth)

module.exports = router;
