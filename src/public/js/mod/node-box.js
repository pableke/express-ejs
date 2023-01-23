
import fs from "fs"; //file system module
import path from "path"; //file and directory paths
import cp from "child_process"; //system calls
//import qs from "querystring"; //parse post data
import xls from "excel4node"; //JSON to Excel
import nodemailer from "nodemailer"; //send emails
import formidable from "formidable"; //file uploads
import sharp from "sharp"; //image resizer
import ejs from "ejs"; //tpl engine

import ab from "./array-box.js";
import dt from "./date-box.js";
import nb from "./number-box.js";
import sb from "./string-box.js";
import i18n from "./i18n-box.js";
import valid from "./validator-box.js";
import langs from "app/i18n/langs.js";
import config from "app/dist/config.js";

function NodeBox() {
	const self = this; //self instance

	this.setBody = (res, tpl) => { res.locals._tplBody = tpl; return self; }
	this.lang = (res, mod) => { res.locals.i18n = i18n.loadModule(mod).getCurrent(); return self; }
	this.json = (res, data, status) => { res.status(status || 200).json(data); return self; }
	this.text = (res, txt, status) => { res.setHeader("content-type", "text/plain").status(status || 200).send(txt); return self; }
	this.msg = (res, msg, status) => self.text(res, i18n.tr(msg), status);
	this.msgs = (res, status) => self.json(res, i18n.toMsgs(), status);
	this.error = (res, status) => (i18n.getNumMsgs() > 1) ? self.msgs(res, status) : self.text(res, i18n.getError(), status);
	this.err = res => self.error(res, 500);

	this.render = function(res, tpl, status) {
		self.setBody(res, tpl);
		res.status(status || 200).render("index");
		return self;
	}
	this.build = function(res, msg) {
		i18n.setOk(msg);
		return self.render(res, res.locals._tplBody);
	}
	this.html = function(res, contents) {
		res.setHeader("content-type", "text/html").send(ejs.render(contents, res.locals));
		return self;
	}

	/******************* send file to client *******************/
	this.getFile = filename => path.join(config.DIR_FILES, filename);
	this.getView = filename => path.join(config.DIR_VIEWS, filename);
	this.sendFile = function(res, filename, type) {
		const filepath = self.getFile(filename);
		const stat = fs.statSync(filepath);
		res.writeHead(200, {
			"Content-Length": stat.size,
			"Content-Type": (type || "application/octet-stream"),
			"Content-Disposition": "attachment; filename=" + filename
		});
		fs.createReadStream(filepath).pipe(res);
		return self;
	}
	this.view = function(res, tpl) {
		fs.readFile(self.getView(tpl), "utf-8", (err, data) => {
			err ? self.text(res, "" + err, 500) : self.html(res, data);
		});
		return self;
	}

	this.sendHtml = (res, file) => self.view(res, file);
	this.sendZip = (res, file) => self.sendFile(res, file, "application/zip");
	this.sendPdf = (res, file) => self.sendFile(res, file, "application/pdf");
	this.sendXls = (res, file) => self.sendFile(res, file, "application/vnd.ms-excel");
	/******************* send file to client *******************/

	/******************* ZIP multiple files *******************/
	// Options: "-r" recursive, "-j": ignore directory info, "-": redirect to stdout
	//const zip = cp.spawn("zip", ["-rj", "-", "src/public/files/afe98b43839ed5f35684bbc308714e15.jpg", "src/public/files/32b80803a9369f0438bc1bb604b07cf5.jpg"]);
	this.compress = function(output, files) {
		const filepath = self.getFile(output);
		const zip = cp.spawn("zip", ["-rj", "-"].concat(files)); //nuevo zip
		zip.stdout.pipe(fs.createWriteStream(filepath)); //sobrescribe el fichero
		return filepath;
	}
	this.zip = function(res, filename, files) {
		const zip = cp.spawn("zip", ["-rj", "-"].concat(files));
		res.writeHead(200, {
			"Content-Type": "application/zip",
			"Content-disposition": "attachment; filename=" + filename
		});
		zip.stdout.pipe(res);
		return self;
	}
	/******************* ZIP multiple files *******************/

	/******************* upload multipart files *******************/
	const UPLOADS = {
		keepExtensions: true,
		uploadDir: path.join(config.DIR_FILES, "uploads"),
		thumbDir: path.join(config.DIR_FILES, "thumbs"),
		maxFieldsSize: 30 * 1024 * 1024, //30mb
		maxFileSize: 60 * 1024 * 1024, //60mb
		maxFields: 1000,
		multiples: true
	};

	this.multipart = function(req, res, next) { //validate all form post
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
		return self;
	}
	/******************* upload multipart files *******************/

	/******************* send html mails *******************/
	// create reusable transporter object using the default SMTP transport
	// allow non secure apps to access gmail: https://myaccount.google.com/lesssecureapps
	const transporter = nodemailer.createTransport({
		service: "gmail",
		secure: true,
		auth: {
			user: config.GMAIL_USER,
			pass: config.GMAIL_PASS
		}
	});

	// verify connection configuration
	transporter.verify(function(err, success) {
		if (err)
			console.error(err);
		else
			console.log("> Mail server is ready to take our messages");
	});

	this.sendMail = function(mail) {
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

		mail = mail || MESSAGE;
		mail.to = mail.to || MESSAGE.to;
		mail.body = mail.body || MESSAGE.body;
		mail.subject = mail.subject || MESSAGE.subject;
		//mail.attachments = mail.attachments || MESSAGE.attachments;

		// Return promise to send email
		return new Promise(function(resolve, reject) {
			const tpl = self.getView("email.ejs");
			ejs.renderFile(tpl, mail.data, (err, result) => {
				if (err)
					return reject(err);
				mail.html = result;
				const _body = mail.data._tplBody; // previous body
				mail.data._tplBody = self.getView(mail.body); // current body
				transporter.sendMail(mail, (err, info) => err ? reject(err) : resolve(info));
				mail.data._tplBody = _body;
			});
		});
	}
	/******************* send html mails *******************/

	/******************* send xlsx from json *******************/
	this.xls = function(res, file) {
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
		return self;
	}
	/******************* send xlsx from json *******************/

	this.ab = ab;
	this.dt = dt;
	this.nb = nb;
	this.sb = sb;
	this.valid = valid;
	this.i18n = i18n;
}

i18n.addLang("en", langs.en).addLang("es", langs.es);
i18n.setModule("test", "en", langs.test_en).setModule("test", "es", langs.test_es);
i18n.setModule("web", "en", langs.web_en).setModule("web", "es", langs.web_es);

export default new NodeBox();

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

/******************* send report template *******************
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