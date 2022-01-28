
// Configure JS client
const ab = new ArrayBox(); //array-box
const dt = new DateBox(); //datetime-box
const gb = new GraphBox(); //graph-box structure
const nb = new NumberBox(); //number box
const sb = new StringBox(); //string box
const tb = new TreeBox(); //tree-box structure

const valid = new ValidatorBox(); //validators
const i18n = new I18nBox(); //messages
const dom = new DomBox(); //HTML-DOM box

//DOM is fully loaded
dom.ready(function() {
	i18n.setI18n(dom.getLang());

	// Extends with animationCSS lib
	dom.animate = function(animation, list) {
		// We create a Promise and return it
		return new Promise((resolve, reject) => {
			const animationName = "animate__animated animate__" + animation;

			// When the animation ends, we clean the classes and resolve the Promise
			function handleAnimationEnd(el, ev) {
				dom.removeClass(animationName, list);
				ev.stopPropagation();
				resolve(el);
			}

			dom.addClass(animationName, list)
				.event("animationend", handleAnimationEnd, list);
		});
	}
	dom.fadeIn = (list) => { dom.removeClass("hide", list).animate("fadeIn", ); return dom; }
	dom.fadeOut = (list) => { dom.animate("fadeOut", list).then(el => dom.addClass("hide", el)); return dom; }

	// Scroll body to top on click and toggle back-to-top arrow
	const _top = document.body.lastElementChild;
	window.onscroll = function() { dom.toggle("hide", this.pageYOffset < 80, _top); }
	dom.click(el => !dom.scroll(), _top);

	// Loading div
	const _loading = _top.previousElementSibling;
	dom.loading = () => dom.removeClass("hide", _loading).closeAlerts();
	dom.working = () => dom.fadeOut(_loading);
	// End loading div

	// Extra inputs helpers
	const inputs = dom.getInputs(); // All inputs list
	dom.setDateRange = el => dom.attr("max", el.value, dom.getInput(".ui-min-" + el.id)).attr("min", el.value, dom.getInput(".ui-max-" + el.id));
	dom.setDates = (value, list) => dom.val(value, list).each(dom.setDateRange, list); //update value and range
	dom.setDate = (selector, value) => dom.setDates(value, dom.getInputs(selector));

	// Alerts handlers
	const alerts = _loading.previousElementSibling;
	const texts = dom.getAll(".alert-text", alerts);
	function setAlert(el, txt) {
		return txt ? dom.fadeIn(el.parentNode).html(txt, el).scroll() : dom;
	}

	dom.isOk = i18n.isOk;
	dom.isError = i18n.isError;
	dom.showOk = (msg) => setAlert(texts[0], msg); //green
	dom.showInfo = (msg) => setAlert(texts[1], msg); //blue
	dom.showWarn = (msg) => setAlert(texts[2], msg); //yellow
	dom.showError = (msg) => setAlert(texts[3], msg); //red
	dom.showAlerts = function(msgs) { //show posible multiple messages types
		return msgs ? dom.showOk(msgs.msgOk).showInfo(msgs.msgInfo).showWarn(msgs.msgWarn).showError(msgs.msgError) : dom;
	}
	dom.closeAlerts = function() { //hide all alerts
		i18n.start(); //reinit. error counter
		const tips = dom.getAll(".ui-errtip"); //tips messages
		return dom.addClass("hide", alerts.children).removeClass("ui-error", inputs).html("", tips).addClass("hide", tips);
	}

	// Show posible server messages and close click event
	dom.each(el => { el.firstChild && dom.fadeIn(el.parentNode); }, texts)
		.click(el => dom.fadeOut(el.parentNode), dom.getAll(".alert-close", alerts));

	// Individual input error messages
	dom.setError = function(el) {
		const tip = dom.get(".ui-errtip", el.parentNode);
		return dom.showError(i18n.getError()).addClass("ui-error", el).focus(el)
					.html(i18n.getMsg(el.name), tip).removeClass("hide", tip);
	}
	dom.addError = function(selector, msg, msgtip) {
		const el = dom.getInput(selector);
		if (el) { // Element exists?
			i18n.setError(el.name, msg, msgtip);
			dom.setError(el);
		}
		else // Only show error
			dom.showError(i18n.setMsgError(msg).getError());
		return dom;
	}
	dom.setErrors = function(data) {
		dom.closeAlerts(); //close prev errros
		if (sb.isstr(data)) //Is string
			return dom.showError(data);
		for (const k in data) //errors list
			dom.addError("[name='" + k + "']", null, data[k]);
		return dom.showAlerts(data); //show global menssages
	}

	// Inputs formater
	dom.each(el => { el.value = i18n.fmtBool(el.value); }, dom.getInputs(".ui-bool"));
	dom.onChangeInput(".ui-integer", el => { el.value = i18n.fmtInt(el.value); dom.toggle("texterr", sb.starts(el.value, "-"), el); });
	dom.onChangeInput(".ui-float", el => { el.value = i18n.fmtFloat(el.value); dom.toggle("texterr", sb.starts(el.value, "-"), el); });
	dom.onChangeInput(".ui-date", dom.setDateRange); //auto range date inputs

	// Initialize all textarea counter
	const ta = dom.getInputs("textarea.counter");
	function fnCounter(el) { dom.setText("#counter-" + el.id, Math.abs(el.getAttribute("maxlength") - sb.size(el.value)), el.parentNode); }
	dom.attr("maxlength", "600", ta).keyup(fnCounter, ta).each(fnCounter, ta);

	// Common validators for fields
	dom.isRequired = (el, msg, msgtip) => (!el || i18n.required(el.name, el.value, msg, msgtip)) ? dom : dom.setError(el);
	dom.required = (selector, msg, msgtip) => dom.isRequired(dom.getInput(selector), msg, msgtip);
	dom.isLogin = (el, msg, msgtip) => (!el || i18n.login(el.name, el.value, msg, msgtip)) ? dom : dom.setError(el);
	dom.login = (selector, msg, msgtip) => dom.isLogin(dom.getInput(selector), msg, msgtip);
	dom.isEmail = (el, msg, msgtip) => (!el || i18n.email(el.name, el.value, msg, msgtip)) ? dom.val(i18n.getData(el.name), el) : dom.setError(el);
	dom.email = (selector, msg, msgtip) => dom.isEmail(dom.getInput(selector), msg, msgtip);
	dom.isUser = (el, msg, msgtip) => (!el || i18n.user(el.name, el.value, msg, msgtip)) ? dom.val(i18n.getData(el.name), el) : dom.setError(el);
	dom.user = (selector, msg, msgtip) => dom.isUser(dom.getInput(selector), msg, msgtip);
	dom.isIntval = (el, msg, msgtip) => (!el || i18n.intval(el.name, el.value, msg, msgtip)) ? dom : dom.setError(el);
	dom.intval = (selector, msg, msgtip) => dom.isIntval(dom.getInput(selector), msg, msgtip);
	dom.isGt0 = (el, msg, msgtip) => (!el || i18n.gt0(el.name, el.value, msg, msgtip)) ? dom : dom.setError(el);
	dom.gt0 = (selector, msg, msgtip) => dom.isGt0(dom.getInput(selector), msg, msgtip);
	dom.isGeToday = (el, msg, msgtip) => (!el || i18n.geToday(el.name, el.value, msg, msgtip)) ? dom : dom.setError(el);
	dom.geToday = (selector, msg, msgtip) => dom.isGeToday(dom.getInput(selector), msg, msgtip);

	// Extends internacionalization
	dom.tr = function(selector, opts) {
		const elements = dom.getAll(selector);
		i18n.set("size", elements.length); //size list
		return dom.each((el, i) => {
			i18n.set("index", i).set("count", i + 1);
			dom.render(el, tpl => i18n.format(tpl, opts));
		}, elements);
	}
	dom.parse = function(selector, data) {
		return dom.each(el => {
			el.outerHTML = sb.entries(data, el.outerHTML);
		}, dom.getAll(selector));
	}

	// Extends dom-box actions (require jquery)
	dom.ajax = function(action, resolve, reject) {
		return dom.loading().fetch({
			action: action,
			resolve: resolve || dom.showOk,
			reject: reject || dom.setErrors
		}).catch(dom.showError) //error handler
			.finally(dom.working); //allways
	}
	dom.send = function(form, resolve, reject) {
		let fd = new FormData(form);
		return dom.loading().fetch({
			action: form.action,
			method: form.method,
			body: (form.enctype == "multipart/form-data") ? fd : new URLSearchParams(fd),
			headers: { "Content-Type": form.enctype || "application/x-www-form-urlencoded" },
			resolve: resolve || dom.showOk,
			reject: reject || dom.setErrors
		}).catch(dom.showError) //error handler
			.finally(dom.working); //allways
	}
	dom.autocomplete = function(selector, opts) {
		const inputs = dom.getInputs(selector); //Autocomplete inputs
		let _search = false; //call source indicator (reduce calls)

		function fnFalse() { return false; }
		function fnParam(data) { return data; }
		function fnGetIds(el) { return dom.get("[type=hidden]", el.parentNode); }

		opts = opts || {}; //default config
		opts.action = opts.action || "#"; //request
		opts.minLength = opts.minLength || 3; //length to start
		opts.maxResults = opts.maxResults || 10; //max showed rows (default = 10)
		opts.delay = opts.delay || 500; //milliseconds between keystroke occurs and when a search is performed
		opts.open = opts.open || fnFalse; //triggered if the value has changed
		opts.focus = opts.focus || fnFalse; //no change focus on select
		opts.load = opts.load || fnFalse; //triggered when select an item
		opts.sort = opts.sort || fnParam; //sort array data received
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
			dom.ajax(opts.action + "?term=" + req.term, data => {
				res(opts.sort(data).slice(0, opts.maxResults));
			});
		};
		// Triggered when the field is blurred, if the value has changed
		opts.change = function(ev, ui) {
			if (!ui.item) { //item selected?
				dom.val("", this).val("", fnGetIds(this));
				opts.remove(this);
			}
		};
		$(inputs).autocomplete(opts);
		return dom.keydown((el, ev) => { // Reduce server calls, only for backspace or alfanum
			_search = (ev.keyCode == 8) || sb.between(ev.keyCode, 46, 111) || sb.between(ev.keyCode, 160, 223);
		}, inputs);
	}
	// Extends dom-box actions

	// Onclose event tab/browser of client user
	/*window.addEventListener("unload", ev => {
		//dom.ajax("/session/destroy.html");
	});*/

	// Set error input styles and reallocate focus
	dom.reverse(el => {
		const tip = dom.get(".ui-errtip", el.parentNode);
		dom.empty(tip) || dom.addClass("ui-error", el).focus(el);
	}, inputs);
});
