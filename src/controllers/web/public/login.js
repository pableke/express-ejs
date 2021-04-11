
/**
 * Login controller
 * @module Login
 */
exports.login = function(req, res) {
	res.build("web/forms/login");
}

exports.auth = function(req, res) {
	res.setMsgOk("login ok").build("web/forms/login");
}
