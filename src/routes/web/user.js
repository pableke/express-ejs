
const express = require("express");
const router = express.Router();

const ctrl = require("app/controllers/index.js");
const login = require("app/controllers/web/public/login.js");
const admin = require("app/controllers/web/user/admin.js");
const pass = require("app/controllers/web/user/pass.js");
const profile = require("app/controllers/web/user/profile.js");

router.get("/", login.home).get("/index.html", login.home).get("/home.html", login.home).get("/inicio.html", login.home);
router.get("/list.html", admin.list).get("/view.html", admin.view).get("/delete.html", admin.delete);
router.post("/save.html", ctrl.post, admin.save, admin.error);

router.get("/pass.html", pass.view).get("/password.html", pass.view);
router.post("/pass.html", ctrl.post, pass.save, pass.error)
	.post("/password.html", ctrl.post, pass.save, pass.error);

router.get("/profile.html", profile.view).get("/perfil.html", profile.view);
router.post("/profile.html", ctrl.post, profile.save, profile.error)
	.post("/perfil.html", ctrl.post, profile.save, profile.error);

module.exports = router;
