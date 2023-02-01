
import i18n from "./i18n-core.js";

export default {
	msgError: "errForm",
	fecha: i18n.leToday, imp: i18n.gt0, 
	name: i18n.required, memo: i18n.required,

	ftest: {
		imp1: i18n.toFloat, imp2: i18n.toFloat
	},

	login: {
		msgError: "errUserNotFound",
		usuario: i18n.user, usuarioError: "errUsuario",
		clave: i18n.login, claveError: "errClave"
	},

	contact: {
		msgError: "errSendContact",
		nombre: i18n.required, correo: i18n.email,
		asunto: i18n.required, info: i18n.required
	}
};
