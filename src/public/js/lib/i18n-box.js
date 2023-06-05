
import ab from "./array-box.js";
import sb from "./string-box.js";
import i18n from "./i18n-core.js";
import langs from "./i18n-langs.js";

const forms = {};
i18n.forms = forms;
i18n.getValidator = id => forms[id];

langs.es.menu = (data, view) => {
	view.creado = sb.isoDate(data.creado);
	view.creado_i18n = sb.esDate(data.creado);
	return ab.copy(["id", "padre", "orden", "enlace", "icono", "nombre", "titulo"], data, view);
}
langs.en.menu = (data, view) => {
	view.creado = sb.isoDate(data.creado);
	view.creado_i18n = view.creado;
	view.nombre = data.nombre_en || data.nombre;
	view.titulo = data.titulo_en || data.titulo;
	return ab.copy(["id", "padre", "orden", "enlace", "icono"], data, view);
}

langs.es.test = (data, view) => {
	view.c4 = i18n.isoFloat(data.c4);
	view.imp = i18n.isoFloat(data.imp);
	view.fecha = sb.isoDate(data.fecha);
	view.fecha_i18n = sb.esDate(data.fecha);
	view["ac-name"] = data.nif + " - " + data.name;
	const fields = ["id", "nif", "name", "email", "memo"];
	return ab.copy(fields, data, view);
}
langs.en.test = (data, view) => {
	view.c4 = i18n.isoFloat(data.c4);
	view.imp = i18n.isoFloat(data.imp);
	view.fecha = sb.isoDate(data.fecha);
	view.fecha_i18n = view.fecha;
    view.memo = data.memo_en || data.memo;
	view["ac-name"] = data.nif + " - " + data.name;
	const fields = ["id", "nif", "name", "email"];
	return ab.copy(fields, data, view);
}

forms.ftest = data => {
	i18n.reset() // All data optional
		.setData("name", data.name).setData("memo", data.memo)
		.setFloat("imp1", data.imp1).setFloat("imp2", data.imp2)
		.setData("f1", data.f1).setData("f2", data.f2);
	return i18n.getData();
}
forms.test = data => {
	// calculated data from autocomplete
	const ac = sb.split(data["ac-name"], " - ");
	i18n.reset() // required fields
		.gt0("imp", data.imp)
		.required("ac-name", data["ac-name"])
		.required("name", ab.pop(ac)).required("nif", data.nif)
		.date("fecha", data.fecha).text300("memo", data.memo);
	// Optionals fields
	i18n.setInteger("id", data.id)
		.setIntval("binary", data.binary)
		.setArray("values", data.values)
		.setIntval("icons", data.icons);
	return i18n.isOk() ? i18n.getData() : !i18n.setError("errForm");
}

forms.login = data => {
	i18n.reset()
		.user("usuario", data.usuario, "errUsuario")
		.login("clave", data.clave, "errClave");
	return i18n.isOk() ? i18n.getData() : !i18n.setError("errUserNotFound");
}

forms.contact = data => {
	i18n.reset()
		.required("usuario", data.usuario).email("correo", data.correo)
		.required("asunto", data.asunto).required("info", data.info);
	return i18n.isOk() ? i18n.getData() : !i18n.setError("errSendContact");
}

export default i18n;
