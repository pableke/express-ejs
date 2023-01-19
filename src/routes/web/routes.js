
import express from "express";
const router = express.Router();

import * as ctrl from "app/controllers/index.js";
import * as web from "app/controllers/web/index.js";

router.use(web.lang); // first middleware to be executed before rest of routes
//router.use(require("./public.js"));
router.get("/", web.index).get("/index.html", web.index).get("/home.html", web.index).get("/inicio.html", web.index);
router.use("/user.html", ctrl.auth/*, require("./user.js")*/);
//router.use("/menu", web.auth, require("./menu.js"));
//router.use("/um", web.auth, require("./um.js"));

export default router;
