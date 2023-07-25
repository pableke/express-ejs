
dom.ready(function() {
	const RESUME = { imp: 0 };
	const STYLES = {
		empty: "N/A", 
		imp: i18n.isoFloat, gg: i18n.isoFloat, ing: i18n.isoFloat, ch: i18n.isoFloat, mh: i18n.isoFloat, ih: i18n.isoFloat, fUxxi: i18n.fmtDate,
		fa: (val, partida) => i18n.fmtBool(partida.omask & 1),
		info: (val, partida) => {
			let output = "";
			if (((PRESTO.tipo == 5) || (partida.e == "642")) && sb.isset(partida.ih) && ((partida.ih + .01) < partida.imp)) { //validación de importe excedido
				output = '<span class="textwarn textbig" title="La cantidad solicitada excede el margen registrado por el Buzón de Ingresos">&#9888;</span>';
				partida.mask |= 2; //flag de importe excedido
			}
			if (partida.mask & 4) //partida anticipada
				output += '<span class="textbig" title="Este contrato ha gozado de anticipo en algún momento">&#65;</span>';
			return output;
		}
	};
	const VALIDATORS = {
		msgError: "errForm",
		presto: { "org-dec": i18n.required, "org-dec-id": i18n.required, "eco-dec": i18n.required }, //no valido el importe => precalculado
		partidas: { "org-inc": i18n.required, "org-inc-id": i18n.required, "eco-inc": i18n.required, "imp-inc": i18n.gt0 } //importe obligatorio
	};

	let economicasDec, dec;
	let partidas = ab.parse(dom.getText("#partidas-json")) || [];

	//****** partida a decrementar ******//
	const fnOrganicaDec = (id, mask, txt) => dom.setValue("#org-dec", txt).setValue("#org-dec-id", id).setValue("#fa-dec", i18n.fmtBool(mask & 1));
	const fnLoadDC = index => {
		dec = economicasDec[index];
		dom.setValue("#imp-cd", i18n.isoFloat(dec?.imp));
	}
	const fnAvisoFa = mask => { //aviso para organicas afectadas en TCR o FCE
		const info = "La orgánica seleccionada es afectada, por lo que su solicitud solo se aceptará para determinado tipo de operaciones.";
		(mask & 1) && ([1, 6].indexOf(PRESTO.tipo) > -1) && dom.showInfo(info);
	}
	const fnAutoloadImp = imp => {
		partidas[0].imp = i18n.toFloat(imp) || 0; //importe obligatorio
		dom.table("#partidas-tb", partidas, RESUME, STYLES);
	}
	const fnAutoloadInc = (data, msg) => {
		const partida = ab.parse(data);
		if (partida) { //hay partida?
			partidas = [ partida ]; //tabla de fila/partida unica
			fnAutoloadImp(); //render partidas
		}
		else
			dom.showError(msg);
	}

	window.autoloadL83 = (xhr, status, args) => fnAutoloadInc(args.data, "Aplicación AIP no encontrada en el sistema.");
	window.autoloadAnt = (xhr, status, args) => fnAutoloadInc(args.data, "No se ha encontrado el anticipo en el sistema.");
	window.loadCD = el => {
		if (PRESTO.tipo == 3) //L83 => busco su AIP
			dom.trigger("#autoload-l83", "click");
		else if (PRESTO.tipo == 5) //ANT => cargo misma organica
			dom.trigger("#autoload-ant", "click");
		fnLoadDC(el.selectedIndex);
	}
	window.loadEconomicasDec = (xhr, status, args) => {
		economicasDec = ab.parse(args.economicas) || [];
		if (args.data) {
			if (PRESTO.tipo == 3) //L83 => busco su AIP
				autoloadL83(xhr, status, args);
			else if (PRESTO.tipo == 5) //ANT => cargo misma organica
				autoloadAnt(xhr, status, args);
		}
		fnLoadDC(0); // Cargo el importe del crédito disponible por defecto
		unloading(); // fin del calculo de las economicas
	}

	function fnResetPartidaDec() {
		if ((PRESTO.tipo != 8) && PRESTO.autoloadInc) //autoload y no AFC
			dom.clearTable("#partidas-tb", partidas, RESUME, STYLES);
		fnOrganicaDec().trigger("#find-economicas-dec", "click");
	}
	function fnResetOrganicaDec() {
		this.value || fnResetPartidaDec();
	}

	$("#org-dec").attr("type", "search").keydown(fnAcChange).autocomplete({
		delay: 500, //milliseconds between keystroke occurs and when a search is performed
		minLength: 4, //longitud minima para lanzar la busqueda
		focus: fnFalse, //no change focus on select
		search: fnAcSearch, //lunch source
		source: fnSourceItems, //show datalist
		select: function(ev, ui) {
			loading(); // muestro denuevo el cargando para cargar las economicas
			fnAvisoFa(ui.item.int); //aviso para organicas afectadas en TCR o FCE
			fnOrganicaDec(ui.item.value, ui.item.int, ui.item.label);
			return !dom.trigger("#find-economicas-dec", "click");
		}
	}).change(fnResetOrganicaDec).on("search", fnResetOrganicaDec);
	dom.onChangeInput("#imp-dec", el => {
		if (PRESTO.autoloadInc && partidas.length)
			fnAutoloadImp(el.value);
	});
	//****** partida a decrementar ******//

	//****** partida a incrementar ******//
	const fnOrganicaInc = (id, mask, txt) => dom.setValue("#org-inc", txt).setValue("#org-inc-id", id).setValue("#fa-inc", i18n.fmtBool(mask & 1));
	function fnResetPartidaInc() { fnOrganicaInc().setValue("#imp-inc").trigger("#find-economicas-inc", "click"); }
	function fnResetOrganicaInc() { this.value || fnResetPartidaInc(); }

	window.loadEconomicasInc = (xhr, status, args) => {
		unloading(); // fin del calculo de las economicas
	}

	$("#org-inc").attr("type", "search").keydown(fnAcChange).autocomplete({
		delay: 500, //milliseconds between keystroke occurs and when a search is performed
		minLength: 4, //longitud minima para lanzar la busqueda
		focus: fnFalse, //no change focus on select
		search: fnAcSearch, //lunch source
		source: fnSourceItems, //show datalist
		select: function(ev, ui) {
			loading(); // muestro denuevo el cargando para cargar las economicas
			fnAvisoFa(ui.item.int); //aviso para organicas afectadas en TCR o FCE
			fnOrganicaInc(ui.item.value, ui.item.int, ui.item.label);
			return !dom.trigger("#find-economicas-inc", "click");
		}
	}).change(fnResetOrganicaInc).on("search", fnResetOrganicaInc);
	//****** partida a incrementar ******//

	dom.onChangeInput("#ej-dec", el => { dom.setValue("#ej-inc", el.value); fnResetPartidaDec(); })
		.onChangeInput("#ej-inc", fnResetPartidaInc)
		.eachInput(".ui-float", el => { el.value = i18n.isoFmt(el.value); });

	//****** tabla de partidas a incrementar ******//
	window.fnAddPartidaInc = (xhr, status, args) => dom.validate("#xeco-presto", VALIDATORS.partidas);
	window.loadPartidaInc = (xhr, status, args) => {
		const partida = ab.parse(args.data);
		partida.imp = i18n.toFloat(dom.getValue("#imp-inc"));
		partidas.push(partida); // save container
		dom.table("#partidas-tb", partidas, RESUME, STYLES).setFocus("#org-inc");
		fnResetPartidaInc();
	}
	dom.onRenderTable("#partidas-tb", table => {
		RESUME.imp = 0; // Init. resume
		partidas.forEach(partida => { RESUME.imp += partida.imp; }); // recalcula total
		dom.eachInput("#ej-dec", el => dom.toggle(el, "ui-state-disabled", partidas.length));
		dom.eachInput("#ej-inc", el => dom.toggle(el, "ui-state-disabled", PRESTO.disableEjInc || partidas.length));
	});
	dom.table("#partidas-tb", partidas, RESUME, STYLES);
	//****** tabla de partidas a incrementar ******//

	window.fnSend = () => {
		const msgRequired = i18n.get("errRequired");
		dom.validate("#xeco-presto", VALIDATORS.presto);
		if (dom.getValue("#urgente") == "2") {
			dom.required("#extra", "Debe asociar un motivo para la urgencia de esta solicitud", msgRequired)
				.geToday("#fMax", "Debe indicar una fecha maxima de resolución para esta solicitud");
		}
		dom.required("#memoria", "Debe asociar una memoria justificativa a la solicitud.", msgRequired)
			.required("#org-dec", "Debe indicar la partida que disminuye.", msgRequired);
		if (!partidas.length) //todas las solicitudes tienen partidas a incrementar
			dom.addError("#org-inc", "Debe seleccionar al menos una partida a aumentar!", msgRequired);
		if (dec) {
			const ok = (PRESTO.tipo == 5) || (RESUME.imp <= dec.imp); // los anticipos no validan el CD
			dom.required("#imp-dec", "Debe indicar el importe de la partida que disminuye.", msgRequired);
			ok || dom.addError("#imp-dec", "¡Importe máximo de la partida a disminuir excedido!", msgRequired);
		}
		if (dom.isOk()) { //todas las validaciones estan ok?
			//dom.setValue("#imp-dec", i18n.isoFloat(RESUME.imp)); //reajusto importe a decrementar
			partidas.sort((a, b) => (b.imp - a.imp)); //orden por importe desc.
			partidas[0].mask = partidas[0].mask | 1; //marco la primera como principal
			dom.setValue("#partidas", JSON.stringify(partidas)); // save data to send to server
			return confirm("¿Confirma que desea firmar y enviar esta solicitud?");
		}
	}
});
