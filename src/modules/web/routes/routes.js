
import express from "express";
const router = express.Router();

import * as web from "app/web/ctrl/index.js";
import * as ctrl from "app/modules/ctrl.js";

router.use(web.lang); // first middleware to be executed before rest of routes
router.get("/", web.index).get("/index.html", web.index).get("/home.html", web.index).get("/inicio.html", web.index);

router.get("/logout.html", ctrl.logout).get("/signout.html", ctrl.logout);
router.get("/destroy.html", ctrl.destroy).get("/unload.html", ctrl.destroy)
	.get("/web/destroy.html", ctrl.destroy).get("/web/unload.html", ctrl.destroy)
	.get("/session/destroy.html", ctrl.destroy).get("/session/unload.html", ctrl.destroy);
router.get("/login.html", ctrl.view).get("/signin.html", ctrl.view);
router.post("/login.html", ctrl.check).post("/signin.html", ctrl.check);

router.get("/user", ctrl.auth/*, require("./user.js")*/);
//router.use("/menu", ctrl.auth, require("./menu.js"));
//router.use("/um", ctrl.auth, require("./um.js"));

export default router;
