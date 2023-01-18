
import express from "express";
const router = express.Router();

import * as web from "app/controllers/web/index.js";
//const login = require("app/controllers/web/public/login.js");

//router.use(require("./public.js"));
router.get("/", web.index).get("/index.html", web.index).get("/home.html", web.index).get("/inicio.html", web.index);
//router.use("/user", login.auth, require("./user.js"));
//router.use("/menu", login.auth, require("./menu.js"));
//router.use("/um", login.auth, require("./um.js"));

export default router;
