
import util from "app/lib/util-box.js";

export const index = (req, res) => {
	util.render(res, "tests/index");
}

export const auth = function(req, res, next) {
	util.setBody(res, "tests/index"); //if error => go login
	if (!req.session || !req.sessionID) //not session found
		return next("err401");
	// Update session helper
	req.session.redirTo = !req.xhr && (req.method == "GET") && req.originalUrl;
	if (!req.session.user) //user not logged
		return next("err401");
	if (req.session.cookie.maxAge < 1) //time session expired
		return next("endSession");
	delete req.session.redirTo;
	next(); //next middleware
}
