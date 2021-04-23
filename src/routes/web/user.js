
const express = require("express");
const router = express.Router();

const basename = "../../controllers/web/user/";
const admin = require(basename + "admin.js");
const pass = require(basename + "pass.js");
const profile = require(basename + "profile.js");
const login = require("../../controllers/web/public/login.js");

router.get("/", login.home).get("/index.html", login.home).get("/home.html", login.home).get("/inicio.html", login.home);
router.get("/list.html", admin.list).get("/view.html", admin.view);

router.get("/pass.html", pass.view).get("/password.html", pass.view);
router.post("/pass.html", pass.save).post("/password.html", pass.save);

router.get("/profile.html", profile.view).get("/perfil.html", profile.view);
router.post("/profile.html", profile.save).post("/perfil.html", profile.save);

module.exports = router;
