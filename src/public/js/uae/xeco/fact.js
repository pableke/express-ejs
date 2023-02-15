
const loadDelegaciones = (xhr, status, args) => {
	const delegaciones = ab.parse(args.data);
	const tpl = '<option value="@value;">@label;</option>';
	delegaciones && dom.setHtml("#id-delegacion", delegaciones.format(tpl)).setValue("#delegacion", delegaciones[0].value);
	unloading(); // fin del calculo de delegaciones
}

dom.ready(function() {
	const RESUME = { imp: 0, iva: 0 };
	const STYLES = { imp: i18n.isoFloat, fUxxi: i18n.fmtDate };
	const VALIDATORS = {
		msgError: "errForm", 
		factura: {
			msgError: "errForm", 
			tercero: i18n.required, delegacion: i18n.required, 
			organica: i18n.required, economica: i18n.digits,
			memoria: i18n.required
		},
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
		const data = dom.validate("#xeco-fact", VALIDATORS.lineas);
		if (data) {
			lineas.push(data); // save container
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
		const iva = table.tFoot.querySelector("#iva");
		if (iva) {
			iva.value = RESUME.iva;
			fnCalcIva(table.tFoot.rows[1], RESUME.iva);
		}
	});

	dom.swapAttr("#fMax", "min", "max")
		.onChangeSelect("#delegacion", el => dom.setValue("#id-delegacion", el.value))
		.onChangeSelect("#sujeto", el => dom.toggleHide(".grupo-exento", (el.value != 0)));
	dom.onChangeSelect("#face", el => {
		dom.toggleHide("div.grupo-face", (el.value != 1))
			.toggleHide("div.grupo-face-otras", (el.value != 2));
	});
	dom.onChangeSelect("#subtipo", el => {
		dom.toggleHide("#grupo-recibo", (el.value != 9) && (el.value != 3))
			.toggleHide(".grupo-deportes", (el.value != 10));
	});

	window.fnSend = () => {
		const data = dom.validate("#xeco-fact", VALIDATORS.factura);
		if (data) {
			ab.size(lineas) || dom.required("#linea", "Debe detallar los conceptos asociados a la solicitud.");
			if (((data.subtipo == 3) || (data.subtipo == 9)) && !data.refreb) //subtipo = ttpp o extension
				dom.addError("#recibo", "Debe indicar un número de recibo válido");
			if (data.subtipo == 10) //subtipo = deportes
				dom.required("#extra", VALIDATORS.msgError).leToday("#fMax", VALIDATORS.msgError);
			if ((data.face == 1)) //factura electronica FACe
				dom.required("#og", VALIDATORS.msgError).required("#oc", VALIDATORS.msgError).required("#ut", VALIDATORS.msgError);
			if ((data.face == 2)) //factura electronica Otras
				dom.required("#plataforma", VALIDATORS.msgError);
		}
		return data;
	}

	//Autocompletes tercero + organica + recibos
	function fnResetTercero() {
		if (this.value) return;
		const tpl = '<option value="">Seleccione una delegación</option>';
		dom.setHtml("#id-delegacion", tpl).setValue("#delegacion");
		fnAcLoad(this, "", "");
	}
	$(".ac-tercero").attr("type", "search").keydown(fnAcChange).autocomplete({
		delay: 500, //milliseconds between keystroke occurs and when a search is performed
		minLength: 5, //reduce matches
		focus: fnFalse, //no change focus on select
		search: fnAcSearch, //lunch source
		source: function(req, res) {
			fnAutocomplete(this.element, ["nombre", "nif"], res,
				item => { return item.nif + " - " + item.nombre; }
			);
		},
		select: function(ev, ui) {
			loading(); // muestro denuevo el cargando para la delegacion
			return !dom.setValue("#tercero", ui.item.nif + " - " + ui.item.nombre)
						.setValue("#nif-tercero", ui.item.nif).setValue("#id-tercero", ui.item.id)
						.trigger("#find-delegaciones", "click");
		}
	}).change(fnResetTercero).on("search", fnResetTercero);
	$(".ac-organica").attr("type", "search").keydown(fnAcChange).autocomplete({
		delay: 500, //milliseconds between keystroke occurs and when a search is performed
		focus: fnFalse, //no change focus on select
		search: fnAcSearch, //lunch source
		source: function(req, res) {
			fnAutocomplete(this.element, ["o", "dOrg"], res, item => (item.o + " - " + item.dOrg));
		},
		select: function(ev, ui) {
			return fnAcLoad(this, ui.item.id, ui.item.o + " - " + ui.item.dOrg);
		}
	}).change(fnAcReset).on("search", fnAcReset);
	$(".ac-recibo").attr("type", "search").keydown(fnAcChange).autocomplete({
		delay: 500, //milliseconds between keystroke occurs and when a search is performed
		focus: fnFalse, //no change focus on select
		search: fnAcSearch, //lunch source
		source: function(req, res) {
			fnAutocomplete(this.element, ["label"], res, item => item.label);
		},
		select: function(ev, ui) {
			return fnAcLoad(this, ui.item.value, ui.item.label);
		}
	}).change(fnAcReset).on("search", fnAcReset);

	//Autocompletes expediente uxxiec
	let op, operaciones; // vinc. container
	$("#uxxi").attr("type", "search").keydown(fnAcChange).autocomplete({
		delay: 500, //milliseconds between keystroke occurs and when a search is performed
		minLength: 3, //force filter => reduce matches
		focus: fnFalse, //no change focus on select
		search: fnAcSearch, //lunch source
		source: function(req, res) {
			const fn = item => (item.num + " - " + item.uxxi + "<br>" + item.desc);
			fnAutocomplete(this.element,  ["num", "desc"], res, fn);
		},
		select: function(ev, ui) {
			op = ui.item; // current operation
			let text = ui.item.num + " - " + ui.item.desc;
			return fnAcLoad(this, ui.item.ec + "," + ui.item.tipo, text);
		}
	}).change(fnAcReset).on("search", fnAcReset);

	operaciones = ab.parse(dom.getText("#op-json")) || [];
	dom.click("a#add-uxxi", el => {
		if (op) {
			delete op.id; //force insert
			operaciones.push(op); // save container
			dom.table("#op-table", operaciones, RESUME, STYLES);
		}
		dom.setValue("#uxxi", "").setFocus("#uxxi")
	});
	dom.table("#op-table", operaciones, RESUME, STYLES);
	dom.onRenderTable("#op-table", table => {
		dom.setValue("#operaciones", JSON.stringify(operaciones));
		op = null; // reinit vinc.
	});
});
