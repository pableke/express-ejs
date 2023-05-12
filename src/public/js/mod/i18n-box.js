
import ab from "./array-box.js";
import sb from "./string-box.js";
import i18n from "./i18n-core.js";

const forms = {};
i18n.forms = forms;
i18n.getValidator = id => forms[id];

forms.filter = (view, data) => {
	ab.copy(["name", "memo", "f1", "f2"], view, data);
	data.imp1 = i18n.toFloat(view.imp1);
	data.imp2 = i18n.toFloat(view.imp2);
	return true;
}
forms.test = (view, data) => {
	i18n.reset()
		.required("imp", view.imp).required("name", view.name)
		.required("fecha", view.fecha).required("memo", view.memo);
	if (i18n.isError()) // Has errors?
		return !i18n.setError("errForm");

	// Everything is ok => parser data
	ab.copy(["id", "name", "fecha", "memo"], view, data);
	//data.c4 = i18n.toFloat(view.c4);
	data.imp = i18n.toFloat(view.imp);
	data.binary = +view.binary; // Integer mask
	data.values = sb.array(view.values); // Optional field
	data.icons = +view.icons; // Integer mask
	return true;
}

forms.login = (view, data) => {
	i18n.reset()
		.user("usuario", view.usuario, "errUsuario")
		.login("name", view.clave, "errClave");
	return i18n.isOk() ? Object.assign(data, view) : !i18n.setError("errUserNotFound");
}

forms.contact = (view, data) => {
	i18n.reset()
		.required("usuario", view.usuario).email("correo", view.correo)
		.required("asunto", view.asunto).required("info", view.info);
	return i18n.isOk() ? Object.assign(data, view) : !i18n.setError("errSendContact");
}

export default i18n;
