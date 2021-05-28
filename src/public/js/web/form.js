
js.ready(function() {
	const lang = js.getLang(); //default language
	const msgs = i18n.setI18n(lang).getLang(); //messages container
	valid.setI18n(msgs); //init error messages

	// Configure datepicker
	$.datepicker.regional["es"] = i18n.getI18n("es");
	$.datepicker.setDefaults(i18n.getLang());

	// Alerts handlers
	let alerts = js.getAll("div.alert");
	let texts = js.getAll(".alert-text");
	let buttons = js.getAll(".alert-close");
	function showAlert(el) { js.fadeIn(el.parentNode, "grid");  }
	function setAlert(el, txt) { el.innerHTML = txt; showAlert(el); }
	function showOk(txt) { txt && setAlert(texts[0], txt); } //green
	function showInfo(txt) { txt && setAlert(texts[1], txt); } //blue
	function showWarn(txt) { txt && setAlert(texts[2], txt); } //yellow
	function showError(txt) { txt && setAlert(texts[3], txt); } //red

	js.each(texts, el => { el.firstChild && showAlert(el); });
	js.click(buttons, el => { js.fadeOut(el.parentNode); });
	// End alerts handlers

	// Loading div
	let _loading = document.querySelector(".loading");
	function fnLoading() { js.show(_loading).closeAlerts(); }
	function fnUnloading() { js.fadeOut(_loading); }
	// End loading div

	/*********************************************/
	/****************** js-box *******************/
	/*********************************************/
	// Extends js-box module
	const CLS_INVALID = "input-error";
	const CLS_FEED_BACK = ".msg-error";

	js.showOk = function(msg) {
		showOk(msg); //green
		return js;
	}
	js.showInfo = function(msg) {
		showInfo(msg); //blue
		return js;
	}
	js.showWarn = function(msg) {
		showWarn(msg); //yellow
		return js;
	}
	js.showError = function(msg) {
		showError(msg); //red
		return js;
	}
	js.showAlerts = function(msgs) { //show posible multiple messages types
		return msgs ? js.showOk(msgs.msgOk).showInfo(msgs.msgInfo).showWarn(msgs.msgWarn).showError(msgs.msgError) : js;
	}
	js.closeAlerts = function() {
		return js.hide(alerts); //hide alerts
	}
	js.clean = function(inputs) { //reset message and state inputs
		return js.closeAlerts().removeClass(inputs, CLS_INVALID)
				.text(js.siblings(inputs, CLS_FEED_BACK), "")
				.focus(inputs);
	}
	js.showErrors = function(inputs, errors) {
		return js.showAlerts(errors).reverse(inputs, el => {
			let msg = el.name && errors[el.name]; //exists message error?
			msg && js.focus(el).addClass(el, CLS_INVALID).html(js.siblings(el, CLS_FEED_BACK), msg);
		});
	}
	js.load = function(inputs, data) {
		js.import(inputs, data); //load data and reformat
		js.each(js.filter(inputs, ".integer"), el => {
			el.value = msgs.isoInt(data[el.name]);
		}).each(js.filter(inputs, ".float"), el => {
			el.value = msgs.isoFloat(data[el.name]);
		}).each(js.filter(inputs, ".date"), el => { //dates
			el.value = msgs.isoDate(sb.toDate(data[el.name]));
		}).each(js.filter(inputs, ".time"), el => { //times
			el.value = msgs.minTime(sb.toDate(data[el.name]));
		});
		return js.showAlerts(data);
	}

	js.ajax = function(action, resolve, reject) {
		fnLoading(); //show loading frame
		return js.fetch({
			action: action,
			resolve: resolve || showOk,
			reject: reject || showError
		}).catch(showError) //error handler
			.finally(fnUnloading); //allways
	}
	js.autocomplete = function(opts) { // Autocomplete inputs
		let _search = false; //call source indicator
		function fnFalse() { return false; }
		function fnGetIds(el) { return js.siblings(el, "[type=hidden]"); }

		opts = opts || {}; //default config
		opts.action = opts.action || "#"; //request
		opts.minLength = opts.minLength || 3; //length to start
		opts.delay = opts.delay || 500; //milliseconds between keystroke occurs and when a search is performed
		opts.open = opts.open || fnFalse; //triggered if the value has changed
		opts.focus = opts.focus || fnFalse; //no change focus on select
		opts.load = opts.load || fnFalse; //triggered when select an item
		opts.remove = opts.remove || fnFalse; //triggered when no item selected
		opts.render = opts.render || function() { return "-"; }; //render on input
		opts.search = function(ev, ui) { return _search; }; //lunch source
		opts.select = function(ev, ui) { //triggered when select an item
			opts.load(ui.item, this, fnGetIds(this)); //update inputs
			return false; //preserve inputs values from load event
		};
		opts.source = function(req, res) {
			this.element.autocomplete("instance")._renderItem = function(ul, item) {
				let label = sb.iwrap(opts.render(item), req.term); //decore matches
				return $("<li>").append("<div>" + label + "</div>").appendTo(ul);
			}
			js.ajax(opts.action + "?term=" + req.term, data => res(data.slice(0, 10)));
		};
		// Triggered when the field is blurred, if the value has changed
		opts.change = function(ev, ui) {
			if (!ui.item) { //item selected?
				js.val(this, "").val(fnGetIds(this), "");
				opts.remove(this);
			}
		};
		$(opts.inputs).autocomplete(opts);
		return js.keydown(opts.inputs, (el, ev) => { // Reduce server calls, only for backspace or alfanum
			_search = (ev.keyCode == 8) || sb.between(ev.keyCode, 46, 111) || sb.between(ev.keyCode, 160, 223);
		});
	}
	// End extends js-box module
	/*********************************************/
	/****************** js-box *******************/
	/*********************************************/

	/*********************************************/
	/*************** validator-cli ***************/
	/*********************************************/
	// Extends validator-box for clients
	valid.validateForm = function(form) {
		let inputs = form.elements;
		js.clean(inputs).export(inputs, valid.getInputs());
		return valid.validate(form.getAttribute("action")) || !js.showErrors(inputs, valid.closeMsgs(msgs.errForm));
	}
	valid.submit = function(form, ev, action, resolve) {
		ev.preventDefault(); //stop default
		if (valid.validateForm(form)) {
			fnLoading(); //show loading frame
			let fd = new FormData(form); //build pair key/value
			for (let field in valid.getInputs()) //add extra data
				fd.has(field) || fd.append(field, valid.getInput(field));
			js.fetch({ //init call options
				method: form.method,
				action: action || form.action,
				body: (form.enctype === "multipart/form-data") ? fd : new URLSearchParams(fd),
				reject: function(data) { js.showErrors(form.elements, data); },
				resolve: resolve || showOk //default ok
			}).catch(showError)
				.finally(fnUnloading);
		}
		return valid;
	}
	// End extends validator-box for clients
	/*********************************************/
	/*************** validator-cli ***************/
	/*********************************************/

	// AJAX links and forms
	if (typeof grecaptcha !== "undefined") {
		grecaptcha.ready(function() { //google captcha defined
			js.click(js.getAll(".captcha"), (el, ev) => {
				grecaptcha.execute("6LeDFNMZAAAAAKssrm7yGbifVaQiy1jwfN8zECZZ", { action: "submit" })
					.then(token => valid.setInput("token", token).submit(el.closest("form"), ev))
					.catch(showError);
				ev.preventDefault();
			});
		});
	}

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
		$(inputs).filter(".datepicker").datepicker({
			dateFormat: i18n.get("dateFormat"),
			changeMonth: false
		});

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
			render: function(item) { return item.nif + " - " + (item.nombre + " " + item.ap1 + " " + item.ap2).trim(); },
			load: function(item, el, ids) { js.val(el, this.render(item)).val(ids, item.nif); }
		}).autocomplete({
			inputs: js.filter(inputs, ".ac-menu"), action: "/menu/find.html",
			focus: function(ev, ui) {
				let icon = ui.item && ui.item.icon;
				return fnUpdateIcon(this, "input-item input-icon " + (icon || "fas fa-arrow-alt-circle-up"));
			},
			remove: function(el) { fnUpdateIcon(el, "input-item input-icon fas fa-arrow-alt-circle-up"); },
			render: function(item) { return (item.icon ? '<i class="' + item.icon + '"></i> - ' : "") + msgs.get(item, "nombre"); },
			load: function(item, el, ids) { js.val(el, msgs.get(item, "nombre")).val(ids, item._id); }
		});

		js.click(js.filter(inputs, "[type=reset]"), () => {
			//Do what you need before reset the form
			form.reset(); //Reset manually the form
			//Do what you need after reset the form
			//reset message, state inputs and recount textareas
			js.clean(inputs).each(textareas, fnCounter);
		}).click(js.filter(inputs, ".clear-all"), () => {
			js.val(inputs, "").clean(inputs).each(textareas, fnCounter);
		}).click(js.getAll("a.nav-to", form), (el, ev) => {
			js.ajax(el.href, data => { js.load(inputs, data); });
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
