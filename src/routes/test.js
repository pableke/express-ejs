
import express from "express";
const router = express.Router();

import util from "app/ctrl/commons.js";
import login from "app/ctrl/login.js";
import * as test from "app/ctrl/test.js";

router.get("/", test.index).get("/index", test.index).get("/home", test.index).get("/inicio", test.index)
		.get("/index.html", test.index).get("/home.html", test.index).get("/inicio.html", test.index);
router.get("/filter", test.filter).get("/filter.html", test.filter)
		.post("/search", test.filter).post("/search.html", test.filter);
router.post("/save", login.verify, util.multipart, test.save)
		.post("/save.html", login.verify, util.multipart, test.save);

router.get("/mail", test.email).get("/email", test.email)
		.get("/mail.html", test.email).get("/email.html", test.email);
router.get("/xls", test.xls).get("/xlsx", test.xls).get("/excel", test.xls)
		.get("/xls.html", test.xls).get("/xlsx.html", test.xls).get("/excel.html", test.xls);
router.get("/zip.html", test.zip).get("/pdf.html", test.pdf);

// TESTS - API + FILES
router.post("/api/sign", login.sign).post("/api/files", util.multipart, test.files);

export default router;
