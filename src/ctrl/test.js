
import bcrypt from "bcrypt";
import util from "app/ctrl/util.js";
import api from "app/lib/api-box.js";
import nb from "app/lib/number-box.js";
import sb from "app/lib/string-box.js";
import i18n from "app/model/test.js";

const ENDPOINT = "https://jsonplaceholder.typicode.com/users";
const form = i18n.getForm("test");

export const index = (req, res) => util.tabs(res, 0).render(res, "web/index");

export const list = (req, res) => {
	const FILTER = form.filter(req.query);
	const fields = ["name", "memo"]; // Strings ilike filter
	const fnFilter = row => (sb.multilike(row, FILTER, fields) && nb.in(row.imp, FILTER.imp1, FILTER.imp2) && sb.inDates(row.fecha, FILTER.f1, FILTER.f2));
	api.ajax.get(ENDPOINT).then(data => res.json(data.filter(fnFilter)));
}
export const filter = (req, res) => {
	const { term } = req.query;
	const fnFilter = row => sb.ilike(row.name, term);
	if (sb.size(term) > 3) // Params recibed successfully
		api.ajax.get(ENDPOINT).then(data => res.json(data.filter(fnFilter)));
	else
		res.json([]); // Empty results
}

export const save = (req, res) => {
	const data = form.validate(req.body);
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

export const hash = function(req, res) {
	res.send(bcrypt.hashSync(req.query.clave, 10));
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
