
const express = require("express");
const router = express.Router();

const basename = "../../../controllers/";
const pass = require(basename + "web/user/pass.js");
const perfil = require(basename + "web/user/perfil.js");

router.get("/pass.html", pass.pass);
router.get("/password.html", pass.pass);

router.get("/", perfil.perfil);
router.get("/perfil.html", perfil.perfil);

module.exports = router;
