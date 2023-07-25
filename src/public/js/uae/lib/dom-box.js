
/**
 * Vanilla JS DOM-Box module, require:
 * ArrayBox (ab), NumberBox (nb), StringBox (sb) and i18nBox (i18n)
 * 
 * @module DomBox
 */
function DomBox(opts) {
	const self = this; //self instance
	const EMPTY = ""; //empty string
	const DIV = document.createElement("div");
	const TEXT = document.createElement("textarea");
	const CONFIG = {
		//maxFileSize: 6000000, //6MB
		classHide: "hide", // CSS class name
		classAlerts: "alerts", // parent container
		classAlertText: "alert-text",
		classAlertClose: "alert-close",
		classInputError: "ui-error",
		classTipError: "ui-errtip",
		//classSortNone: "sort-none",
		//classSortDesc: "sort-desc",
		//classSortAsc: "sort-asc",
		//classSortTable: "sort",
		classCheckList: "check-list",
		classCheckGroup: "check-group"
	}

	// Update congig
	Object.assign(CONFIG, opts);
	const TIP_ERR_SELECTOR = "." + CONFIG.classTipError;
	const CHEK_LIST_SELECTOR = "." + CONFIG.classCheckList;
	const CHEK_GROUP_SELECTOR = "." + CONFIG.classCheckGroup;

	const fnSelf = () => self;
	const fnParam = value => value; // return param value
	const fnValue = (obj, name) => obj[name]; // get prop.
	const fnLog = data => console.log("Log:", data); // Show log
	const fnSplit = str => str ? str.split(/\s+/) : []; // class separator
	const fnQuery = (elem, parent) => sb.isstr(elem) ? self.get(elem, parent) : elem;
	const fnQueryAll = list => sb.isstr(list) ? document.querySelectorAll(list) : list;

	this.get = (selector, el) => (el || document).querySelector(selector);
	this.getAll = (selector, el) => (el || document).querySelectorAll(selector);
	this.closest = (selector, el) => el && el.closest(selector);

	this.getNavLang = () => navigator.language || navigator.userLanguage; //default browser language
	this.getLang = () => document.documentElement.getAttribute("lang") || self.getNavLang(); //get lang by tag
	this.redir = (url, target) => { url && window.open(url, target || "_blank"); return self; };
	this.unescape = html => { TEXT.innerHTML = html; return TEXT.value; }
	this.escape = text => { DIV.innerHTML = text; return DIV.innerHTML; }
	this.scroll = function(el, win) {
		win = win || window; //window to apply scroll
		el = el || win.document.body; //destination elem
		el.scrollIntoView({ behavior: "smooth" }); //Scroll to destination with a slow effect
		return self;
	}
	this.fetch = function(opts) {
		opts = opts || {}; //default config
		opts.headers = opts.headers || {}; //init. headers
		opts.reject = opts.reject || fnLog;
		opts.resolve = opts.resolve || fnLog;
		opts.headers["x-requested-with"] = "XMLHttpRequest"; //add ajax header
		opts.headers["Authorization"] = "Bearer " + window.localStorage.getItem("jwt");
		return window.fetch(opts.action, opts).then(res => {
			let contentType = res.headers.get("content-type") || EMPTY; //response type
			let promise = (contentType.indexOf("application/json") > -1) ? res.json() : res.text(); //response
			return promise.then(res.ok ? opts.resolve : opts.reject); //ok = 200
		});
	}
	this.copyToClipboard = function(str) {
		TEXT.value = str;
		TEXT.select(); //select text
		document.execCommand("copy");
		return self;
	}

	// Iterators and Filters
	const fnEach = (list, fn) => fnSelf(ab.each(list, fn));
	this.each = function(list, fn) {
		if (list) // Is DOMElement, selector or NodeList
			(list.nodeType == 1) ? fn(list) : fnEach(fnQueryAll(list), fn);
		return self;
	}
	this.reverse = (list, cb) => { ab.reverse(list, cb); return self; }
	this.indexOf = (el, list) => ab.findIndex(list || el.parentNode.children, elem => (el == elem));
	this.findIndex = (selector, list) => ab.findIndex(list, el => el.matches(selector));
	this.find = (selector, list) => ab.find(list, el => el.matches(selector));
	this.toArray = list => [...fnQueryAll(list)];
	this.filter = (selector, list) => [...list].filter(el => el.matches(selector));
	this.apply = (selector, list, fn) => fnEach(list, (el, i) => el.matches(selector) && fn(el, i));
	this.sort = (list, cb)  => self.toArray(list).sort(cb);
	this.map = (list, cb)  => self.toArray(list).map(cb);
	this.values = list => self.map(list, el => el.value);

	this.prev = (el, selector) => {
		el = el.previousElementSibling;
		while (selector && el) {
			if (el.matches(selector))
				return el;
			el = el.previousElementSibling;
		}
		return el;
	}
	this.next = (el, selector) => {
		el = el.nextElementSibling;
		while (selector && el) {
			if (el.matches(selector))
				return el;
			el = el.nextElementSibling;
		}
		return el;
	}
	this.sibling = (el, selector) => self.prev(el, selector) || self.next(el, selector);
	this.children = (el, selector) => el.parentNode.querySelectorAll(selector);
	this.eachChild = (el, selector, fn) => self.apply(selector, el.children, fn);
	this.clear = el => {
		while (el.firstChild)
			el.removeChild(el.firstChild);
		return self;
	}

	// Inputs and focusables selectors
	const INPUTS = "input,textarea,select";
	const FOCUSABLE = "[tabindex]:not([type=hidden],[readonly],[disabled])";
	const fnVisible = el => (el.offsetWidth || el.offsetHeight || el.getClientRects().length);
	const fnFocus = input => (fnVisible(input) && input.matches(FOCUSABLE));

	this.inputs = el => self.getAll(INPUTS, el);
	this.focus = el => { el && el.focus(); return self; }
	this.checked = el => self.getAll("input:checked", el);
	this.checks = el => self.getAll("input[type=checkbox]", el);
	this.check = (list, value) => self.each(list, el => { el.checked = value; });
	this.getFormInputs = form => self.filter(INPUTS, self.getForm(form).elements);
	this.binary = (list, mask) => self.each(list, (el, i) => { el.checked = nb.mask(mask, i); });
	this.integer = list => {
		let aux = ""; // Binary string, for example: "01001011"
		self.reverse(list, el => { aux += el.checked ? "1" : "0"; });
		return parseInt(aux, 2); // Bin2Int
	}
	this.checkval = (el, group, value) => {
		el.value = value || 0; // force integer
		self.binary(group, el.value); // check/uncheck subgroup
		el.checked = (group.length == self.filter(":checked", group).length);
		return self;
	}

	// Inputs values
	function fnSetVal(el, value) {
		value = value ?? EMPTY; // define value as string
		if (el.tagName === "SELECT") // select option
			el.selectedIndex = self.findIndex("[value='" + value + "']", el.options);
		else if ((el.type === "checkbox") || (el.type === "radio"))
			el.checked = (el.value == value);
		else
			el.value = value;
		return self;
	}
	this.val = (list, value) => self.each(list, el => fnSetVal(el, value));
	this.clearInput = el => { el = self.getInput(el); el.focus(); return fnSetVal(el); }
	this.clearInputs = list => self.val(list).autofocus(list);
	this.clearForm = form => self.clearInputs(form.elements);

	// Elements attributes
	this.attr = (list, name, value) => self.each(list, el => el.setAttribute(name, value));
	this.removeAttr = (list, name) => self.each(list, el => el.removeAttribute(name));
	this.getAttr = function(el, name, parent) {
		el = fnQuery(el, parent); //find element
		return el && el.getAttribute(name);
	}
	this.setAttr = function(el, name, value, parent) {
		el = fnQuery(el, parent); //find element
		el && el.setAttribute(name, value);
		return self;
	}
	this.delAttr = function(el, name, parent) {
		el = fnQuery(el, parent); //find element
		el && el.removeAttribute(name);
		return self;
	}

	this.loadInputs = (inputs, data, parsers) => {
		parsers = parsers || {}; // Default container
		return self.each(inputs, el => {
			const fn = parsers[el.name] || fnParam; // Field parser type
			data[el.name] = fn(el.value); // Parse type
		});
	}
	this.displayInputs = (inputs, data, styles) => {
		const fnDate = value => sb.substring(value, 0, 10); // Value = string date time
		const TYPES = {
			"datetime": fnParam, //"number": fnParam, // Not to change style
			"date": fnDate, "week": fnDate, "month": fnDate // Styled for type=date
		};
		styles = styles || TYPES; // Optional styles

		return self.each(inputs, el => {
			if (el.classList.contains("check-group")) // Integer mask by checkboxes
				self.checkval(el, self.filter(".check-group-" + el.name, inputs), data[el.name]);
			else {
				const fn = TYPES[el.type] || styles[el.name] || fnParam; // Field style type
				fnSetVal(el, fn(data[el.name])); // Display styled value
			}
		});
	}
	this.load = (form, data, parsers) => self.loadInputs(self.getFormInputs(form), data, parsers);
	this.display = (form, data, styles) => self.displayInputs(self.getFormInputs(form), data, styles);

	function fnSetError(el) {
		const partner = self.sibling(el, INPUTS); // Partner element
		const tip = self.sibling(el, TIP_ERR_SELECTOR); // Show tip error
		return self.showError(i18n.getError()).setHtml(tip, i18n.getMsg(el.name)).show(tip)
					.addClass(el, CONFIG.classInputError).addClass(partner, CONFIG.classInputError)
					.focus(fnVisible(el) ? el : partner);
	}
	function fnValidate(inputs, validators, messages) {
		return self.closeAlerts().reverse(inputs, el => { // Reverse iterator
			const fn = validators[el.name] || fnSelf; // Validator function
			const msgtip = messages[el.name] || validators[el.name + "Error"];
			fn(el.name, el.value, messages.msgError, msgtip) || fnSetError(el);
		}).isOk();
	}
	this.setInputError = (el, msg, msgtip, fn) => {
		el = self.getInput(el); // Get input
		if (!el) // If no input => ok
			return self;
		if (!fn) { // Update i18n error and show message
			i18n.setError(msg, el.name, msgtip); //i18n
			return fnSetError(el); // Restyle element
		}
		return fn(el.name, el.value, msg, msgtip) ? self : fnSetError(el);
	}
	this.validateInputs = (inputs, validators, messages) => {
		validators = validators || {}; // Default container
		messages = messages || {}; // View messages

		messages.msgError = messages.msgError || validators.msgError;
		return fnValidate(inputs, validators, messages);
	}
	this.validate = (form, validators, messages) => {
		form = self.getForm(form); // Get form
		validators = validators || {}; // Default container
		messages = messages || {}; // View messages

		const key = form.getAttribute("id") + "FormError"; // Specific key error message
		messages.msgError = messages[key] || validators[key] || messages.msgError || validators.msgError;
		return fnValidate(self.filter(INPUTS, form.elements), validators, messages);
	}

	function fnSetText(el, value) {
		el.classList.toggle(CONFIG.classHide, !value);
		el.innerText = value;
		return self;
	}
	this.getText = function(el, parent) {
		el = fnQuery(el, parent); //find element
		return el && el.innerText; //text
	}
	this.setText = function(el, value, parent) {
		el = fnQuery(el, parent); //find element
		return el ? fnSetText(el, value ?? EMPTY) : self;
	}
	this.text = function(list, value) {
		value = value ?? EMPTY; // define value as string
		return self.each(list, el => fnSetText(el, value));
	}

	function fnSetHtml(el, value) {
		el.classList.toggle(CONFIG.classHide, !value);
		el.innerHTML = value;
		return self;
	}
	this.getHtml = function(el, parent) {
		el = fnQuery(el, parent); //find element
		return el && el.innerHTML; //html
	}
	this.setHtml = function(el, value, parent) {
		el = fnQuery(el, parent); //find element
		return el ? fnSetHtml(el, value ?? EMPTY) : self;
	}
	this.html = function(list, value) {
		value = value ?? EMPTY; // define value as string
		return self.each(list, el => fnSetHtml(el, value));
	}

	this.mask = (list, mask, name) => self.each(list, (el, i) => el.classList.toggle(name, nb.mask(mask, i))); //toggle class by mask
	this.view = (list, mask) => self.mask(list, ~mask, CONFIG.classHide); //toggle hide class by mask
	this.select = function(list, mask) {
		return self.each(list, el => { //iterate over all selects
			const option = el.options[el.selectedIndex]; //get current option
			if (self.view(el.options, mask).hasClass(option, CONFIG.classHide)) //option hidden => force change
				el.selectedIndex = self.findIndex(":not(.hide)", el.options);
		});
	}

	this.empty = el => !el || !el.innerHTML || (el.innerHTML.trim() === EMPTY);
	this.add = (node, list) => self.each(list, el => node.appendChild(el));
	this.append = function(text, list) {
		list = list || document.body;
		return self.each(list, el => {
			DIV.innerHTML = text; // As clone
			self.add(el, DIV.childNodes);
		});
	}

	// Format and parse contents
	const TEMPLATES = {}; //container
	this.getTpl = name => TEMPLATES[name];
	this.setTpl = (name, tpl) => { TEMPLATES[name] = tpl; return self; }
	this.loadTemplates = () => self.each("template[id]", tpl => self.setTpl(tpl.id, tpl.innerHTML));
	this.render = function(el, formatter) {
		el.id = el.id || ("_" + sb.rand()); // force unique id for element
		let key = el.dataset.tpl || el.id; // tpl asociated
		TEMPLATES[key] = TEMPLATES[key] || el.innerHTML;
		return fnSetHtml(el, formatter(TEMPLATES[key]));
	}
	this.format = (selector, data, opts) => {
		const elements = fnQueryAll(selector);
		data.size = elements.length; //reuse object
		ab.each(elements, (el, i) => {
			data.index = i;
			data.count = i + 1;
			self.render(el, tpl => sb.format(data, tpl, opts));
		});
		return self;
	}
	this.tr = (selector, opts) => self.format(selector, i18n.getLang(), opts); // Extends internacionalization
	this.replace = (selector, value) => self.each(selector, el => { el.outerHTML = value; });
	this.parse = (selector, formatter)  => self.each(selector, el => { el.outerHTML = formatter(el.outerHTML); });

	// Styles
	const isHide = el => el.classList.contains(CONFIG.classHide);
	const fnShow = el => el.classList.remove(CONFIG.classHide);
	const fnHide = el => el.classList.add(CONFIG.classHide);

	this.isVisible = el => el && fnVisible(el);
	this.visible = (el, parent) => self.isVisible(fnQuery(el, parent));
	this.show = list => self.each(list, fnShow);
	this.hide = list => self.each(list, fnHide);
	this.hasClass = (el, names) => el && fnSplit(names).some(name => el.classList.contains(name));
	this.addClass = function(list, names) {
		names = fnSplit(names); // Split value by " " (class separator)
		return self.each(list, el => names.forEach(name => el.classList.add(name)));
	}
	this.removeClass = function(list, names) {
		names = fnSplit(names); // Split value by " " (class separator)
		return self.each(list, el => names.forEach(name => el.classList.remove(name)));
	}
	this.toggle = function(list, names, force) {
		names = fnSplit(names); // Split value by " " (class separator)
		return self.each(list, el => names.forEach(name => el.classList.toggle(name, force)));
	}
	this.toggleHide = (list, force) => self.toggle(list, CONFIG.classHide, force);
	this.toggleLink = (el, force) => self.toggleHide(".info-" + el.id, force).setFocus(el.parentNode);

	this.css = function(list, prop, value) {
		const camelProp = prop.replace(/(-[a-z])/, g => g.replace("-", EMPTY).toUpperCase());
		return self.each(list, el => { el.style[camelProp] = value; });
	}

	// Animatios
	function fnAnimateClass(el, name, opts) {
		opts.once = true; // fired once
		opts.onstart(el); // before animation
		el.addEventListener("animationend", ev => {
			el.classList.remove(name);
			opts.onfinish(el, ev);
		}, opts);
		el.classList.add(name);
	}
	this.animate = function(list, keyframes, opts) {
		opts = Object.assign({ duration: 1000, onfinish: fnSelf }, opts);
		return self.each(list, el => el.animate(keyframes, opts).onfinish(opts.onfinish));
	}
	this.animateClass = function(list, name, opts) {
		opts = Object.assign({ onstart: fnSelf, onfinish: fnSelf }, opts);
		return self.each(list, el => fnAnimateClass(el, name, opts));
	}
	this.animateIn = function(list, name) {
		const opts = { onstart: fnShow, onfinish: fnSelf };
		return self.each(list, el => fnAnimateClass(el, name, opts));
	}
	this.animateOut = function(list, name) {
		const opts = { onstart: fnSelf, onfinish: fnHide };
		return self.each(list, el => { isHide(el) || fnAnimateClass(el, name, opts); });
	}
	this.animateToggle = function(list, nameIn, nameOut) {
		const optsIn = { onstart: fnShow, onfinish: fnSelf };
		const optsOut = { onstart: fnSelf, onfinish: fnHide };
		return self.each(list, el => (isHide(el) ? fnAnimateClass(el, nameIn, optsIn) : fnAnimateClass(el, nameOut, optsOut)));
	}
	this.fadeIn = list => self.animateIn(list, "fadeIn");
	this.fadeOut = list => self.animateOut(list, "fadeOut");
	this.fadeToggle = list => self.animateToggle(list, "fadeIn", "fadeOut");
	this.slideIn = list => self.animateIn(list, "slideIn");
	this.slideOut = list => self.animateOut(list, "slideOut");
	this.slideToggle = list => self.animateToggle(list, "slideIn", "slideOut");

	// Events
	const ON_CHANGE = "change";
	const fnEvent = (el, name, i, fn, opts) => fnSelf(el.addEventListener(name, ev => fn(el, ev, i) || ev.preventDefault(), opts));
	const fnAddEvent = (el, name, fn, opts) => (el ? fnEvent(el, name, 0, fn, opts) : self);
	const fnAddEvents = (selector, list, name, fn) => self.apply(selector, list, (el, i) => fnEvent(el, name, i, fn));

	this.event = (el, name, fn) => fnAddEvent(fnQuery(el), name, fn);
	this.events = (list, name, fn) => self.each(list, (el, i) => fnEvent(el, name, i, fn));
	this.ready = fn => fnEvent(document, "DOMContentLoaded", 0, fn);
	this.trigger = function(el, name, detail) {
		fnQuery(el).dispatchEvent(detail ? new CustomEvent(name, { detail }) : new Event(name));
		return self;
	}

	this.click = (list, fn) => self.each(list, (el, i) => fnEvent(el, "click", i, fn));
	this.addClick = (el, fn) => fnAddEvent(fnQuery(el), "click", fn);
	this.onclick = this.onClick = self.click;

	this.change = (list, fn) => self.each(list, (el, i) => fnEvent(el, ON_CHANGE, i, fn));
	this.onchange = this.onChange = self.change;

	this.keyup = (list, fn) => self.each(list, (el, i) => fnEvent(el, "keyup", i, fn));
	this.onkeyup = this.onKeyup = self.keyup;

	this.keydown = (list, fn) => self.each(list, (el, i) => fnEvent(el, "keydown", i, fn));
	this.onkeydown = this.onKeydown = self.keydown;

	this.submit = (list, fn) => self.each(list, (el, i) => fnEvent(el, "submit", i, fn));
	this.onsubmit = this.onSubmit = self.submit;

	this.ready(function() {
		const elements = self.getAll(".tab-content,table,form," + INPUTS);
		const tabs = self.filter(".tab-content", elements); //all tabs
		const tables = self.filter("table", elements); //all html tables
		const forms = self.filter("form", elements); //all html forms
		const inputs = self.filter(INPUTS, elements); //all html inputs

		self.isOk = i18n.isOk;
		self.isError = i18n.isError;
		self.loading = self.working = fnSelf;

		// Alerts handlers
		const alerts = self.get("." + CONFIG.classAlerts);
		const texts = self.getAll("." + CONFIG.classAlertText, alerts);
		const showAlert = el => self.fadeIn(el.parentNode);
		const closeAlert = el => self.fadeOut(el.parentNode);
		const setAlert = (el, txt) => txt ? showAlert(el).setHtml(el, txt).scroll() : self;

		self.showOk = msg => setAlert(texts[0], msg); //green
		self.showInfo = msg => setAlert(texts[1], msg); //blue
		self.showWarn = msg => setAlert(texts[2], msg); //yellow
		self.showError = msg => setAlert(texts[3], msg); //red
		self.showAlerts = function(msgs) { //show posible multiple messages types
			return msgs ? self.showOk(msgs.msgOk).showInfo(msgs.msgInfo).showWarn(msgs.msgWarn).showError(msgs.msgError) : self;
		}
		self.closeAlerts = function() { // Hide all alerts
			i18n.start(); // Reinit error counter
			const tips = self.getAll(TIP_ERR_SELECTOR); //tips messages
			return self.each(texts, closeAlert).removeClass(inputs, CONFIG.classInputError).html(tips, "").hide(tips);
		}

		self.setOk = (form, msg) => self.showOk(msg).clearForm(form);
		self.setErrors = function(data) {
			self.closeAlerts(); //close prev errros
			if (sb.isstr(data)) //Is string
				return self.showError(data);
			for (const k in data) //errors list
				self.setInputError("[name='" + k + "']", null, data[k]);
			return self.showAlerts(data); //show global menssages
		}

		// Show posible server messages and close click event
		self.each(texts, el => { el.firstChild && showAlert(el); })
			.click(self.getAll("." + CONFIG.classAlertClose, alerts), closeAlert);

		// Tables, Forms and Inputs helpers
		self.getTable = elem =>  sb.isstr(elem) ? self.find(elem, tables) : elem;
		self.getTables = elem => elem ? self.filter(elem, tables) : tables;
		self.getForm = elem =>  sb.isstr(elem) ? self.find(elem, forms) : elem;
		self.getForms = elem => elem ? self.filter(elem, forms) : forms;
		self.getInput = elem => sb.isstr(elem) ? self.find(elem, inputs) : elem;
		self.getInputs = elem => elem ? self.filter(elem, inputs) : inputs;

		self.eachInput = (selector, fn) => self.apply(selector, inputs, fn);
		self.getValue = el => { el = self.getInput(el); return el && el.value; }
		self.setValue = (el, value) => { el = self.getInput(el); return el ? fnSetVal(el, value) : self; }
		self.setValues = (selector, value) => self.apply(selector, inputs, input => fnSetVal(input, value));
		self.copyVal = (i1, i2) => self.setValue(i1, self.getValue(i2));
		self.setAttrInput = (selector, name, value) => self.setAttr(self.getInput(selector), name, value);
		self.setAttrInputs = (selector, name, value) => self.apply(selector, inputs, input => input.setAttribute(name, value));
		self.setReadonly = (selector, value) => self.apply(selector, inputs, input => { input.readOnly = value; });
		self.setDisabled = (selector, value) => self.apply(selector, inputs, input => { input.disabled = value; });
		self.delAttrInput = (selector, name) => self.delAttr(self.getInput(selector), name);
		self.delAttrInputs = (selector, name) => self.apply(selector, inputs, input => input.removeAttribute(name));
		self.getOptText = select => { select = self.getInput(select); return select && self.getText(select.options[select.selectedIndex]); }
		self.swapAttr = (selector, a1, a2) => self.apply(selector, inputs, input => { input.setAttribute(a2, input.getAttribute(a1)); input.removeAttribute(a1); });
		self.setInput = (selector, value, fnChange) => {
			const el = self.getInput(selector);
			if (el) {
				fnEvent(el, ON_CHANGE, 0, fnChange);
				fnSetVal(el, value);
			}
			return self;
		}

		self.setFocus = el => self.focus(sb.isstr(el) ? self.find(el, inputs) : ab.find(self.inputs(el), fnFocus));
		self.autofocus = elements => self.focus(ab.find(elements || inputs, fnFocus)); // Set focus on first visible input
		self.autofocus().reverse(inputs, el => { // Initial focus or reallocate in first error
			const tip = self.get(TIP_ERR_SELECTOR, el.parentNode); // Has error tip
			self.empty(tip) || self.show(tip).addClass(el, CONFIG.classInputError).focus(el);
		});

		self.onChangeForm = (selector, fn) => fnAddEvent(self.getForm(selector), ON_CHANGE, fn);
		self.onSubmitForm = (selector, fn) => fnAddEvent(self.getForm(selector), "submit", fn);
		self.beforeResetForm = (selector, fn) => fnAddEvent(self.getForm(selector), "reset", fn);
		self.afterResetForm = (selector, fn) => fnAddEvent(self.getForm(selector), "reset", (form, ev) => setTimeout(() => fn(form, ev), 1));
		self.onChangeForms = (selector, fn) => fnAddEvents(selector, forms, ON_CHANGE, fn);
		self.onSubmitForms = (selector, fn) => fnAddEvents(selector, forms, "submit", fn);

		self.onBlurInput = (selector, fn) => fnAddEvent(self.getInput(selector), "blur", fn);
		self.onChangeInput = (selector, fn) => fnAddEvent(self.getInput(selector), ON_CHANGE, fn);
		self.onChangeInputs = (selector, fn) => fnAddEvents(selector, inputs, ON_CHANGE, fn);
		self.onChangeSelect = (selector, fn) => self.apply(selector, inputs, (el, i) => { fn(el); fnEvent(el, ON_CHANGE, i, fn); });
		self.onChangeFile = (selector, fn) => {
			const reader = new FileReader();
			const el = self.getInput(selector);

			return fnAddEvent(el, ON_CHANGE, ev => {
				let index = 0; // position
				let file = el.files[index];
				const fnRead = () => reader.readAsBinaryString(file); //reader.readAsText(file, "UTF-8");
				reader.onload = ev => { // event on load file
					fn(el, file, ev.target.result, index);
					file = el.files[++index];
					file && fnRead();
				}
				file ? fnRead() : fn(el);
			});
		}
	
		self.setRangeDate = (f1, f2) => {
			return self.onBlurInput(f1, el => self.setAttrInput(f2, "min", el.value))
						.onBlurInput(f2, el => self.setAttrInput(f1, "max", el.value));
		}

		/**************** Tables/rows helper ****************/
		self.getCheckRows = selector => self.checks(self.getTable(selector));
		self.getCheckedRows = selector => self.checked(self.getTable(selector));
		self.onTable = (selector, name, fn) => fnAddEvent(self.getTable(selector), name, fn);
		self.onFindRow = (selector, fn) => self.onTable(selector, "find", fn);
		self.onRemoveRow = (selector, fn) => self.onTable(selector, "remove", fn);
		self.onChangeTable = (selector, fn) => self.onTable(selector, ON_CHANGE, fn);
		self.onChangeTables = (selector, fn) => fnAddEvents(selector, tables, ON_CHANGE, fn);
		self.onRenderTable = (selector, fn) => self.onTable(selector, "render", fn);
		self.afterRenderTable = (selector, fn) => self.onTable(selector, "rendered", fn);
		self.onRenderTables = (selector, fn) => fnAddEvents(selector, tables, "render", fn);
		self.onPaginationTable = (selector, fn) => self.onTable(selector, "pagination", fn);

		function fnToggleTbody(table) {
			const list = table.tBodies; // Bodies list
			if (list[0].children.length) // Has data rows?
				self.show(list[0]).hide(list[1]);
			else
				self.hide(list[0]).show(list[1]);
		}
		function fnRendetTfoot(table, resume, styles) {
			// Trigger event after change data and before render it, after redraw footer
			return self.trigger(table, "render").render(table.tFoot, tpl => sb.format(resume, tpl, styles));
		}
		self.tfoot = function(table, resume, styles) {
			table = self.getTable(table); // find table on tables array
			return table ? fnRendetTfoot(table, resume, styles) : self; // Render footer
		}

		function fnRenderRows(table, data, resume, styles) {
			// Recalc table page indexes
			resume.total = data.length;
			resume.index = resume.index || 0; //default=0
			resume.start = resume.start || 0; //default=0
			resume.pageSize = resume.pageSize || 99; //max=99
			resume.sortDir = table.dataset.sortDir;
			resume.sortBy = table.dataset.sortBy;
			resume.end = resume.start + resume.pageSize;
			resume.page = +(resume.start / resume.pageSize);

			if (resume.sortBy) { // Sort full array, default sort by string
				const fnSort = resume.sort || ((a, b) => sb.cmpBy(a, b, resume.sortBy));
				ab.sort(data, resume.sortDir, fnSort); // Sort before paginate
			}
			else {
				const links = self.getAll(".sort", table.tHead); // Reset orderable links
				self.removeClass(links, "sort-asc sort-desc").addClass(links, "sort-none");
			}
			const aux = (resume.pageSize < resume.total) ? data.slice(resume.start, resume.end) : data;
			resume.size = aux.length; // Num page rows

			styles = styles || {}; // Default styles
			styles.getValue = styles.getValue || i18n.val;

			const tbody = table.tBodies[0]; // Data rows
			fnRendetTfoot(table, resume, styles); // First render footer
			self.render(tbody, tpl => ab.format(aux, tpl, styles)).trigger(table, "rendered"); // Render rows
			fnToggleTbody(table); // Toggle body if no data
			fnPagination(table, data, resume, styles); // Render asociated pages

			// Listeners for change, find and remove events
			return self.change(tbody.children, (row, ev, i) => {
				resume.row = row; // TR parent row
				resume.index = resume.start + i; // Real index
				resume.data = data[resume.index]; // Current data row
				resume.element = ev.target; // Element to trigger event
				self.trigger(table, "change-" + ev.target.name, resume); // Specific change event
			}).change(table.tFoot.children, (row, ev, i) => {
				resume.row = row; // TR parent row
				resume.index = i; // Real index
				resume.data = null; // no data
				resume.element = ev.target; // Element to trigger event
				self.trigger(table, "change-" + ev.target.name, resume); // Specific change event
			}).click(self.getAll("a[href]", tbody), el => {
				resume.row = el.closest("tr"); // TR parent row
				resume.index = resume.start + self.indexOf(resume.row); // Real index
				resume.data = data[resume.index]; // Current data row
				resume.element = el; // Element to trigger event
				const name = el.getAttribute("href"); // Name event
				if (name == "#remove") // Remove row link
					fnRemoveRow(table, data, resume, styles);
				else if (sb.starts(name, "#find")) // Is find event?
					self.trigger(table, name.substring(1), resume);
			});
		}
		function fnPagination(table, data, resume, styles) {
			const pagination = self.next(table, ".pagination"); // Pag section
			const pages = Math.ceil(resume.total / resume.pageSize); // Num pages
			if ((resume.pageSize < 1) || !pagination)
				return; // Guard clausule

			let output = ""; // Output buffer
			function addControl(i, text) {
				i = nb.range(i, 0, pages - 1); // Close range limit
				output += '<a href="#' + i + '">' + text + '</a>';
			}
			function addPage(i) {
				i = nb.range(i, 0, pages - 1); // Close range limit
				output += '<a href="#' + i + '"';
				output += (i == resume.page) ? ' class="active">' : '>';
				output += (i + 1) + '</a>';
			}

			if (pages > 1) {
				let i = 0; // Index
				addControl(resume.page - 1, "&laquo;");
				(pages > 1) && addPage(0);
				i = Math.max(resume.page - 3, 1);
				(i >= 2) && addControl(i - 1, "...");
				let max = Math.min(resume.page + 3, pages - 1);
				while (i <= max)
					addPage(i++);
				(i < (pages - 1)) && addControl(i, "...");
				(i < pages) && addPage(pages - 1);
				addControl(resume.page + 1, "&raquo;");
				pagination.innerHTML = output;

				// Reload pagination click event
				self.click(self.getAll("a", pagination), el => {
					resume.page = sb.lastId(el.href); // Current page
					resume.start = resume.page * resume.pageSize; // Start page index
					resume.end = resume.start + resume.pageSize; // End page index
					fnRenderRows(table, data, resume, styles) // Render full table
					self.trigger(table, "pagination", resume); // Trigger event
				});
			}
			else
				pagination.innerHTML = output;
		}
		function fnRemoveRow(table, data, resume, styles) {
			// Confirm, close prev. alerts and trigger remove event
			let ok = table && data && i18n.confirm(styles?.remove || "remove");
			if (ok && self.closeAlerts().trigger(table, "remove", resume.data).isOk()) {
				data.splice(resume.index, 1); // Remove data row
				resume.start = (resume.size > 1) ? resume.start : 0; // If empty Page => Go first page
				fnRenderRows(table, data, resume, styles); // Build table rows
			}
			return self;
		}

		self.table = function(table, data, resume, styles) {
			table = self.getTable(table); // Search table
			return table ? fnRenderRows(table, data, resume, styles) : self;
		}
		function fnDisplayRow(form, resume, styles, row, index) {
			resume.index = index; // Current position
			resume.data = row; // Current data row
			delete resume.row; // Not row selected
			return self.display(form, row, styles);
		}
		self.selectRow = function(form, data, resume, styles, index) {
			index = nb.range(index, 0, data.length - 1); // close range
			return fnDisplayRow(form, resume, styles, data[index], index);
		}
		self.createRow = (form, resume, styles, row) => fnDisplayRow(form, resume, styles, row, -1);
		self.removeRow = (table, data, resume, styles) => fnRemoveRow(self.getTable(table), data, resume, styles);

		self.repaginate = function(table, data, resume, styles) {
			resume.start = 0; // Go first page
			return self.table(table, data, resume, styles);
		}
		self.updateTable = function(table, data, resume, styles) {
			table = self.getTable(table); // Search table
			if (table) {
				delete table.dataset.sortBy; // Update state list
				fnRenderRows(table, data, resume, styles);
			}
			return self;
		}
		self.clearTable = function(table, data, resume, styles) {
			data.splice(0); // Clear array data
			resume.index = resume.start = 0; // Update index
			return self.updateTable(table, data, resume, styles);
		}

		// Table acctions synonyms
		self.renderTables = self.tables = self.list;
		self.renderRows = self.renderTable = self.table;
		self.renderTfoot = self.tFoot = self.tfoot;
		self.startPagination = self.repaginate;

		// Initialize all tables
		ab.each(tables, table => {
			const links = self.getAll(".sort", table.tHead); // All orderable columns
			function fnToggleOrder(link) { // Update all sort icons
				self.removeClass(links, "sort-asc sort-desc") // Remove prev order
					.addClass(links, "sort-none") // Reset all orderable columns
					.toggle(link, "sort-none sort-" + table.dataset.sortDir); // Column to order table
			}

			if (table.dataset.sortDir) // Ordered column and sort direction
				fnToggleOrder(self.find("a[href='#" + table.dataset.sortBy + "']", links));

			// Add click event for order table
			self.click(links, el => { // Sort event click
				table.dataset.sortDir = self.hasClass(el, "sort-asc") ? "desc" : "asc"; // Toggle sort direction
				table.dataset.sortBy = el.getAttribute("href").substring(1); // Column name
				// First fire specific column sort event and after common sort event
				self.trigger(table, "sort-" + table.dataset.sortBy).trigger(table, "sort");
				fnToggleOrder(el); // Update all sort icons
			});

			fnToggleTbody(table); // Toggle body if no data
		});
		/**************** Tables/rows helper ****************/

		/**************** Tabs helper ****************/
		let _tabIndex = self.findIndex(".active", tabs); //current index tab
		let _tabSize = tabs.length - 1; // max tabs size
		let _backTab = _tabIndex; // back to previous tab
		let _tabMask = ~0; // all 11111....

		self.getTabs = () => tabs; //all tabs
		self.getTab = id => self.find("#tab-" + id, tabs); // Find by id selector
		self.setTabMask = mask => { _tabMask = mask; return self; } // set mask for tabs
		self.lastId = (str, max) => nb.max(sb.lastId(str) || 0, max || 99); // Extract id

		self.onTab = (id, name, fn, opts) => fnAddEvent(self.getTab(id), name, fn, opts);
		self.onPrevTab = (id, fn) => self.onTab(id, "prev-tab", fn);
		self.onLoadTab = (id, fn) => self.onTab(id, "show-tab", fn, { once: true });
		self.onShowTab = (id, fn) => self.onTab(id, "show-tab", fn);
		self.onNextTab = (id, fn) => self.onTab(id, "next-tab", fn);
		self.onChangeTab = (id, fn) => self.onTab(id, ON_CHANGE, fn);

		function fnShowTab(i) { //show tab by index
			self.closeAlerts(); // always close alerts
			i = nb.range(i, 0, _tabSize); // Force range
			if (i == _tabIndex) // is current tab
				return self; // nothing to do
			const tab = tabs[i]; // get next tab
			// Trigger prev or next tab event and after show tab event (show-tab) and change tab if all ok
			if (self.trigger(tabs[_tabIndex], (i < _tabIndex) ? "prev-tab" : "next-tab").isOk() && self.trigger(tab, "show-tab").isOk()) {
				const progressbar = self.get("#progressbar");
				if (progressbar) { // progressbar is optional
					const step = "step-" + i; //go to a specific step on progressbar
					self.each(progressbar.children, li => self.toggle(li, "active", li.id <= step));
				}
				_backTab = _tabIndex; // save from
				_tabIndex = i; // set current index
				self.removeClass(tabs, "active").addClass(tab, "active") // set active tab
					.setFocus(tab).scroll(); // Auto set focus and scroll
			}
			return self;
		}

		self.viewTab = id => fnShowTab(self.findIndex("#tab-" + id, tabs)); //find by id selector
		self.lastTab = () => fnShowTab(_tabSize);
		self.backTab = () => fnShowTab(_backTab);
		self.prevTab = () => { // Ignore 0's mask tab
			for (var i = _tabIndex - 1; !nb.mask(_tabMask, i) && (i > 0); i--);
			return fnShowTab(i); // Show calculated prev tab
		}
		self.nextTab = () => { // Ignore 0's mask tab
			for (var i = _tabIndex + 1; !nb.mask(_tabMask, i) && (i < _tabSize); i++);
			return fnShowTab(i); // Show calculated next tab
		}

		if (_tabSize > 0) { // Has view tabs?
			self.onclick("a[href='#back-tab']", () => !self.backTab())
				.onclick("a[href='#prev-tab']", el => !self.setTabMask(+(el.dataset.mask ?? _tabMask)).prevTab())
				.onclick("a[href='#next-tab']", el => !self.setTabMask(+(el.dataset.mask ?? _tabMask)).nextTab())
				.onclick("a[href='#last-tab']", () => !self.lastTab())
				.onclick("a[href^='#tab-']", el => !self.viewTab(self.lastId(el.href)));
		}

		// Auto check inputs groups
		self.eachInput(CHEK_GROUP_SELECTOR, el => {
			const group = self.getInputs(CHEK_GROUP_SELECTOR + "-" + el.id);
			self.checkval(el, group, +el.value)
				.click(el, aux => { el.value = self.check(group, el.checked).integer(group); return true; })
				.click(group, aux => self.checkval(el, group, self.integer(group)));
		}).eachInput(CHEK_LIST_SELECTOR, el => {
			const group = self.getInputs(CHEK_LIST_SELECTOR + "-" + el.id);
			self.click(el, aux => self.check(group, el.checked))
				.click(group, aux => { el.checked = ab.every(group, el => el.checked); return true; });
		});

		// Clipboard function
		TEXT.style.position = "absolute";
		TEXT.style.left = "-9999px";
		document.body.prepend(TEXT);
	});
}
