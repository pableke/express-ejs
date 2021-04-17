
exports.view = function(req, res) {
	res.build("web/forms/profile");
}

exports.save = function(req, res) {
	res.send("perfil ok");	
}
