
//const fs = require("fs"); //file system module
//import path from "path"; //file and directory paths
//const http = require("http"); //http server
//const https = require("https"); //secure server

import express from "express"; //infraestructura web
import session from "express-session"; //session handler
import * as uuid from "uuid"; //generate random ids

import dao from "app/dao/factory.js"; // DAO factory
import i18n from "app/mod/i18n-box.js"; // Util helpers
import util from "app/mod/node-box.js"; // Util helpers
import routes from "./routes/routes.js"; // All routes
import config from "app/dist/config.js"; // Configurations

/*const HTTPS = { //credentials
	key: fs.readFileSync(path.join(__dirname, "../certs/key.pem")).toString(),
	cert: fs.readFileSync(path.join(__dirname, "../certs/cert.pem")).toString()
};*/

const app = express(); // Instance
// Template engines for views
app.set("view engine", "ejs");
app.set("views", config.DIR_VIEWS);

app.locals._tplBody = "web/index"; // Default body
app.locals.msgs = i18n.getMsgs(); // Set messages
app.locals.body = {}; // Set data on response

// Express configurations
app.use("/public", express.static(config.DIR_PUBLIC)); // static files
app.use(express.urlencoded({ limit: "90mb", extended: false })); // to support URL-encoded bodies
app.use(express.json({ limit: "90mb" }));

app.set("trust proxy", 1) // trust first proxy
app.use(session({ //session config
	resave: false,
	rolling: true, // Reset expiration to maxAge
	saveUninitialized: false,
	genid: req => uuid.v1(), //use UUIDs for session IDs
	secret: config.SESSION_SECRET,
	name: config.SESSION_NAME,
	cookie: {
		secure: false, //require https
		sameSite: true, //blocks CORS requests on cookies. This will affect the workflow on API calls and mobile applications
		maxAge: 60*60*1000 //1h
	}
}));

// Routes
app.use((req, res, next) => {
	// Initialize response function helpers
	res.on("finish", () => i18n.reset()); // Close response event

	// Search for language in request, session and headers by region: es-ES
	let lang = req.query.lang || req.session.lang || req.headers["accept-language"].substr(0, 5);
	req.session.lang = res.locals.lang = i18n.load(lang).get("lang"); // Set language id

	// Load specific user menus or public menus on view
	res.locals.menus = [];//req.session.menus || dao.web.myjson.menus.getPublic(lang);
	next(); //go next middleware
});
app.use(routes); // Use all routes
app.use((err, req, res, next) => { //global handler error
	if (req.xhr) // Is ajax request => (req.headers["x-requested-with"] == "XMLHttpRequest")
		util.msgErr500(res, "" + err); // return string error
	else // Is non ajax request => render template body
		util.err500(res, "" + err); // error view

	// Show log error for console
	console.error("> Log:", req.url, err);
});
app.use("*", (req, res) => { //error 404 page not found
	if (req.xhr) // equivalent to (req.headers["x-requested-with"] == "XMLHttpRequest")
		util.msgErr404(res, "err404"); //ajax response
	else
		util.err404(res, "errors/404"); //show 404 page
});

// Start servers (db's and http)
const server = app.listen(config.PORT, err => {
	if (err) // If error => stop
		return console.log(err);
	dao.open(); //open db's factories
	console.log("> Server listening on http://localhost:" + config.PORT);
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
//process.on("exit", function() { fnExit("exit"); }); //common exit signal = SIGINT
process.on("SIGHUP", function() { fnExit("SIGHUP"); }); //generated on Windows when the console window is closed
process.on("SIGINT", function() { fnExit("SIGINT"); }); //Press Ctrl-C / Ctrl-D keys to exit
process.on("SIGTERM", function() { fnExit("SIGTERM"); }); //kill the server using command kill [PID_number] or killall node
process.stdin.on("data", function(data) { (data == "exit\n") && fnExit("exit"); }); //console exit
