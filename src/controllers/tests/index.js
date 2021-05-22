
const fs = require("fs"); //file system
const path = require("path"); //file and directory paths
const cp = require("child_process"); //system calls
const mailer = require("app/lib/mailer.js"); //google mailer
const valid = require("app/lib/validator-box.js"); //validator

exports.index = (req, res) => {
	res.build("tests/index");
};

exports.email = (req, res) => {
	res.build("tests/forms/email");
};
exports.send = (req, res, next) => {
	mailer.send({
		to: "pableke@gmail.com",
		subject: req.body.asunto,
		tpl: "tests/emails/test.ejs",
		data: res.locals //data
	}).then(info => res.send(res.locals.i18n.msgCorreo))
		.catch(err => next(res.locals.i18n.errSendMail));
}

exports.files = (req, res) => {
	res.build("tests/forms/files");
}
exports.upload = (req, res) => {
	console.log("upload", req.body);
	res.send("file uploaded!");
}

exports.zip = function(req, res) {
	// Options -r recursive -j ignore directory info - redirect to stdout
	let zip = cp.spawn("zip", ["-rj", "-", "src/public/files/afe98b43839ed5f35684bbc308714e15.jpg", "src/public/files/32b80803a9369f0438bc1bb604b07cf5.jpg"]);
	res.writeHead(200, {
		"Content-Type": "application/zip",
		"Content-disposition": "attachment; filename=test.zip"
	});
	zip.stdout.pipe(res); //sobrescribe file
}
