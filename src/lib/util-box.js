
const fs = require("fs"); //file system module
const path = require("path"); //file and directory paths
const cp = require("child_process"); //system calls
const qs = require("querystring"); //parse post data
const xls = require("excel4node"); //JSON to Excel
const nodemailer = require("nodemailer"); //send emails
const formidable = require("formidable"); //file uploads
const sharp = require("sharp"); //image resizer
const ejs = require("ejs"); //tpl engine

const ab = require("./array-box.js");
const dt = require("./date-box.js");
const nb = require("./number-box.js");
const sb = require("./string-box.js");
const valid = require("./validator-box.js");
const i18n = require("./i18n-box.js");
const langs = require("../i18n/i18n.js");

i18n.addLangs(langs.main)
	.addLangs(langs.test, "test")
	.addLangs(langs.web, "web");

exports.ab = ab;
exports.dt = dt;
exports.nb = nb;
exports.sb = sb;
exports.valid = valid;
exports.i18n = i18n;

exports.setBody = function(res, tpl) {
	res.locals._tplBody = tpl;
	return this;
}

// Default = 500 internal server error
exports.text = function(res, msg, status) {
	res.setHeader("content-type", "text/plain")
		.status(status || 200).send(msg);
	return this;
}
exports.msgs = function(res, status) {
	res.status(status || 200).json(i18n.toMsgs());
	return this;
}
exports.error = function(res, status) {
	return (i18n.getNumMsgs() > 1)
						? this.msgs(res, status) 
						: this.text(res, i18n.getError(), status);
}

exports.render = function(res, tpl, status) {
	this.setBody(res, tpl);
	res.status(status || 200).render("index");
	return this;
}
exports.build = function(res, msg) {
	i18n.setOk(msg);
	return this.render(res, res.locals._tplBody);
}

exports.html = function(res, contents) {
	res.setHeader("content-type", "text/html")
		.send(ejs.render(contents, res.locals));
	return this;
}
exports.sendHtml = function(res, tpl) {
	const filepath = path.join(__dirname, "../views", tpl);
	fs.readFile(filepath, "utf-8", (err, data) => {
		err ? this.text(res, "" + err, 500) : this.html(res, data);
	});
	return this;
}

/*exports.post = function(req, res, next) {
	let rawData = ""; // Buffer
	req.on("data", function(chunk) {
		rawData += chunk;
		if (rawData.length > UPLOADS.maxFieldsSize) {
			req.connection.destroy(); //FLOOD ATTACK OR FAULTY CLIENT, NUKE REQUEST
			next("err413"); //Error 413 request too large
		}
	});
	req.on("end", function() {
		req.body = (req.headers["content-type"] == "application/json") ? JSON.parse(rawData) : qs.parse(rawData);
		next();
	});
}*/

/******************* multipart files *******************/
const FILES_DIR = path.join(__dirname, "../public/files/");
const VIEWS_DIR = path.join(__dirname, "../views/");
const UPLOADS = {
	keepExtensions: true,
	uploadDir: path.join(FILES_DIR, "uploads"),
	thumbDir: path.join(FILES_DIR, "thumbs"),
	maxFieldsSize: 30 * 1024 * 1024, //30mb
	maxFileSize: 60 * 1024 * 1024, //60mb
	maxFields: 1000,
	multiples: true
};

exports.multipart = function(req, res, next) { //validate all form post
	const form = formidable(UPLOADS); //file upload options
	const fields = req.body = {}; //fields container

	form.on("field", function(field, value) {
		fields[field] = value;
	});
	form.on("fileBegin", function(field, file) {
		let name = path.basename(file.path).replace("upload_", "");
		file.path = path.join(path.dirname(file.path), name);
	});
	form.on("file", function(field, file) {
		fields[field] = fields[field] || [];
		if (file.size < 1) //empty uploaded file
			return fs.unlink(file.path, err => {});
		if (file.type.startsWith("image")) {
			sharp(file.path)
				.resize({ width: 250 })
				.toFile(path.join(UPLOADS.thumbDir, path.basename(file.path)))
				//.then(info => console.log(info))
				.catch(err => console.log(err));
		}
		fields[field].push(file);
	});
	form.once("error", err => next(err));
	form.once("end", () => next());
	form.parse(req);
}
/******************* multipart files *******************/


/******************* send file to client *******************/
exports.getFile = function(filename) { return path.join(FILES_DIR, filename); }
exports.getView = function(filename) { return path.join(VIEWS_DIR, filename); }
exports.sendFile = function(filename, type) {
	let filepath = this.getFile(filename);
	let stat = fs.statSync(filepath);
	res.writeHead(200, {
		"Content-Length": stat.size,
		"Content-Type": (type || "application/octet-stream"),
		"Content-Disposition": "attachment; filename=" + filename
	});
	fs.createReadStream(filepath).pipe(res);
	return this;
}
exports.sendZip = function(file) { return this.sendFile(file, "application/zip"); }
exports.sendPdf = function(file) { return this.sendFile(file, "application/pdf"); }
exports.sendXls = function(file) { return this.sendFile(file, "application/vnd.ms-excel"); }
/******************* send file to client *******************/


/******************* ZIP multiple files *******************/
// Options: "-r" recursive, "-j": ignore directory info, "-": redirect to stdout
//const zip = cp.spawn("zip", ["-rj", "-", "src/public/files/afe98b43839ed5f35684bbc308714e15.jpg", "src/public/files/32b80803a9369f0438bc1bb604b07cf5.jpg"]);
exports.compress = function(output, files) {
	const filepath = this.getFile(output);
	const zip = cp.spawn("zip", ["-rj", "-"].concat(files)); //nuevo zip
	zip.stdout.pipe(fs.createWriteStream(filepath)); //sobrescribe el fichero
	return filepath;
}
exports.zip = function(res, filename, files) {
	const zip = cp.spawn("zip", ["-rj", "-"].concat(files));
	res.writeHead(200, {
		"Content-Type": "application/zip",
		"Content-disposition": "attachment; filename=" + filename
	});
	zip.stdout.pipe(res);
	return this;
}
/******************* ZIP multiple files *******************/


/******************* send html mails *******************/
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
		console.error(err);
	else
		console.log("> Mail server is ready to take our messages");
});

const MESSAGE = {
	from: "info@gmail.com", // sender address
	to: "pablo.rosique@upct.es", // list of receivers
	body: "tests/emails/test.ejs", // default template
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

exports.sendMail = function(mail) {
	mail = mail || MESSAGE;
	mail.to = mail.to || MESSAGE.to;
	mail.body = mail.body || MESSAGE.body;
	mail.subject = mail.subject || MESSAGE.subject;
	//mail.attachments = mail.attachments || MESSAGE.attachments;

	// Return promise to send email
	return new Promise(function(resolve, reject) {
		let _body = mail.data._tplBody; // previous body
		let tpl = path.join(__dirname, "../views/email.ejs");
		mail.data._tplBody = path.join(__dirname, "../views", mail.body);

		ejs.renderFile(tpl, mail.data, function(err, result) {
			if (err)
				return reject(err);
			mail.html = result;
			transporter.sendMail(mail, (err, info) => err ? reject(err) : resolve(info));
			mail.data._tplBody = _body;
		});
	});
}
/******************* send html mails *******************/


/******************* send xlsx from json *******************/
exports.xls = function(res, file) {
	const fontStyle = { size: 10, name: "Calibri", family: "roman", color: "#000000" };
	const stringStyle = { font: fontStyle };
	const headerStyle = {
		font: { size: 12, bold: true },
		alignment: { wrapText: true, horizontal: "center" }
	};

	const wb = new xls.Workbook({ // new xlsx instance
		jszip: { compression: "DEFLATE" },
		defaultFont: fontStyle,
		dateFormat: "m/d/yy hh:mm:ss",
		author: file.author || "Microsoft Office User"
	});

	function fnSheet(sheet, i) {
		sheet.styles = sheet.styles || {}; // Array of cell styles
		sheet.name = sheet.name || ("sheet" + (i + 1)); //Worksheet Name

		let ws = wb.addWorksheet(sheet.name); // WorkBook
		let headStyle = wb.createStyle(sheet.headStyle || headerStyle);

		let columnIndex = 1; // current column
		for (let key in sheet.headers) { // headers = Object
			let style = sheet.styles[key] || stringStyle; // column style
			style.numberFormat = style.numberFormat || style.dateFormat;
			let columnStyle = wb.createStyle(style);

			function fnDate(value, i) { ws.cell(i + 2, columnIndex).date(value).style(columnStyle); } // accepts either a date or a date string
			function fnNumber(value, i) { ws.cell(i + 2, columnIndex).number(value).style(columnStyle); } // isset numberFormat = number type
			function fnString(value, i) { ws.cell(i + 2, columnIndex).string(value).style(columnStyle); } // default type = string
			const fnCell = style.dateFormat ? fnDate : (style.numberFormat ? fnNumber : fnString) //date, number or string

			sheet.data.forEach((row, i) => {
				let value = row[key]; // cell value
				sb.isset(value) && fnCell(value, i);
			});
			ws.cell(1, columnIndex++).string(sheet.headers[key]).style(headStyle);
		}
	}

	if (file.sheets) // Multi-sheet
		file.sheets.forEach(fnSheet);
	else // Single sheet
		fnSheet(file, 0);

	//wb.write("ExcelFile.xlsx"); // Writes the file ExcelFile.xlsx to the process.cwd();
	wb.write(file.filename, res); // pipe excel xlsx to response
	return this;
}
/******************* send xlsx from json *******************/


/******************* send report template *******************/
const jsreport = require("jsreport-core")();
jsreport.use(require("jsreport-chrome-pdf")());
jsreport.use(require("jsreport-ejs")());
jsreport.init(); // init. once

exports.pdf = function(res, file) {
	file = this.getView(file);
	return jsreport.render({
		template: {
			engine: "ejs",
			recipe: "chrome-pdf",
			content: fs.readFileSync(file, "utf-8")
		},
		data: res.locals
	}).then(out => out.stream.pipe(res));
}
/******************* send report template *******************/
