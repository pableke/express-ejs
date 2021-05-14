
const express = require("express");
const router = express.Router();

const ctrl = require("app/controllers/index.js");
const admin = require("app/controllers/web/menu/admin.js");

router.get("/", admin.list).get("/index.html", admin.list).get("/home.html", admin.list).get("/inicio.html", admin.list);
router.get("/list.html", admin.list).get("/users.html", admin.users).get("/view.html", admin.view).get("/delete.html", admin.delete);
router.post("/link.html", admin.link).post("/unlink.html", admin.unlink);
router.post("/save.html", ctrl.post, admin.save, admin.error);
router.post("/duplicate.html", ctrl.post, admin.duplicate, admin.error);

module.exports = router;
