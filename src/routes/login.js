
import express from "express";
const router = express.Router();

import login from "app/ctrl/login.js";

router.get("/login", login.view).get("/signin", login.view)
		.get("/login.html", login.view).get("/signin.html", login.view);
router.post("/login", login.sign).post("/signin", login.sign)
		.post("/login.html", login.sign).post("/signin.html", login.sign);

router.post("/contact", login.contact).post("/contacto", login.contact)
        .post("/contact.html", login.contact).post("/contacto.html", login.contact);

router.get("/signup", login.viewSignup).get("/registro", login.viewSignup)
		.get("/signup.html", login.viewSignup).get("/registro.html", login.viewSignup);
router.post("/signup", login.signup).post("/registro", login.signup)
		.post("/signup.html", login.signup).post("/registro.html", login.signup);
router.get("/activate", login.activate).get("/activate.html", login.activate);

router.get("/logout", login.logout).get("/signout", login.logout)
		.get("/logout.html", login.logout).get("/signout.html", login.logout);
router.get("/destroy.html", login.destroy).get("/unload.html", login.destroy)
		.get("/web/destroy.html", login.destroy).get("/web/unload.html", login.destroy)
		.get("/session/destroy.html", login.destroy).get("/session/unload.html", login.destroy);

export default router;
