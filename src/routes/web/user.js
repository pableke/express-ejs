
const express = require("express");
const router = express.Router();

const valid = require("../../lib/validators.js");

const basename = "../../controllers/web/user/";
const contact = require(basename + "contact.js");
const login = require(basename + "login.js");
const pass = require(basename + "pass.js");
const profile = require(basename + "profile.js");
const reactive = require(basename + "reactive.js");
const singup = require(basename + "signup.js");

router.get("/", login.view).get("/login.html", login.view).get("/signin.html", login.view);
router.post("/login.html", login.auth).post("/signin.html", login.auth);

router.get("/contact.html", contact.view).get("/contacto.html", contact.view);
router.post("/contact.html", contact.save).post("/contacto.html", contact.save);

router.get("/reactive.html", reactive.view).get("/reactivate.html", reactive.view).get("/reactivar.html", reactive.view);
router.post("/reactive.html", reactive.save).post("/reactivate.html", reactive.save).post("/reactivar.html", reactive.save);

router.get("/signup.html", singup.view).get("/register.html", singup.view).get("/registro.html", singup.view);
router.post("/signup.html", singup.save).post("/register.html", singup.save).post("/registro.html", singup.save);

// Autentication required
router.get("/pass.html", valid.auth, pass.view).get("/password.html", valid.auth, pass.view);
router.post("/pass.html", valid.auth, pass.save).post("/password.html", valid.auth, pass.save);

router.get("/profile.html", valid.auth, profile.view).get("/perfil.html", valid.auth, profile.view);
router.post("/profile.html", valid.auth, profile.save).post("/perfil.html", valid.auth, profile.save);

module.exports = router;
