
exports.view = function(req, res) {
	res.build("web/forms/pass");
}

exports.save = function(req, res) {
	res.send("pass ok");	
}
