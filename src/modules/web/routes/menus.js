
import express from "express";
const router = express.Router();

import * as ctrl from "app/modules/ctrl.js";
import * as menus from "app/test/ctrl/menus.js";

router.get("/all", menus.all);

export default router;
