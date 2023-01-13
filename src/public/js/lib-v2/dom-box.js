
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
		classCheckGroup: "check-group"
	}

	// Update congig
	Object.assign(CONFIG, opts);
	const TIP_ERR_SELECTOR = "." + CONFIG.classTipError;
	const CHEK_GROUP_SELECTOR = "." + CONFIG.classCheckGroup;

	const fnSelf = () => self;
	const fnParam = value => value; // return param value
	const fnValue = (obj, name) => obj[name]; // get prop.
	const fnSplit = str => str ? str.split(/\s+/) : []; // class separator
	const fnQuery = elem => sb.isstr(elem) ? document.querySelector(elem) : elem;
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
	this.copyToClipboard = function(str) {
		TEXT.value = str;
		TEXT.select(); //select text
		document.execCommand("copy");
		return self;
	}

	// AJAX calls
	this.fetch = function(opts) {
		self.loading(); //show loading...
		//opts = opts || {}; //default config
		opts.headers = opts.headers || {}; //init. headers
		opts.headers["x-requested-with"] = "XMLHttpRequest"; //add ajax header
		var token = window.sessionStorage.getItem(opts.tokenName);
		if (token) // token to be sended to server
			opts.headers["Authorization"] = "Bearer " + token;
		return window.fetch(opts.action, opts).then(res => {
			if (!res.ok) // status ok = 200
				return Promise.reject("Error " + res.status + " " + res.url);
			token = res.headers.get(opts.tokenName);
			if (token) // token to be returned to server
				window.sessionStorage.setItem(opts.tokenName, token);
			const contentType = res.headers.get("content-type") || EMPTY; //response type
			return contentType.includes("application/json") ? res.json() : res.text(); //response
		}).catch(self.showError).finally(self.working); //set error handler and close loading...
	}
	this.send = function(form, method, tokenName) {
		const fd = new FormData(form);
		const opts = { action: form.action };
		opts.method = method || form.method; //method-override
		opts.tokenName = tokenName || form.dataset.tokenName; //jwt name
		opts.body = (form.enctype == "multipart/form-data") ? fd : new URLSearchParams(fd);
		opts.headers = { "Content-Type": form.enctype || "application/x-www-form-urlencoded" };
		return self.fetch(opts).then(msg => self.setOk(form, msg)).catch(self.setErrors);
	}

	function fnFetchJSON(action, method, data) { // CREATE
		const opts = { action, method, body: JSON.stringify(data) };
		opts.headers = { "Content-Type": "application/json; charset=utf-8" };
		return self.fetch(opts).catch(self.setErrors);
	}
	this.api = { // API REST full ej: https://jsonplaceholder.typicode.com/users
		get: action => self.fetch({ action }), // READ
		post: (action, data) => fnFetchJSON(action, "POST", data), // CREATE
		put: (action, data) => fnFetchJSON(action, "PUT", data), // UPDATE
		patch: (action, data) => fnFetchJSON(action, "PATCH", data), // PATCH
		delete: action => self.fetch({ action, method: "DELETE" }) //DELETE
	};

	// Iterators and Filters
	this.each = function(list, fn) {
		if (list) {
			if (list.nodeType === 1)
				fn(list); // Is DOMElement
			else // Is Selector or NodeList
				ab.each(fnQueryAll(list), fn);
		}
		return self;
	}
	this.reverse = (list, cb) => { ab.reverse(list, cb); return self; }
	this.indexOf = (el, list) => ab.findIndex(list || el.parentNode.children, elem => (el == elem));
	this.findIndex = (selector, list) => ab.findIndex(list, el => el.matches(selector));
	this.find = (selector, list) => ab.find(list, el => el.matches(selector));
	this.toArray = list => [...fnQueryAll(list)];
	this.filter = (selector, list) => [...list].filter(el => el.matches(selector));
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
	this.clear = el => {
		while (el.firstChild)
			el.removeChild(el.firstChild);
		return self;
	}

	// Inputs and focusables selectors
	const INPUTS = "input,textarea,select";
	const fnVisible = el => (el.offsetWidth || el.offsetHeight || el.getClientRects().length);
	const fnFocus = input => (fnVisible(input) && input.matches("[tabindex]:not([type=hidden],[readonly],[disabled])"));

	this.inputs = el => self.getAll(INPUTS, el);
	this.focus = el => { el && el.focus(); return self; }
	this.checked = el => self.getAll("input:checked", el);
	this.checks = el => self.getAll("input[type=checkbox]", el);
	this.check = (list, value) => self.each(list, input => { input.checked = value; });
	this.setReadonly = (list, value) => self.each(list, input => { input.readOnly = value; });
	this.setDisabled = (list, value) => self.each(list, input => { input.disabled = value; });
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
		el.checked = ab.every(group, el => el.checked);
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
	this.getValue = el => el && el.value;
	this.getVal = selector => self.getValue(fnQuery(selector));
	this.setValue = (el, value) => el ? fnSetVal(el, value) : self;
	this.setVal = (selector, value) => self.setValue(fnQuery(selector), value);
	this.setValues = (list, value) => self.each(list, input => fnSetVal(input, value));
	this.val = (list, value) => self.each(list, el => fnSetVal(el, value));
	this.clearInputs = list => self.val(list).autofocus(list);
	this.clearForm = form => self.clearInputs(form.elements);

	// Elements attributes
	this.getAttribute = (el, name) => el && el.getAttribute(name);
	this.getAttr = (el, name) => self.getAttribute(fnQuery(el), name);
	this.setAttribute = (el, name, value) => el && el.setAttribute(name, value);
	this.setAttr = (el, name, value) => self.setAttribute(fnQuery(el), name, value);
	this.attr = (list, name, value) => self.each(list, el => el.setAttribute(name, value));
	this.removeAttr = (list, name) => self.each(list, el => el.removeAttribute(name));

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
			if (el.classList.contains(CONFIG.classCheckGroup)) // Integer mask by checkboxes
				self.checkval(el, self.filter(CHEK_GROUP_SELECTOR + "-" + el.name, inputs), data[el.name]);
			else {
				const fn = TYPES[el.type] || styles[el.name] || fnParam; // Field style type
				fnSetVal(el, fn(data[el.name])); // Display styled value
			}
		});
	}
	this.load = (form, data, parsers) => self.loadInputs(self.getFormInputs(form), data, parsers);
	this.display = (form, data, styles) => self.displayInputs(self.getFormInputs(form), data, styles);

	function fnSetError(el) {
		const tip = self.sibling(el, TIP_ERR_SELECTOR); // Show tip error
		return self.showError(i18n.getError()).setHtml(tip, i18n.getMsg(el.name)).show(tip)
					.addClass(el, CONFIG.classInputError).focus(el);
	}
	function fnValidate(inputs, validators, messages) {
		self.closeAlerts().reverse(inputs, el => { // Reverse iterator
			const fn = validators[el.name] || fnSelf; // Validator function
			const msgtip = messages[el.name] || validators[el.name + "Error"];
			fn(el.name, el.value, messages.msgError, msgtip) || fnSetError(el);
		});
		return self.isOk() ? i18n.toData() : null;
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

	function fnContents(el, value) { el.classList.toggle(CONFIG.classHide, !value); return self; }
	function fnSetText(el, value) { el.innerText = value; return fnContents(el, value); }
	function fnSetHtml(el, value) { el.innerHTML = value; return fnContents(el, value); }

	this.getInnerText = el => el && el.innerText; //text
	this.getText = el => self.getInnerText(fnQuery(el)); //find element
	this.setInnerText = (el, value) => (el ? fnSetText(el, value ?? EMPTY) : self);
	this.setText = (el, value) => self.setInnerText(fnQuery(el), value); //find element
	this.text = function(list, value) {
		value = value ?? EMPTY; // define value as string
		return self.each(list, el => fnSetText(el, value));
	}

	this.getInnerHtml = el => el && el.innerHTML; //text
	this.getHtml = el => self.getInnerHtml(fnQuery(el)); //find element
	this.setInnerHtml = (el, value) => (el ? fnSetHtml(el, value ?? EMPTY) : self);
	this.setHtml = (el, value) => self.setInnerHtml(fnQuery(el), value); //find element
	this.html = function(list, value) {
		value = value ?? EMPTY; // define value as string
		return self.each(list, el => fnSetHtml(el, value));
	}

	this.mask = (list, mask, name) => self.each(list, (el, i) => el.classList.toggle(name, nb.mask(mask, i))); //toggle class by mask
	this.view = (list, mask) => self.mask(list, ~mask, CONFIG.classHide); //toggle hide class by mask
	this.getOptText = select => select && self.getText(select.options[select.selectedIndex]);
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
	const fnEvent = (el, name, i, fn, opts) => fnSelf(el.addEventListener(name, ev => fn(el, ev, i) || ev.preventDefault(), opts));
	const fnAddEvent = (el, name, fn, opts) => (el ? fnEvent(el, name, 0, fn, opts) : self);

	this.event = (el, name, fn) => fnAddEvent(fnQuery(el), name, fn);
	this.events = (list, name, fn) => self.each(list, (el, i) => fnEvent(el, name, i, fn));
	this.ready = fn => fnEvent(document, "DOMContentLoaded", 0, fn);
	this.trigger = function(el, name, detail) {
		el.dispatchEvent(detail ? new CustomEvent(name, { detail }) : new Event(name));
		return self;
	}

	this.click = (list, fn) => self.each(list, (el, i) => fnEvent(el, "click", i, fn));
	this.addClick = (el, fn) => fnAddEvent(fnQuery(el), "click", fn);
	this.onclick = this.onClick = self.click;

	this.change = (list, fn) => self.each(list, (el, i) => fnEvent(el, "change", i, fn));
	this.onchange = this.onChange = self.change;

	this.keyup = (list, fn) => self.each(list, (el, i) => fnEvent(el, "keyup", i, fn));
	this.onkeyup = this.onKeyup = self.keyup;

	this.keydown = (list, fn) => self.each(list, (el, i) => fnEvent(el, "keydown", i, fn));
	this.onkeydown = this.onKeydown = self.keydown;

	this.submit = (list, fn) => self.each(list, (el, i) => fnEvent(el, "submit", i, fn));
	this.onsubmit = this.onSubmit = self.submit;

	this.ready(function() {
		i18n.setI18n(self.getLang()); // Set language
		const reader = new FileReader(); // File Reader object

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

		self.getInputValue = el => self.getValue(self.getInput(el));
		self.setInputValue = (el, value) => self.setValue(self.getInput(el));
		self.copyVal = (i1, i2) => self.setInputValue(i1, self.getInputValue(i2));
		self.setAttrInput = (selector, name, value) => self.setAttribute(self.getInput(selector), name, value);
		self.delAttrInput = (selector, name) => self.removeAttr(self.getInput(selector), name);

		self.setFocus = el => self.focus(sb.isstr(el) ? self.find(el, inputs) : ab.find(self.inputs(el), fnFocus));
		self.autofocus = elements => self.focus(ab.find(elements || inputs, fnFocus)); // Set focus on first visible input
		self.autofocus().reverse(inputs, el => { // Initial focus or reallocate in first error
			const tip = self.get(TIP_ERR_SELECTOR, el.parentNode); // Has error tip
			self.empty(tip) || self.show(tip).addClass(el, CONFIG.classInputError).focus(el);
		});

		self.onForm = (selector, name, fn) => fnAddEvent(self.getForm(selector), name, fn);
		self.onChangeForm = (selector, fn) => fnAddEvent(self.getForm(selector), "change", fn);
		self.onResetForm = (selector, fn) => fnAddEvent(self.getForm(selector), "reset", fn);
		self.onSubmitForm = (selector, fn) => fnAddEvent(self.getForm(selector), "submit", fn);
		self.onChangeInput = (selector, fn) => fnAddEvent(self.getInput(selector), "change", fn);
		self.onChangeInputs = (selector, fn) => self.change(self.getInputs(selector), fn);
		self.onBlurInput = (selector, fn) => fnAddEvent(self.getInput(selector), "blur", fn);
		self.onFileInput = (selector, fn) => self.onChangeInput(selector, el => {
			const fnRead = file => { file && reader.readAsBinaryString(file); } //reader.readAsText(file, "UTF-8");
			let index = 0; // position
			reader.onload = ev => { // event on load file
				fn(el, ev, el.files[index], ev.target.result, index);
				fnRead(el.files[++index]);
			}
			fnRead(el.files[index]);
		});

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
		self.onChangeTable = (selector, fn) => self.onTable(selector, "change", fn);
		self.onRenderTable = (selector, fn) => self.onTable(selector, "render", fn);
		self.onSortTable = (selector, fn) => self.onTable(selector, "sort", fn);
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
			self.trigger(table, "render") // First: trigger render event
				.render(tbody, tpl => ab.format(aux, tpl, styles)) // Second: render rows
				.render(table.tFoot, tpl => sb.format(resume, tpl, styles)); // Third: render footer
			fnToggleTbody(table); // Toggle body if no data
			fnPagination(table, data, resume, styles); // Render asociated pages

			// Listeners for change, find and remove events
			return self.change(tbody.children, (row, ev, i) => {
				resume.row = row; // TR parent row
				resume.index = resume.start + i; // Real index
				resume.data = data[resume.index]; // Current data row
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
				resume.start = (resume.size > 1) ? resume.start : 0; // If empty page => Go first page
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
			table = self.getTable(table); // Search table (must exists)
			delete table.dataset.sortBy; // Update state list
			return fnRenderRows(table, data, resume, styles);
		}
		self.clearTable = function(table, data, resume, styles) {
			data.splice(0); // Clear array data
			resume.index = resume.start = 0; // Update index
			return self.updateTable(table, data, resume, styles);
		}

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

			// Toggle body if no data and is not hide
			isHide(table.tBodies[0]) || fnToggleTbody(table);
		});
		/**************** Tables/rows helper ****************/

		/**************** Tabs helper ****************/
		let _tabIndex = self.findIndex(".active", tabs); //current index tab
		let _tabSize = tabs.length - 1; // max tabs size
		let _tabMask = ~0; // all 11111....

		self.getTabs = () => tabs; //all tabs
		self.getTab = id => self.find("#tab-" + id, tabs); // Find by id selector
		self.setTabMask = mask => { _tabMask = mask; return self; } // set mask for tabs
		self.lastId = (str, max) => nb.max(sb.lastId(str) || 0, max || 99); // Extract id

		self.onTab = (id, name, fn, opts) => fnAddEvent(self.getTab(id), name, fn, opts);
		self.onLoadTab = (id, fn) => self.onTab(id, "tab-" + id, fn, { once: true });
		self.onShowTab = (id, fn) => self.onTab(id, "tab-" + id, fn);
		self.onChangeTab = (id, fn) => self.onTab(id, "change", fn);
		self.onExitTab = fn => fnAddEvent(tabs[0], "exit", fn);

		function fnShowTab(i) { //show tab by index
			i = nb.range(i, 0, _tabSize); // Force range
			self.closeAlerts(); // always close alerts
			if (i == _tabIndex) // is current tab
				return self; // nothing to do
			if ((i > 0) || (_tabIndex > 0)) { // Nav in tabs
				const tab = tabs[i]; // get next tab
				// Trigger show tab event (onShowTab) and change tab if all ok
				if (self.trigger(tab, tab.id).isOk()) {
					const progressbar = self.get("#progressbar");
					if (progressbar) { // progressbar is optional
						const step = "step-" + i; //go to a specific step on progressbar
						self.each(progressbar.children, li => self.toggle(li, "active", li.id <= step));
					}
					_tabIndex = i; // set current index
					self.removeClass(tabs, "active").addClass(tab, "active") // set active tab
						.setFocus(tab).scroll(); // Auto set focus and scroll
				}
			}
			else // Is first tab and click on prev button
				self.trigger(tab, "exit"); // Trigger exit event
			return self;
		}

		self.viewTab = id => fnShowTab(self.findIndex("#tab-" + id, tabs)); //find by id selector
		self.lastTab = () => fnShowTab(_tabSize);
		self.prevTab = () => { // Ignore 0's mask tab
			for (var i = _tabIndex - 1; !nb.mask(_tabMask, i) && (i > 0); i--);
			return fnShowTab(i); // Show calculated prev tab
		}
		self.nextTab = () => { // Ignore 0's mask tab
			for (var i = _tabIndex + 1; !nb.mask(_tabMask, i) && (i < _tabSize); i++);
			return fnShowTab(i); // Show calculated next tab
		}

		if (_tabSize > 0) { // Has view tabs?
			self.onclick("a[href='#prev-tab']", () => !self.prevTab())
				.onclick("a[href='#next-tab']", () => !self.nextTab())
				.onclick("a[href='#last-tab']", () => !self.lastTab())
				.onclick("a[href^='#tab-']", el => !self.viewTab(self.lastId(el.href)));
		}

		// Auto check-all inputs groups
		self.each(self.getInputs(CHEK_GROUP_SELECTOR), el => {
			const group = self.getInputs(CHEK_GROUP_SELECTOR + "-" + el.name);
			self.checkval(el, group, +el.value)
				.click(el, aux => { el.value = self.check(group, el.checked).integer(group); return true; })
				.click(group, aux => self.checkval(el, group, self.integer(group)));
		});

		// Clipboard function
		TEXT.style.position = "absolute";
		TEXT.style.left = "-9999px";
		document.body.prepend(TEXT);
	});
}
