
const express = require("express");
const router = express.Router();

const web = require("app/controllers/web/index.js");
const login = require("app/controllers/web/public/login.js");

router.use(web.lang, require("./public.js"));
router.get("/", web.index).get("/index.html", web.index).get("/home.html", web.index).get("/inicio.html", web.index);
router.use("/user", login.auth, require("./user.js"));
router.use("/menu", login.auth, require("./menu.js"));
router.use("/um", login.auth, require("./um.js"));

module.exports = router;
