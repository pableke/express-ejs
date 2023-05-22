
//*************** subvención, congreso, asistencias/colaboraciones ***************//
dom.ready(function() {
	const eCong = dom.getInput("#congreso"); //confreso si/no
	const eIniCong = dom.getInput("#fIniCong"); //fecha inicio del congreso
	const eFinCong = dom.getInput("#fFinCong"); //fecha fin del congreso
	const eJustifiCong = dom.get(".justifi-congreso"); //justificacion del congreso

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
