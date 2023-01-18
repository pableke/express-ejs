
import express from "express";
const router = express.Router();

import * as tests from "app/controllers/tests/index.js";

router.get("/", tests.index).get("/index.html", tests.index).get("/home.html", tests.index).get("/inicio.html", tests.index);
router.get("/mail.html", tests.email).get("/email.html", tests.email);
router.get("/xls.html", tests.xls).get("/xlsx.html", tests.xls).get("/excel.html", tests.xls);
router.get("/zip.html", tests.zip).get("/pdf.html", tests.pdf);

export default router;
