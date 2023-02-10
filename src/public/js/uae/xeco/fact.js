
dom.ready(function() {
	const RESUME = { imp: 0, iva: 0 };
	const STYLES = { imp: i18n.isoFloat };
	const VALIDATORS = {
		msgError: "errForm",
		tercero: i18n.required, organica: i18n.required,
		lineas: { msgError: "errForm", linea: i18n.required, imp: i18n.gt0 }
	};

	const lineas = ab.parse(dom.getText("#lineas-json")) || [];
	const fnCalcIva = (row, value) => {
		RESUME.iva = +value; // nuevo iva
		const iva = RESUME.imp * (RESUME.iva / 100);
		dom.setText(row.cells[1], i18n.isoFloat(iva) + " €")
			.setText(row.nextElementSibling.cells[1], i18n.isoFloat(RESUME.imp + iva) + " €");
	}

	dom.click("a#add-linea", el => {
		if (dom.validate("#xeco-fact", VALIDATORS.lineas)) {
			lineas.push(i18n.toData()); // save container
			dom.table("#conceptos", lineas, RESUME, STYLES);
		}
		dom.setValue("#linea", "").setValue("#imp", "").setFocus("#linea")
	});
	dom.table("#conceptos", lineas, RESUME, STYLES)
		.onChangeTable("#conceptos", table => fnCalcIva(RESUME.row, RESUME.element.value));
	dom.onRenderTable("#conceptos", table => {
		RESUME.imp = 0; // Init. resume
		lineas.forEach(linea => { RESUME.imp += linea.imp; }); // recalcula total
		dom.setValue("#lineas", JSON.stringify(lineas)); // save data to send to server
	});
	dom.afterRenderTable("#conceptos", table => {
		table.tFoot.querySelector("#iva").value = RESUME.iva;
		fnCalcIva(table.tFoot.rows[1], RESUME.iva);
	});

	dom.onChangeInput("#face", el => {
		dom.toggleHide("div.grupo-face", (el.value != 1))
			.toggleHide("div.grupo-face-otras", (el.value != 2));
	});
	dom.onChangeInput("#subtipo", el => {
		dom.toggleHide("#grupo-recibo", (el.value != 9) && (el.value != 3))
			.toggleHide(".grupo-deportes", (el.value != 10));
	});
	dom.onChangeInput("#sujeto", el => {
		dom.toggleHide(".grupo-exento", (el.value != 0));
	});
});
