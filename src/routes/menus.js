
import express from "express";
const router = express.Router();

import * as menu from "app/ctrl/menus.js";

router.get("/list", menu.list).get("/search", menu.list).get("/filter", menu.list)
        .get("/list.html", menu.list).get("/search.html", menu.list).get("/filter.html", menu.list);
router.get("/view", menu.view).get("/view.html", menu.view);
router.post("/save", menu.save).post("/save.html", menu.save);
router.delete("/delete", menu.remove).delete("/remove", menu.remove)
        .delete("/delete.html", menu.remove).delete("/remove.html", menu.remove);

export default router;
