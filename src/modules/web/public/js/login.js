
import sb from "../lib/string-box.js";
import dom from "../lib/dom-box.js";
import i18n from "../lib/i18n-box.js";

//DOM is fully loaded
dom.ready(function() {
	const flogin = dom.getForm("#login");
    dom.onChangeInputs(flogin, "#usuario", (ev, el) => { el.value = sb.toCode(el.value); })
		.afterReset(flogin, ev => dom.closeAlerts().autofocus(flogin.elements)) // Reset form action
		.submit(flogin, ev => dom.isValid(flogin, i18n.forms.login)); // validate and submit
});
