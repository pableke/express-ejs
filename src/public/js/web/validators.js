
// Web module validators
// Public validators
valid.setForm("/login.html", {
	usuario: valid.usuario,
	clave: valid.clave
}).setForm("/contact.html", {
	nm: valid.required,
	correo: valid.correo,
	asunto: valid.required,
	info: valid.required
}).setForm("/signup.html", {
	token: valid.token,
	nm: valid.required,
	ap1: valid.required,
	nif: valid.nif,
	correo: valid.correo
}).setForm("/reactive.html", {
	token: valid.token,
	correo: valid.correo
});

// User validators
valid.setForm("/user/pass.html", {
	oldPass: valid.min8,
	clave: valid.min8,
	reclave: valid.reclave
}).setForm("/user/profile.html", {
	nm: valid.required,
	ap1: valid.required,
	ap2: valid.max200, //optional
	nif: valid.nif,
	correo: valid.correo
});

// Menu validators
const MENU_SAVE = {
	id: valid.key,
	ico: valid.max50,
	nm: valid.required,
	nm_en: valid.max200,
	pn: valid.max200,
	padre: function(name, value, msgs) {
		let id = valid.getData("id");
		let padre = msgs.toInt(value);
		if (sb.isset(id) && sb.isset(padre) && (id == padre))
			valid.setError("pn", msgs.errRefCircular);
		return padre;
	},
	orden: valid.intval,
	mask: valid.intval,
	alta: valid.ltNow
};
const MENU_FILTER = {
	fn: valid.max200,
	n1: valid.intnull,
	n2: valid.intnull,
	d1: valid.datenull,
	d2: valid.datenull
};
valid.setForm("/menu/save.html", MENU_SAVE).setForm("/menu/duplicate.html", MENU_SAVE);
valid.setForm("/menu/filter.html", MENU_FILTER).setForm("/menu/search.html", MENU_FILTER);
