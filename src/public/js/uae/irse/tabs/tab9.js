
function fnPaso3() {
	return dom.closeAlerts().required("#justifi", "errJustifiSubv", "errRequired").isOk();
}
function fnPaso9() {
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
function fnSend() {
	return i18n.confirm("msgFirmarEnviar");
}

dom.ready(function() {
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
		dom.show(dom.get("#grupo-iban"));
	}
});
