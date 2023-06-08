
import express from "express";
const router = express.Router();

import * as menus from "app/web/ctrl/menus.js";

router.get("/all", menus.all);

export default router;
