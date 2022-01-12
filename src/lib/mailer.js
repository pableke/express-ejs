
const fs = require("fs"); //file system module
const path = require("path"); //file and directory paths
const nodemailer = require("nodemailer"); //send emails
const ejs = require("ejs"); //tpl engine
const i18n = require("app/lib/i18n-box.js");

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
	to: "pablo.rosique@upct.es", // list of receivers
	tpl: "tests/emails/test.ejs", // default template
	subject: "Mailer no reply", // Subject line
	text: "Email submitted", // plain text body
	html: "<html><body>Email submitted</body></html>" // html contents
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

exports.send = function(mail) {
	mail = mail || MESSAGE;
	mail.to = mail.to || MESSAGE.to;
	mail.tpl = mail.tpl || MESSAGE.tpl;
	mail.subject = mail.subject || MESSAGE.subject;
	mail.attachments = mail.attachments || MESSAGE.attachments;

	// Email template path base = /views
	let tpl = path.join(__dirname, "../views/email.ejs");
	mail.data._tplBody = path.join(__dirname, "../views", mail.tpl);

	// Return promise to send email
	return new Promise(function(resolve, reject) {
		ejs.renderFile(tpl, mail.data, function(err, result) {
			if (err)
				return reject(fnShowError("EJS", err));
			mail.html = result;
			transporter.sendMail(mail, function(err, info) {
				return err ? reject(fnShowError("NODEMAILER", err)) : resolve(info);
			});
		});
	});
}
