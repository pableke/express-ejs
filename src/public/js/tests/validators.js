
// Test module validators
valid.setForm("/tests/email.html", {
	nombre: valid.required,
	correo: valid.correo,
	date: valid.datenull,
	number: valid.gt0,
	asunto: valid.required,
	info: valid.required800
});
