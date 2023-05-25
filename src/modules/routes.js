
import express from "express";
const router = express.Router();

import test from "./test/routes/routes.js";
import web from "./web/routes/routes.js";

// Specific middlewares for each module
router.use("", web).use("/web", web);
router.use("/test", test);

export default router;
