
// Define form validators to web module
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
const MENU = {
	_id: valid.pk,
	nombre: valid.required,
	nombre_en: valid.max200,
	icon: valid.max50,
	alta: valid.ltNow
};
valid.setForm("/menu/save.html", MENU).setForm("/menu/duplicate.html", MENU);
