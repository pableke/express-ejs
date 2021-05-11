
const express = require("express");
const router = express.Router();

const ctrl = require("app/controllers/index.js");
const admin = require("app/controllers/web/menu/admin.js");

router.get("/", admin.list).get("/index.html", admin.list).get("/home.html", admin.list).get("/inicio.html", admin.list);
router.get("/list", admin.list).get("/view.html", admin.view).get("/delete.html", admin.delete);
router.post("/save.html", ctrl.post, admin.save, admin.error);

module.exports = router;
