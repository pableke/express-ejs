
const express = require("express");
const router = express.Router();

const web = require("../../controllers/web/index.js");

router.use(require("./public.js"));
router.get("/", web.index).get("/index.html", web.index).get("/home.html", web.index).get("/inicio.html", web.index);
router.use("/menu", web.auth, require("./menu.js"));
router.use("/user", web.auth, require("./user.js"));

module.exports = router;
