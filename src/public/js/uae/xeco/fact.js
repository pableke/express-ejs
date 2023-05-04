
const loadDelegacion = (id, txt) => dom.setValue("#del-id", id).setValue("#del-name", txt);
const loadDelegaciones = (xhr, status, args) => {
	const delegaciones = ab.parse(args.data);
	if (delegaciones) {
		const tpl = '<option value="@value;">@label;</option>';
		dom.setHtml("#delegacion", delegaciones.format(tpl));
		loadDelegacion(delegaciones[0].value, delegaciones[0].label)
	}
	unloading(); // fin del calculo de delegaciones
}

dom.ready(function() {
	const RESUME = { imp: 0, iva: 0 };
	const STYLES = { imp: i18n.isoFloat, fUxxi: i18n.fmtDate };
	const VALIDATORS = {
		msgError: "errForm", 
		factura: {
			msgError: "errForm", 
			tercero: i18n.required, "id-tercero": i18n.required, delegacion: i18n.required, 
			organica: i18n.required, "id-organica": i18n.required, memoria: i18n.required
		},
		lineas: { msgError: "errForm", desc: i18n.required, imp: i18n.gt0 }
	};

	let keyEco;
	function fnFiscal(eco, sujeto, exento, m349, iban, iva) {
		dom.setValue("#economica", eco).setValue("#sujeto", sujeto).setValue("#exento", exento)
			.setValue("#m349", m349).setValue("#iban", iban).val("#iva", iva || 0)
			.toggleHide(".grupo-exento", sujeto != 0);
	}

	const fnDefault = () => fnFiscal(null, 0, 0, 0);
	const fn323003_010 = () => fnFiscal("323003", 0, 1, 0);
	const fnC2T04 = () => fnFiscal("323003", 1, 0, 0);
	const fnC2T14 = () => fnFiscal("131004", 0, 1, 0, 10);
	const fnC2UET14 = () => fnFiscal("131004", 1, 0, 6, 10);
	const fnC2ZZT14 = () => fnFiscal("131004", 1, 0, 0, 10);
	const fnC2T03 = () => fnFiscal("323003", 1, 0, 0, 6);
	const fnC2T15 = () => fnFiscal("131200", 0, 1, 0, 10);
	const fnC2TUE15 = () => fnFiscal("131200", 1, 0, 6, 10);
	const fnC2UET09 = () => fnFiscal("323003", 1, 0, 6);
	const fnC2T16 = () => fnFiscal("139000", 0, 0, 0, 10, 21);
	const fnC2UET16 = () => fnFiscal("139000", 1, 0, 6, 10);
	const fnC2T17 = () => fnFiscal("139001", 0, 0, 0, 10, 21);
	const fnC2UET17 = () => fnFiscal("139001", 1, 0, 6, 10);
	const fnC2T18 = () => fnFiscal("139002", 0, 0, 0, 10, 21);
	const fnC2UET18 = () => fnFiscal("139002", 1, 0, 6, 10);
	const ECONOMICAS = {
		c1epes4: fn323003_010, c1noes4: fn323003_010, c1noue4: fn323003_010, c1nozz4: fn323003_010, c2epes4: fn323003_010, c2noes4: fn323003_010, c2noue4: fnC2T04, c2nozz4: fn323003_010, c3epes4: fn323003_010, c3noes4: fn323003_010, c3noue4: fnC2T04, c3nozz4: fn323003_010,
		c2epes14: fnC2T14, c2noes14: fnC2T14, c2noue14: fnC2UET14, c2nozz14: fnC2ZZT14, c3epes14: fnC2T14, c3noes14: fnC2T14, c3noue14: fnC2UET14, c3nozz14: fnC2ZZT14,
		c1epes3: fn323003_010, c1noes3: fn323003_010, c1noue3: fn323003_010, c1nozz3: fn323003_010, c2epes3: fn323003_010, c2noes3: fn323003_010, c2noue3: fnC2T03, c2nozz3: fn323003_010, c3epes3: fn323003_010, c3noes3: fn323003_010, c3noue3: fnC2T03, c3nozz3: fn323003_010,
		c2epes15: fnC2T15, c2noes15: fnC2T15, c2noue15: fnC2TUE15, c2nozz15: fnC2T15, c3epes15: fnC2T15, c3noes15: fnC2T15, c3noue15: fnC2TUE15, c3nozz15: fnC2T15,
		c1epes9: fn323003_010, c1noes9: fn323003_010, c1noue9: fn323003_010, c1nozz9: fn323003_010, c2epes9: fn323003_010, c2noes9: fn323003_010, c2noue9: fnC2UET09, c2nozz9: fn323003_010, c3epes9: fn323003_010, c3noes9: fn323003_010, c3noue9: fnC2UET09, c3nozz9: fn323003_010,
		c2epes16: fnC2T16, c2noes16: fnC2T16, c2noue16: fnC2UET16, c2nozz16: fnC2T16, c3epes16: fnC2T16, c3noes16: fnC2T16, c3noue16: fnC2UET16, c3nozz16: fnC2T16,
		c2epes17: fnC2T17, c2noes17: fnC2T17, c2noue17: fnC2UET17, c2nozz17: fnC2T17, c3epes17: fnC2T17, c3noes17: fnC2T17, c3noue17: fnC2UET17, c3nozz17: fnC2T17,
		c2epes18: fnC2T18, c2noes18: fnC2T18, c2noue18: fnC2UET18, c2nozz18: fnC2T18, c3epes18: fnC2T18, c3noes18: fnC2T18, c3noue18: fnC2UET18, c3nozz18: fnC2T18
	};
	const updateEconomica = subtipo => {
		dom.toggleHide("#grupo-recibo", (subtipo != 9) && (subtipo != 4) && (subtipo != 3));
		const fn = ECONOMICAS[keyEco + subtipo] || fnDefault;
		console.log("ECONOMICAS", keyEco + subtipo, fn);
		fn();
	}
	updateEconomica(dom.getValue("#subtipo")); //auto-load economica

	const lineas = ab.parse(dom.getText("#lineas-json")) || [];
	const fnCalcIva = (row, value) => {
		RESUME.iva = +value; // nuevo iva
		const iva = RESUME.imp * (RESUME.iva / 100);
		dom.setText(row.cells[1], i18n.isoFloat(iva) + " €")
			.setText(row.nextElementSibling.cells[1], i18n.isoFloat(RESUME.imp + iva) + " €");
	}

	RESUME.iva = +dom.getValue("#iva") ?? 0;
	VALIDATORS.factura.economica = FACT.uae ? i18n.required : null;

	dom.click("a#add-linea", el => {
		if (dom.validate("#xeco-fact", VALIDATORS.lineas)) {
			lineas.push(i18n.toData()); // save container
			dom.table("#conceptos", lineas, RESUME, STYLES);
		}
		dom.setValue("#linea", "").setValue("#imp", "").setFocus("#linea")
	});
	dom.onRenderTable("#conceptos", table => {
		RESUME.imp = 0; // Init. resume
		lineas.forEach(linea => { RESUME.imp += linea.imp; }); // recalcula total
		dom.setValue("#lineas", JSON.stringify(lineas)); // save data to send to server
	});
	dom.afterRenderTable("#conceptos", table => {
		table.tFoot.querySelector("#iva").value = RESUME.iva;
		fnCalcIva(table.tFoot.rows[1], RESUME.iva);
	});
	dom.table("#conceptos", lineas, RESUME, STYLES)
		.onChangeTable("#conceptos", table => fnCalcIva(RESUME.row, RESUME.element.value));

	dom.swapAttr("#fMax", "min", "max")
		.onChangeInput("#subtipo", el => updateEconomica(el.value))
		.onChangeInput("#delegacion", el => loadDelegacion(el.value, dom.getOptText(el)))
		.onChangeInput("#sujeto", el => dom.toggleHide(".grupo-exento", (el.value != 0)))
		.onChangeInputs(".face-common", el => dom.eachInput(".face-common", input => { input.value = el.value; }));
	dom.onChangeSelect("#face", el => {
		VALIDATORS.factura.og = (el.value == 1) ? i18n.required : null;
		VALIDATORS.factura.plataforma = (el.value == 2) ? i18n.required : null;
		dom.toggleHide("div.grupo-face", (el.value != 1))
			.toggleHide("div.grupo-face-otras", (el.value != 2));
	});

	window.fnSend = () => {
		if (!dom.validate("#xeco-fact", VALIDATORS.factura))
			return null;
		const data = i18n.toData();
		ab.size(lineas) || dom.required("#linea", "Debe detallar los conceptos asociados a la solicitud.");
		if (((data.subtipo == 3) || (data.subtipo == 9)) && !data.refreb) //subtipo = ttpp o extension
			dom.addError("#recibo", "Debe indicar un número de recibo válido");
		if (data.subtipo == 10) //subtipo = deportes
			dom.required("#extra", VALIDATORS.msgError).leToday("#fMax", VALIDATORS.msgError);
		if ((data.face == 1)) //factura electronica FACe
			dom.required("#og", VALIDATORS.msgError).required("#oc", VALIDATORS.msgError).required("#ut", VALIDATORS.msgError);
		if ((data.face == 2)) //factura electronica Otras
			dom.required("#plataforma", VALIDATORS.msgError);
		return data;
	}

	//Autocompletes tercero + organica + recibos
	function fnResetTercero() {
		if (this.value) return;
		dom.setHtml("#delegacion", '<option value="">Seleccione una delegación</option>');
		loadDelegacion("", "Seleccione una delegación");
		fnAcLoad(this, "", "");
	}
	$(".ac-tercero").attr("type", "search").keydown(fnAcChange).autocomplete({
		delay: 500, //milliseconds between keystroke occurs and when a search is performed
		minLength: 5, //reduce matches
		focus: fnFalse, //no change focus on select
		search: fnAcSearch, //lunch source
		source: fnSourceItems, //show datalist
		select: function(ev, ui) {
			loading(); // muestro denuevo el cargando para la delegacion
			keyEco = "c" + ui.item.imp; //persona fisica=1, persona juridica=2, est. publico=3
			keyEco += (ui.item.int & 256) ? "ep" : "no"; // Establecimiento permanente
			let ep_es = (ui.item.int & 128) || (ui.item.int & 256); //Establecimiento permanente o Residente
			// Residente en la peninsula=es, ceuta-melillacanarias=np, comunitario=ue, resto del mundo=zz
			keyEco += ep_es ? ((ui.item.int & 2048) ? "es" : "np") : ((ui.item.int & 2) ? "ue" : "zz");
			updateEconomica(dom.getValue("#subtipo")); //auto-calculate economica
			return !dom.setValue("#tercero", ui.item.label)
						.setValue("#id-tercero", ui.item.value)
						.trigger("#find-delegaciones", "click");
		}
	}).change(fnResetTercero).on("search", fnResetTercero);
});
