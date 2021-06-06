
const express = require("express");
const router = express.Router();

const ctrl = require("app/controllers/index.js");
const login = require("app/controllers/web/public/login.js");
const admin = require("app/controllers/web/user/admin.js");
const pass = require("app/controllers/web/user/pass.js");
const profile = require("app/controllers/web/user/profile.js");

router.get("/", login.home).get("/index.html", login.home).get("/home.html", login.home).get("/inicio.html", login.home);
router.get("/users.html", admin.list).get("/list.html", admin.list).get("/usuarios.html", admin.list).get("/listar.html", admin.list);
router.get("/filter.html", ctrl.get, admin.list, admin.errList).get("/search.html", ctrl.get, admin.list, admin.errList);
router.get("/filtrar.html", ctrl.get, admin.list, admin.errList).get("/buscar.html", ctrl.get, admin.list, admin.errList);
router.get("/sort.html", admin.sort).get("/order.html", admin.sort).get("/ordenar.html", admin.sort);
router.get("/paginate.html", admin.users).get("/pages.html", admin.users).get("/paginar.html", admin.users).get("/relist.html", admin.users);
router.get("/view.html", admin.view).get("/find.html", admin.find);
router.get("/first.html", admin.first).get("/prev.html", admin.prev).get("/next.html", admin.next).get("/last.html", admin.last);
router.get("/delete.html", admin.delete).get("/remove.html", admin.delete);

router.get("/menus.html", admin.menus).get("/grupos.html", admin.grupos);
router.post("/menu/link.html", admin.mlink).post("/menu/unlink.html", admin.munlink);
router.post("/grupo/link.html", admin.glink).post("/grupo/unlink.html", admin.gunlink);

router.post("/save.html", ctrl.post, admin.save, admin.error);
router.post("/duplicate.html", ctrl.post, admin.duplicate, admin.error);

router.get("/pass.html", pass.view).get("/password.html", pass.view);
router.post("/pass.html", ctrl.post, pass.save, pass.error)
	.post("/password.html", ctrl.post, pass.save, pass.error);

router.get("/profile.html", profile.view).get("/perfil.html", profile.view);
router.post("/profile.html", ctrl.post, profile.save, profile.error)
	.post("/perfil.html", ctrl.post, profile.save, profile.error);

// routes errors => redirect to it's list (avoid 404)
router.get("/menu/link.html", admin.menus).get("/menu/unlink.html", admin.menus);
router.get("/grupo/link.html", admin.menus).get("/grupo/unlink.html", admin.menus);
router.get("/save.html", admin.list).get("/duplicate.html", admin.list);

module.exports = router;
