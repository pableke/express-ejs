
dom.ready(function() {
	let tab5 = dom.get("#tab-5");
	let eTipoGasto = dom.getInput("#tipo-gasto"); //select tipo

	dom.setAttrInputs(".ui-pernocta", "min", dt.isoEnDate(ir.start()))
		.setAttrInputs(".ui-pernocta", "max", dt.isoEnDate(ir.end()))
		.setValue("#fAloMin", dt.isoEnDate(ir.start()))
		.setValue("#fAloMax", dt.isoEnDate(ir.end()));
	let fMaxPernocta = dt.clone(ir.end());
	dt.trunc(fMaxPernocta);

	function isDoc() { return ["201", "202", "204", "205", "206"].indexOf(eTipoGasto.value) > -1; }
	function isExtra() { return ["301", "302", "303", "304"].indexOf(eTipoGasto.value) > -1; }
	function isPernocta() { return eTipoGasto.value == "9"; }

	$("#fileGasto_input", tab5).change(() => !dom.show(eTipoGasto.parentNode))
								.prev().html(i18n.tr("lblPorAqui"))
								.prev().toggleClass("fas fa-share ui-icon-plusthick")
								.parent().addClass("success-btn")
								.closest(".hide").toggleClass("hide");

	dom.change(eTipoGasto, () => {
		let grupos = dom.setValue("#tipoGasto", eTipoGasto.value).getAll(".grupo-gasto", tab5);
		if (isPernocta())
			dom.view(grupos, 0b11011);
		else if (isDoc())
			dom.view(grupos, 0b10101);
		else if (isExtra())
			dom.view(grupos, 0b10111);
		else if (0 < +eTipoGasto.value)
			dom.view(grupos, 0b10011);
		else
			dom.view(grupos, 0b00001);			
	});

	dom.addClick("a#gasto-rutas", () => {
		let etapas = dom.values(dom.getCheckedRows("#rutas-out")).join(",");
		if (etapas) {
			dom.setValue("#trayectos", etapas);
			$("#uploadGasto", tab5).click();
		}
		else
			dom.showError(i18n.get("errLinkRuta"));
	});

	window.fnPaso5 = function() {
		dom.closeAlerts();
		if (isDoc())
			return dom.required("#txtGasto", "errDoc").isOk();
		dom.gt0("#impGasto", "errGt0", "errRequired")
			.required(eTipoGasto, "errTipoGasto", "errRequired")
		if (dom.isError())
			return false;
		if (isExtra())
			return dom.required("#txtExtra", "errJustifiExtra", "errRequired").isOk();
		if ((eTipoGasto.value == "8") && !dom.getValue("#trayectos")) //factura sin trayectos asociados => tab-12
			return !dom.viewTab(12);
		if (isPernocta()) {
			let fIni = dt.enDate(dom.getValue("#fAloMin"));
			let fFin = dt.enDate(dom.getValue("#fAloMax"));
			if (!fIni || !fFin)
				return !dom.addError("fAloMin", "errFechasAloja");
			if (!ir.inRange(fIni) || !ir.inRange(fFin))
				return !dom.addError("fAloMin", "errRangoAloja");
		}
		return true;
	}
});
