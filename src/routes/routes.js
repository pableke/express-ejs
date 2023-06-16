
import express from "express";
const router = express.Router();

import util from "app/ctrl/commons.js";
import login from "app/ctrl/login.js";
import * as web from "app/ctrl/index.js";

import admin from "./admin.js";
import menus from "./menus.js";
import test from "./test.js";
import usuarios from "./usuarios.js";

router.use(util.lang);
router.get("/", web.index).get("/index", web.index).get("/home", web.index).get("/inicio", web.index)
		.get("/index.html", web.index).get("/home.html", web.index).get("/inicio.html", web.index);
router.get("/contact", web.contact).get("/contacto", web.contact)
		.get("/contact.html", web.contact).get("/contacto.html", web.contact);

router.get("/login", login.view).get("/signin", login.view)
		.get("/login.html", login.view).get("/signin.html", login.view);
router.post("/login", login.check).post("/signin", login.check)
		.post("/login.html", login.check).post("/signin.html", login.check);
router.post("/signup", web.signup).post("/registro", web.signup)
		.post("/signup.html", web.signup).post("/registro.html", web.signup);
router.get("/activate", web.activate).get("/activate.html", web.activate);

router.get("/logout", login.logout).get("/signout", login.logout)
		.get("/logout.html", login.logout).get("/signout.html", login.logout);
router.get("/destroy.html", login.destroy).get("/unload.html", login.destroy)
		.get("/web/destroy.html", login.destroy).get("/web/unload.html", login.destroy)
		.get("/session/destroy.html", login.destroy).get("/session/unload.html", login.destroy);

// Rutas para los modelos
router.use("/test", test)
	.use("/admin", login.auth, admin).use("/menu", login.auth, menus)
	//.use("/group", login.auth, grupos).use("/grupo", login.auth, grupos)
	.use("/user", login.auth, usuarios).use("/usuario", login.auth, usuarios);

export default router;
