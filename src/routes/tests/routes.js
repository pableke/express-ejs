
import express from "express";
const router = express.Router();

import * as ctrl from "app/controllers/index.js";
import * as tests from "app/controllers/tests/index.js";

router.use(tests.lang); // first middleware to be executed before rest of routes
router.get("/", tests.index).get("/index.html", tests.index).get("/home.html", tests.index).get("/inicio.html", tests.index);
router.get("/filter.html", tests.filter).post("/search.html", tests.filter);
router.post("/save.html", ctrl.multipart).post("/save.html", tests.save);
router.get("/mail.html", tests.email).get("/email.html", tests.email);
router.get("/xls.html", tests.xls).get("/xlsx.html", tests.xls).get("/excel.html", tests.xls);
router.get("/zip.html", tests.zip).get("/pdf.html", tests.pdf);

// TESTS - API
router.post("/sign", ctrl.sign);
router.use("/api", ctrl.verify);
router.get("/api/users", tests.filter);

export default router;
