
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
	dom.onChangeInput("#correo", el => { el.value = sb.lower(el.value); })
		.onSubmitForm("#contact", form => {
			dom.closeAlerts()
				.required("#info", "errSendContact")
				.required("#asunto", "errSendContact")
				.email("#correo", "errSendContact")
				.required("#nombre", "errSendContact");
			dom.isOk() && dom.send(form, msg => {
				dom.showOk(msg).val(form.elements, "").setFocus("#nombre");
			});
		});

	// Non AJAX Forms
	dom.onChangeInput("#usuario", el => { el.value = sb.toUpperWord(el.value); })
		.onSubmitForm("#login", form => {
			return dom.closeAlerts()
						.login("#clave", "errUserNotFound") //password
						.user("#usuario", "errUserNotFound") //email or login
						.isOk();
		});
});
