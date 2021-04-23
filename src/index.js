
const fs = require("fs"); //file system module
const path = require("path"); //file and directory paths
const http = require("http"); //http server
const https = require("https"); //secure server

const express = require("express"); //infraestructura web
const session = require("express-session") //session handler
const app = express(); //instance app

const env = require("dotenv").config(); //load env const
const dao = require("app/dao/factory.js"); //DAO factory
const valid = require("app/validator-box.js"); //validators

const HTTPS = { //credentials
	key: fs.readFileSync(path.join(__dirname, "../certs/key.pem")).toString(),
	cert: fs.readFileSync(path.join(__dirname, "../certs/cert.pem")).toString()
};
const UPLOADS = {
	keepExtensions: true,
	uploadDir: path.join(__dirname, "public/files/"),
	maxFieldsSize: 30 * 1024 * 1024, //30mb
	maxFileSize: 60 * 1024 * 1024, //60mb
	maxFields: 1000,
	multiples: true
};

// Template engines
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

//extends validators
valid.set("required", function(name, value, msgs) {
	return valid.size(value, 1, 200) || !valid.setError(name, msgs.errRequired);
}).set("min8", function(name, value, msgs) {
	return valid.size(value, 8, 200) || !valid.setError(name, msgs.errMinlength8);
}).set("usuario", function(name, value, msgs) {
	return valid.min8(name, value, msgs) && (valid.idES(name, value) || valid.email(name, value) || !valid.setError(name, msgs.errRegex));
}).set("clave", function(name, value, msgs) {
	return valid.min8(name, value, msgs) && (valid.login(name, value) || !valid.setError(name, msgs.errRegex));
}).set("reclave", function(name, value, msgs, data) {
	return valid.clave(name, value, msgs) && ((value == data.clave) || !valid.setError(name, msgs.errReclave));
}).set("nif", function(name, value, msgs) {
	return valid.required(name, value, msgs) && (valid.idES(name, value) || !valid.setError(name, msgs.errNif));
}).set("correo", function(name, value, msgs) {
	return valid.required(name, value, msgs) && (valid.email(name, value) || !valid.setError(name, msgs.errCorreo));
}).set("ltNow", function(name, value, msgs) {
	return valid.required(name, value, msgs) 
			&& (valid.date(name, value, msgs) || !valid.setError(name, msgs.errDate)) 
			&& ((valid.getData(name).getTime() < Date.now()) || !valid.setError(name, msgs.errDateLe));
}).set("leToday", function(name, value, msgs) {
	return valid.required(name, value, msgs) 
			&& (valid.date(name, value, msgs) || !valid.setError(name, msgs.errDate)) 
			&& ((valid.toISODateString(valid.getData(name)) <= valid.toISODateString()) || !valid.setError(name, msgs.errDateLe));
}).set("gtNow", function(name, value, msgs) {
	return valid.required(name, value, msgs) 
			&& (valid.date(name, value, msgs) || !valid.setError(name, msgs.errDate)) 
			&& ((valid.getData(name).getTime() > Date.now()) || !valid.setError(name, msgs.errDateGe));
}).set("geToday", function(name, value, msgs) {
	return valid.required(name, value, msgs) 
			&& (valid.date(name, value, msgs) || !valid.setError(name, msgs.errDate)) 
			&& ((valid.toISODateString(valid.getData(name)) >= valid.toISODateString()) || !valid.setError(name, msgs.errDateGe));
}).set("gt0", function(name, value, msgs) {
	return valid.required(name, value, msgs) 
			&& (valid.float(name, value, msgs) || !valid.setError(name, msgs.errNumber)) 
			&& ((valid.getData(name) > 0) || !valid.setError(name, msgs.errGt0));
});

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
//app.use((req, res, next) => {});
app.use(require("./routes/routes.js")); //add all routes
app.use((err, req, res, next) => { //global handler error
	valid.setMsgError(err); //set message error on view
	if (req.headers["x-requested-with"] == "XMLHttpRequest")
		return res.status(500).json(valid.getMsgs()); //ajax response
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
