
import express from "express";
const router = express.Router();

import * as menus from "../ctrl/menus.js";

router.get("/all", menus.all);

export default router;
