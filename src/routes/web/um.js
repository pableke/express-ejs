
const express = require("express");
const router = express.Router();

const ctrl = require("app/controllers/index.js");
const admin = require("app/controllers/web/um/admin.js");
const user = require("app/controllers/web/um/user.js");
const menu = require("app/controllers/web/um/menu.js");

router.get("/users.html", user.users);
router.get("/menus.html", menu.menus);

/*router.get("/", admin.menus).get("/index.html", admin.menus).get("/home.html", admin.menus).get("/inicio.html", admin.menus);
router.get("/menus.html", admin.menus).get("/list.html", admin.menus).get("/listar.html", admin.menus).get("/relist.html", admin.menus);
router.get("/filter.html", ctrl.get, admin.list, admin.errList).get("/search.html", ctrl.get, admin.list, admin.errList);
router.get("/filtrar.html", ctrl.get, admin.list, admin.errList).get("/buscar.html", ctrl.get, admin.list, admin.errList);
router.get("/sort.html", admin.sort).get("/order.html", admin.sort).get("/ordenar.html", admin.sort);
router.get("/paginate.html", admin.pagination).get("/pagination.html", admin.pagination).get("/paginator.html", admin.pagination)
	.get("/navto.html", admin.pagination).get("/pages.html", admin.pagination).get("/paginar.html", admin.pagination);
router.get("/view.html", admin.view).get("/find.html", admin.find);
router.get("/first.html", admin.first).get("/prev.html", admin.prev).get("/next.html", admin.next).get("/last.html", admin.last);
router.get("/delete.html", admin.delete).get("/remove.html", admin.delete);

router.get("/users.html", admin.users);
router.post("/link.html", admin.link).post("/unlink.html", admin.unlink);
router.post("/save.html", ctrl.post, admin.save, admin.error);
router.post("/duplicate.html", ctrl.post, admin.duplicate, admin.error);

// routes errors => redirect to it's list (avoid 404)
router.get("/link.html", admin.users).get("/unlink.html", admin.users);
router.get("/save.html", admin.list).get("/duplicate.html", admin.list);*/

module.exports = router;
