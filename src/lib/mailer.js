
const fs = require("fs"); //file system module
const path = require("path"); //file and directory paths
const nodemailer = require("nodemailer"); //send emails
const ejs = require("ejs"); //tpl engine

// create reusable transporter object using the default SMTP transport
// allow non secure apps to access gmail: https://myaccount.google.com/lesssecureapps
const transporter = nodemailer.createTransport({
	service: "gmail",
	secure: true,
	auth: {
		user: process.env.GMAIL_USER,
		pass: process.env.GMAIL_PASS
	}
});

// verify connection configuration
transporter.verify(function(err, success) {
	if (err)
		console.log(err);
	else
		console.log("> Mail server is ready to take our messages");
});

const MESSAGE = {
	from: "info@gmail.com", // sender address
	//to: "pablo.rosique@upct.es", // list of receivers
	//subject: "Email de prueba", // Subject line
	text: "Email submitted by XXXX"//, // plain text body
	//html: res.build("dist/mails/index.html").getValue(), // html
	/*attachments: [ // array of attachment objects
		{ filename: "text1.txt", content: "hello world!" }, // utf-8 string as an attachment
		{ filename: "test.zip", content: fs.createReadStream("src/public/temp/test.zip") }, //stream as an attachment
		{ filename: "license.txt", path: "https://raw.github.com/nodemailer/nodemailer/master/LICENSE" }, // use URL as an attachment
		{ filename: "text2.txt", content: "aGVsbG8gd29ybGQh", encoding: "base64" } // encoded string as an attachment
	]*/
};

function fnShowError(type, err) {
	console.log("\n--------------------", type, "--------------------");
	console.log("> " + (new Date()));
	console.log("--------------------", "Error", "--------------------");
	//err.message = "Error " + err.errno + ": " + err.sqlMessage;
	console.log(err);
	return err;
}

exports.send = function(to, subject, tpl, data, attachments) {
	MESSAGE.to = to;
	MESSAGE.subject = subject;
	MESSAGE.attachments = attachments;

	tpl = path.join(__dirname, "../views", tpl);
	return new Promise(function(resolve, reject) {
		ejs.renderFile(tpl, data, function(err, result) {
			if (err)
				return reject(fnShowError("EJS", err));
			MESSAGE.html = result;
			transporter.sendMail(MESSAGE, function(err, info) {
				return err ? reject(fnShowError("NODEMAILER", err)) : resolve(info);
			});
		});
	});
}
