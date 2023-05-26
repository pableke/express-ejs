
import api from "app/lib/api-box.js";
import nb from "app/lib/number-box.js";
import sb from "app/lib/string-box.js";
import i18n from "app/lib/i18n-box.js";
import util from "app/modules/util.js";

const ENDPOINT = "https://jsonplaceholder.typicode.com/users";

export const index = (req, res) => util.render(res, "test/index");

export const filter = (req, res) => {
	const FILTER = i18n.forms.test.filter(req.query);
	const fields = ["name", "memo"]; // Strings ilike filter
	const fnFilter = row => (sb.multilike(row, FILTER, fields) && nb.in(row.imp, FILTER.imp1, FILTER.imp2) && sb.inDates(row.fecha, FILTER.f1, FILTER.f2));
	api.get(ENDPOINT).then(data => util.json(res, data.filter(fnFilter)));
}

export const save = (req, res) => {
	const data = i18n.forms.test.parser(req.body);
	if (i18n.isError())
		return util.errors(res);
	console.log("save", req.body, data);
	//save data un DB .....
	res.send("" + (data.id || nb.randInt(1, 1e9)));
}

export const files = (req, res) => {
	console.log('req.body', req.body);
	res.send("ok");
}

export const email = (req, res, next) => {
	util.sendMail({
		to: "pableke@gmail.com",
		subject: req.body.asunto,
		body: "test/emails/test.ejs",
		data: res.locals //data
	}).then(info => util.msg(res, "msgCorreo"))
		.catch(err => next("errSendMail"));
}

export const xls = function(req, res) {
	api.get(ENDPOINT).then(users => {
		util.xls(res, {
			filename: "test.xlsx",
			author: "Pablo Rosique Vidal",
			headers: { name: "Nombre", email: "E-Mail", website: "WEB" },
			styles: {
				imp: { numberFormat: "#,##0.00" },
				fecha: { dateFormat: "dd/mm/yyyy" }
			},
			data: users
		});
	});
}

export const zip = function(req, res) {
	util.zip(res, "tests.zip", ["tests.xlsx", "Gestión_Documental.pdf", "Guías_Docentes.pdf"].map(util.getFile));
}

export const pdf = (req, res, next) => {
	res.locals.users = users;
	util.setBody(res, "test/index").pdf(res, "tests/reports/test.ejs").catch(next);
}
