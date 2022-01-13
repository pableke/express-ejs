
dom.ready(function() {
	// Google recptcha
	if (sb.isset(window.grecaptcha)) {
		grecaptcha.ready(function() { // Is ready for token
			grecaptcha.execute("6LeDFNMZAAAAAKssrm7yGbifVaQiy1jwfN8zECZZ", { action: "submit" })
				.then(token => dom.setValue("#token", token))
				.catch(dom.showError);
		});
	}

	// AJAX Forms
	dom.submit((form) => {
		dom.closeAlerts()
			.required("#info", "errSendContact", "errRequired")
			.required("#asunto", "errSendContact", "errRequired")
			.email("#correo", "errSendContact", "errCorreo")
			.required("#nombre", "errSendContact", "errRequired");
		dom.isOk() && dom.ajax(form.action, (msg) => {
			dom.showOk(msg).val("", form.elements).moveFocus("#nombre");
		});
	}, dom.get("#contact"));

	// Non AJAX Forms
	dom.submit((form) => {
		return dom.closeAlerts()
					.login("#clave", "errUserNotFound", "errRegex") //password
					.user("#usuario", "errUserNotFound", "errRegex") //email or login
					.isOk();
	}, dom.get("#login"));
});
