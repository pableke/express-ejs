
import express from "express";
const router = express.Router();

import * as ctrl from "app/modules/ctrl.js";
import * as user from "app/test/ctrl/users.js";

router.post("/login", user.login).post("/login.html", user.login);

router.get("/list", user.list).get("/list.html", user.list);
router.get("/view", user.view).get("/view.html", user.view);
router.post("/save", user.save).post("/save.html", user.save);
router.delete("/delete", user.remove).delete("/remove", user.remove)
    .delete("/delete.html", user.remove).delete("/remove.html", user.remove);

export default router;
