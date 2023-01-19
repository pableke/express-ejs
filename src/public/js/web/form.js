
dom.ready(function() {
	const validators = {
		loginFormError: "errUserNotFound",
		contactFormError: "errSendContact",
		nombre: i18n.required, correo: i18n.email,
		asunto: i18n.required, info: i18n.required,
		usuario: i18n.user, clave: i18n.login
	};

	// Google recptcha
	if (sb.isset(window.grecaptcha)) {
		grecaptcha.ready(function() { // Is ready for token
			grecaptcha.execute("6LeDFNMZAAAAAKssrm7yGbifVaQiy1jwfN8zECZZ", { action: "submit" })
				.then(token => dom.setValue("#token", token))
				.catch(dom.showError);
		});
	}

	// Fields and forms (helpers and validators)
	dom.onChangeInput("#correo", el => { el.value = sb.lower(el.value); })
		.onChangeInput("#usuario", el => { el.value = sb.toUpperWord(el.value); })
		.onSubmitForm("#contact", form => dom.validate(form, validators) && !dom.send(form).then(msg => dom.setOk(form, msg))) // AJAX Forms
		.onSubmitForm("#login", form => dom.validate(form, validators)); // Non AJAX Forms
});
