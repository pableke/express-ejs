
import dom from "../lib/dom-box.js";
import i18n from "../lib/i18n-box.js";

//DOM is fully loaded
dom.ready(function() {
	const flogin = dom.getForm("#login");
    dom.afterReset(flogin, ev => dom.closeAlerts().autofocus(flogin.elements)) // Reset form action
		.submit(flogin, ev => dom.isValid(flogin, i18n.forms.login)); // validate and submit
});
