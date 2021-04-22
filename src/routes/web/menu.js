
const express = require("express");
const router = express.Router();

const basename = "../../controllers/web/menu/";
const admin = require(basename + "admin.js");

router.get("/list", admin.list).get("/view.html", admin.view).get("/delete.html", admin.delete);
router.post("/save.html", admin.save);

module.exports = router;
