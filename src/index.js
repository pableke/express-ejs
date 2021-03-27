
const path = require("path"); //file and directory paths
const express = require("express"); //infraestructura web
const session = require("express-session") //session handler
const app = express(); //instance app

const i18n = { //aviable languages list
	"es": require("./i18n/es.js"), 
	"en": require("./i18n/en.js")
};

//motor de plantillas
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

//configuraciones
app.use("/public", express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.set("trust proxy", 1) // trust first proxy
app.use(session({
	secret: "keyboard cat",
	resave: false,
	saveUninitialize: false,
	cookie: {
		secure: false, //require https
		maxAge: 60*60*1000 //1h
	}
}));

app.use((req, res, next) => {
	let lang = req.query.lang || req.session.lang;
	if (!lang || (lang !== req.session.lang)) {
		//user has changed current language or first access
		let ac = req.headers["accept-language"] || "es"; //default laguage = es
		lang = (i18n[lang]) ? lang : ac.substr(0, 5); //search region language es-ES
		lang = (i18n[lang]) ? lang : lang.substr(0, 2); //search type language es
		lang = (i18n[lang]) ? lang : "es"; //default language = es
		req.session[lang] = i18n.es;
		req.session.lang = lang;
	}
	req.session.count = req.session.count || 0;
	res.locals.count = ++req.session.count;
	res.locals.i18n = req.session[lang];
	res.locals.lang = lang;
	next();
});

//rutas
app.get("/", (req, res) => {
	res.render("index", { page: "index", titWelcome: "Welcome to templating using EJS!", dir: __dirname });
});
app.use("*", (req, res) => { //404
	res.send("resource not found");
});

//arranca el servidor
app.listen(3000, () => console.log("Server listening on port 3000"));
