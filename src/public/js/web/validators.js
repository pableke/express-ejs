
// Web module validators
// Public validators
valid.setForm("/login.html", {
	usuario: valid.usuario,
	clave: valid.clave
}).setForm("/contact.html", {
	nombre: valid.required,
	correo: valid.correo,
	asunto: valid.required,
	info: valid.required
}).setForm("/signup.html", {
	token: valid.token,
	nombre: valid.required,
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
	nombre: valid.required,
	ap1: valid.required,
	ap2: valid.max200, //optional
	nif: valid.nif,
	correo: valid.correo
});

// Menu validators
const MENU_SAVE = {
	_id: valid.key,
	icon: valid.max50,
	nombre: valid.required,
	nombre_en: valid.max200,
	padre: valid.key,
	orden: valid.intval,
	mask: valid.intval,
	alta: valid.ltNow
};
const MENU_FILTER = {
	fn: valid.max200,
	o1: valid.intnull,
	o2: valid.intnull,
	f1: valid.datenull,
	f2: valid.datenull
};
valid.setForm("/menu/save.html", MENU_SAVE).setForm("/menu/duplicate.html", MENU_SAVE);
valid.setForm("/menu/filter.html", MENU_FILTER).setForm("/menu/search.html", MENU_FILTER);
