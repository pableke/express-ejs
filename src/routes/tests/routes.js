
const express = require("express");
const router = express.Router();

const basename = "../../controllers/";
const tests = require(basename + "tests/zip.js");

router.get("/", tests.index);
router.get("/email.html", tests.email).post("/email.html", tests.send);
router.get("/files.html", tests.files).post("/files.html", tests.upload);
router.get("/usuarios.html", tests.usuarios);
router.get("/zip.html", tests.zip);

module.exports = router;
