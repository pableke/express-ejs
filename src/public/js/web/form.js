
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
	function fnLoading() { js.show(_loading).closeAlerts(); valid.initMsgs(); }
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
	js.showError = function(msg) {
		showError(msg); //red
		return js;
	}
	js.showAlerts = function(msgs) {
		//show posible multiple messages types
		showInfo(msgs.msgInfo); //blue
		showWarn(msgs.msgWarn); //yellow
		return js.showOk(msgs.msgOk).showError(msgs.msgError); //red
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
		opts = opts || {}; //default config
		function fnAcLoad(el, id, txt) {
			return !js.val(el, txt).val(js.siblings(el, "[type=hidden]"), id);
		}

		let _search = false; //call source indicator
		opts.action = opts.action || "#"; //request
		opts.minLength = opts.minLength || 3; //length to start
		opts.render = opts.render || function() { return "-"; }; //render on input
		opts.renderItem = opts.renderItem || opts.render; //render on item list
		opts.focus = function() { return false; }; //no change focus on select
		opts.search = function(ev, ui) { return _search; }; //lunch source
		opts.select = function(ev, ui) { return fnAcLoad(this, ui.item[opts.id], opts.render(ui.item)); };
		opts.source = function(req, res) {
			this.element.autocomplete("instance")._renderItem = function(ul, item) {
				let label = sb.iwrap(opts.renderItem(item), req.term); //decore matches
				return $("<li></li>").append("<div>" + label + "</div>").appendTo(ul);
			}
			js.ajax(opts.action + "?term=" + req.term, data => res(data.slice(0, 10)));
		};
		$(opts.inputs).autocomplete(opts);

		//reduce server calls = backspace or alfanum
		return js.keydown(opts.inputs, (el, ev) => {
			_search = (ev.keyCode == 8) || ((ev.keyCode > 45) && (ev.keyCode < 224));
		}).change(opts.inputs, el => {
			el.value || fnAcLoad(el, "", "");
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
		js.clean(inputs).each(inputs, el => {
			el.name && valid.setInput(el.name, el.value);
		});
		return valid.validate(form.getAttribute("action"))
				|| !js.showErrors(inputs, valid.setMsgError(msgs.errForm).getMsgs());
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
			.change(dates, el => { el.value = msgs.isoDate(el.value); });
		let times = js.filter(inputs, ".time");
		js.keyup(times, el => { el.value = msgs.acTime(el.value); })
			.change(times, el => { el.value = msgs.isoTime(el.value); });
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

		js.autocomplete({
			inputs: js.filter(inputs, ".ac-user"),
			id: "nif", action: "/tests/usuarios.html",
			render: function(item) { return item.nif + " - " + item.nombre; }
		});

		js.click(js.filter(inputs, "[type=reset]"), () => {
			//Do what you need before reset the form
			form.reset(); //Reset manually the form
			//Do what you need after reset the form
			//reset message, state inputs and recount textareas
			js.clean(inputs).each(textareas, fnCounter);
		}).click(js.getAll("a.duplicate", form), (el, ev) => {
			valid.submit(form, ev, el.href, data => { //ajax form submit
				js.val(js.filter(inputs, "[name='_id'],.dup-clear"), ""); //clean input values
				showOk(data); //show ok message
			});
		});

		js.focus(inputs); //focus on first
		form.addEventListener("submit", ev => {
			if (form.classList.contains("ajax")) {
				valid.submit(form, ev, null, data => {
					js.val(inputs, ""); //clean input values
					showOk(data); //show ok message
				});
			}
			else
				valid.validateForm(form) || ev.preventDefault();
		});
	});
	// End AJAX links and forms
});
