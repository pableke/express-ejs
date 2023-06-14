
import sb from "../lib/string-box.js";
import dom from "../lib/dom-box.js";
import i18n from "../lib/i18n-box.js";
import langs from "./i18n/langs.js";

//DOM is fully loaded
dom.ready(function() {
	i18n.setLangs(langs).load();

	const flogin = dom.getForm("#login");
    dom.onChangeInputs(flogin, "#usuario", (ev, el) => { el.value = sb.toCode(el.value); })
		.afterReset(flogin, ev => dom.closeAlerts().autofocus(flogin.elements)) // Reset form action
		.submit(flogin, ev => dom.isValid(flogin, i18n.getForm("login"))); // validate and submit
});
