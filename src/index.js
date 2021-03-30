
const fs = require("fs"); //file system module
const path = require("path"); //file and directory paths
const http = require("http"); //http server
const https = require("https"); //secure server

const express = require("express"); //infraestructura web
const session = require("express-session") //session handler
const app = express(); //instance app

const env = require("dotenv").config(); //load env const
const mailer = require("./lib/mailer"); //google mailer

const HTTPS = { //credentials
	key: fs.readFileSync(path.join(__dirname, "../certs/key.pem")).toString(),
	cert: fs.readFileSync(path.join(__dirname, "../certs/cert.pem")).toString()
};
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
app.use(session({ //session config
	resave: false,
	saveUninitialized: false,
	secret: "v@Ge*UfKmLm5QRGg6kQB61dqT6Rj##F*me!vG",
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
	res.locals.msgOk = res.locals.msgInfo = res.locals.msgWarn = res.locals.msgError = "";
	req.session.menu = req.session.menu || [{},{}]; //public menu
	res.locals.i18n = req.session[lang];
	res.locals.lang = lang;
	next();
});

//rutas
app.get("/", (req, res) => {
	res.locals.peliculas = [];
	res.render("index", { page: "pages/index" });
});
const usuarios = [{"idUsuario":3322,"nif":"52801892X","nombre":"JOSÉ VICENTE HELLÍN ATENZA","idGrupo":55,"utCodigo":"U06400009","utDesc":"VICERRECTORADO DE PROFESORADO E INNOVACIÓN DOCENTE","utEmail":"josevicente.hellin@dep.upct.es"},{"idUsuario":8248,"nif":"77503501X","nombre":"CARMEN POZO RABADÁN","idGrupo":8,"utCodigo":"U06400010","utDesc":"VICERRECTORADO DE INVESTIGACIÓN E INNOVACIÓN","utEmail":"salvador.martinez7@upct.es"},{"idUsuario":18,"nif":"10559758K","nombre":"MARÍA DOLORES DE LA CAÑINA FERNÁNDEZ","idGrupo":9,"utCodigo":"U06400061","utDesc":"ESTUDIANTES Y EXTENSIÓN UNIVERSITARIA","utEmail":"rosario.garcia@upct.es"},{"idUsuario":3915,"nif":"22941522B","nombre":"CARMEN ANDREU VERA","idGrupo":68,"utCodigo":"U06400067","utDesc":"CONTRATACIÓN Y SERVICIOS","utEmail":"carmen.andreu@upct.es"},{"idUsuario":2178,"nif":"22964610F","nombre":"MARÍA ROSARIO GARCÍA JARA","idGrupo":9,"utCodigo":"U06400061","utDesc":"ESTUDIANTES Y EXTENSIÓN UNIVERSITARIA","utEmail":"rosario.garcia@upct.es"},{"idUsuario":3890,"nif":"22965599F","nombre":"DOMINGO LORENTE ÁNGEL","idGrupo":9,"utCodigo":"U06400061","utDesc":"ESTUDIANTES Y EXTENSIÓN UNIVERSITARIA","utEmail":"rosario.garcia@upct.es"},{"idUsuario":7171,"nif":"22969113W","nombre":"ROSA MARÍA CARIDAD AGUILAR OCHOA","idGrupo":46,"utCodigo":"U06400029","utDesc":"DEPARTAMENTO DE ARQUITECTURA Y TECNOLOGÍA DE LA EDIFICACIÓN","utEmail":"eva.szamora@dep.upct.es"},{"idUsuario":261,"nif":"22977599R","nombre":"ELVIRA JOSEFA DÁVILA TUDELA","idGrupo":54,"utCodigo":"U06400060","utDesc":"GESTIÓN ACADÉMICA","utEmail":"mcarmen.gutierrez@dep.upct.es"},{"idUsuario":7018,"nif":"73650999P","nombre":"CARMEN LÓPEZ URREA","idGrupo":63,"utCodigo":"U06400002","utDesc":"CONSEJO SOCIAL","utEmail":"carmen.lopez@rec.upct.es"},{"idUsuario":2157,"nif":"22928617D","nombre":"MARÍA ÁNGELES BOSQUE MATA","idGrupo":33,"utCodigo":"U06400031","utDesc":"DEPARTAMENTO DE CIENCIAS JURÍDICAS","utEmail":"angeles.bosque@euitc.upct.es"},{"idUsuario":8428,"nif":"22938843T","nombre":"MARÍA DE LOS ÁNGELES FONTCUBERTA MULERO","idGrupo":19,"utCodigo":"U06400042","utDesc":"DEPARTAMENTO DE INGENIERÍA MECÁNICA","utEmail":"angela.fontcuberta@upct.es"},{"idUsuario":3944,"nif":"22944530Y","nombre":"JOSÉ ANTONIO VIDAL FLORES","idGrupo":9,"utCodigo":"U06400061","utDesc":"ESTUDIANTES Y EXTENSIÓN UNIVERSITARIA","utEmail":"rosario.garcia@upct.es"},{"idUsuario":11269,"nif":"22945394L","nombre":"JAVIER LORENZO ESPÍN NAVARRO","idGrupo":48,"utCodigo":"U06400059","utDesc":"RECURSOS HUMANOS","utEmail":"javier.espin@upct.es"},{"idUsuario":3925,"nif":"22947098K","nombre":"JOSÉ MANUEL MARTÍNEZ MARTÍNEZ","idGrupo":65,"utCodigo":"U06400057","utDesc":"GESTIÓN DE LA CALIDAD","utEmail":"lola.catalan@upct.es"},{"idUsuario":30111,"nif":"22968434J","nombre":"MARIA DEL MAR AVILÉS RODEIRO","idGrupo":32,"utCodigo":"U06400022","utDesc":"ESCUELA TÉCNICA SUPERIOR DE INGENIEROS DE CAMINOS CANALES Y PUERTOS Y DE INGENIERÍA DE MINAS","utEmail":"mariad.aviles@upct.es"},{"idUsuario":37,"nif":"22974234V","nombre":"ANDRÉS SORIANO ASUAR","idGrupo":58,"utCodigo":"U06400030","utDesc":"DEPARTAMENTO DE CIENCIA Y TECNOLOGÍA AGRARIA","utEmail":"andres.soriano@rec.upct.es"},{"idUsuario":7568,"nif":"22996413R","nombre":"EVA SÁNCHEZ ZAMORA","idGrupo":6,"utCodigo":"U06400066","utDesc":"UNIDAD TÉCNICA","utEmail":"mariarosa.ayala@rec.upct.es"},{"idUsuario":7022,"nif":"24226055V","nombre":"MARGARITA JOHANNA BIRRIEL SALCEDO","idGrupo":83,"utCodigo":"U06400043","utDesc":"DEPARTAMENTO DE INGENIERÍA MINERA, GEOLÓGICA Y CARTOGRÁFICA","utEmail":"johanna.birriel@rec.upct.es"},{"idUsuario":3502,"nif":"27439979J","nombre":"ASUNCIÓN RUIZ PARDO","idGrupo":45,"utCodigo":"U06400048","utDesc":"DEPARTAMENTO DE MÉTODOS CUANTITATIVOS E INFORMÁTICOS","utEmail":"asuncion.ruiz@dep.upct.es"},{"idUsuario":5613,"nif":"27428597Q","nombre":"SALVADOR MELGAREJO LORENTE","idGrupo":12,"utCodigo":"U06400018","utDesc":"ESCUELA TÉCNICA SUPERIOR DE INGENIERÍA INDUSTRIAL","utEmail":"domingo.lorente@upct.es"},{"idUsuario":2322,"nif":"34813664J","nombre":"JOSEFA PALAZÓN SABATER","idGrupo":3,"utCodigo":"U06400065","utDesc":"INFORMÁTICA","utEmail":"pepa.palazon@si.upct.es"},{"idUsuario":9744,"nif":"74173940K","nombre":"JOSÉ FERNANDO MONTERO RODRÍGUEZ","idGrupo":9,"utCodigo":"U06400061","utDesc":"ESTUDIANTES Y EXTENSIÓN UNIVERSITARIA","utEmail":"rosario.garcia@upct.es"},{"idUsuario":3542,"nif":"22451969J","nombre":"JOSEFA ARANDA MUÑOZ","idGrupo":5,"utCodigo":"U06400011","utDesc":"VICERRECTORADO DE PLANIFICACIÓN ECONÓMICA Y ESTRATÉGICA","utEmail":"berta.bayo@rec.upct.es"},{"idUsuario":7021,"nif":"22918702F","nombre":"ANA MARÍA MARTÍNEZ VALVERDE","idGrupo":48,"utCodigo":"U06400059","utDesc":"RECURSOS HUMANOS","utEmail":"javier.espin@upct.es"},{"idUsuario":3891,"nif":"22923403Q","nombre":"MARÍA CARMEN MATEU ERVITI","idGrupo":43,"utCodigo":"U06400035","utDesc":"DEPARTAMENTO DE ELECTRÓNICA, TECNOLOGÍA DE COMPUTADORAS Y PROYECTOS","utEmail":"mamen.mateu@rec.upct.es"},{"idUsuario":9904,"nif":"22929900G","nombre":"JOSÉ MARTÍNEZ MARTÍNEZ","idGrupo":9,"utCodigo":"U06400061","utDesc":"ESTUDIANTES Y EXTENSIÓN UNIVERSITARIA","utEmail":"rosario.garcia@upct.es"},{"idUsuario":7566,"nif":"22941114V","nombre":"ANA MARÍA RODRÍGUEZ RAMÍREZ","idGrupo":26,"utCodigo":"U06400051","utDesc":"DEPARTAMENTO DE TECNOLOGÍAS DE LA INFORMACIÓN Y LAS COMUNICACIONES","utEmail":"ana.rodriguez@dep.upct.es"},{"idUsuario":7094,"nif":"22943145R","nombre":"MARÍA DOLORES MORAL RODRÍGUEZ","idGrupo":27,"utCodigo":"U06400017","utDesc":"ESCUELA TÉCNICA SUPERIOR DE INGENIERÍA AGRONÓMICA","utEmail":"lola.moral@upct.es"},{"idUsuario":7359,"nif":"22947924L","nombre":"TRINIDAD SÁNCHEZ MATEOS","idGrupo":74,"utCodigo":"U06400052","utDesc":"UNIDAD PREDEPARTAMENTAL DE TECNOLOGÍA NAVAL","utEmail":"trini.sanchez@rec.upct.es"},{"idUsuario":3897,"nif":"22951545Y","nombre":"MANUELA BLANES ESPARZA","idGrupo":29,"utCodigo":"U06400038","utDesc":"DEPARTAMENTO DE FÍSICA APLICADA","utEmail":"manoli.blanes@dep.upct.es"},{"idUsuario":28,"nif":"09337213H","nombre":"ANA ISABEL MOSTAZA FERNÁNDEZ","idGrupo":54,"utCodigo":"U06400060","utDesc":"GESTIÓN ACADÉMICA","utEmail":"mcarmen.gutierrez@dep.upct.es"},{"idUsuario":3907,"nif":"22910106J","nombre":"MARÍA ROSA AYALA SÁNCHEZ","idGrupo":6,"utCodigo":"U06400066","utDesc":"UNIDAD TÉCNICA","utEmail":"mariarosa.ayala@rec.upct.es"},{"idUsuario":2152,"nif":"22917955L","nombre":"MARÍA TERESA GUILLAMÓN FERNÁNDEZ","idGrupo":14,"utCodigo":"U06400063","utDesc":"DOCUMENTACIÓN","utEmail":"teresa.guillamon@bib.upct.es"},{"idUsuario":7676,"nif":"22951152G","nombre":"BERTA DOLORES BAYO GARCÍA","idGrupo":5,"utCodigo":"U06400011","utDesc":"VICERRECTORADO DE PLANIFICACIÓN ECONÓMICA Y ESTRATÉGICA","utEmail":"berta.bayo@rec.upct.es"},{"idUsuario":7001,"nif":"22976162J","nombre":"MARÍA JOSEFA GUTIÉRREZ HERNÁNDEZ","idGrupo":47,"utCodigo":"U06400020","utDesc":"ESCUELA TÉCNICA SUPERIOR DE INGENIERÍA DE TELECOMUNICACIONES","utEmail":"mjose.gutierrez@rec.upct.es"},{"idUsuario":522,"nif":"22976816T","nombre":"MARÍA DE LA LUZ MEDRAÑO MARTÍN","idGrupo":4,"utCodigo":"U06400034","utDesc":"DEPARTAMENTO DE ECONOMÍA DE LA EMPRESA","utEmail":"mariluz.medrano@upct.es"},{"idUsuario":1002,"nif":"27460214P","nombre":"JOSÉ ALBERTO LUCAS MUÑOZ","idGrupo":24,"utCodigo":"U06400056","utDesc":"RELACIONES INTERNACIONALES","utEmail":"jalberto.lucas@rec.upct.es"},{"idUsuario":3901,"nif":"27469497E","nombre":"JOSEFA MARÍA NAVARRO GÓMEZ","idGrupo":25,"utCodigo":"U06400044","utDesc":"DEPARTAMENTO DE INGENIERÍA QUÍMICA Y AMBIENTAL","utEmail":"mariajo.navarro@rec.upct.es"},{"idUsuario":8905,"nif":"34810558N","nombre":"CARMEN MARÍA MESEGUER GÓMEZ","idGrupo":31,"utCodigo":"U06400021","utDesc":"FACULTAD DE CIENCIAS DE LA EMPRESA","utEmail":"josem.martinez@upct.es"},{"idUsuario":4792,"nif":"22974655R","nombre":"MARÍA JOSÉ BERNAL LIARTE","idGrupo":41,"utCodigo":"U06400039","utDesc":"DEPARTAMENTO DE INGENIERÍA DE LOS ALIMENTOS Y DEL EQUIPAMIENTO AGRÍCOLA","utEmail":"mariajose.bernal@upct.es"},{"idUsuario":8219,"nif":"22991561W","nombre":"SALVADOR MARTÍNEZ OTÓN","idGrupo":8,"utCodigo":"U06400010","utDesc":"VICERRECTORADO DE INVESTIGACIÓN E INNOVACIÓN","utEmail":"salvador.martinez7@upct.es"},{"idUsuario":10987,"nif":"23006373W","nombre":"MARTA BALERIOLA FERNÁNDEZ","idGrupo":68,"utCodigo":"U06400067","utDesc":"CONTRATACIÓN Y SERVICIOS","utEmail":"carmen.andreu@upct.es"},{"idUsuario":2013,"nif":"22960183L","nombre":"JOSÉ MARIANO JIMÉNEZ TÁRRAGA","idGrupo":22,"utCodigo":"U06400047","utDesc":"DEPARTAMENTO DE MATEMÁTICA APLICADA Y ESTADÍSTICA","utEmail":"josemariano.jimenez@dep.upct.es"},{"idUsuario":3362,"nif":"22989898H","nombre":"MERCEDES MARTÍNEZ ESCUDERO","idGrupo":66,"utCodigo":"U06400023","utDesc":"ESCUELA TÉCNICA SUPERIOR DE ARQUITECTURA Y EDIFICACIÓN","utEmail":"mercedes.escudero@rec.upct.es"},{"idUsuario":9910,"nif":"23005940Y","nombre":"ANA BELÉN VIUDES GARCÍA","idGrupo":17,"utCodigo":"U06400050","utDesc":"DEPARTAMENTO DE TECNOLOGÍA ELECTRÓNICA","utEmail":"anabelen.viudes@upct.es"},{"idUsuario":3898,"nif":"27340629T","nombre":"MARÍA LOZANO RODRÍGUEZ","idGrupo":40,"utCodigo":"U06400040","utDesc":"DEPARTAMENTO DE INGENIERÍA ELÉCTRICA","utEmail":"maria.lozano@upct.es"},{"idUsuario":7347,"nif":"27436743C","nombre":"MARÍA VIRGINIA CARLES CANO-MANUEL","idGrupo":24,"utCodigo":"U06400056","utDesc":"RELACIONES INTERNACIONALES","utEmail":"jalberto.lucas@rec.upct.es"},{"idUsuario":13034,"nif":"27459291M","nombre":"MARÍA TRINIDAD GALERA GARCÍA","idGrupo":54,"utCodigo":"U06400060","utDesc":"GESTIÓN ACADÉMICA","utEmail":"mcarmen.gutierrez@dep.upct.es"},{"idUsuario":20936,"nif":"X1718513E","nombre":"CARINA CINTA MARIE TARDY","idGrupo":24,"utCodigo":"U06400056","utDesc":"RELACIONES INTERNACIONALES","utEmail":"jalberto.lucas@rec.upct.es"},{"idUsuario":50,"nif":"EC_SIDIOMAS","nombre":"JOSÉ ALBERTO LUCAS MUÑOZ","idGrupo":11,"utCodigo":"U06400070","utDesc":"IDIOMAS","utEmail":"trini.sanchez@rec.upct.es"},{"idUsuario":52,"nif":"EC_DEPTERMICA","nombre":"ISABEL DOLORES CARVAJAL BASTIDA","idGrupo":39,"utCodigo":"U06400046","utDesc":"DEPARTAMENTO DE INGENIERÍA TÉRMICA Y DE FLUIDOS","utEmail":"isa.carvajal@upct.es"},{"idUsuario":54,"nif":"EC_UPCIVIL","nombre":"MARGARITA JOHANNA BIRRIEL SALCEDO","idGrupo":28,"utCodigo":"U06400053","utDesc":"UNIDAD PREDEPARTAMENTAL DE INGENIERÍA CIVIL","utEmail":"johanna.birriel@rec.upct.es"},{"idUsuario":55,"nif":"EC_INGELEC","nombre":"DARÍO CAÑETE CERVANTES","idGrupo":40,"utCodigo":"U06400040","utDesc":"DEPARTAMENTO DE INGENIERÍA ELÉCTRICA","utEmail":"maria.lozano@upct.es"},{"idUsuario":56,"nif":"EC_DEPARQ","nombre":"EVA SÁNCHEZ ZAMORA","idGrupo":46,"utCodigo":"U06400029","utDesc":"DEPARTAMENTO DE ARQUITECTURA Y TECNOLOGÍA DE LA EDIFICACIÓN","utEmail":"eva.szamora@dep.upct.es"},{"idUsuario":57,"nif":"EC_UCULTURA","nombre":"MERCEDES MARTÍNEZ ESCUDERO","idGrupo":134,"utCodigo":"U06400079","utDesc":"Unidad De Cultura Científica Y De La Innovación (Unidad De Cultura Científica Y Tecnológica)","utEmail":"mercedes.escudero@rec.upct.es"},{"idUsuario":58,"nif":"EC_DEFENSOR","nombre":"CARMEN LÓPEZ URREA","idGrupo":94,"utCodigo":"U06400005","utDesc":"DEFENSOR UNIVERSITARIO","utEmail":"carmen.lopez@rec.upct.es"},{"idUsuario":59,"nif":"EC_DEPETCP","nombre":"MANUELA BLANES ESPARZA","idGrupo":43,"utCodigo":"U06400035","utDesc":"DEPARTAMENTO DE ELECTRÓNICA, TECNOLOGÍA DE COMPUTADORAS Y PROYECTOS","utEmail":"mamen.mateu@rec.upct.es"},{"idUsuario":60,"nif":"EC_UPNAVAL","nombre":"JOSÉ MARIANO JIMÉNEZ TÁRRAGA","idGrupo":74,"utCodigo":"U06400052","utDesc":"UNIDAD PREDEPARTAMENTAL DE TECNOLOGÍA NAVAL","utEmail":"trini.sanchez@rec.upct.es"},{"idUsuario":70,"nif":"EC_INGALIMENTOS","nombre":"JOSEFA MARÍA NAVARRO GÓMEZ","idGrupo":41,"utCodigo":"U06400039","utDesc":"DEPARTAMENTO DE INGENIERÍA DE LOS ALIMENTOS Y DEL EQUIPAMIENTO AGRÍCOLA","utEmail":"mariajose.bernal@upct.es"},{"idUsuario":72,"nif":"EC_SERVINFOR","nombre":"DOLORES ANA FERNÁNDEZ MARTÍNEZ","idGrupo":3,"utCodigo":"U06400065","utDesc":"INFORMÁTICA","utEmail":"pepa.palazon@si.upct.es"},{"idUsuario":75,"nif":"EC_DEPMETCUAN","nombre":"DOLORES GUERRERO BELMONTE","idGrupo":45,"utCodigo":"U06400048","utDesc":"DEPARTAMENTO DE MÉTODOS CUANTITATIVOS E INFORMÁTICOS","utEmail":"asuncion.ruiz@dep.upct.es"},{"idUsuario":76,"nif":"EC_IBV","nombre":"ANA MARÍA FRUCTUOSO HERNÁNDEZ","idGrupo":61,"utCodigo":"U06400024","utDesc":"INSTITUTO DE BIOTECNOLOGÍA VEGETAL","utEmail":"maria.morote@sait.upct.es"},{"idUsuario":80,"nif":"EC_CTAGRARIA2","nombre":"DARÍO CAÑETE CERVANTES","idGrupo":58,"utCodigo":"U06400030","utDesc":"DEPARTAMENTO DE CIENCIA Y TECNOLOGÍA AGRARIA","utEmail":"andres.soriano@rec.upct.es"},{"idUsuario":82,"nif":"EC_DEPECO","nombre":"DOLORES GUERRERO BELMONTE","idGrupo":4,"utCodigo":"U06400034","utDesc":"DEPARTAMENTO DE ECONOMÍA DE LA EMPRESA","utEmail":"mariluz.medrano@upct.es"},{"idUsuario":84,"nif":"EC_ALIMENTOS2","nombre":"MARÍA ISABEL NAVARRO FERNÁNDEZ","idGrupo":41,"utCodigo":"U06400039","utDesc":"DEPARTAMENTO DE INGENIERÍA DE LOS ALIMENTOS Y DEL EQUIPAMIENTO AGRÍCOLA","utEmail":"mariajose.bernal@upct.es"},{"idUsuario":85,"nif":"EC_CTAGRARIA","nombre":"ASUNCIÓN RUIZ PARDO","idGrupo":58,"utCodigo":"U06400030","utDesc":"DEPARTAMENTO DE CIENCIA Y TECNOLOGÍA AGRARIA","utEmail":"andres.soriano@rec.upct.es"},{"idUsuario":86,"nif":"EC_SPREVENCION","nombre":"ANA MARÍA FRUCTUOSO HERNÁNDEZ","idGrupo":84,"utCodigo":"U06400069","utDesc":"SERVICIO DE PREVENCIÓN Y RIESGOS LABORALES","utEmail":"maria.morote@sait.upct.es"},{"idUsuario":87,"nif":"EC_FINCA","nombre":"MARÍA DOLORES MORAL RODRÍGUEZ","idGrupo":104,"utCodigo":"U06400025","utDesc":"ESTACIÓN EXPERIMENTAL AGROALIMENTARIA TOMÁS FERRO","utEmail":"lola.moral@upct.es"},{"idUsuario":3929,"nif":"22477271S","nombre":"PEDRO JOSÉ VICENTE BELTRÁN","idGrupo":30,"utCodigo":"U06400019","utDesc":"ESCUELA TÉCNICA SUPERIOR DE INGENIERÍA NAVAL Y OCEÁNICA","utEmail":"pedro.vicente@etsii.upct.es"},{"idUsuario":3900,"nif":"22948472S","nombre":"ANA MARÍA VIZCAÍNO MARTÍNEZ","idGrupo":8,"utCodigo":"U06400010","utDesc":"VICERRECTORADO DE INVESTIGACIÓN E INNOVACIÓN","utEmail":"salvador.martinez7@upct.es"},{"idUsuario":7266,"nif":"22951020X","nombre":"ANA MARÍA FRUCTUOSO HERNÁNDEZ","idGrupo":38,"utCodigo":"U06400064","utDesc":"APOYO A LA INVESTIGACIÓN TECNOLÓGICA (SAIT)","utEmail":"maria.morote@sait.upct.es"},{"idUsuario":7098,"nif":"22968388J","nombre":"MATILDE RUIZ CONESA","idGrupo":23,"utCodigo":"U06400037","utDesc":"DEPARTAMENTO DE EXPRESIÓN GRÁFICA","utEmail":"matilde.ruiz@rec.upct.es"},{"idUsuario":9349,"nif":"22977141A","nombre":"MARÍA ISABEL NAVARRO FERNÁNDEZ","idGrupo":21,"utCodigo":"U06400049","utDesc":"DEPARTAMENTO DE PRODUCCIÓN VEGETAL","utEmail":"misabel.navarro@upct.es"},{"idUsuario":8544,"nif":"07530635K","nombre":"ROSA MARÍA SÁNCHEZ HERNÁNDEZ","idGrupo":133,"utCodigo":"U06400073","utDesc":"Centro De Produccion De Contenidos Digitales (Centro De Producción De Contenidos Digitales)","utEmail":"rosam.sanchez@sec.upct.es"},{"idUsuario":3895,"nif":"21455514X","nombre":"DOLORES ANA FERNÁNDEZ MARTÍNEZ","idGrupo":115,"utCodigo":"U06400015","utDesc":"Vicerrectorado De Tecnologías De La Información Y Las Comunicaciones","utEmail":"ana.fernandez@dep.upct.es"},{"idUsuario":8429,"nif":"22928572X","nombre":"ANTONIA TOLOSA FERNÁNDEZ","idGrupo":49,"utCodigo":"U06400075","utDesc":"RESIDENCIAS UNIVERSITARIAS","utEmail":"antonia.tolosa@upct.es"},{"idUsuario":7146,"nif":"22963788J","nombre":"DARÍO CAÑETE CERVANTES","idGrupo":42,"utCodigo":"U06400036","utDesc":"DEPARTAMENTO DE ESTRUCTURAS Y CONSTRUCCIÓN","utEmail":"dario.canete@rec.upct.es"},{"idUsuario":27,"nif":"22993844P","nombre":"SUSANA MÁRMOL GALLEGO","idGrupo":68,"utCodigo":"U06400067","utDesc":"CONTRATACIÓN Y SERVICIOS","utEmail":"carmen.andreu@upct.es"},{"idUsuario":3462,"nif":"27451941S","nombre":"DOLORES GUERRERO BELMONTE","idGrupo":50,"utCodigo":"U06400032","utDesc":"DEPARTAMENTO DE ECONOMÍA","utEmail":"loli.guerrero@dep.upct.es"},{"idUsuario":3892,"nif":"27471603N","nombre":"JUAN ÁNGEL LÓPEZ BARCELÓ","idGrupo":13,"utCodigo":"U06400041","utDesc":"DEPARTAMENTO DE INGENIERÍA DE MATERIALES Y FABRICACIÓN","utEmail":"juanangel.lopez@dep.upct.es"},{"idUsuario":3904,"nif":"27471646D","nombre":"JOSÉ PATRICIO AGUSTÍN GARCÍA","idGrupo":44,"utCodigo":"U06400045","utDesc":"DEPARTAMENTO DE INGENIERÍA DE SISTEMAS Y AUTOMÁTICA","utEmail":"jpatricio.agustin@sec.upct.es"},{"idUsuario":6689,"nif":"22926834C","nombre":"MARÍA DEL CARMEN GUTIÉRREZ SANTOS","idGrupo":54,"utCodigo":"U06400060","utDesc":"GESTIÓN ACADÉMICA","utEmail":"mcarmen.gutierrez@dep.upct.es"},{"idUsuario":25,"nif":"22965965M","nombre":"RAQUEL LEÓN NAVARRO","idGrupo":54,"utCodigo":"U06400060","utDesc":"GESTIÓN ACADÉMICA","utEmail":"mcarmen.gutierrez@dep.upct.es"},{"idUsuario":3603,"nif":"23027739R","nombre":"PRÁXEDES SÁNCHEZ MARTÍNEZ","idGrupo":18,"utCodigo":"U06400033","utDesc":"DEPARTAMENTO DE ECONOMÍA FINANCIERA Y CONTABILIDAD","utEmail":"prax.sanchez@rec.upct.es"}];
app.get("/usuarios.html", (req, res) => {
	res.json(usuarios.filter((u, i) => { return (i < 12); }))
});
app.post("/test.html", (req, res) => {
	res.status(500).json({ email: res.locals.i18n.errCorreo, msgerr: res.locals.i18n.errEjecutar, msgok: res.locals.i18n.msgGuardarOk });
});
app.get("/peliculas.html", (req, res) => {
	res.locals.peliculas = [{id:1,nombre:"avatar"},{nombre:"raya"}];
	res.render("pages/list");
});
app.get("/email.html", (req, res) => {
	let tpl = path.join(__dirname, "views/emails/test.ejs");
	mailer.send("pableke@gmail.com", "prueba de plantilla", tpl, res.locals)
		.then(info => res.send(res.locals.i18n.msgCorreo))
		.catch(err => res.status(500).send(res.locals.i18n.errSendMail));
});
app.use(require("./routes/routes.js"));
app.use("*", (req, res) => { //404
	res.render("index", { page: "errors/404" });
});

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
//process.on("exit", function() { fnExit("exit"); }); //common exit signal = SIGINT
process.on("SIGHUP", function() { fnExit("SIGHUP"); }); //generated on Windows when the console window is closed
process.on("SIGINT", function() { fnExit("SIGINT"); }); //Press Ctrl-C / Ctrl-D keys to exit
process.on("SIGTERM", function() { fnExit("SIGTERM"); }); //kill the server using command kill [PID_number] or killall node
process.stdin.on("data", function(data) { (data == "exit\n") && fnExit("exit"); }); //console exit

console.log("Server listening on port http://localhost:3000");
console.log("Secure Server listening on port https://localhost:3443");
