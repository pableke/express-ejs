
import util from "app/lib/util-box.js";

export const index = (req, res) => {
	util.render(res, "tests/index");
};
