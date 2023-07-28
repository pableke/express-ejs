
import express from "express";
const router = express.Router();

import ctrlLogin from "app/ctrl/login.js";
import { lang } from "app/ctrl/commons.js";

import login from "./login.js";
import admin from "./admin.js";
import index from "./index.js";
import menus from "./menus.js";
import test from "./test.js";
import usuarios from "./usuarios.js";

router.use(lang).use(login).use(index).use("/test", test)
	.use("/admin", ctrlLogin.verify, admin).use("/menu", ctrlLogin.verify, menus)
	//.use("/group", ctrlLogin.verify, grupos).use("/grupo", ctrlLogin.verify, grupos)
	.use("/user", ctrlLogin.verify, usuarios).use("/usuario", ctrlLogin.verify, usuarios);

export default router;
