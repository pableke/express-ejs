
import express from "express";
const router = express.Router();

import i18n from "app/modules/i18n.js";
import * as ctrl from "app/modules/ctrl.js";
import * as web from "app/web/ctrl/index.js";

import menus from "./menus.js";
import usuarios from "./usuarios.js";

router.use(i18n.web);
router.get("/", web.index).get("/index", web.index).get("/home", web.index).get("/inicio", web.index)
		.get("/index.html", web.index).get("/home.html", web.index).get("/inicio.html", web.index);

router.get("/login", ctrl.view).get("/signin", ctrl.view)
		.get("/login.html", ctrl.view).get("/signin.html", ctrl.view);
router.post("/login", ctrl.check).post("/signin", ctrl.check)
		.post("/login.html", ctrl.check).post("/signin.html", ctrl.check);

router.get("/logout", ctrl.logout).get("/signout", ctrl.logout)
		.get("/logout.html", ctrl.logout).get("/signout.html", ctrl.logout);
router.get("/destroy.html", ctrl.destroy).get("/unload.html", ctrl.destroy)
		.get("/web/destroy.html", ctrl.destroy).get("/web/unload.html", ctrl.destroy)
		.get("/session/destroy.html", ctrl.destroy).get("/session/unload.html", ctrl.destroy);

// Rutas para los modelos
router.use("/menu", ctrl.auth, menus)
	//.use("/group", ctrl.auth, grupos).use("/grupo", ctrl.auth, grupos)
	.use("/user", ctrl.auth, usuarios).use("/usuario", ctrl.auth, usuarios);

export default router;
