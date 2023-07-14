
import sb from "./lib/string-box.js";
import dom from "./lib/dom-box.js";
import login from "./model/login.js";

//DOM is fully loaded
dom.ready(function() {
	const form = login.getForm("login");
	const flogin = dom.getForm("#signin");
	const fcontact = dom.getForm("#contact");

	function loadRecaptcha() {
		const CONFIG = { action: "submit" };
		const PUBLIC_KEY = "6LeDFNMZAAAAAKssrm7yGbifVaQiy1jwfN8zECZZ";
		grecaptcha.execute(PUBLIC_KEY, CONFIG).then(token => dom.setVal("token", token));
	}
	// Reload token every 5 minutes
	grecaptcha.ready(loadRecaptcha);
	setInterval(loadRecaptcha, 300 * 1000);

	dom.tabs(".tab-content") // Tabs hendlres
		.submit(fcontact, ev => !dom.validate(fcontact, { validate: form.contact }).then(loadRecaptcha)) // validate + ajax submit
		.onChangeInputs(flogin, "#usuario", (ev, el) => { el.value = sb.clean(el.value); }) // format fields
		.submit(flogin, ev => dom.isValid(flogin, form.signin)); // validate and submit
});
