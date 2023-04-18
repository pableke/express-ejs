
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
	const ECONOMICAS = {
		1: "132500", 2: "155100", 3: "131200", 4: "131000", 5: "131600", 6: "154000",
		7: "132600", 8: "13250200", 9: "131300", 10: "131501", 12: "174100" //13: "174109"
	};

	const lineas = ab.parse(dom.getText("#lineas-json")) || [];
	const updateEconomica = eco => dom.setValue("#economica", ECONOMICAS[eco]);
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
		.onChangeInputs("#subtipo", el => updateEconomica(el.value))
		.onChangeInputs(".face-common", el => dom.eachInput(".face-common", input => { input.value = el.value; }))
		.onChangeInput("#delegacion", el => loadDelegacion(el.value, dom.getOptText(el)))
		.onChangeSelect("#sujeto", el => dom.toggleHide(".grupo-exento", (el.value != 0)));
	dom.onChangeSelect("#face", el => {
		VALIDATORS.factura.og = (el.value == 1) ? i18n.required : null;
		VALIDATORS.factura.plataforma = (el.value == 2) ? i18n.required : null;
		dom.toggleHide("div.grupo-face", (el.value != 1))
			.toggleHide("div.grupo-face-otras", (el.value != 2));
	});
	dom.onChangeSelect("#subtipo", el => {
		dom.toggleHide("#grupo-recibo", (el.value != 9) && (el.value != 3))
			.toggleHide(".grupo-deportes", (el.value != 10));
	});

	const fnInsert = form => updateEconomica(dom.getValue("#subtipo"));
	dom.onLoadForm("#xeco-fact", fnInsert, () => {});

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
			console.log("ui.item", ui.item);
			return !dom.setValue("#tercero", ui.item.label)
						.setValue("#id-tercero", ui.item.value)
						.trigger("#find-delegaciones", "click");
		}
	}).change(fnResetTercero).on("search", fnResetTercero);
});
