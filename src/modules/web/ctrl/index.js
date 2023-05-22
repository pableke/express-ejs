
import util from "app/modules/util.js";

export const lang = (req, res, next) => util.lang(res, "web", next);
export const index = (req, res) => util.render(res, "web/index");
