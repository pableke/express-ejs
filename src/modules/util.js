
import fs from "fs"; //file system module
import path from "path"; //file and directory paths
import cp from "child_process"; //system calls
//import qs from "querystring"; //parse post data
import xls from "excel4node"; //JSON to Excel
import nodemailer from "nodemailer"; //send emails
import ejs from "ejs"; //tpl engine

import sb from "app/lib/string-box.js";
import i18n from "app/lib/i18n-box.js";
import config from "app/dist/config.js";

function UtilBox() {
	const self = this; //self instance

	this.setBody = (res, tpl) => { res.locals.body._tplBody = tpl; return self; }
	this.msg = (res, msg) => res.send(i18n.tr(msg));
	this.msgs = res => res.json(i18n.getMsgs());
	this.err404 = (res, msg) => res.status(404).send(i18n.tr(msg));
	this.err500 = (res, msg) => res.status(500).send(i18n.tr(msg));
	this.errors = res => res.status(500).json(i18n.getMsgs());

	this.html = (res, contents) => {
		res.setHeader("content-type", "text/html").send(ejs.render(contents, res.locals));
	}
	this.view = function(res, tpl) {
		fs.readFile(self.getView(tpl), "utf-8", (err, data) => {
			err ? self.err500(res, "" + err) : self.html(res, data);
		});
	}

	const fnRender = (res, status, tpl) => {
		tpl && self.setBody(res, tpl); // update body view
		res.status(status).render("index"); // render view
	}
	this.render = (res, tpl) => fnRender(res, 200, tpl);
	this.send = (res, msg, tpl) => { i18n.setOk(msg); fnRender(res, 200, tpl); }
	this.info = (res, msg, tpl) => { i18n.setInfo(msg); fnRender(res, 200, tpl); }
	this.error = (res, msg, tpl) => { i18n.setError(msg); fnRender(res, 500, tpl); }

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
	}

	this.sendHtml = (res, file) => self.view(res, file);
	this.sendZip = (res, file) => self.sendFile(res, file, "application/zip");
	this.sendPdf = (res, file) => self.sendFile(res, file, "application/pdf");
	this.sendXls = (res, file) => self.sendFile(res, file, "application/vnd.ms-excel");
	/******************* send file to client *******************/

	this.toFormData = (fields, files, basedir) => {
		basedir = basedir || config.DIR_FILES;
		const fd = new FormData(); // Data container
		for (const key in fields) // Field values
			fd.append(key, fields[key]);
		for (const key in files) { // Field files
			const names = files[key]; //file/es
			if (Array.isArray(names))
				names.forEach(filename => {
					const pathname = path.join(basedir, filename);
					fd.append(key, fs.createReadStream(pathname), filename);
				});
			else {
				const pathname = path.join(basedir, names);
				fd.append(key, fs.createReadStream(pathname), names);
			}
		}
		return fd;
	}

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
	}
	/******************* ZIP multiple files *******************/

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

	const MESSAGE = {
		from: "info@gmail.com", // sender address
		to: "pablo.rosique@upct.es", // list of receivers
		body: "test/emails/test.ejs", // default template
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

	this.sendMail = function(mail) {
		mail = mail || MESSAGE;
		mail.to = mail.to || MESSAGE.to;
		mail.body = mail.body || MESSAGE.body;
		mail.subject = mail.subject || MESSAGE.subject;
		//mail.attachments = mail.attachments || MESSAGE.attachments;

		// Return promise to send email
		return new Promise(function(resolve, reject) {
			const tpl = self.getView("email.ejs"); // Global email tpl
			mail.data.body._tplEmail = mail.body; // current body
			ejs.renderFile(tpl, mail.data, (err, result) => {
				if (err)
					return reject(err);
				mail.html = result;
				transporter.sendMail(mail, (err, info) => err ? reject(err) : resolve(info));
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
}

export default new UtilBox();
