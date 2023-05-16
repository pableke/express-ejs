
import api from "app/mod/api-box.js";
import nb from "app/mod/number-box.js";
import sb from "app/mod/string-box.js";
import i18n from "app/mod/i18n-box.js";
import util from "app/mod/node-box.js";

const ENDPOINT = "https://jsonplaceholder.typicode.com/users";

export const lang = (req, res, next) => util.lang(res, "test", next);
export const index = (req, res) => util.render(res, "tests/index");

export const filter = (req, res) => {
	const FILTER = i18n.forms.filter(req.query);
	const fields = ["name", "memo"]; // Strings ilike filter
	const fnFilter = row => (sb.multilike(row, FILTER, fields) && nb.in(row.imp, FILTER.imp1, FILTER.imp2) && sb.inDates(row.fecha, FILTER.f1, FILTER.f2));
	api.get(ENDPOINT).then(data => util.json(res, data.filter(fnFilter)));
}

export const save = (req, res) => {
	const data = i18n.forms.test(req.body);
	if (!data)
		return util.errors(res);
	console.log("save", req.body, data);
	//save data un DB .....
	res.send("" + (data.id || nb.randInt(1, 1e9)));
}

export const email = (req, res, next) => {
	util.sendMail({
		to: "pableke@gmail.com",
		subject: req.body.asunto,
		body: "tests/emails/test.ejs",
		data: res.locals //data
	}).then(info => util.msg(res, "msgCorreo"))
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
