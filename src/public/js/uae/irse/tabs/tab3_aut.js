
//*************** subvención, congreso, asistencias/colaboraciones ***************//
dom.ready(function() {
	const resume = { impMax: 0, dif: 0, imp1: 0 };
	const estimaciones = ab.parse(dom.getText("#estimaciones-data")) || [];
	//const PARSERS = { subtipo: nb.intval, imp1: i18n.toFloat };
	const STYLES = {
		remove: "\277Confirma que desea desasociar esta estimación de la comunicación?",
		imp1: i18n.isoFloat, imp2: i18n.isoFloat, impMax: i18n.isoFloat, 
		dif: (val, est) => i18n.isoFloat(est.impMax-est.imp1),
		subtipo: val => i18n.arrval("tiposEstimaciones", val),
		cod: (val, est) => (est.subtipo == 3) ? "-" : dietas.getPais(val)
	};

	function fnUpdateImp() {
		let num = +dom.getValue("#dias") || 1;
		dom.setValue("#imp-est", nfLatin(dietas.getImporte(dom.getValue("#paises"), dom.getValue("#tipo-est"))*num));
	}
	dom.onChangeInputs("#dias", fnUpdateImp).onChangeInputs("#paises", fnUpdateImp).onChangeInputs("#tipo-est", el => {
		dom.closeAlerts().toggleHide(".grupo-pais", el.value == "3");
		fnUpdateImp();
	});

	function fnReloadEstimaciones() {
		resume.impMax = resume.dif = resume.imp1 = 0;
		estimaciones.forEach(est => { //build resume
			est.impMax = nb.round(est.num*est.imp2);
			resume.impMax += est.impMax;
			resume.imp1 += est.imp1;
		});
		resume.dif = resume.impMax - resume.imp1;
		return dom.renderRows(table, estimaciones, resume, STYLES).setValues(".input-estimacion", "")
					.hide(".grupo-pais").setFocus("#tipo-est");
	}
	window.fnAddEstima = function() {
		const msg = i18n.get("errRequired");
		dom.closeAlerts().intval("#tipo-est", "Tipo no válido")
			.required("#paises", "El país asociado a la estimación no es válido!", msg)
			.gt0("#imp-est", "Debe indicar un importe estimado válido!", msg);
		(i18n.getData("subtipo") != 3) && dom.gt0("#dias", "Debe indicar un número de días válido para la estimación", msg);
		if (i18n.isOk()) {
			const estimacion = i18n.toData();
			estimacion.num = +estimacion.num || 1;
			estimacion.imp2 = (estimacion.subtipo == 3) ? estimacion.imp1 : dietas.getImporte(estimacion.cod, estimacion.subtipo);
			estimaciones.push(estimacion);
			fnReloadEstimaciones().setValue("#estima", JSON.stringify(estimaciones));
		}
	}
	window.fnPaso3 = function() {
		dom.closeAlerts();
		if (resume.imp1 < .1)
			dom.required("#tipo-est", i18n.get("errEstimaciones"));
		return dom.isOk();
	}

	const table = dom.getTable("#estimaciones");
	dom.event("remove", t => {
		fnReloadEstimaciones().setValue("#estima", JSON.stringify(estimaciones));
	}, table)
	fnReloadEstimaciones();
});
