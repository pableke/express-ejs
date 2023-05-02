
import ab from "./array-box.js";
import sb from "./string-box.js";
import nb from "./number-box.js";
import api from "./api-box.js";
import i18n from "./i18n-box.js";

function Dom() {
	const self = this; //self instance
	const EMPTY = ""; //empty string
	const HIDE = "hide"; //hide class

	const fnSelf = () => self; //function void
	const isElement = node => (node.nodeType == 1);
	const isstr = val => (typeof(val) === "string") || (val instanceof String);
	const fnQuery = selector => isstr(selector) ? document.querySelector(selector) : selector;
	const fnQueryAll = selector => isstr(selector) ? document.querySelectorAll(selector) : selector;

	this.get = (selector, el) => (el || document).querySelector(selector);
	this.getAll = (selector, el) => (el || document).querySelectorAll(selector);
	this.closest = (selector, el) => el && el.closest(selector);

	this.each = function(list, fn) {
		if (list) // Is DOMElement, selector or NodeList
			isElement(list) ? fn(list) : ab.each(fnQueryAll(list), fn);
		return self;
	}
	this.reverse = function(list, fn) {
		if (list) // Is DOMElement, selector or NodeList
			isElement(list) ? fn(list) : ab.reverse(fnQueryAll(list), fn);
		return self;
	}

	this.apply = (selector, list, fn) => fnSelf(ab.each(list, (el, i) => el.matches(selector) && fn(el, i)));
	this.applyReverse = (selector, list, fn) => fnSelf(ab.reverse(list, (el, i) => el.matches(selector) && fn(el, i)));
	this.indexOf = (el, list) => ab.findIndex(list || el.parentNode.children, elem => (el == elem));
	this.findIndex = (selector, list) => ab.findIndex(list, el => el.matches(selector));
	this.find = (selector, list) => ab.find(list, el => el.matches(selector));

	this.prev = (el, selector) => {
		for (el = el.previousElementSibling; el; el = el.previousElementSibling) {
			if (el.matches(selector))
				return el;
		}
		return el;
	}
	this.next = (el, selector) => {
		for (el = el.nextElementSibling; el; el = el.nextElementSibling) {
			if (el.matches(selector))
				return el;
		}
		return el;
	}
	this.sibling = (el, selector) => self.prev(el, selector) || self.next(el, selector);
	this.eachChild = (el, selector, fn) => self.apply(selector, el.children, fn);

	// Styles
	const fnHide = el => el.classList.add(HIDE);
	const fnShow = el => el.classList.remove(HIDE);
	const isHide = el => el.classList.contains(HIDE);
	const fnVisible = el => (el.offsetWidth || el.offsetHeight || el.getClientRects().length);

	this.visible = el => el && fnVisible(el);
	this.show = list => self.each(list, fnShow);
	this.hide = list => self.each(list, fnHide);
	this.addClass = (list, name) => self.each(list, el => el.classList.add(name));
	this.removeClass = (list, name) => self.each(list, el => el.classList.remove(name));
	this.toggle = (list, name, force) => self.each(list, el => el.classList.toggle(name, force));
	this.toggleHide = (list, force) => self.toggle(list, HIDE, force);
	this.hasClass = (el, name) => el && el.classList.contains(name);

	this.toggleInfo = selector => {
		return self.click(selector, (ev, el) => {
			const info = self.getAll(".info-" + el.id);
			const names = sb.split(el.dataset.toggle, /\s+/);
			self.eachChild(el, "i", child => ab.each(names, name => child.classList.toggle(name)))
				.toggleHide(info).setFocus(info[0]);
		});
	}

	// Format and parse contents
	const TEMPLATES = {}; //container
	function fnContents(el, value) { el.classList.toggle(HIDE, !value); return self; }
	function fnSetText(el, value) { el.innerText = value; return fnContents(el, value); }
	function fnSetHtml(el, value) { el.innerHTML = value; return fnContents(el, value); }
	function fnTpl(el) {
		el.id = el.id || ("_" + sb.rand()); // force unique id for element
		const key = el.dataset.tpl || el.id; // tpl asociated
		TEMPLATES[key] = TEMPLATES[key] || el.innerHTML; // save tpl
		return TEMPLATES[key];
	}

	this.getInnerHtml = el => el && el.innerHTML; //text
	this.getHtml = el => self.getInnerHtml(fnQuery(el)); //find element
	this.setInnerHtml = (el, value) => (el ? fnSetHtml(el, value) : self);
	this.setHtml = (el, value) => self.setInnerHtml(fnQuery(el), value); //find element
	this.html = (list, value) => self.each(list, el => fnSetHtml(el, value));
	this.format = (selector, data) => self.each(selector, el => fnSetHtml(el, sb.format(fnTpl(el), data)));
	this.render = (selector, data, fnRender) => self.each(selector, el => fnSetHtml(el, sb.render(fnTpl(el), data, fnRender)));

	this.table = function(table, data, opts) {
		const links = self.getAll(".sort", table.tHead); // All orderable columns
		const detail = { size: data.length, index: 0 }; // Event detail
		const tbody = table.tBodies[0]; // Data rows

		function fnDetail(i, data, view) {
			detail.index = i; // Real index
			detail.data = data; // Current data row
			detail.view = view; // Rendered data container
			return detail;
		}
		function fnMove(i) {
			i = nb.range(i, 0, data.length - 1);
			return fnDetail(i, data[i]);
		}
		function fnEvent(row, el) {
			detail.row = row; // TR parent row
			detail.element = el; // Element to trigger event
			fnMove(self.indexOf(row)); // Real index
		}
		function fnTfoot() { // Render tFoot only
			self.trigger(table, "after-render", detail).format(table.tFoot, detail);
			self.change(table.tFoot.children, (ev, tr) => {
				fnEvent(tr, ev.target); // Set event indicators
				self.trigger(table, "change-" + ev.target.name, detail); // Specific change event
				fnTfoot(); // Build footer only
			});
		}
		function fnRender() { // Render tBody and tFoot
			detail.size = data.length;
			self.trigger(table, "before-render", detail)
				.render(tbody, data, (row, view) => self.trigger(table, "on-render", fnDetail(view.index, row, view)))
				.toggleHide(tbody, !data.length).toggleHide(table.tBodies[1], data.length);

			// Listeners for change, find and remove events
			const action = self.getAll("a[href^='#find']", tbody);
			const remove = self.getAll("a[href='#remove']", tbody);
			self.change(tbody.children, (ev, tr) => {
				fnEvent(tr, ev.target); // Set event indicators
				self.trigger(table, "change-" + ev.target.name, detail); // Specific change event
				fnTfoot(); // Build footer only
			}).click(remove, (ev, link) => {
				fnEvent(link.closest("tr"), link);
				table.remove();
			}).click(action, (ev, link) => {
				fnEvent(link.closest("tr"), link);
				const name = link.getAttribute("href");
				self.trigger(table, name.substring(1), detail);
			});
			fnTfoot();
		}

		self.click(links, (ev, link) => { // Sort event click
			detail.dir = self.hasClass(link, "sort-asc") ? "desc" : "asc"; // Toggle sort direction
			detail.column = link.getAttribute("href").substring(1); // Column name
			detail.sort = ((a, b) => sb.cmpBy(a, b, detail.column)); // Default sort function

			// Update all sort icons
			self.removeClass(links, "sort-asc").removeClass(links, "sort-desc") // Remove prev order
				.addClass(links, "sort-none") // Reset all orderable columns
				.removeClass(link, "sort-none").addClass(link, "sort-" + detail.dir); // Column to order table

			// Fire specific column sort event and after common sort event
			self.trigger(table, "sort-" + detail.column, detail).trigger(table, "sort");
			ab.sort(data, detail.dir, detail.sort); // Sort data by function
			fnRender(); // Build table rows
		});

		fnRender(); // Render table and add extra events
		table.update = fnRender; // Mutate table object 
		table.insert = function(row) { data.push(row); fnRender(); }
		table.first = function() { self.trigger(table, "find", fnMove(0)); }
		table.prev = function() { self.trigger(table, "find", fnMove(detail.index - 1)); }
		table.next = function() { self.trigger(table, "find", fnMove(detail.index + 1)); }
		table.last = function() { self.trigger(table, "find", fnMove(data.length)); }

		table.remove = function() {
			// Confirm, close prev. alerts and trigger remove event
			let ok = i18n.confirm(opts?.remove || "remove");
			if (ok && self.closeAlerts().trigger(table, "remove", detail).isOk()) {
				data.splice(detail.index, 1); // Remove data row
				fnRender(); // Build table rows
			}
		}
		table.reset = function() {
			// Confirm, close prev. alerts and trigger reset event
			let ok = i18n.confirm(opts?.removeAll || "removeAll");
			if (ok && self.closeAlerts().trigger(table, "reset").isOk()) {
				data.splice(0); // Remove data row
				fnRender(); // Build table rows
			}
		}
		return self;
	}

	// Forms and inputs
	const INPUTS = "input,select,textarea";
	const FIELDS = "input[name],select[name],textarea[name]";

	this.fetch = function(opts) {
		self.loading(); //show loading..., set error handler and close loading...
		return api.fetch(opts).finally(self.working);
	}
	this.ajax = action => self.fetch({ action }).catch(self.showError);
	this.send = function(form, opts) {
		opts = opts || {};
		const fd = new FormData(form);
		opts.action = form.action;
		opts.method = method || form.method; //method-override
		if (opts.method == "get") // Form get => prams in url
			opts.action += "?" + (new URLSearchParams(fd)).toString();
		else
			opts.body = (form.enctype == "multipart/form-data") ? fd : new URLSearchParams(fd);
		opts.headers = { "Content-Type": form.enctype || "application/x-www-form-urlencoded" };
		return self.fetch(opts).catch(data => self.setErrors(data, form));
	}

	this.inputs = el => self.getAll(INPUTS, el);
	this.setChecked = (list, value) => self.each(list, input => { input.checked = value; });
	this.setReadonly = (list, value) => self.each(list, input => { input.readOnly = value; });
	this.setDisabled = (list, value) => self.each(list, input => { input.disabled = value; });
	this.focus = el => { el && el.focus(); return self; }
	this.setFocus = el => self.autofocus(self.inputs(el));
	this.autofocus = function(inputs) {
		inputs = fnQueryAll(inputs); // get posible inputs
		const fnFocus = input => (fnVisible(input) && input.matches("[tabindex]:not([type=hidden],[readonly],[disabled])"));
		return self.focus(ab.find(inputs, fnFocus)); // Set focus on first visible input
	}

	this.load = (form, data) => {
		return self.apply(FIELDS, form.elements, el => {
			if ((el.type === "checkbox") || (el.type === "radio"))
				el.checked = (el.value == data[el.name]);
			else
				el.value = data[el.name];
		});
	}
	this.group = selector => {
		return self.each(selector, check => {
			const group = self.getAll(".check-" + check.id);
			self.click(check, aux => self.setChecked(group, check.checked))
				.click(group, aux => { check.checked = (self.findIndex(":not(:checked)", group) < 0); return true; });
		});
	}
	this.setCheckBin = (form, name, value) => {
		return self.apply(".check-" + name, form.elements, check => { check.checked = (value & check.value); })
					.apply("#" + name, form.elements, el => { el.checked = (value == el.value); })
	}
	this.getCheckBin = (form, name) => {
		let result = 0;
		self.apply(".check-" + name, form.elements, check => { result |= (check.checked ? +check.value : 0); });
		return result;
	}
	this.setCheckList = (form, name, values) => {
		const group = self.getAll(".check-" + name, form);
		return self.each(group, check => { check.checked = values.indexOf(check.value) > -1; })
					.apply("#" + name, form.elements, el => { el.checked = (ab.size(values) == group.length); });
	}
	this.getCheckList = (form, name) => {
		let result = []; // Id's container
		self.apply(".check-" + name, form.elements, check => { check.checked && result.push(check.value); });
		return result;
	}

	this.mask = (list, mask, name) => self.each(list, (el, i) => el.classList.toggle(name, nb.mask(mask, i))); //toggle class by mask
	this.view = (list, mask) => self.mask(list, ~mask, HIDE); //toggle hide class by mask
	this.getSelectHtml = select => select && self.getInnerHtml(select.options[select.selectedIndex]);
	this.select = function(list, mask) {
		return self.each(list, el => { //iterate over all selects
			const option = el.options[el.selectedIndex]; //get current option
			if (self.view(el.options, mask).hasClass(option, HIDE)) //option hidden => force change
				el.selectedIndex = self.findIndex(":not(.hide)", el.options);
		});
	}

	// Animations
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
	const fnEvent = (el, name, fn, opts) => fnSelf(el.addEventListener(name, ev => fn(ev, ev.currentTarget) || ev.preventDefault(), opts));
	const fnAddEvent = (el, name, fn, opts) => (el ? fnEvent(el, name, fn, opts) : self);

	this.event = (el, name, fn) => fnAddEvent(fnQuery(el), name, fn);
	this.events = (list, name, fn) => self.each(list, el => fnEvent(el, name, fn));
	this.trigger = (el, name, detail) => fnSelf(el.dispatchEvent(detail ? new CustomEvent(name, { detail }) : new Event(name)));
	this.ready = fn => fnEvent(document, "DOMContentLoaded", fn);

	this.click = (list, fn) => self.each(list, el => fnEvent(el, "click", fn));
	this.addClick = (el, fn) => fnAddEvent(fnQuery(el), "click", fn);
	this.setClick = (parent, selector, fn) => fnAddEvent(self.get(selector, parent), "click", fn);
	this.onclick = this.onClick = self.click;

	this.change = (list, fn) => self.each(list, el => fnEvent(el, ON_CHANGE, fn));
	this.onchange = this.onChange = self.change;

	this.keyup = (list, fn) => self.each(list, el => fnEvent(el, "keyup", fn));
	this.onkeyup = this.onKeyup = self.keyup;

	this.keydown = (list, fn) => self.each(list, el => fnEvent(el, "keydown", fn));
	this.onkeydown = this.onKeydown = self.keydown;

	this.submit = (list, fn) => self.each(list, el => fnEvent(el, "submit", fn));
	this.onsubmit = this.onSubmit = self.submit;

	this.tabs = function(tabs) {
		tabs = fnQueryAll(tabs); // Get all tabs
		let _tabIndex = self.findIndex(".active", tabs); //current index tab
		let _tabSize = tabs.length - 1; // max tabs size
		let _tabMask = ~0; // all 11111....

		self.getTab = id => self.find("#tab-" + id, tabs); // Find by id selector
		self.setTabMask = mask => { _tabMask = mask; return self; } // set mask for tabs

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
				_tabIndex = i; // set current index
				self.removeClass(tabs, "active").addClass(tab, "active") // set active tab
					.setFocus(tab); // Auto set focus and scroll
			}
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
				.onclick("a[href^='#tab-']", (ev, el) => !self.viewTab(sb.lastId(el.href)));
		}
		return self;
	}

	this.alerts = function(alerts, opts) {
		opts = opts || {};
		opts.classAlertText = opts.classAlertText || "alert-text";
		opts.classAlertClose = opts.classAlertClose || "alert-close";
		opts.classTipError = opts.classTipError || "ui-errtip";
		opts.classInputError = opts.classInputError || "ui-error";
		const TIP_ERR_SELECTOR = "." + opts.classTipError;

		const texts = self.getAll("." + opts.classAlertText, alerts);
		const showAlert = el => self.fadeIn(el.parentNode);
		const closeAlert = el => self.fadeOut(el.parentNode);
		const setAlert = (el, txt) => txt ? showAlert(el).setInnerHtml(el, i18n.tr(txt)) : self;

		self.isOk = self.isError = fnSelf;
		self.loading = self.working = fnSelf;
		self.showOk = msg => setAlert(texts[0], msg); //green
		self.showInfo = msg => setAlert(texts[1], msg); //blue
		self.showWarn = msg => setAlert(texts[2], msg); //yellow
		self.showError = msg => setAlert(texts[3], msg); //red
		self.showAlerts = function(msgs) { //show posible multiple messages types
			return msgs ? self.showOk(msgs.msgOk).showInfo(msgs.msgInfo).showWarn(msgs.msgWarn).showError(msgs.msgError) : self;
		}
		self.closeAlerts = function() { // Hide all alerts
			return self.each(texts, closeAlert).each(INPUTS, el => {
				const tip = self.sibling(el, TIP_ERR_SELECTOR); // tip error
				self.setInnerHtml(tip, EMPTY).hide(tip).removeClass(el, opts.classInputError);
			});
		}

		self.setErrors = (messages, form) => {
			self.closeAlerts(); //close previous errros
			if (isstr(messages)) // simple message text
				return self.showError(messages);
			if (messages) {
				self.applyReverse(FIELDS, form.elements, el => { // Reverse iterator
					const msg = messages[el.name]; // message to show
					if (msg) {
						const partner = self.sibling(el, INPUTS); // Partner element
						const tip = self.sibling(el, TIP_ERR_SELECTOR); // Show tip error
						self.setInnerHtml(tip, msg).show(tip)
							.addClass(el, opts.classInputError).addClass(partner, opts.classInputError)
							.focus(fnVisible(el) ? el : partner);
					}
				});
				self.showError(messages.msgError);
			}
			return self;
		}

		// Show posible server messages and close click event
		const close = self.getAll("." + opts.classAlertClose, alerts);
		return self.each(texts, el => { el.firstChild && showAlert(el); }).click(close, (ev, el) => closeAlert(el));
	}
}

export default new Dom();
