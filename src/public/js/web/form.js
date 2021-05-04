
js.ready(function() {
	const lang = js.getLang(); //default language
	const msgs = i18n.setI18n(lang).getLang(); //messages container

	// Alerts handlers
	let alerts = js.getAll("div.alert");
	let texts = js.getAll(".alert-text");
	let buttons = js.getAll(".alert-close");
	function showAlert(el) { js.fadeIn(el.parentNode, "flex");  }
	function setAlert(el, txt) { el.innerHTML = txt; showAlert(el); }
	function showOk(txt) { txt && setAlert(texts[0], txt); } //green
	function showInfo(txt) { txt && setAlert(texts[1], txt); } //blue
	function showWarn(txt) { txt && setAlert(texts[2], txt); } //yellow
	function showError(txt) { txt && setAlert(texts[3], txt); } //red
	function closeAlerts() { js.hide(alerts); } //hide alerts
	function showAlerts(msgs) {
		//show posible multiple messages types
		showOk(msgs.msgOk); //green
		showInfo(msgs.msgInfo); //blue
		showWarn(msgs.msgWarn); //yellow
		showError(msgs.msgError); //red
	}

	js.each(texts, el => { el.firstChild && showAlert(el); });
	js.click(buttons, el => { js.fadeOut(el.parentNode); });
	// End alerts handlers

	// Loading div
	let _loading = document.querySelector(".loading");
	function fnLoading() { js.show(_loading); closeAlerts(); valid.initMsgs(); }
	function fnUnloading() { js.fadeOut(_loading); }
	// End loading div

	/*********************************************/
	/*************** validator-cli ***************/
	/*********************************************/
	// Extends validator-box for clients
	const CLS_INVALID = "input-error";
	const CLS_FEED_BACK = ".msg-error";
	const COUNTER_SELECTOR = "textarea[maxlength]";
	const XHR = { "x-requested-with": "XMLHttpRequest" };

	valid.clean = function(inputs) { //reset message and state inputs
		closeAlerts(); //close previous messages
		js.removeClass(inputs, CLS_INVALID)
			.text(js.siblings(inputs, CLS_FEED_BACK), "")
			.focus(inputs);
		return valid;
	}
	valid.loadInputs = function(inputs) {
		js.each(inputs, el => {
			el.name && valid.setInput(el.name, el.value);
		});
		return valid;
	}
	valid.showErrors = function(inputs, errors) {
		js.reverse(inputs, el => {
			let msg = el.name && errors[el.name]; //exists message error?
			msg && js.focus(el).addClass(el, CLS_INVALID).html(js.siblings(el, CLS_FEED_BACK), msg);
		});
		showAlerts(errors);
		return valid;
	}
	valid.validateForm = function(form) {
		let inputs = form.elements; //list
		valid.clean(inputs).loadInputs(inputs); //input list to object
		return valid.validate(form.getAttribute("action"), msgs)
				|| !valid.showErrors(inputs, valid.setMsgError(msgs.errForm).getMsgs());
	}

	function fnResponse(res) { //response = 200 read type
		res.ok || valid.setMsgError(msgs.errAjax); //server response ok?
		let contentType = res.headers.get("content-type") || ""; //response type
		return (contentType.indexOf("application/json") > -1) ? res.json() : res.text();
	}
	valid.ajax = function(action, ev, resolve) {
		fnLoading(); //show loading frame
		ev && ev.preventDefault(); //stop default
		resolve = resolve || showOk; //default ok
		return fetch(action, { headers: XHR }) //get call
					.then(fnResponse) //detect response
					// Only call resolve function if is valid otherwise showError
					.then(data => valid.isValid() ? resolve(data) : showError(data))
					.catch(showError) //error handler
					.finally(fnUnloading); //allways
	}
	valid.submit = function(form, ev, action, resolve) {
		ev.preventDefault(); //stop default
		if (valid.validateForm(form)) {
			fnLoading(); //show loading frame
			let fd = new FormData(form); //build pair key/value
			for (let field in valid.getInputs()) //add extra data
				fd.has(field) || fd.append(field, valid.getInput(field));
			const CONFIG = { //init call options
				method: form.method,
				body: (form.enctype === "multipart/form-data") ? fd : new URLSearchParams(fd),
				headers: XHR
			}
			resolve = resolve || showOk; //default ok
			fetch(action || form.action, CONFIG)
					.then(fnResponse) //detect response
					// Only call resolve function if is valid otherwise showErrors
					.then(data => valid.isValid() ? resolve(data) : valid.showErrors(form.elements, data))
					.catch(showError)
					.finally(fnUnloading);
		}
		return valid;
	}
	valid.update = function(data) { //update partial
		js.html(js.getAll(data.update), data.html); //selector
		showAlerts(data); //show alerts
		return valid;
	}
	// End extends validator-box for clients
	/*********************************************/
	/*************** validator-cli ***************/
	/*********************************************/

	// AJAX links and forms
	/*$("a.ajax.remove").click(function(ev) {
		return confirm(msgs.remove) && valid.ajax(this.href, ev);
	});
	$("a.ajax.reload").click(function(ev) {
		valid.ajax(this.href, ev, valid.update);
	});*/
	if (typeof grecaptcha !== "undefined") {
		grecaptcha.ready(function() { //google captcha defined
			document.querySelectorAll(".captcha").forEach(el => {
				el.addEventListener("click", ev => {
					grecaptcha.execute("6LeDFNMZAAAAAKssrm7yGbifVaQiy1jwfN8zECZZ", { action: "submit" })
						.then(token => valid.setInput("token", token).submit(el.closest("form"), ev))
						.catch(showError);
					ev.preventDefault();
				});
			});
		});
	}

	js.reverse(js.getAll("form"), form => {
		let inputs = form.elements; //inputs list
		js.change(js.filter(inputs, ".integer"), el => { el.value = msgs.intHelper(el.value); });
		js.change(js.filter(inputs, ".float"), el => { el.value = msgs.floatHelper(el.value); });

		let dates = js.filter(inputs, ".date");
		js.keyup(dates, el => { el.value = msgs.acDate(el.value); })
			.change(dates, el => { el.value = msgs.dateHelper(el.value); });
		let times = js.filter(inputs, ".time");
		js.keyup(times, el => { el.value = msgs.acTime(el.value); })
			.change(times, el => { el.value = msgs.timeHelper(el.value); });

		// Initialize all textarea counter
		let textareas = js.filter(inputs, COUNTER_SELECTOR);
		function fnCounter(el) {
			let txt = Math.abs(el.getAttribute("maxlength") - sb.size(el.value));
			js.text(form.querySelector("#counter-" + el.id), txt);
		}
		js.keyup(textareas, fnCounter).each(textareas, fnCounter);
		// End initialize all textarea counter

		// Autocomplete inputs
		let _search = false; //call source indicator
		function fnRenderUser(item) { return item.nif + " - " + item.nombre; }
		function fnAcLoad(el, id, txt) { return !js.val(el, txt).val(js.siblings(el, "[type=hidden]"), id); }
		$(form.elements).filter(".ac-user").keydown(ev => { //reduce server calls
			_search = (ev.keyCode == 8) || ((ev.keyCode > 45) && (ev.keyCode < 224)); //backspace or alfanum
		}).autocomplete({ //autocomplete for users
			minLength: 3,
			source: function(req, res) {
				this.element.autocomplete("instance")._renderItem = function(ul, item) {
					let label = sb.iwrap(fnRenderUser(item), req.term); //decore matches
					return $("<li></li>").append("<div>" + label + "</div>").appendTo(ul);
				}
				valid.ajax("/tests/usuarios.html?term=" + req.term, null, data => res(data.slice(0, 10)));
			},
			focus: function() { return false; }, //no change focus on select
			search: function(ev, ui) { return _search; }, //lunch source
			select: function(ev, ui) { return fnAcLoad(this, ui.item.nif, fnRenderUser(ui.item)); }
		}).change(function(ev) {
			this.value || fnAcLoad(this, "", "");
		});
		// End autocomplete inputs

		js.click(js.filter(inputs, "[type=reset]"), ev => {
			//Do what you need before reset the form
			form.reset(); //Reset manually the form
			//Do what you need after reset the form
			valid.clean(form.elements); //reset message and state inputs
			js.each(textareas, fnCounter); //recount all textareas
		});
		js.click(js.filter(inputs, "a.duplicate"), ev => {
			valid.submit(form, ev, this.href, data => {
				js.val(js.filter(inputs, ".duplicate"), ""); //clean input values
				showOk(data); //show ok message
			});
		});

		js.focus(form.elements); //focus on first
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
