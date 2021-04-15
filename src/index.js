
const fs = require("fs"); //file system module
const path = require("path"); //file and directory paths
const http = require("http"); //http server
const https = require("https"); //secure server

const express = require("express"); //infraestructura web
const session = require("express-session") //session handler
const formidable = require("formidable"); //file uploads
const sharp = require("sharp"); //image resizer
const app = express(); //instance app

const env = require("dotenv").config(); //load env const
const i18n = require("./i18n/i18n.js"); //languages
const dao = require("./dao/factory.js"); //DAO factory
const valid = require("./lib/validator-box.js"); //validators

const HTTPS = { //credentials
	key: fs.readFileSync(path.join(__dirname, "certs/key.pem")).toString(),
	cert: fs.readFileSync(path.join(__dirname, "certs/cert.pem")).toString()
};
const UPLOADS = {
	keepExtensions: true,
	uploadDir: path.join(__dirname, "public/files/"),
	maxFieldsSize: 20 * 1024 * 1024, //20mb
	maxFileSize: 50 * 1024 * 1024, //50mb
	maxFields: 1000,
	multiples: true
};

// Template engines
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Express configurations
app.use("/public", express.static(path.join(__dirname, "public"))); // static files
app.use(express.urlencoded({ limit: "80mb", extended: false })); // to support URL-encoded bodies
app.use(express.json({ limit: "80mb" }));

app.set("trust proxy", 1) // trust first proxy
app.use(session({ //session config
	resave: false,
	saveUninitialized: false,
	secret: "v@Ge*UfKmLm5QRGg6kQB61dqT6Rj##F*me!vG",
	cookie: {
		secure: false, //require https
		maxAge: 60*60*1000 //1h
	}
}));

// Routes
app.use((req, res, next) => {
	let lang = req.query.lang || req.session.lang;
	if (!lang || (lang !== req.session.lang)) {
		//user has changed current language or first access
		let ac = req.headers["accept-language"] || "es"; //default laguage = es
		lang = (i18n[lang]) ? lang : ac.substr(0, 5); //search region language es-ES
		lang = (i18n[lang]) ? lang : lang.substr(0, 2); //search type language es
		lang = (i18n[lang]) ? lang : "es"; //default language = es
		req.session.langs = i18n; //all languages container
		req.session.lang = lang; //save language on session
	}

	// Commons actions for all views
	req.session.menus = req.session.menus || dao.tests.myjson.menus.getPublic(); //public menu
	res.locals.menus = req.session.menus; //set menus on view
	res.locals.i18n = i18n[lang]; //current language
	res.locals.lang = lang; //lang id
	res.locals.msgs = valid; //init messages

	// Commons response hadlers
	res.locals._tplBody = "web/forms/index"; //default body
	res.setBody = function(tpl) {
		res.locals._tplBody = tpl; //new tpl body path
		return res;
	}
	res.build = function(tpl) {
		//set tpl body path and render index
		return res.setBody(tpl).render("index");
	}
	res.on("finish", function() {
		valid.initMsgs(); //reset messages
	});

	// Go yo next route
	next(); //call next
});
app.post("*", (req, res, next) => { //validate all form post
	if (!valid.validate(req.path, req.body, res.locals.i18n))
		return next(res.locals.i18n.errForm); //validate inputs form
	let enctype = req.headers["content-type"] || ""; //get content-type
	if (enctype.startsWith("multipart/form-data")) { //multipart => files
		const fields = req.body = {}; //fields container
		const form = formidable(UPLOADS); //file upload options
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
					.toFile(path.join(__dirname, "public/thumb/", path.basename(file.path)))
					//.then(info => console.log(info))
					.catch(err => console.log(err));
			}
			fields[field].push(file);
		});
		form.once("error", err => next(err));
		form.once("end", () => next());
		form.parse(req);
	}
	else
		next();
});
app.use(require("./routes/routes.js")); //add all routes
app.use((err, req, res, next) => { //global handler error
	valid.setMsgError(err); //set message error on view
	if (req.headers["x-requested-with"] == "XMLHttpRequest")
		return res.status(500).json(valid.getErrors()); //ajax response
	return res.status(500).render("index");
});
app.use("*", (req, res) => { //404
	valid.setMsgError(res.locals.i18n.err404); //set message error on view
	if (req.headers["x-requested-with"] == "XMLHttpRequest")
		return res.status(404).send(valid.getMsgError()); //ajax response
	return res.status(404).build("web/errors/404");
});

// Start servers (bd's and http)
dao.open(); //open db factories
const httpServer = http.createServer(app);
const httpsServer = https.createServer(HTTPS, app);
httpServer.listen(3000);
httpsServer.listen(3443);

//capture Node.js Signals and Events
function fnExit(signal) { //exit handler
	console.log("\n--------------------");
	console.log("> Received [" + signal + "].");
	console.log("--------------------");

	dao.close();
	httpServer.close();
	httpsServer.close();

	console.log("> Http server closed.");
	console.log("> " + (new Date()));
	console.log("--------------------\n");
	process.exit(0);
};
httpServer.on("close", fnExit); //close server event
httpsServer.on("close", fnExit); //close server event
process.on("exit", function() { fnExit("exit"); }); //common exit signal = SIGINT
process.on("SIGHUP", function() { fnExit("SIGHUP"); }); //generated on Windows when the console window is closed
process.on("SIGINT", function() { fnExit("SIGINT"); }); //Press Ctrl-C / Ctrl-D keys to exit
process.on("SIGTERM", function() { fnExit("SIGTERM"); }); //kill the server using command kill [PID_number] or killall node
process.stdin.on("data", function(data) { (data == "exit\n") && fnExit("exit"); }); //console exit

console.log("Server listening on port http://localhost:3000");
console.log("Secure Server listening on port https://localhost:3443");
