
js.ready(function() {
	const msgs = i18n.getLang(); //messages container

	// Configure datepicker
	//$.datepicker.regional["es"] = i18n.getI18n("es");
	//$.datepicker.setDefaults(i18n.getLang());

	// Google recptcha
	if (typeof grecaptcha !== "undefined") {
		grecaptcha.ready(function() { //google captcha defined
			js.click(js.getAll(".captcha"), (el, ev) => {
				grecaptcha.execute("6LeDFNMZAAAAAKssrm7yGbifVaQiy1jwfN8zECZZ", { action: "submit" })
					.then(token => valid.setInput("token", token).submit(el.closest("form"), ev))
					.catch(js.showError);
				ev.preventDefault();
			});
		});
	}
	// load select value
	js.val(js.getAll("select"));

	js.reverse(js.getAll("form"), form => {
		let inputs = form.elements; //inputs list

		js.change(js.filter(inputs, ".integer"), el => { el.value = msgs.fmtInt(el.value); });
		js.change(js.filter(inputs, ".float"), el => { el.value = msgs.fmtFloat(el.value); });
		let dates = js.filter(inputs, ".date");
		js.keyup(dates, el => { el.value = msgs.acDate(el.value); })
			.change(dates, el => { el.value = msgs.fmtDate(el.value); });
		let times = js.filter(inputs, ".time");
		js.keyup(times, el => { el.value = msgs.acTime(el.value); })
			.change(times, el => { el.value = msgs.fmtTime(el.value); });
		/*$(inputs).filter(".datepicker").datepicker({
			dateFormat: i18n.get("dateFormat"),
			changeMonth: false
		});*/

		// Initialize all textarea counter
		let textareas = js.filter(inputs, "textarea[maxlength]");
		function fnCounter(el) {
			let txt = Math.abs(el.getAttribute("maxlength") - sb.size(el.value));
			js.text(form.querySelector("#counter-" + el.id), txt);
		}
		js.keyup(textareas, fnCounter).each(textareas, fnCounter);
		// End initialize all textarea counter

		function fnUpdateIcon(el, value) { return !js.setClass(js.next(el, "i"), value); }
		js.autocomplete({
			inputs: js.filter(inputs, ".ac-user"), action: "/user/find.html",
			render: function(item) { return item.nif + " - " + (item.nm + " " + item.ap1 + " " + item.ap2).trim(); },
			load: function(item, el, ids) { js.val(el, this.render(item)).val(ids, item.nif); }
		}).autocomplete({
			inputs: js.filter(inputs, ".ac-menu"), action: "/menu/find.html",
			focus: function(ev, ui) {
				let icon = ui.item && ui.item.icon;
				return fnUpdateIcon(this, "input-item input-icon " + (icon || "fas fa-arrow-alt-circle-up"));
			},
			remove: function(el) { fnUpdateIcon(el, "input-item input-icon fas fa-arrow-alt-circle-up"); },
			render: function(item) { return (item.icon ? '<i class="' + item.icon + '"></i> - ' : "") + msgs.get(item, "nm"); },
			load: function(item, el, ids) { js.val(el, msgs.get(item, "nm")).val(ids, item.id); }
		});

		js.change(js.filter(inputs, ".update-icon"), (el) => {
			js.setClass(el.nextElementSibling, "input-item input-icon " + (el.value || "far fa-window-close"));
		})

		js.click(js.filter(inputs, "[type=reset]"), () => {
			//Do what you need before reset the form
			form.reset(); //Reset manually the form
			//Do what you need after reset the form
			//reset message, state inputs and recount textareas
			js.clean(inputs).each(textareas, fnCounter);
		}).click(js.filter(inputs, ".clear-all"), () => {
			js.val(inputs, "").clean(inputs).each(textareas, fnCounter);
		}).click(js.getAll("a.nav-to", form), (el, ev) => {
			js.ajax(el.href, data => {
				js.load(inputs, data).trigger(inputs, "change");
			});
			ev.preventDefault();
		}).click(js.getAll("a.duplicate", form), (el, ev) => {
			valid.submit(form, ev, el.href, data => {
				js.load(inputs, data).toggle(js.getAll("a.nav-to", form), "btn hide");
			});
		});

		js.focus(inputs); //focus on first
		form.addEventListener("submit", ev => {
			if (form.classList.contains("ajax"))
				valid.submit(form, ev, null, data => { js.load(inputs, data); });
			else
				valid.validateForm(form) || ev.preventDefault();
		});
	});
	// End AJAX links and forms
});
