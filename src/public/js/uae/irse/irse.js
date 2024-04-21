
//Global IRSE components
const ip = new IrsePerfil();
const ir = new IrseRutas();
const dietas = new IrseDietas();
const io = new IrseOrganicas();

dom.ready(function() {
	var isTab6Loaded;

	/*********** subvención, congreso, asistencias/colaboraciones ***********/
	dom.onShowTab(3, tab3 => {
		if (window.fnPaso3)
			return; // tab preloaded
		if (ip.isColaboracion()) { // tab3 = colaboracion
			window.fnPaso3 = () => dom.closeAlerts().required("#justifi", "errJustifiSubv", "errRequired").isOk();
			return; // validate col only
		}

		const eCong = dom.getInput("#congreso", tab3); //congreso si/no
		const eIniCong = dom.getInput("#fIniCong", tab3); //fecha inicio del congreso
		const eFinCong = dom.getInput("#fFinCong", tab3); //fecha fin del congreso
		const eJustifiCong = dom.get(".justifi-congreso", tab3); //justificacion del congreso

		function validCong() {
			let fIniCong = dt.toDate(eIniCong.value);
			let fFinCong = dt.toDate(eFinCong.value);
			dt.addDate(fIniCong, -1).trunc(fIniCong).addDate(fFinCong, 2).trunc(fFinCong);
			return ((fIniCong && dt.lt(ir.start(), fIniCong)) || (fFinCong && dt.lt(fFinCong, ir.end())));
		}
		function fechasCong() {
			eIniCong.setAttribute("max", eFinCong.value);
			eFinCong.setAttribute("min", eIniCong.value);
			dom.toggleHide(eJustifiCong, !validCong());
		}
		function updateCong() {
			dom.toggleHide(".grp-congreso", eCong.value == "0");
			(+eCong.value > 0) ? fechasCong() : dom.hide(eJustifiCong);
		}

		dom.onBlurInput(eIniCong, fechasCong)
			.onBlurInput(eFinCong, fechasCong)
			.onChangeInput(eCong, updateCong);
		updateCong();

		window.fnPaso3 = function() {
			dom.closeAlerts()
				.required("#justifi", "errJustifiSubv", "errRequired")
				.required("#justifiVp", "errJustifiVp", "errRequired")
				.required("#entidad-origen", "errEntidadOrigen", "errRequired");
			if (validCong())
				dom.required("#justifiCong", "errCongreso", "errRequired");
			if (eCong.value == "4")
				dom.required("#impInsc", "errNumber", "errRequired");
			return dom.isOk();
		}
	});

	/*********** FACTURAS, TICKETS y demás DOCUMENTACIÓN para liquidar ***********/
	dom.onShowTab(5, tab5 => {
		if (window.fnPaso5)
			return; // tab preloaded

		const eTipoGasto = dom.getInput("#tipo-gasto"); //select tipo
		dom.setAttrInputs(".ui-pernocta", "min", dt.isoEnDate(ir.start()))
			.setAttrInputs(".ui-pernocta", "max", dt.isoEnDate(ir.end()))
			.setValue("#fAloMin", dt.isoEnDate(ir.start()))
			.setValue("#fAloMax", dt.isoEnDate(ir.end()));

		function isDoc() { return ["201", "202", "204", "205", "206"].indexOf(eTipoGasto.value) > -1; }
		function isExtra() { return ["301", "302", "303", "304"].indexOf(eTipoGasto.value) > -1; }
		function isPernocta() { return eTipoGasto.value == "9"; }

		const file = $("#fileGasto_input", tab5).change(() => !dom.show(eTipoGasto.parentNode));
		dom.get("[href='#open-file-gasto']", tab5).addEventListener("click", ev => file.click());

		dom.change(eTipoGasto, () => {
			const grupos = dom.setValue("#tipoGasto", eTipoGasto.value)
								.setText("[for=txtGasto]", i18n.get("lblDescObserv"), tab5)
								.getAll(".grupo-gasto", tab5);
			if (isPernocta())
				dom.view(grupos, 0b11011);
			else if (isDoc())
				dom.view(grupos, 0b10101);
			else if (isExtra())
				dom.view(grupos, 0b10111);
			else if (ip.isIsu() && ("4" == eTipoGasto.value)) //ISU y taxi
				dom.setText("[for=txtGasto]", i18n.get("lblDescTaxi"), tab5).view(grupos, 0b10111);
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
				let fIni = dom.getValue("#fAloMin");
				let fFin = dom.getValue("#fAloMax");
				if (!fIni || !fFin)
					return !dom.addError("fAloMin", "errFechasAloja");
				if (!ir.inRange(fIni) || !ir.inRange(fFin))
					return !dom.addError("fAloMin", "errRangoAloja");
			}
			return true;
		}
	});

	/*********** Tablas de resumen ***********/
	function fnLoadTab6() {
		if (!isTab6Loaded)
			dietas.render(); //muestro la tabla de dietas
		isTab6Loaded = true; //load indicator
	}
	dom.onShowTab(6, fnLoadTab6);

	/*********** Fin + IBAN ***********/
	dom.onShowTab(9, tab9 => {
		// always auto build table organicas/gastos
		fnLoadTab6();
		io.build();
		if (window.fnPaso9)
			return; // tab preloaded

		const cuentas = dom.getInput("#cuentas");
		function fnPais(pais) {
			let es = (pais == "ES");
			dom.toggleHide("#entidades", !es).toggleHide(".swift-block,#banco", es);
		}
	
		dom.toggleHide("#grupo-iban", cuentas.options.length > 1) // existen cuentas?
			.onChangeInput("#paises", el => {
				fnPais(el.value);
				dom.setValue("#banco", null);
			})
			.onChangeInput("#entidades", el => dom.setValue("#banco", dom.getOptText(el)))
			.change(cuentas, el => {
				dom.setValue("#iban", el.value).setValue("#entidades", sb.substr(el.value, 4, 4))
					.setValue("#swift", "").toggleHide("#grupo-iban", el.value);
			})
			.each(cuentas.options, opt => {
				let entidad = valid.getEntidad(opt.innerText);
				if (entidad)
					opt.innerText += " - " + entidad;
			})
			.onChangeInput("#iban", el => { el.value = sb.toWord(el.value); })
			.onChangeInput("#swift", el => { el.value = sb.toWord(el.value); });
	
		if (!cuentas.value) {
			fnPais(dom.getValue("#paises"));
			dom.show(dom.get("#grupo-iban", tab9));
		}
	
		window.fnPaso9 = function() {
			dom.closeAlerts().required("#iban", "errIban", "errRequired");
			if (!dom.getValue("#cuentas")) {
				if (dom.getValue("#paises") != "ES")
					dom.required("#swift", "errSwift", "errRequired").required("#banco", null, "errRequired");
				else
					dom.required("#entidades", null, "errRequired");
				if (dom.getValue("#urgente") == "2")
					dom.required("#extra", "errExtra", "errRequired").geToday("#fMax", "errFechaMax", "errRequired");
			}
			return dom.isOk() && io.build();
		}
		window.fnSend = () => i18n.confirm("msgFirmarEnviar");
	});

	// show current tab
	const tab0 = dom.getTab(13);
	dom.viewTab(tab0.dataset.paso || 13);
});

//PF needs confirmation in onclick attribute
const fnUnlink = () => i18n.confirm("msgUnlink") && loading();
const fnClone = () => i18n.confirm("msgReactivar") && loading();
const saveTab = () => dom.showOk(i18n.get("saveOk")).working();
const showNextTab = (xhr, status, args) => {
	if (!xhr || (status != "success"))
		return !dom.showError("Error 500: Internal server error.").working();
	if (!args) // Has server response?
		return dom.nextTab(); // Show next tab
	const msgs = args.msgs && JSON.parse(args.msgs); // Parse server messages
	if (!msgs?.msgError) // is ok?
		dom.nextTab(); // Show next tab
	// Always show alerts after change tab
	dom.showAlerts(msgs).working();
}
const gotoTab = (xhr, status, args, tab) => {
	if (!xhr || (status != "success"))
		return !dom.showError("Error 500: Internal server error.").working();
	if (!args) // Has server response?
		return dom.nextTab(); // Show next tab
	const msgs = args.msgs && JSON.parse(args.msgs); // Parse server messages
	if (!msgs?.msgError) // is ok?
		dom.viewTab(tab); // Show next tab
	// Always show alerts after change tab
	dom.showAlerts(msgs).working();
}
const onList = () => dom.val(".ui-filter").setValue("#firma", "5" ).loading();
const onVinc = () => dom.val(".ui-filter").setValue("#estado", "1" ).loading();
