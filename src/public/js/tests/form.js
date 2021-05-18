
js.ready(function() {
	const msgs = i18n.getLang(); //messages container

	// Range datepickers
	const f1 = $("#f1").on("change", function() { f2.datepicker("option", "minDate", msgs.toDate(this.value)); });
	const f2 = $("#f2").on("change", function() { f1.datepicker("option", "maxDate", msgs.toDate(this.value)); });
});
