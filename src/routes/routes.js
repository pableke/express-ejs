
import express from "express";
const router = express.Router();

import util from "app/ctrl/commons.js";
import login from "app/ctrl/login.js";
import web from "app/ctrl/index.js";

import admin from "./admin.js";
import menus from "./menus.js";
import test from "./test.js";
import usuarios from "./usuarios.js";

router.use(util.lang);
router.get("/", web.index).get("/index", web.index).get("/home", web.index).get("/inicio", web.index)
		.get("/index.html", web.index).get("/home.html", web.index).get("/inicio.html", web.index);
router.get("/contact", login.contact).get("/contacto", login.contact)
		.get("/contact.html", login.contact).get("/contacto.html", login.contact);

router.get("/login", login.view).get("/signin", login.view)
		.get("/login.html", login.view).get("/signin.html", login.view);
router.post("/login", login.sign).post("/signin", login.sign)
		.post("/login.html", login.sign).post("/signin.html", login.sign);
router.post("/signup", login.signup).post("/registro", login.signup)
		.post("/signup.html", login.signup).post("/registro.html", login.signup);
router.get("/activate", login.activate).get("/activate.html", login.activate);

router.get("/logout", login.logout).get("/signout", login.logout)
		.get("/logout.html", login.logout).get("/signout.html", login.logout);
router.get("/destroy.html", login.destroy).get("/unload.html", login.destroy)
		.get("/web/destroy.html", login.destroy).get("/web/unload.html", login.destroy)
		.get("/session/destroy.html", login.destroy).get("/session/unload.html", login.destroy);

// Rutas para los modelos
router.use("/test", test)
	.use("/admin", login.verify, admin).use("/menu", login.verify, menus)
	//.use("/group", login.verify, grupos).use("/grupo", login.verify, grupos)
	.use("/user", login.verify, usuarios).use("/usuario", login.verify, usuarios);

export default router;
