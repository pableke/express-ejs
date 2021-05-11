
const express = require("express");
const router = express.Router();

const ctrl = require("app/controllers/index.js");
const contact = require("app/controllers/web/public/contact.js");
const login = require("app/controllers/web/public/login.js");
const reactive = require("app/controllers/web/public/reactive.js");
const singup = require("app/controllers/web/public/signup.js");

router.get("/contact.html", contact.view).get("/contacto.html", contact.view);
router.post("/contact.html", contact.send).post("/contacto.html", contact.send);

router.get("/logout.html", login.logout).get("/signout.html", login.logout);
router.get("/session/destroy.html", login.destroy).get("/session/unload.html", login.destroy);
router.get("/login.html", login.view).get("/signin.html", login.view);
router.post("/login.html", ctrl.post, login.check, login.error)
	.post("/signin.html", ctrl.post, login.check, login.error);

router.get("/reactive.html", reactive.view).get("/reactivate.html", reactive.view).get("/reactivar.html", reactive.view);
router.post("/reactive.html", reactive.send).post("/reactivate.html", reactive.send).post("/reactivar.html", reactive.send);

router.get("/signup.html", singup.view).get("/register.html", singup.view).get("/registro.html", singup.view);
router.post("/signup.html", singup.save).post("/register.html", singup.save).post("/registro.html", singup.save);

module.exports = router;
