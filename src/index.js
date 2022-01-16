
const fs = require("fs"); //file system module
const path = require("path"); //file and directory paths
//const http = require("http"); //http server
//const https = require("https"); //secure server

const express = require("express"); //infraestructura web
const session = require("express-session") //session handler
const uuid = require("uuid"); //generate random ids
const ejs = require("ejs"); //tpl engine
const app = express(); //instance app

const env = require("dotenv").config(); //load env const
const dao = require("app/dao/factory.js"); //DAO factory
const util = require("app/lib/util-box.js"); //languages

/*const HTTPS = { //credentials
	key: fs.readFileSync(path.join(__dirname, "../certs/key.pem")).toString(),
	cert: fs.readFileSync(path.join(__dirname, "../certs/cert.pem")).toString()
};*/

// Template engines for views
const VIEWS = path.join(__dirname, "views");
app.set("view engine", "ejs");
app.set("views", VIEWS);
//app.locals.partials = VIEWS + "/partials/";
//app.locals.components = VIEWS + "/components/"
app.locals._tplBody = "web/index"; // Default body
app.locals.msgs = util.i18n.getMsgs(); // Set messages
app.locals.body = {}; // Set data on response

// Express configurations
app.use("/public", express.static(path.join(__dirname, "public"))); // static files
app.use(express.urlencoded({ limit: "90mb", extended: false })); // to support URL-encoded bodies
app.use(express.json({ limit: "90mb" }));

app.set("trust proxy", 1) // trust first proxy
app.use(session({ //session config
	resave: false,
	rolling: true, // Reset expiration to maxAge
	saveUninitialized: false,
	genid: req => uuid.v1(), //use UUIDs for session IDs
	secret: process.env.SESSION_SECRET,
	name: process.env.SESSION_NAME,
	cookie: {
		secure: false, //require https
		sameSite: true, //blocks CORS requests on cookies. This will affect the workflow on API calls and mobile applications
		maxAge: 60*60*1000 //1h
	}
}));

// Routes
app.use((req, res, next) => {
	// Initialize response function helpers
	res.msgs = function() { res.json(util.i18n.toMsgs()); } //send object messages
	res.setBody = function(tpl) { res.locals._tplBody = tpl; return res; } //set body template
	res.build = function(tpl) { res.setBody(tpl).render("index"); } //set tpl body path and render index
	res.setHtml = function(contents) { util.i18n.setMsg("html", ejs.render(contents, res.locals)); return res; }
	res.setFile = function(tpl) { return res.setHtml(fs.readFileSync(path.join(VIEWS, tpl), "utf-8")); }
	res.on("finish", () => { util.i18n.reset(); }); // Close response event

	// Search for language in request, session and headers by region: es-ES
	let lang = req.query.lang || req.session.lang || req.headers["accept-language"].substr(0, 5);
	req.session.lang = res.locals.lang = util.i18n.setI18n(lang).get("lang"); // Set language id
	res.locals.i18n = util.i18n.getLang(); // Set texts on view

	// Load specific user menus or public menus on view
	res.locals.menus = req.session.menus || dao.web.myjson.menus.getPublic(lang);
	next(); //go next middleware
});
app.use(require("./routes/routes.js")); //add all routes
app.use((err, req, res, next) => { //global handler error
	if (util.sb.isstr(err)) // Exception or message to string
		util.i18n.setMsgError(err); // i18n key or string

	if (req.xhr) // Is ajax request => (req.headers["x-requested-with"] == "XMLHttpRequest")
		(util.i18n.getNumErrors() > 1) ? res.status(500).msgs() : res.status(500).send(util.i18n.getError());
	else {
		// Is non ajax request => reload data formated and render body
		res.locals.body = Object.assign(req.body, util.i18n.toData());
		res.status(500).render("index"); // Render tpl body
	}

	// Show log error for console
	console.error("> Log:", util.i18n.getError());
});
app.use("*", (req, res) => { //error 404 page not found
	util.i18n.setMsgError("err404"); //set message error on view
	if (req.xhr) // equivalent to (req.headers["x-requested-with"] == "XMLHttpRequest")
		res.status(404).send(util.i18n.getError()); //ajax response
	else
		res.status(404).build("errors/404"); //show 404 page
});

// Start servers (db's and http)
const port = process.env.PORT || 3000;
const server = app.listen(port, err => {
	if (err) // If error => stop
		return console.log(err);
	dao.open(); //open db's factories
	console.log("> Server listening on http://localhost:" + port);
});

//capture Node.js Signals and Events
function fnExit(signal) { //exit handler
	console.log("\n--------------------");
	console.log("> Received [" + signal + "].");
	console.log("--------------------");

	dao.close();
	server.close();

	console.log("> Http server closed.");
	console.log("> " + (new Date()));
	console.log("--------------------\n");
	process.exit(0);
};
server.on("close", fnExit); //close server event
process.on("exit", function() { fnExit("exit"); }); //common exit signal = SIGINT
process.on("SIGHUP", function() { fnExit("SIGHUP"); }); //generated on Windows when the console window is closed
process.on("SIGINT", function() { fnExit("SIGINT"); }); //Press Ctrl-C / Ctrl-D keys to exit
process.on("SIGTERM", function() { fnExit("SIGTERM"); }); //kill the server using command kill [PID_number] or killall node
process.stdin.on("data", function(data) { (data == "exit\n") && fnExit("exit"); }); //console exit
