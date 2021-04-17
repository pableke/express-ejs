
/**
 * Login controller
 * @module Login
 */
exports.view = function(req, res) {
	res.build("web/forms/login");
}

exports.auth = function(req, res) {
	res.setMsgOk("login ok").build("web/forms/login");
}
