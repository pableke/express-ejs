
import util from "app/mod/node-box.js";

export const lang = (req, res, next) => util.lang(res, "web", next);
export const index = (req, res) => util.render(res, "tests/index");
