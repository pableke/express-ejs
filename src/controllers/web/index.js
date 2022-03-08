
const util = require("app/lib/util-box.js");

exports.index = (req, res) => {
	util.render(res, "tests/index");
};
