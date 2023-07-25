
import express from "express";
const router = express.Router();

import web from "app/ctrl/index.js";

router.get("/", web.index).get("/index", web.index).get("/home", web.index).get("/inicio", web.index)
		.get("/index.html", web.index).get("/home.html", web.index).get("/inicio.html", web.index);

export default router;
