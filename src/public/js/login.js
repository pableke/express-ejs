
import sb from "./lib/string-box.js";
import dom from "./lib/dom-box.js";
import i18n from "./model/login.js";

//DOM is fully loaded
dom.ready(function() {
	const form = i18n.getForm("login");
	const flogin = dom.getForm("#login");

	dom.tabs(".tab-content") // Tabs hendlres
		.onChangeInputs(flogin, "#usuario", (ev, el) => { el.value = sb.clean(el.value); })
		.submit(flogin, ev => dom.isValid(flogin, form.validate)); // validate and submit

	grecaptcha.ready(function() {
		grecaptcha.execute("6LeDFNMZAAAAAKssrm7yGbifVaQiy1jwfN8zECZZ", { action: "submit" }).then(token => {
			dom.setVal("token", token);
		});
	});
});
