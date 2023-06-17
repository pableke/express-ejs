
import sb from "./lib/string-box.js";
import dom from "./lib/dom-box.js";
import i18n from "./model/login.js";

//DOM is fully loaded
dom.ready(function() {
	const form = i18n.getForm("login");
	const flogin = dom.getForm("#login");
    dom.onChangeInputs(flogin, "#usuario", (ev, el) => { el.value = sb.toCode(el.value); })
		.afterReset(flogin, ev => dom.closeAlerts().autofocus(flogin.elements)) // Reset form action
		.submit(flogin, ev => dom.isValid(flogin, form.validate)); // validate and submit
});
