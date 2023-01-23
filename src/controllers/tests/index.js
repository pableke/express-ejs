
import util from "app/mod/node-box.js";

export const index = (req, res) => {
	util.render(res, "tests/index");
}

export const lang = (req, res, next) => {
	util.lang(res, "test");
	next();
}

export const save = (req, res) => {
	console.log("req", req.body);
	
	util.i18n.validate(req.body); /*? util.msg(res, "saveOk") :*/ 
	util.i18n.setError("errForm");
	util.err(res);
}

export const saveAndList = (req, res) => {
	console.log("req", req.body);
	util.render(res, "tests/index");
}

export const email = (req, res, next) => {
	util.setBody(res, "tests/index").sendMail({
		to: "pableke@gmail.com",
		subject: req.body.asunto,
		body: "tests/emails/test.ejs",
		data: res.locals //data
	}).then(info => util.build(res, "msgCorreo"))
		.catch(err => next("errSendMail"));
}

const users = [ // JSON DB for tests
	{ name: "askjld", imp: 23.87, fCreacion: new Date() },
	{ name: "fila 2", imp:2.9  },
	{ name: "fila 3", imp:24566.95675, fCreacion: "2022-01-01T10:22:53" }
];

export const xls = function(req, res) {
	util.xls(res, {
		filename: "tests.xlsx",
		author: "Pablo Rosique Vidal",
		headers: { name: "Nombre", imp: "Importe", fCreacion: "Fecha" },
		styles: {
			imp: { numberFormat: "#,##0.00" },
			fCreacion: { dateFormat: "dd/mm/yyyy" }
		},
		data: users
	});
}

export const zip = function(req, res) {
	util.zip(res, "tests.zip", ["tests.xlsx", "Gestión_Documental.pdf", "Guías_Docentes.pdf"].map(util.getFile));
}

export const pdf = (req, res, next) => {
	res.locals.users = users;
	util.setBody(res, "tests/index").pdf(res, "tests/reports/test.ejs").catch(next);
}
