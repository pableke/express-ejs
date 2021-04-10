
const express = require("express");
const router = express.Router();

const basename = "../../../controllers/";
const tests = require(basename + "web/tests/zip.js");

router.get("/", tests.index).get("/index.html", tests.index)
	.get("/home.html", tests.index).get("/inicio.html", tests.index);

router.get("/usuarios.html", tests.usuarios);
router.post("/email.html", tests.email);
router.get("/zip.html", tests.zip);

module.exports = router;
