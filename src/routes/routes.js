
import express from "express";
const router = express.Router();

import i18n from "app/i18n/i18n.js";
import tests from "./tests/routes.js";
import web from "./web/routes.js";
//const login = require("app/controllers/web/public/login.js");

const testLang = (req, res, next) => { res.locals.i18n = i18n.loadModule("test").getCurrent(); next(); }
const webLang = (req, res, next) => { res.locals.i18n = i18n.loadModule("web").getCurrent(); next(); }

// Specific middlewares for each module
router.use("/tests", testLang, tests);
//router.use("/uae", webLang, login.auth, require("./uae/routes.js"));
router.use("", webLang, web);

export default router;
