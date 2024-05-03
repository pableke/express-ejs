
//Global IRSE components
const ip = new IrsePerfil();
const ir = new IrseRutas();
const dietas = new IrseDietas();
const io = new IrseOrganicas();

dom.ready(function() { // DOM ready
	i18n.addLangs(IRSE_I18N).setCurrent(IRSE.lang); //Set init. config
	dom.tr(".i18n-tr-h1").setText("#imp-gasolina-km", i18n.isoFloat(IRSE.gasolina)); //local traductor
	dom.each(document.forms, form => form.setAttribute("novalidate", "1"));

	// Init. IRSE form
	ip.init(); ir.init(); io.init();

	/*********** subvención, congreso, asistencias/colaboraciones ***********/
	dom.onShowTab(3, tab3 => {
		ir.update(); // Actualizo los tipos de rutas
		tab3.querySelectorAll(".rutas-vp").forEach(el => el.classList.toggle("hide", ir.getNumRutasVp() < 1));
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
				.required("#entidad-origen", "errEntidadOrigen", "errRequired");
			if (ir.getNumRutasVp())
				dom.required("#justifiVp", "errJustifiVp", "errRequired");
			if (validCong())
				dom.required("#justifiCong", "errCongreso", "errRequired");
			if (eCong.value == "4")
				dom.required("#impInsc", "errNumber", "errRequired");
			return dom.isOk();
		}
	});

	/*********** FACTURAS, TICKETS y demás DOCUMENTACIÓN para liquidar ***********/
	dom.onShowTab(5, tab5 => {
		const eTipoGasto = tab5.querySelector("#tipo-gasto"); //select tipo
		if (!eTipoGasto)
			return; // modo solo consulta

		ir.update(); // Actualizo los tipos de rutas
		const grupos = dom.getAll(".grupo-gasto", tab5);
		const isDoc = () => (["201", "202", "204", "205", "206"].indexOf(eTipoGasto.value) > -1);
		const isExtra = () => (["301", "302", "303", "304"].indexOf(eTipoGasto.value) > -1);
		const isPernocta = () => (eTipoGasto.value == "9");
		eTipoGasto.onchange = () => {
			dom.setValue("#tipoGasto", eTipoGasto.value)
				.setText("[for=txtGasto]", i18n.get("lblDescObserv"), tab5);
			if (isPernocta())
				dom.view(grupos, 0b11011);
			else if (isDoc())
				dom.view(grupos, 0b10101);
			else if (isExtra())
				dom.view(grupos, 0b10111);
			else if ("4" == eTipoGasto.value) //ISU y taxi
				dom.setText("[for=txtGasto]", i18n.get("lblDescTaxi"), tab5).view(grupos, 0b10111);
			else if (0 < +eTipoGasto.value)
				dom.view(grupos, 0b10011);
			else
				dom.view(grupos, 0b00001);			
		}

		// trayectos de ida y vuelta => al menos 2
		tab5.querySelectorAll(".rutas-gt-1").forEach(el => el.classList.toggle("hide", ir.size() < 2));
		dom.table("#rutas-read", ir.getAll(), ir.getResume(), ir.getStyles())
			.setAttrInputs(".ui-pernocta", "min", dt.isoEnDate(ir.start()))
			.setAttrInputs(".ui-pernocta", "max", dt.isoEnDate(ir.end()))
			.setValue("#fAloMin", dt.isoEnDate(ir.start()))
			.setValue("#fAloMax", dt.isoEnDate(ir.end()))
			.view(grupos, 0);

		eTipoGasto.value = ""; // clear selection
		tab5.querySelector("#impGasto").value = i18n.isoFloat(0);
		tab5.querySelector("#txtGasto").value = "";
		dom.setValue("#trayectos");

		const file = tab5.querySelector("#fileGasto_input");
		file.onchange = () => dom.show(eTipoGasto.parentNode);
		tab5.querySelector("[href='#open-file-gasto']").onclick = () => file.click();
		document.querySelector("a#gasto-rutas").onclick = () => { // button in tab12
			let etapas = dom.values(dom.getCheckedRows("#rutas-out")).join(",");
			if (etapas) {
				dom.setValue("#trayectos", etapas);
				tab5.querySelector("#uploadGasto").click();
			}
			else
				dom.showError(i18n.get("errLinkRuta"));
		}

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
				//if (!ir.inRange(fIni) || !ir.inRange(fFin))
					//return !dom.addError("fAloMin", "errRangoAloja");
			}
			return true;
		}
	});

	/*********** Tablas de resumen ***********/
	var isTab6Loaded;
	dom.onShowTab(6, tab6 => {
		if (!isTab6Loaded)
			dietas.render(); // Calc dietas
		dom.toggleInfo(tab6); // update toggle links
		tab6.querySelectorAll(".rutas-vp").forEach(el => el.classList.toggle("hide", ir.getNumRutasVp() < 1));
		isTab6Loaded = true; //load indicator
	});

	/*********** Fin + IBAN ***********/
	dom.onShowTab(9, tab9 => {
		io.build(); // always auto build table organicas/gastos
		if (window.fnPaso9)
			return; // tab preloaded

		dietas.render(); // Force dietas recalc
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

	/*********** Autocompletes expediente uxxiec ***********/
	const RESUME = {};
	const STYLES = { imp: i18n.isoFloat, fUxxi: i18n.fmtDate };
	let op, operaciones; // vinc. container
	dom.onLoadTab(15, tab15 => {
		$("#uxxi", tab15).attr("type", "search").keydown(fnAcChange).autocomplete({
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
				return fnAcLoad(this, null, op.num + " - " + op.desc);
			}
		}).change(fnAcReset).on("search", fnAcReset);
		dom.click("a#add-uxxi", el => {
			if (op) {
				delete op.id; //force insert
				operaciones.push(op); // save container
				dom.table("#op-table", operaciones, RESUME, STYLES);
			}
			dom.setValue("#uxxi", "").setFocus("#uxxi")
		});
		dom.onRenderTable("#op-table", table => {
			dom.setValue("#operaciones", JSON.stringify(operaciones));
			op = null; // reinit vinc.
		});
	});
	dom.onShowTab(15, tab15 => {
		operaciones = ab.parse(dom.getText("#op-json")) || []; // preload docs
		dom.setValue("#operaciones").table("#op-table", operaciones, RESUME, STYLES);
	});

	// show current tab
	const tab0 = dom.getTab(13);
	return dom.viewTab(tab0.dataset.paso || 13);
});

//PF needs confirmation in onclick attribute
const fnUnlink = () => i18n.confirm("msgUnlink") && loading();
const fnClone = () => i18n.confirm("msgReactivar") && loading();
const saveTab = () => dom.showOk(i18n.get("saveOk")).working();
// Handle errors or parse server messages
const isLoaded = (xhr, status, args) => (xhr && (status == "success")) || !alerts.showError(xhr || "Error 500: Internal server error.").working();
const showAlerts = (xhr, status, args) => {
    if (isLoaded(xhr, status, args)) { // Error or parse server messages
        const msgs = args.msgs && JSON.parse(args.msgs); // Parse server messages
        dom.showAlerts(msgs); // Always show alerts after change tab
        return !msgs?.msgError; // has error message
    }
    return false; // Server error
}
const showNextTab = (xhr, status, args, tab) => {
	if (!isLoaded(xhr, status, args))
		return false; // Server error
	const msgs = args.msgs && JSON.parse(args.msgs); // Parse server messages
	const ok = !msgs?.msgError; // has error message
	if (ok) // If no error => Show next tab
		sb.isset(tab) ? dom.viewTab(tab) : dom.nextTab();
	// Always show alerts after change tab
	dom.showAlerts(msgs).working();
	return ok;
}
const onList = () => dom.val(".ui-filter").setValue("#firma", "5").loading();
const clickList = () => onList().trigger("#filter-list", "click");
const clickVinc = () => dom.val(".ui-filter").setValue("#estado", "1").trigger("#filter-list", "click");
