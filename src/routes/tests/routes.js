
const express = require("express");
const router = express.Router();

const tests = require("../../controllers/tests/index.js");

router.get("/", tests.index).get("/index.html", tests.index).get("/home.html", tests.index).get("/inicio.html", tests.index);
router.get("/email.html", tests.email).post("/email.html", tests.send);
router.get("/files.html", tests.files).post("/files.html", tests.upload);
router.get("/zip.html", tests.zip);

module.exports = router;
