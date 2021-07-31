
js.ready(function() {
	const msgs = i18n.getLang(); //messages container

	// Google recptcha
	if (typeof grecaptcha !== "undefined") {
		grecaptcha.ready(function() { //google captcha defined
			js.load(".captcha").click((el, ev) => {
				grecaptcha.execute("6LeDFNMZAAAAAKssrm7yGbifVaQiy1jwfN8zECZZ", { action: "submit" })
					.then(token => valid.setInput("token", token).submit(el.closest("form"), ev))
					.catch(js.showError);
				ev.preventDefault();
			});
		});
	}
	// load select value
	js.load("select").val();

	js.setI18n(msgs).load("form").reverse(form => {
		let inputs = form.elements; //inputs list
		js.set(js.filter(".integer", inputs)).change(el => { el.value = msgs.fmtInt(el.value); });
		js.set(js.filter(".float", inputs)).change(el => { el.value = msgs.fmtFloat(el.value); });
		js.set(js.filter(".date-range", inputs)).each((el, i, arr) => { // unpdate range limits
			js.change(el, () => js.set(js.filter(".min-" + el.id, arr)).attr("max", el.value));
			js.change(el, () => js.set(js.filter(".max-" + el.id, arr)).attr("min", el.value));
		});

		// Initialize all textarea counter
		let textareas = js.filter("textarea[maxlength]", inputs);
		function fnCounter(el) {
			let txt = Math.abs(el.getAttribute("maxlength") - sb.size(el.value));
			js.text(txt, form.querySelector("#counter-" + el.id));
		}
		js.set(textareas).keyup(fnCounter).each(fnCounter);
		// End initialize all textarea counter

		function fnUpdateIcon(el, value) { return !js.set(js.next("i", el)).setClass(value); }
		js.autocomplete({
			inputs: js.filter(".ac-user", inputs), action: "/user/find.html",
			render: function(item) { return item.nif + " - " + (item.nm + " " + item.ap1 + " " + item.ap2).trim(); },
			load: function(item, el, ids) { js.val(this.render(item), el).val(item.nif, ids); }
		}).autocomplete({
			inputs: js.filter(".ac-menu", inputs), action: "/menu/find.html",
			focus: function(ev, ui) {
				let icon = ui.item && ui.item.icon;
				return fnUpdateIcon(this, "input-item input-icon " + (icon || "fas fa-arrow-alt-circle-up"));
			},
			remove: function(el) { fnUpdateIcon(el, "input-item input-icon fas fa-arrow-alt-circle-up"); },
			render: function(item) { return (item.icon ? '<i class="' + item.icon + '"></i> - ' : "") + msgs.get(item, "nm"); },
			load: function(item, el, ids) { js.val(msgs.get(item, "nm"), el).val(item.id, ids); }
		});

		js.set(js.filter(".update-icon", inputs)).change(el => {
			js.setClass("input-item input-icon " + (el.value || "far fa-window-close"), el.nextElementSibling);
		});

		js.set(js.filter("[type=reset]", inputs)).click(() => {
			//Do what you need before reset the form
			form.reset(); //Reset manually the form
			//Do what you need after reset the form
			//reset message, state inputs and recount textareas
			js.clean(inputs).each(fnCounter, textareas);
		}).set(js.filter(".clear-all", inputs)).click(() => {
			js.val("", inputs).clean(inputs).each(fnCounter, textareas);
		}).load("a.nav-to", form).click((el, ev) => {
			js.ajax(el.href, data => {
				js.showAlerts(data).import(inputs, data).trigger(inputs, "change");
			});
			ev.preventDefault();
		}).load("a.duplicate", form).click((el, ev) => {
			valid.submit(form, ev, el.href, data => {
				js.showAlerts(data).import(inputs, data).load("a.remove,a.nav-to", form).hide();
			});
		}).load("a.remove", form).click((el, ev) => {
			confirm(msgs.remove) || ev.preventDefault();
		});

		js.focus(inputs); //focus on first
		form.addEventListener("submit", ev => {
			if (form.classList.contains("ajax"))
				valid.submit(form, ev, null, data => js.showAlerts(data).import(inputs, data).clean(inputs).each(fnCounter, textareas));
			else if (form.classList.contains("ajax-clear"))
				valid.submit(form, ev, null, data => js.showAlerts(data).val("", inputs).clean(inputs).each(fnCounter, textareas));
			else
				valid.validateForm(form, ev);
		});
	});
	// End AJAX links and forms
});
