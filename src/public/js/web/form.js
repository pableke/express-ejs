
import sb from "./mod/string-box.js";
import dom from "./mod/dom-box.js";

dom.ready(function() {
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
		.onSubmitForm("#contact", form => dom.validate(form) && !dom.send(form).then(msg => dom.setOk(form, msg))) // AJAX Forms
		.onSubmitForm("#login", form => dom.validate(form)); // Non AJAX Forms
});
