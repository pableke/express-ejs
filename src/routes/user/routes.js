
const express = require("express");
const router = express.Router();

const pass = require("../../controllers/user/pass.js");
const perfil = require("../../controllers/user/perfil.js");

router.get("/pass.html", pass.pass);
router.get("/password.html", pass.pass);

router.get("/", perfil.perfil);
router.get("/perfil.html", perfil.perfil);

module.exports = router;
