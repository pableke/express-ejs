
import ab from "./array-box.js";
import sb from "./string-box.js";
import i18n from "./i18n-core.js";

const forms = {};
i18n.forms = forms;
i18n.getValidator = id => forms[id];

forms.test = {
	filter: data => {
		i18n.reset() // All data optional
			.setData("name", data.name).setData("memo", data.memo)
			.setFloat("imp1", data.imp1).setFloat("imp2", data.imp2)
			.setData("f1", data.f1).setData("f2", data.f2);
		return i18n.getData();
	},
	parser: data => {
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
	},
	render: (data, view) => {
		view.c4 = i18n.isoFloat(data.c4);
		view.imp = i18n.isoFloat(data.imp);
		view.fecha = sb.isoDate(data.fecha);
		view.fecha_i18n = i18n.fmtDate(data.fecha);
		view["ac-name"] = data.nif + " - " + data.name;
		const fields = ["id", "nif", "name", "email", "memo"];
		return ab.copy(fields, data, view);
	}
}

forms.login = data => {
	i18n.reset()
		.user("usuario", data.usuario, "errUsuario")
		.login("name", data.clave, "errClave");
	return i18n.isOk() ? i18n.getData() : !i18n.setError("errUserNotFound");
}

forms.contact = data => {
	i18n.reset()
		.required("usuario", data.usuario).email("correo", data.correo)
		.required("asunto", data.asunto).required("info", data.info);
	return i18n.isOk() ? i18n.getData() : !i18n.setError("errSendContact");
}

export default i18n;
