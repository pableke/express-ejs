
const fs = require("fs"); //file system module
const path = require("path"); //file and directory paths
const http = require("http"); //http server
const https = require("https"); //secure server

const express = require("express"); //infraestructura web
const session = require("express-session") //session handler
const app = express(); //instance app

const env = require("dotenv").config(); //load env const
const valid = require("./lib/validator-box.js"); //validators

const HTTPS = { //credentials
	key: fs.readFileSync(path.join(__dirname, "../certs/key.pem")).toString(),
	cert: fs.readFileSync(path.join(__dirname, "../certs/cert.pem")).toString()
};
const i18n = { //aviable languages list
	es: require("./i18n/es.js"), 
	en: require("./i18n/en.js")
};

// Template engines
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Express configurations
app.use("/public", express.static(path.join(__dirname, "public"))); // static files
app.use(express.urlencoded({ limit: "50mb", extended: true })); // to support URL-encoded bodies
app.use(express.json({ limit: "50mb" }));

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
		req.session[lang] = i18n.es; //save messages on session
		req.session.lang = lang; //save language on session
	}

	// Commons actions for all views
	res.locals.msgOk = res.locals.msgInfo = res.locals.msgWarn = res.locals.msgError = "";
	req.session.menu = req.session.menu || [{},{}]; //public menu
	res.locals.i18n = req.session[lang];
	res.locals.lang = lang;

	// Commons response hadlers
	res.setBody = function(tpl) {
		res.locals._tplBody = tpl; //tpl body path
		return res;
	}
	res.build = function(tpl) {
		//set tpl body path and render index
		return res.setBody(tpl).render("index");
	}
	res.ok = function(msg, tpl) {
		res.locals.msgOk = msg; //error text
		return res.build(tpl); //build /index.ejs
	}

	// Go yo next route
	next(); //call next
});
app.get("*", (req, res, next) => {
	res.locals.errors = {}; //init messages
	next();
});
app.post("*", (req, res, next) => { //validate all form post
	if (valid.validate(req.path, req.body, res.locals.i18n))
		next();
	else
		next(res.locals.i18n.errForm);
});
app.use(require("./routes/routes.js")); //add all routes
app.use((err, req, res, next) => { //global handler error
	if (req.headers["x-requested-with"] == "XMLHttpRequest") //ajax call
		return res.status(500).json(valid.addMsg("msgError", err).getErrors());
	res.locals.errors = valid.getErrors();
	res.locals.msgError = err; //error text
	return res.render("index");
});
app.use("*", (req, res) => res.build("errors/404")); //404

//arranca el servidor
const httpServer = http.createServer(app);
const httpsServer = https.createServer(HTTPS, app);
httpServer.listen(3000);
httpsServer.listen(3443);

//capture Node.js Signals and Events
function fnExit(signal) { //exit handler
	console.log("\n--------------------");
	console.log("> Received [" + signal + "].");
	console.log("--------------------");

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
