
dom.ready(function() {
	i18n.addLangs(TC_I18N).setCurrent("es");

	const form = $("form#xeco");
	const op2 = $("input#op2", form);
	const eId = $("input#id", form);

	const ej = $("#ejCache", form).val();
	const tipo = +op2.val() || 1; //default tcr
	const ePartidas = $("#partidas", form); //todas las partidas a inc
	const partidas = (new TcPartidas(ej, tipo)).load(); //registro de partidas

	/********** partida que se decrementa **********/
	function fnUpdateCd(item) {
		pdec.cd = 0; //init credito disponible
		Object.assign(pdec, item); //actualizo datos
		dom.getInput("input#cd").value = nfLatin(pdec.cd);
	}
	function fnUpdateFirst(partida) {
		fnAnticipo(partida);
		partida.importe = pdec.importe;
		incrementar.splice(0, 1, partida);
		dom.table("#partidas-inc", incrementar, pinc, STYLES);
	}
	function fawarn(row) {
		dom.closeAlerts();
		if ((row.mask & 1) && ([1, 2, 6].indexOf(tipo) > -1)) //organicas afectadas para TCR o FCB 
			dom.showInfo("La org&aacute;nica " + row.o + " es afectada, por lo que su solicitud solo se aceptar&aacute; para determinado tipo de operaciones.");
	}
	function fnAnticipo(p) {
		if (partidas.getAnticipo(eId.val(), p.o)) { //aviso no bloquante + flag
			dom.closeAlerts().showWarn("Atenci&oacute;n: la org&aacute;nica " + p.o + " ha dispuesto de cr&eacute;dito anticipado al cobro de la factura.");
			p.mask |= 4; //flag anticipada
		}
		else
			p.mask &= ~4; //flag anticipada
	}

	$("#cv", form).keydown(fnAcChange).autocomplete({
		minLength: 3,
		focus: fnFalse, //no change focus on select
		search: fnAcSearch, //lunch source
		source: function(req, res) {
			fnAcRender(this.element, item => (item.o + " - " + item.dOrg));
			res(fnAcFilter(partidas.getPartidasDec(), ["o", "dOrg"], req.term));
		},
		select: function(ev, ui) {
			fawarn(ui.item);
			fnUpdateCd(ui.item);
			$("#org-desc", form).text(pdec.dOrg);
			$("#fa", form).val(i18n.fmtBool(pdec.mask & 1));
			let aux = partidas.getEconomicasDec(pdec.idOrg);
			eEco.html(ab.format(aux, '<option value="@idEco;">@e; - @dEco;</option>')).val(pdec.idEco);
			eImp.change(); //force update tabla
			return fnAcLoad(this, pdec.idOrg, pdec.o);
		}
	}).change(fnAcReset);
	const eEco = $("#idEco", form).change(function() {
		fnUpdateCd(partidas.getPdec(pdec.idOrg, this.value));
	});
	const eImp = $("#importe", form).change(function() {
		pdec.importe = npLatin(eImp.val()) || 0;
		if (tipo == 3) { //L83
			let aip = partidas.getAip(pdec.idAip);
			if (!aip)
				return !dom.addError("#cv", "AIP no encontrado para la partida seleccionada.");
			fnAnticipo(pdec); //solo muestro el aviso para la partida que disminuye
			aip.importe = pdec.importe;
			aip.ej = pdec.ej;
			fnUpdateFirst(aip);
		}
		else if (tipo == 5) //ANT
			fnUpdateFirst(pdec);
		else if (tipo == 8) //AFC
			fnUpdateFirst(incrementar[0]);
	});
	/********** partida que se decrementa **********/

	const STYLES = {
			remove: "\277Confirma que desea desasociar esta partida?",
			empty: "N/A", gg: nfLatin, ing: nfLatin, ch: nfLatin, mh: nfLatin, ih: nfLatin, importe: nfLatin, 
			imp: nfLatin, impTotal: nfLatin, impPartida: nfLatin, fCreacion: dfLatin, fMax: dfLatin, ff: dfLatin,
			fa: (val, partida) => i18n.fmtBool(partida.omask & 1),
			info: (val, partida) => {
				let output = "";
				if (partida.mask & 4)
					output = '<span class="textbig" title="Este contrato ha gozado de anticipo en alg&uacute;n momento">&#65;</span>';
				if (((tipo == 5) || (partida.e == "642")) && sb.isset(partida.ih) && ((partida.ih + .01) < partida.importe)) { //validación de importe excedido
					output += '<span class="textwarn textbig" title="La cantidad solicitada excede el margen registrado por el Buz&oacute;n de Ingresos">&#9888;</span>';
					partida.mask |= 2; //flag de importe excedido
				}
				return output;
			}
		};
	const pdec = {
		ej: ej, importe: npLatin(eImp.val()) || 0,
		cd: npLatin($("input#cd", form).val())
	};
	const pinc = {};
	const incrementar = ab.parse(ePartidas.val()) || []

	/********** partida que se incrementa **********/
	let _ecos;
	function fnAddPinc(item) {
		pinc.temp = item;
		pinc.temp.omask = item.mask;
		$("#fainc", form).val(i18n.fmtBool(item.mask & 1));
	}

	var eOrg = $("#eco3d", form).keydown(fnAcChange).autocomplete({
		minLength: 3,
		focus: fnFalse, //no change focus on select
		search: fnAcSearch, //lunch source
		source: function(req, res) {
			fnAcRender(this.element, item => (item.o + " - " + item.dOrg));
			res(fnAcFilter(partidas.getPartidasInc(), ["o", "dOrg"], req.term));
		},
		select: function(ev, ui) {
			fawarn(ui.item);
			fnAddPinc(ui.item);
			_ecos = partidas.getEconomicasInc(ui.item.idOrg);
			eInc.val((_ecos.length == 1) ? ui.item.e : null);
			return fnAcLoad(this, "", ui.item.o);
		}
	}).change(fnAcReset);
	var eInc = $("#ecoinc", form).keydown(fnAcChange).autocomplete({
		minLength: 1,
		focus: fnFalse, //no change focus on select
		search: fnAcSearch, //lunch source
		source: function(req, res) {
			fnAcRender(this.element, item => (item.e + " - " + item.dEco));
			res(fnAcFilter(_ecos, ["e", "dEco"], req.term));
		},
		select: function(ev, ui) {
			fnAddPinc(ui.item);
			return fnAcLoad(this, "", ui.item.e);
		}
	}).change(fnAcReset);

	dom.onRenderTable("#partidas-inc", (table, ev) => {
		pinc.importe = incrementar.reduce((total, p) => (total + p.importe), 0); // resume imp
		pdec.importe = (tipo == 1) ? pdec.importe : pinc.importe; //TCR => mantiene importe
		dom.setValues(".grp-inc", "").setFocus("#eco3d");
	});
	dom.table("#partidas-inc", incrementar, pinc, STYLES)
		.autofocus();

	function fnUpdatePinc(imp) {
		incrementar.push(pinc.temp);
		fnAnticipo(pinc.temp);
		pinc.temp.importe = imp;
		pinc.temp.ej = pdec.ej;
		pinc.temp = null;
		dom.table("#partidas-inc", incrementar, pinc, STYLES);
	}
	dom.onclick("a#add-partida", el => {
		let msgRequired = i18n.get("errRequired");
		dom.closeAlerts().gt0("#impinc", "El importe de la partida a incrementar debe ser mayor de 0,00 &euro;");
		if (!pinc.temp || (eOrg.val() != pinc.temp.o))
			return dom.addError("#eco3d", "No ha seleccionado correctamente la partida a aumentar", msgRequired);
		if (eInc.val() != pinc.temp.e)
			dom.addError("#ecoinc", "La partida seleccionada no existe en UXXI-EC, debe solicitarse a través de Extraeco.", msgRequired);
		if (incrementar.find(p => (p.id == pinc.temp.id))) //pk
			dom.addError("#eco3d", "¡Partida ya asociada a la solicitud!");
		if (dom.isOk()) {
			let imp = i18n.getData("impinc");
			if (tipo == 1) { //TCR
				let capInc = sb.substr(pinc.temp.e, 0, 1);
				let cap = sb.substr(eEco.find("option:selected").text(), 0, 1);
				if ((["6", "7", "8", "9"].indexOf(cap) > -1) && (cap != capInc))
					return !dom.addError("#cv", "No puede realizarse la transferencia solicitada porque es competencia del Consejo Social. Debe ponerse en contacto con la UAE.");
				if ((pdec.o == pinc.temp.o) && (pdec.e == capInc))
					return !dom.showWarn("La partida que aumenta est&aacute; dentro del mismo cr&eacute;dito vinculante que la que disminuye, con lo que esta operaci&oacute;n no es necesaria.");
				if (pdec.importe < (pinc.importe + imp))
					return !dom.addError("#cv", "El importe de las partidas que se incrementan supera al de la partida que se decrementa!");
				fnUpdatePinc(imp);
			}
			else {
				fnUpdatePinc(imp);
				pdec.importe = pinc.importe;
				eImp.val(nfLatin(pdec.importe));
			}
		}
	});
	/********** partida que se incrementa **********/

	dom.onclick("a[href=insert]", el => {
		let msgRequired = i18n.get("errRequired");
		if (dom.closeAlerts().getInput("#urgente").value == "2") {
			dom.required("#extra", "Debe asociar un motivo para la urgencia de esta solicitud", msgRequired)
				.geToday("#fMax", "Debe indicar una fecha maxima de resolución para esta solicitud");
		}
		dom.required("#memoria", "Debe asociar una memoria justificativa a la solicitud.", msgRequired)
			.required("#cv", "Debe indicar la partida que disminuye.", msgRequired);
		if (!eImp.val() || (pdec.importe < .01))
			dom.addError("#importe", "Debe indicar un importe mayor de 0,00 &euro; para la partida que disminuye");
		if (!incrementar.length) //todas las solicitudes tienen partidas a aumentar
			dom.addError("#eco3d", "Debe seleccionar al menos una partida a aumentar!", msgRequired);
		if (!nb.eq01(pdec.importe, pinc.importe))
			dom.addError("#eco3d", "El importe de la partida que disminuye no coincide con el de la/las que aumentan!");
		if (partidas.isValidableCd() && ((pdec.cd || 0) < pinc.importe)) //TCR o AFC
			dom.addError("#eco3d", "Cr&eacute;dito m&aacute;ximo disponible excedido!");
		ePartidas.val(JSON.stringify(incrementar)); //serializo las partidas a incrementar
		return dom.isOk() && confirm("\277Confirma que desea firmar y enviar esta solicitud?") && linkto(el);
	});
});
