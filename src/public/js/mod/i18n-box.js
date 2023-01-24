
import i18n from "./i18n-core.js";
import forms from "./i18n-forms.js";

const fnVoid = () => {}

i18n.getForms = () => forms;
i18n.getForm = id => (forms[id] || forms);
i18n.validate = function(data, validators, messages) {
	messages = messages || {}; // View messages
	validators = validators || forms; // Default container
	messages.msgError = messages.msgError || validators.msgError;
	i18n.reset(); // Reinit error counter
	for (let key in data) {
		const fn = validators[key] || fnVoid;
		const msgtip = messages[key] || validators[key + "Error"];
		fn(key, data[key], messages.msgError, msgtip);
	}
	return i18n.isOk() ? i18n.toData() : null;
}

export default i18n;
