
// Extends config for DOM elements
js.ready(function() {
	const lang = js.getLang(); //default language
	const msgs = i18n.setI18n(lang).getLang(); //messages container
	valid.setI18n(msgs); //init error messages

	// Alerts handlers
	let alerts = js.getAll("div.alert");
	let texts = js.getAll(".alert-text");
	function showAlert(el) { js.fadeIn(el.parentNode, "grid"); }
	function setAlert(el, txt) { el.innerHTML = txt; showAlert(el); }
	function showOk(txt) { txt && setAlert(texts[0], txt); } //green
	function showInfo(txt) { txt && setAlert(texts[1], txt); } //blue
	function showWarn(txt) { txt && setAlert(texts[2], txt); } //yellow
	function showError(txt) { txt && setAlert(texts[3], txt); } //red

	js.each(el => { el.firstChild && showAlert(el); }, texts)
		.load(".alert-close").click(el => js.fadeOut(el.parentNode));
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

	js.showOk = function(msg) { showOk(msg); return js; } //green
	js.showInfo = function(msg) { showInfo(msg); return js; } //blue
	js.showWarn = function(msg) { showWarn(msg); return js; } //yellow
	js.showError = function(msg) { showError(msg); return js; } //red
	js.closeAlerts = function() { return js.hide(alerts); } //hide alerts
	js.showAlerts = function(msgs) { //show posible multiple messages types
		return msgs ? js.showOk(msgs.msgOk).showInfo(msgs.msgInfo).showWarn(msgs.msgWarn).showError(msgs.msgError) : js;
	}
	js.clean = function(inputs) { //reset message and state inputs
		return js.closeAlerts().set(inputs).removeClass(CLS_INVALID).set(js.siblings(inputs, CLS_FEED_BACK)).text("").focus(inputs);
	}
	js.showErrors = function(inputs, errors) {
		return js.showAlerts(errors).set(inputs).reverse(el => {
			let msg = el.name && errors[el.name]; //exists message error?
			msg && js.focus(el).addClass(el, CLS_INVALID).html(js.siblings(el, CLS_FEED_BACK), msg);
		});
	}

	js.format = function(inputs, data) {
		js.import(inputs, data); //load data and reformat
		js.set(js.filter(".integer", inputs)).each(el => {
			el.value = msgs.isoInt(data[el.name]);
		}).set(js.filter(".float", inputs)).each(el => {
			el.value = msgs.isoFloat(data[el.name]);
		}).set(js.filter(".date", inputs)).each(el => { //dates
			el.value = msgs.isoDate(sb.toDate(data[el.name]));
		}).set(js.filter(".time", inputs)).each(el => { //times
			el.value = msgs.minTime(sb.toDate(data[el.name]));
		});
		return js.showAlerts(data);
	}
	js.parse = function(inputs, data) {
		data = js.export(inputs, data); //parse from inputs
		js.set(js.filter(".integer", inputs)).each(el => {
			data[el.name] = msgs.toInt(data[el.name]);
		}).set(js.filter(".float", inputs)).each(el => {
			data[el.name] = msgs.toFloat(data[el.name]);
		}).set(js.filter("[type=date]", inputs)).each(el => { //dates
			data[el.name] = new Date(data[el.name]);
		}).set(js.filter(".date", inputs)).each(el => { //dates
			data[el.name] = msgs.toDate(data[el.name]);
		}).set(js.filter(".time", inputs)).each(el => { //times
			data[el.name] = msgs.toTime(data[el.name]);
		});
		return data;
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
		function fnGetIds(el) { return js.siblings("[type=hidden]", el); }

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
				js.val("", this).val("", fnGetIds(this));
				opts.remove(this);
			}
		};
		$(opts.inputs).autocomplete(opts);
		return js.set(opts.inputs).keydown((el, ev) => { // Reduce server calls, only for backspace or alfanum
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
});
