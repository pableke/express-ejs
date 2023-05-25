
import express from "express";
const router = express.Router();

import * as tests from "app/test/ctrl/index.js";
import * as ctrl from "app/modules/ctrl.js";

router.use(tests.lang); // first middleware to be executed before rest of routes
router.get("/", tests.index).get("/index", tests.index).get("/home", tests.index).get("/inicio", tests.index)
		.get("/index.html", tests.index).get("/home.html", tests.index).get("/inicio.html", tests.index);
router.get("/filter", tests.filter).get("/filter.html", tests.filter)
		.post("/search", tests.filter).post("/search.html", tests.filter);
router.post("/save", ctrl.verify, ctrl.multipart, tests.save)
		.post("/save.html", ctrl.verify, ctrl.multipart, tests.save);

router.get("/mail", tests.email).get("/email", tests.email)
		.get("/mail.html", tests.email).get("/email.html", tests.email);
router.get("/xls", tests.xls).get("/xlsx", tests.xls).get("/excel", tests.xls)
		.get("/xls.html", tests.xls).get("/xlsx.html", tests.xls).get("/excel.html", tests.xls);
router.get("/zip.html", tests.zip).get("/pdf.html", tests.pdf);

// TESTS - API
router.post("/api/sign", ctrl.sign);

export default router;
