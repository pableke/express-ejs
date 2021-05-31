
const fs = require("fs"); //file system module
const path = require("path"); //file and directory paths
//const http = require("http"); //http server
//const https = require("https"); //secure server

const express = require("express"); //infraestructura web
const session = require("express-session") //session handler
const uuid = require("uuid"); //generate random ids
const app = express(); //instance app

const env = require("dotenv").config(); //load env const
const dao = require("app/dao/factory.js"); //DAO factory
const valid = require("app/lib/validator-box.js"); //validators

/*const HTTPS = { //credentials
	key: fs.readFileSync(path.join(__dirname, "../certs/key.pem")).toString(),
	cert: fs.readFileSync(path.join(__dirname, "../certs/cert.pem")).toString()
};*/

// Template engines
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Express configurations
app.use("/public", express.static(path.join(__dirname, "public"))); // static files
app.use(express.urlencoded({ limit: "90mb", extended: false })); // to support URL-encoded bodies
app.use(express.json({ limit: "90mb" }));

app.set("trust proxy", 1) // trust first proxy
app.use(session({ //session config
	resave: false,
	saveUninitialized: false,
	genid: req => uuid.v1(), //use UUIDs for session IDs
	secret: process.env.SESSION_SECRET,
	cookie: {
		secure: false, //require https
		maxAge: 60*60*1000 //1h
	}
}));

// Routes
app.use((req, res, next) => {
	// Initialize response helpers
	res.locals.msgs = {}; //init messages
	res.locals._tplBody = "web/index"; //default body
	res.setOk = function(msg) { res.locals.msgs.msgOk = msg; return res; } //set msg ok
	res.setBody = function(tpl) { res.locals._tplBody = tpl; return res; } //set body template
	res.jsonMsgs = function(msg) { res.setOk(msg).json(res.locals.msgs); } //send msgs + ok as json
	res.build = function(tpl) { res.setBody(tpl).render("index"); } //set tpl body path and render index
	res.buildOk = function(tpl, msg) { res.setOk(msg).build(tpl); } //build + msg ok
	res.buildErr = function(tpl, msg) { res.locals.msgs.msgError = msg; res.build(tpl); } //build + msg err
	res.on("finish", function() { valid.clear(res.locals.msgs).clear(res.locals); }); //reset messages and view
	next(); //go next middleware
});
app.use(require("./routes/routes.js")); //add all routes
app.use((err, req, res, next) => { //global handler error
	console.log("> Log:", err); // show log on console
	if (err.stack && err.message && (typeof(err.message) === "string"))
		err = err.message; // Is Exception Error Type => response message only
	if (req.xhr) // is ajax request => (req.headers["x-requested-with"] == "XMLHttpRequest")
		return valid.isObject(err) ? res.status(500).json(err) : res.status(500).send(err);

	// Is non ajax request
	if (valid.isObject(err))
		res.locals.msgs = err;
	else
		res.locals.msgs.msgError = err;
	return res.status(500).render("index"); //render tpl body specified
});
app.use("*", (req, res) => { //error 404 page not found
	res.locals.msgs.msgError = res.locals.i18n.err404; //set message error on view
	if (req.xhr) // equivalent to (req.headers["x-requested-with"] == "XMLHttpRequest")
		return res.status(404).send(res.locals.msgs.msgError); //ajax response
	return res.status(404).build("errors/404"); //show 404 page
});

// Start servers (db's and http)
dao.open(); //open db's factories
const port = process.env.PORT || 3000;
const server = app.listen(port, err => {
	if (err)
		console.log(err);
	else
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
