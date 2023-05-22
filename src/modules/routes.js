
import express from "express";
const router = express.Router();

import web from "./web/routes/routes.js";
import tests from "./test/routes/routes.js";

// Specific middlewares for each module
router.use("/tests", tests);
router.use("", web).use("/web", web);

export default router;
