
js.ready(function() {
	const msgs = i18n.getLang(); //messages container

	// Tests form validators
	valid.setForm("/tests/email.html", {
		nombre: valid.required,
		correo: valid.correo,
		date: function(name, value, msgs) { //optional input
			return !value || valid.ltNow(name, value, msgs);
		},
		number: valid.gt0,
		asunto: valid.required,
		info: function(name, value, msgs) {
			return valid.size(value, 1, 600) || !valid.setError(name, msgs.errRequired);
		}
	});

	const f1 = $("#f1").on("change", function() { f2.datepicker("option", "minDate", msgs.toDate(this.value)); });
	const f2 = $("#f2").on("change", function() { f1.datepicker("option", "maxDate", msgs.toDate(this.value)); });
});
