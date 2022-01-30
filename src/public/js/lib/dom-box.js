
/**
 * Vanilla JS DOM-Box module
 * @module DomBox
 */
function DomBox() {
	const self = this; //self instance
	const EMPTY = ""; //empty string
	const HIDE = "hide"; //css display: none
	const DIV = document.createElement("div");
	const TEXT = document.createElement("textarea");

	function fnLog(data) { console.log("Log:", data); }
	function fnSize(list) { return list ? list.length : 0; } //string o array
	function fnId() { return "_" + Math.random().toString(36).substr(2, 9); }
	function fnSplit(str) { return str ? str.split(/\s+/) : []; } //class separator
	function addMatch(el, selector, results) { el.matches(selector) && results.push(el); }

	this.get = (selector, el) => (el || document).querySelector(selector);
	this.getAll = (selector, el) => (el || document).querySelectorAll(selector);
	this.closest = (selector, el) => el && el.closest(selector);
	this.matches = (selector, el) => el && el.matches(selector);
	this.sibling = (selector, el) => el && self.get(selector, el.parentNode);
	this.siblings = (selector, el) => el && self.getAll(selector, el.parentNode);

	this.getNavLang = () => navigator.language || navigator.userLanguage; //default browser language
	this.getLang = () => document.documentElement.getAttribute("lang") || self.getNavLang(); //get lang by tag
	this.redir = function(url, target) { url && window.open(url, target || "_blank"); return self; };
	this.unescape = function(html) { TEXT.innerHTML = html; return TEXT.value; }
	this.escape = function(text) { DIV.innerHTML = text; return DIV.innerHTML; }
	/*this.buildPath = function(parts, url) {
		url = url || window.location.pathname;
		let aux = new URLSearchParams(parts);
		let params = new URLSearchParams(window.location.search);
		aux.forEach((v, k) => params.set(k, v));
		return url + "?" + params.toString();
	}*/
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

	// Iterators
	this.each = function(cb, list) {
		if (list) {
			if (list.nodeType === 1)
				cb(list, 0); //is DOMElement
			else {
				let size = fnSize(list);
				for (let i = 0; i < size; i++)
					cb(list[i], i, list);
			}
		}
		return self;
	}
	this.reverse = function(cb, list) {
		for (let i = fnSize(list) - 1; i > -1; i--)
			cb(list[i], i, list);
		return self;
	}

	// Filters
	this.findIndex = function(selector, list) {
		let size = fnSize(list);
		for (let i = 0; i < size; i++) {
			if (list[i].matches(selector))
				return i;
		}
		return -1;
	}
	this.find = function(selector, list) {
		return list[self.findIndex(selector, list)];
	}
	this.filter = function(selector, list) {
		let results = []; //elem container
		self.each(el => addMatch(el, selector, results), list);
		return results;
	}

	// Inputs selectors and focusableds
	const INPUTS = "input,textarea,select";
	const FOCUSABLE = ":not([type=hidden],[readonly],[disabled],[tabindex='-1'])";
	function fnVisible(el) { return el.offsetWidth || el.offsetHeight || el.getClientRects().length; }
	this.inputs = el => self.getAll(INPUTS, el);
	this.focus = function(el) { el && el.focus(); return self; }
	this.setFocus = el => self.refocus(self.inputs(el));
	this.refocus = function(list) {
		return self.reverse(input => { //set focus on first input
			fnVisible(input) && input.matches(FOCUSABLE) && input.focus();
		}, list);
	}

	// Contents
	function fnSetVal(el, value) {
		if (el.tagName === "SELECT") {
			value = value || el.getAttribute("value");
			el.selectedIndex = value ? self.findIndex("[value='" + value + "']", el.options) : 0;
		}
		else
			el.value = value ?? EMPTY;
		return self;
	}
	this.getValue = el => el && el.value;
	this.setValue = (el, value) => el ? fnSetVal(el, value) : self;
	this.val = (value, list) => self.each(el => fnSetVal(el, value), list);

	this.getAttr = (el, name) => el && el.getAttribute(name);
	this.attr = (name, value, list) => self.each(el => el.setAttribute(name, value), list);
	this.removeAttr = (name, list) => self.each(el => el.removeAttribute(name), list);

	this.getText = el => el && el.innerText;
	this.findText = (selector, el) => self.getText(self.get(selector, el));
	this.text = function(value, list) { value = value || EMPTY; return self.each(el => { el.innerText = value; }, list); }
	this.setText = (selector, value, el) => self.text(value, self.getAll(selector, el));

	this.getHtml = el => el && el.innerHTML;
	this.findHtml = (selector, el) => self.getHtml(self.get(selector, el));
	this.html = function(value, list) { value = value || EMPTY; return self.each(el => { el.innerHTML = value; }, list); }
	this.setHtml = (selector, value, el) => self.html(value, self.getAll(selector, el));

	this.mask = (name, mask, list) => self.each((el, i) => el.classList.toggle(name, (mask>>i)&1), list); //toggle class by mask
	this.optText = sel => sel ? self.getText(sel.options[sel.selectedIndex]) : null;
	this.select = function(mask, list) {
		return self.each(el => { //iterate over all selects
			let option = self.mask(HIDE, ~mask, el.options).get("[value='" + el.value + "']", el);
			if (self.hasClass(option, HIDE)) //current option is hidden => force change
				el.selectedIndex = self.findIndex(":not(.hide)", el.options);
		}, list);
	}

	this.empty = el => !el || !el.innerHTML || (el.innerHTML.trim() === EMPTY);
	this.add = (node, list) => self.each(el => node.appendChild(el), list);
	this.append = function(text, list) {
		return self.each(el => {
			DIV.innerHTML = text; // As clone
			self.add(el, DIV.childNodes);
		}, list || document.body);
	}

	// Format and parse contents
	/*this.import = function(inputs, data, opts) {
		opts = opts || {}; //default settings
		if (!data) //no data => clear inputs
			return self.val(EMPTY, inputs);
		return self.each((el, i) => { //format data
			let fn = opts[el.name]; //field format function
			if (fn)
				el.value = fn(data[el.name], data, i);
			else //default string if not defined same value
				fnSetVal(el, data[el.name] ?? el.value);
		}, inputs);
	}
	this.export = function(inputs, data, opts) {
		data = data || {}; //output data container
		opts = opts || {}; //default settings
		self.each((el, i) => { //parse inputs data
			let fn = opts[el.name]; //field format function
			data[el.name] = fn ? fn(el.value, data, i) : el.value;
		}, inputs);
		delete data.undefined; //no name element
		return data;
	}*/

	const TEMPLATES = {}; //container
	this.setTpl = function(name, tpl) {
		TEMPLATES[name] = tpl;
		return self;
	}
	this.loadTemplates = function() {
		return self.each(tpl => self.setTpl(tpl.id, tpl.innerHTML), self.getAll("template[id]"));
	}
	this.render = function(el, formatter) {
		el.id = el.id || fnId(); // force unique id for element
		let key = el.dataset.tpl || el.id; // tpl asociated
		TEMPLATES[key] = TEMPLATES[key] || el.innerHTML;
		el.innerHTML = formatter(TEMPLATES[key]);
		el.classList.toggle(HIDE, !el.innerHTML);
		return self;
	}
	this.format = (formatter, list) => self.each(self.render, list);
	this.reformat = (selector, formatter) => self.format(formatter, self.getAll(selector));
	this.replace = (selector, value) => self.each(el => { el.outerHTML = value; }, self.getAll(selector));
	this.parse = (selector, formatter)  => self.each(el => { el.outerHTML = formatter(el.outerHTML); }, self.getAll(selector));

	// Styles
	this.isVisible = el => el && fnVisible(el);
	this.visible = (selector, el) => self.isVisible(self.get(selector, el));
	this.show = list => self.each(el => el.classList.add(HIDE), list);
	this.hide = list => self.each(el => el.classList.remove(HIDE), list);
	this.hasClass = (el, name) => el && fnSplit(name).some(name => el.classList.contains(name));
	this.addClass = function(name, list) {
		const names = fnSplit(name); // Split value by " " (class separator)
		return self.each(el => { names.forEach(name => el.classList.add(name)); }, list);
	}
	this.addStyle = function(selector, name, el) {
		return self.addClass(name, self.getAll(selector, el));
	}
	this.removeClass = function(name, list) {
		const names = fnSplit(name); // Split value by " " (class separator)
		return self.each(el => { names.forEach(name => el.classList.remove(name)); }, list);
	}
	this.removeStyle = function(selector, name, el) {
		return self.removeClass(name, self.getAll(selector, el));
	}

	this.toggle = function(name, force, list) {
		const names = fnSplit(name); // Split value by " " (class separator)
		return self.each(el => names.forEach(name => el.classList.toggle(name, force)), list);
	}
	this.toggleClass = (selector, name, force, el) => self.toggle(name, force, self.getAll(selector, el));
	this.toggleHide = (selector, force, el) => self.toggleClass(selector, HIDE, force, el);

	this.swap = function(name, list) {
		const names = fnSplit(name); // Split value by " " (class separator)
		return self.each(el => names.forEach(name => el.classList.toggle(name)), list);
	}
	this.swapClass = (selector, name, el) => self.swap(name, self.getAll(selector, el));
	this.swapHide = (selector, el) => self.swapClass(selector, HIDE, el);

	this.css = function(prop, value, list) {
		const camelProp = prop.replace(/(-[a-z])/, g => g.replace("-", EMPTY).toUpperCase());
		return self.each(el => { el.style[camelProp] = value; }, list);
	}

	// Events
	const ON_CHANGE = "change";
	function fnEvent(name, el, i, fn) {
		el.addEventListener(name, ev => fn(el, ev, i) || ev.preventDefault());
		return self;
	}
	function fnAddEvent(name, el, fn) {
		return el ? fnEvent(name, el , 0, fn) : self;
	}
	this.event = (name, fn, list) => self.each((el, i) => fnEvent(name, el, i, fn), list);
	this.addEvent = (selector, name, fn) => self.event(name, fn, self.getAll(selector));
	this.trigger = (el, name) => { el && el.dispatchEvent(new Event(name)); return self; }
	this.ready = fn => fnEvent("DOMContentLoaded", document, 0, fn);

	this.click = (fn, list) => self.each((el, i) => fnEvent("click", el, i, fn), list);
	this.onClick = (selector, fn) => self.click(fn, self.getAll(selector));
	this.onClickElem = (selector, fn) => fnAddEvent("click", self.get(selector), fn);
	this.onclick = self.onClick;

	this.change = (fn, list) => self.each((el, i) => fnEvent(ON_CHANGE, el, i, fn), list);
	this.onChange = (selector, fn) => self.change(fn, self.getAll(selector));
	this.onchange = self.onChange;

	this.keyup = (fn, list) => self.each((el, i) => fnEvent("keyup", el, i, fn), list);
	this.onKeyup = (selector, fn) => self.keyup(fn, self.getAll(selector));
	this.onkeyup = self.onKeyup;

	this.keydown = (fn, list) => self.each((el, i) => fnEvent("keydown", el, i, fn), list);
	this.onKeydown = (selector, fn) => self.keydown(fn, self.getAll(selector));
	this.onkeydown = self.onKeydown;

	this.submit = (fn, list) => self.each((el, i) => fnEvent("submit", el, i, fn), list);
	this.onSubmit = (selector, fn) => self.submit(fn, self.getAll(selector));
	this.onsubmit = self.onSubmit;

	this.ready(function() {
		const elements = self.getAll("table,form," + INPUTS);
		const tables = self.filter("table", elements); //all html tables
		const forms = self.filter("form", elements); //all html forms
		const inputs = self.filter(INPUTS, elements); //all html inputs

		self.getTable = selector => self.find(selector, tables);
		self.getTables = selector => self.filter(selector, tables);
		self.getForm = selector => self.find(selector, forms);
		self.getForms = selector => self.filter(selector, forms);
		self.getInput = selector => self.find(selector, inputs);
		self.getInputs = selector => selector ? self.filter(selector, inputs) : inputs;

		self.moveFocus = selector => self.focus(self.getInput(selector));
		self.getVal = selector => self.getValue(self.getInput(selector));
		self.setVal = (selector, value) => self.val(value, self.getInputs(selector));
		self.setInputValue = (selector, value) => self.setValue(self.getInput(selector), value);
		self.setAttr = (selector, name, value) => self.attr(name, value, self.getInputs(selector));
		self.delAttr = (selector, name) => self.removeAttr(name, self.getInputs(selector));
		self.setInput = (selector, value, fnChange) => {
			const el = self.getInput(selector);
			if (el) {
				fnEvent(ON_CHANGE, el, 0, fnChange);
				fnSetVal(el, value);
			}
			return self;
		}

		self.onChangeForm = (selector, fn) => fnAddEvent(ON_CHANGE, self.getForm(selector), fn);
		self.onSubmitForm = (selector, fn) => fnAddEvent("submit", self.getForm(selector), fn);
		self.onChangeForms = (selector, fn) => self.change(fn, self.getForms(selector));
		self.onSubmitForms = (selector, fn) => self.submit(fn, self.getForms(selector));
		self.onChangeInput = (selector, fn) => fnAddEvent(ON_CHANGE, self.getInput(selector), fn);
		self.onChangeInputs = (selector, fn) => self.change(fn, self.getInputs(selector));
		self.refocus(inputs); // Set focus on first visible input


		/**************** Tables/rows helper ****************/
		self.onFindRow = (selector, fn) => self.event("find", fn, self.getTables(selector));
		self.onRemoveRow = (selector, fn) => self.event("remove", fn, self.getTables(selector));
		self.onChangeTable = (selector, fn) => fnAddEvent(ON_CHANGE, self.getTable(selector), fn);
		self.onChangeTables = (selector, fn) => self.change(fn, self.getTables(selector));
		self.onRenderTable = (selector, fn) => fnAddEvent("render", self.getTable(selector), fn);
		self.onRenderTables = (selector, fn) => self.event("render", fn, self.getTables(selector));
		self.onPaginationTable = (selector, fn) => self.event("pagination", fn, self.getTables(selector));

		function fnToggleTbody(table) {
			let tr = self.get("tr.tb-data", table); //has data rows?
			return self.toggle("hide", !tr, table.tBodies[0]).toggle("hide", tr, table.tBodies[1]);
		}
		function fnToggleOrder(links, link, dir) { // Update all sort indicators
			self.removeClass("sort-asc sort-desc", links) // Remove prev order
				.addClass("sort-none", links) // Reset all orderable columns
				.swap("sort-none sort-" + dir, link); // Column to order table
		}
		function fnPagination(table) { // Paginate table
			const pageSize = nb.intval(table.dataset.pageSize);
			const pagination = self.get(".pagination", table.parentNode);
			if (pagination && (pageSize > 0)) {
				table.dataset.page = nb.intval(table.dataset.page);
				let pages = Math.ceil(table.dataset.total / pageSize);

				function renderPagination(page) {
					let output = ""; // Output buffer
					function addControl(i, text) {
						i = nb.range(i, 0, pages - 1); // Close range limit
						output += '<a href="#" data-page="' + i + '">' + text + '</a>';
					}
					function addPage(i) {
						i = nb.range(i, 0, pages - 1); // Close range limit
						output += '<a href="#" data-page="' + i + '"';
						output += (i == page) ? ' class="active">' : '>';
						output += (i + 1) + '</a>';
					}

					let i = 0; // Index
					addControl(page - 1, "&laquo;");
					(pages > 1) && addPage(0);
					i = Math.max(page - 3, 1);
					(i > 2) && addControl(i - 1, "...");
					let max = Math.min(page + 3, pages - 1);
					while (i <= max)
						addPage(i++);
					(i < (pages - 1)) && addControl(i, "...");
					(i < pages) && addPage(pages - 1);
					addControl(page + 1, "&raquo;");
					pagination.innerHTML = output;

					self.click(el => { // Reload pagination click event
						const i = +el.dataset.page; // Current page
						const params = { index: i * pageSize, length: pageSize }; // Event data

						renderPagination(i); // Render all pages
						table.dataset.page = i; // Update current
						table.dispatchEvent(new CustomEvent("pagination", { "detail": params })); // Trigger event
					}, self.getAll("a", pagination));
				}
				renderPagination(table.dataset.page);
			}
			return dom;
		}

		function fnRenderRows(table, data, resume, styles) {
			resume.size = data.length; // Numrows
			resume.total = resume.total ?? (+table.dataset.total || data.length); // Parse to int
			self.render(table.tFoot, tpl => sb.format(resume, tpl, styles)) // Render footer
				.render(table.tBodies[0], tpl => ab.format(data, tpl, styles)); // Render rows

			self.click((el, ev, i) => { // Find data event
				table.dispatchEvent(new CustomEvent("find", { "detail": data[i] }));
			}, self.getAll("a[href='#find']", table));
			self.click((el, ev, i) => { // Remove event
				if (confirm(styles?.remove)) {
					resume.total--; // dec. total rows
					const obj = data.splice(i, 1)[0]; // Remove from data
					table.dispatchEvent(new CustomEvent("remove", { "detail": obj })); // Trigger event
				}
			}, self.getAll("a[href='#remove']", table));

			table.dispatchEvent(new Event("render")); // Trigger event
			return fnToggleTbody(table); // Toggle body if no data
		}
		self.renderRows = function(table, data, resume, styles) {
			return table ? fnRenderRows(table, data, resume, styles) : dom;
		}
		self.list = function(selector, data, resume, styles) {
			return self.each(table => fnRenderRows(table, data, resume, styles), self.getTables(selector));
		}

		function fnRenderTable(table, data, resume, styles) {
			self.renderRows(table, data, resume, styles);
			return fnPagination(table); // Update pagination
		}
		self.renderTable = function(table, data, resume, styles) {
			return table ? fnRenderTable(table, data, resume, styles) : dom;
		}
		self.renderTables = function(selector, data, resume, styles) {
			return self.each(table => fnRenderTable(table, data, resume, styles), self.getTables(selector));
		}

		// Initialize all tables
		self.each(table => {
			const links = self.getAll(".sort", table.tHead); // All orderable columns
			if (table.dataset.sortDir) {
				fnToggleOrder(links, // Update sort icons
							self.find(".sort-" + table.dataset.sortBy, links), // Ordered column
							table.dataset.sortDir); // Sort direction
			}

			self.click(el => { // Sort event click
				const dir = self.hasClass(el, "sort-asc") ? "desc" : "asc"; // Toggle sort direction
				fnToggleOrder(links, el, dir); // Update all sort indicators
			}, links); // Add click event for order table

			/*self.click(el => { // Find data event
				table.dispatchEvent(new CustomEvent("find", { "detail": el }));
			}, self.getAll("a[href='#find']", table));
			self.click(el => { // Remove event
				if (i18n.confirm("remove"))
					table.dispatchEvent(new CustomEvent("remove", { "detail": el }));
			}, self.getAll("a[href='#remove']", table));*/

			fnToggleTbody(table); // Toggle body if no data
			fnPagination(table); // Update pagination
		}, tables);
		/**************** Tables/rows helper ****************/


		// Clipboard function
		TEXT.style.position = "absolute";
		TEXT.style.left = "-9999px";
		document.body.prepend(TEXT);
	});
}
