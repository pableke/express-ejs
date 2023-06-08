
import express from "express";
const router = express.Router();

import * as admin from "app/web/ctrl/admin.js";

router.get("/", admin.index);

export default router;
