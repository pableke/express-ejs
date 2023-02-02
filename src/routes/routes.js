
import express from "express";
const router = express.Router();

import tests from "./tests/routes.js";
import uae from "./uae/routes.js";
import web from "./web/routes.js";

// Specific middlewares for each module
router.use("/tests", tests);
router.use("/uae", uae);
router.use("", web).use("/web", web);

export default router;
