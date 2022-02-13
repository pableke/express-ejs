
/**
 * Vanilla JS DOM-Box module, require:
 * ArrayBox (ab), StringBox (sb) and i18nBox (i18n)
 * 
 * @module DomBox
 */
function DomBox() {
	const self = this; //self instance
	const EMPTY = ""; //empty string
	const HIDE = "hide"; //css display: none
	const DIV = document.createElement("div");
	const TEXT = document.createElement("textarea");

	function fnLog(data) { console.log("Log:", data); }
	function fnId() { return "_" + Math.random().toString(36).substr(2, 9); }
	function fnSplit(str) { return str ? str.split(/\s+/) : []; } //class separator
	function fnQuery(list) { return (typeof(list) === "string") ? document.querySelectorAll(list) : list; }

	this.get = (selector, el) => (el || document).querySelector(selector);
	this.getAll = (selector, el) => (el || document).querySelectorAll(selector);
	this.closest = (selector, el) => el && el.closest(selector);
	this.matches = (selector, el) => el && el.matches(selector);
	this.sibling = (selector, el) => el && self.get(selector, el.parentNode);
	this.siblings = (selector, el) => el && self.getAll(selector, el.parentNode);

	this.getNavLang = () => navigator.language || navigator.userLanguage; //default browser language
	this.getLang = () => document.documentElement.getAttribute("lang") || self.getNavLang(); //get lang by tag
	this.redir = (url, target) => { url && window.open(url, target || "_blank"); return self; };
	this.unescape = html => { TEXT.innerHTML = html; return TEXT.value; }
	this.escape = text => { DIV.innerHTML = text; return DIV.innerHTML; }
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
	this.each = function(list, cb) {
		if (!list)
			return self;

		// Is DOMElement
		if (list.nodeType === 1)
			cb(list, 0);
		else // Is Selector or NodeList
			ab.each(fnQuery(list), cb);
		return self;
	}
	this.reverse = function(list, cb) {
		ab.reverse(list, cb);
		return self;
	}

	// Filters
	this.findIndex = (selector, list)  => [...list].findIndex(el => el.matches(selector));
	this.find = (selector, list)  => [...list].find(el => el.matches(selector));
	this.filter = (selector, list) => [...list].filter(el => el.matches(selector));
	this.map = (list, cb)  => [...fnQuery(list)].map(cb);

	// Inputs selectors and focusableds
	const INPUTS = "input,textarea,select";
	const FOCUSABLE = ":not([type=hidden],[readonly],[disabled],[tabindex='-1'])";
	function fnVisible(el) { return el.offsetWidth || el.offsetHeight || el.getClientRects().length; }
	this.inputs = el => self.getAll(INPUTS, el);
	this.focus = el => { el && el.focus(); return self; }
	this.setFocus = el => self.refocus(self.inputs(el));
	this.refocus = function(list) {
		return self.reverse(list, input => { //set focus on first input
			fnVisible(input) && input.matches(FOCUSABLE) && input.focus();
		});
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
	this.val = (list, value) => self.each(list, el => fnSetVal(el, value));

	this.getAttr = (el, name) => el && el.getAttribute(name);
	this.setAttr = (el, name, value) => { el && el.setAttribute(name, value); return self; };
	this.attr = (list, name, value) => self.each(list, el => el.setAttribute(name, value));
	this.removeAttr = (list, name) => self.each(list, el => el.removeAttribute(name));
	this.delAttr = (el, name) => { el && el.removeAttribute(name); return self; };

	this.getText = el => el && el.innerText;
	this.findText = (selector, el) => self.getText(self.get(selector, el));
	this.text = function(list, value) { value = value || EMPTY; return self.each(list, el => { el.innerText = value; }); }
	this.setText = (selector, value, el) => self.text(self.getAll(selector, el), value);

	this.getHtml = el => el && el.innerHTML;
	this.findHtml = (selector, el) => self.getHtml(self.get(selector, el));
	this.html = function(list, value) { value = value || EMPTY; return self.each(list, el => { el.innerHTML = value; }); }
	this.setHtml = (selector, value, el) => self.html(self.getAll(selector, el), value);

	this.mask = (list, mask, name) => self.each(list, (el, i) => el.classList.toggle(name, (mask>>i)&1)); //toggle class by mask
	this.optText = sel => sel ? self.getText(sel.options[sel.selectedIndex]) : null;
	this.select = function(list, mask) {
		return self.each(list, el => { //iterate over all selects
			let option = self.mask(el.options, ~mask, HIDE).get("[value='" + el.value + "']", el);
			if (self.hasClass(option, HIDE)) //current option is hidden => force change
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
	this.setTpl = (name, tpl) => { TEMPLATES[name] = tpl; return self; }
	this.loadTemplates = () =>self.each("template[id]", tpl => self.setTpl(tpl.id, tpl.innerHTML));
	this.render = function(el, formatter) {
		el.id = el.id || fnId(); // force unique id for element
		let key = el.dataset.tpl || el.id; // tpl asociated
		TEMPLATES[key] = TEMPLATES[key] || el.innerHTML;
		el.innerHTML = formatter(TEMPLATES[key]);
		el.classList.toggle(HIDE, !el.innerHTML);
		return self;
	}
	this.format = (list, formatter) => self.each(list, self.render);
	this.replace = (selector, value) => self.each(selector, el => { el.outerHTML = value; });
	this.parse = (selector, formatter)  => self.each(selector, el => { el.outerHTML = formatter(el.outerHTML); });

	// Styles
	this.isVisible = el => el && fnVisible(el);
	this.visible = (selector, el) => self.isVisible(self.get(selector, el));
	this.show = list => self.each(list, el => el.classList.remove(HIDE));
	this.hide = list => self.each(list, el => el.classList.add(HIDE));
	this.hasClass = (el, name) => el && fnSplit(name).some(name => el.classList.contains(name));
	this.addClass = function(list, name) {
		const names = fnSplit(name); // Split value by " " (class separator)
		return self.each(list, el => { names.forEach(name => el.classList.add(name)); });
	}
	this.removeClass = function(list, name) {
		const names = fnSplit(name); // Split value by " " (class separator)
		return self.each(list, el => { names.forEach(name => el.classList.remove(name)); });
	}
	this.toggle = function(list, name, force) {
		const names = fnSplit(name); // Split value by " " (class separator)
		return self.each(list, el => names.forEach(name => el.classList.toggle(name, force)));
	}
	this.toggleHide = function(list, force) {
		return self.toggle(list, HIDE, force);
	}

	this.css = function(list, prop, value) {
		const camelProp = prop.replace(/(-[a-z])/, g => g.replace("-", EMPTY).toUpperCase());
		return self.each(list, el => { el.style[camelProp] = value; });
	}

	// Events
	const ON_CHANGE = "change";
	function fnEvent(el, name, i, fn) {
		el.addEventListener(name, ev => fn(el, ev, i) || ev.preventDefault());
		return self;
	}
	function fnAddEvent(el, name, fn) {
		return el ? fnEvent(el, name, 0, fn) : self;
	}
	this.event = (list, name, fn) => self.each(list, (el, i) => fnEvent(el, name, i, fn));
	this.trigger = (el, name) => { el && el.dispatchEvent(new Event(name)); return self; }
	this.ready = fn => fnEvent(document, "DOMContentLoaded", 0, fn);

	this.click = (list, fn) => self.each(list, (el, i) => fnEvent(el, "click", i, fn));
	this.onClickElem = (selector, fn) => fnAddEvent(self.get(selector), "click", fn);
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
		self.values = selector => self.getInputs(selector).map(el => el.value);
		self.setVal = (selector, value) => self.val(self.getInputs(selector), value);
		self.setValueInput = (selector, value) => self.setValue(self.getInput(selector), value);
		self.copyVal = (i1, i2) => self.setValueInput(i1, self.getVal(i2));
		self.getOptText = selector => self.optText(self.getInput(selector));
		self.setAttrInput = (selector, name, value) => self.setAttr(self.getInput(selector), name, value);
		self.setAttrInputs = (selector, name, value) => self.attr(self.getInputs(selector), name, value);
		self.delAttrInput = (selector, name) => self.delAttr(self.getInput(selector), name);
		self.delAttrInputs = (selector, name) => self.removeAttr(self.getInputs(selector), name);
		self.setInput = (selector, value, fnChange) => {
			const el = self.getInput(selector);
			if (el) {
				fnEvent(el, ON_CHANGE, 0, fnChange);
				fnSetVal(el, value);
			}
			return self;
		}

		self.onChangeForm = (selector, fn) => fnAddEvent(self.getForm(selector), ON_CHANGE, fn);
		self.onSubmitForm = (selector, fn) => fnAddEvent(self.getForm(selector), "submit", fn);
		self.onChangeForms = (selector, fn) => self.change(self.getForms(selector), fn);
		self.onSubmitForms = (selector, fn) => self.submit(fn, self.getForms(selector));
		self.onChangeInput = (selector, fn) => fnAddEvent(self.getInput(selector), ON_CHANGE, fn);
		self.onChangeInputs = (selector, fn) => self.change(self.getInputs(selector), fn);
		self.refocus(inputs); // Set focus on first visible input

		// Extends internacionalization
		self.tr = function(selector, opts) {
			const elements = self.getAll(selector);
			i18n.set("size", elements.length); //size list
			return self.each(elements, (el, i) => {
				i18n.set("index", i).set("count", i + 1);
				self.render(el, tpl => i18n.format(tpl, opts));
			});
		}

		/**************** Tables/rows helper ****************/
		self.onFindRow = (selector, fn) => self.event(self.getTables(selector), "find", fn);
		self.onSelectRow = (selector, fn) => self.event(self.getTables(selector), "select", fn);
		self.onRemoveRow = (selector, fn) => self.event(self.getTables(selector), "remove", fn);
		self.onChangeTable = (selector, fn) => fnAddEvent(self.getTable(selector), ON_CHANGE, fn);
		self.onChangeTables = (selector, fn) => self.change(self.getTables(selector), fn);
		self.onRenderTable = (selector, fn) => fnAddEvent(self.getTable(selector), "render", fn);
		self.onRenderTables = (selector, fn) => self.event(self.getTables(selector), "render", fn);
		self.onPaginationTable = (selector, fn) => self.event(self.getTables(selector), "pagination", fn);

		function fnToggleTbody(table) {
			let tr = self.get("tr.tb-data", table); //has data rows?
			return self.toggle(table.tBodies[0], "hide", !tr).toggle(table.tBodies[1], "hide", tr);
		}
		function fnToggleOrder(links, link, dir) { // Update all sort indicators
			self.removeClass(links, "sort-asc sort-desc") // Remove prev order
				.addClass(links, "sort-none") // Reset all orderable columns
				.toggle(link, "sort-none sort-" + dir); // Column to order table
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

					// Reload pagination click event
					self.click(self.getAll("a", pagination), el => {
						const i = +el.dataset.page; // Current page
						const params = { index: i * pageSize, length: pageSize }; // Event data

						renderPagination(i); // Render all pages
						table.dataset.page = i; // Update current
						table.dispatchEvent(new CustomEvent("pagination", { detail: params })); // Trigger event
					});
				}
				renderPagination(table.dataset.page);
			}
			return self;
		}

		function fnRenderRows(table, data, resume, styles) {
			styles = styles || {}; // Default styles
			styles.getValue = styles.getValue || i18n.val;
			resume.size = data.length; // Numrows
			resume.total = resume.total ?? (+table.dataset.total || data.length); // Parse to int

			self.render(table.tFoot, tpl => sb.format(resume, tpl, styles)) // Render footer
				.render(table.tBodies[0], tpl => ab.format(data, tpl, styles)); // Render rows

			// Find, select and remove events
			self.click(self.getAll("a[href='#find']", table), (el, ev, i) => {
				table.dispatchEvent(new CustomEvent("find", { detail: data[i] }));
			});
			self.click(self.getAll("a[href='#select']", table), (el, ev, i) => {
				table.dispatchEvent(new CustomEvent("select", { detail: i }));
			});
			self.click(self.getAll("a[href='#remove']", table), (el, ev, i) => {
				const msg = styles.remove || "remove"; // specific message
				if (i18n.confirm(msg)) { // confirm before trigger event
					resume.total--; // decrement total rows number
					const obj = data.splice(i, 1)[0]; // Remove from data array
					table.dispatchEvent(new CustomEvent("remove", { detail: obj })); // Trigger event
				}
			});

			table.dispatchEvent(new Event("render")); // Trigger event
			return fnToggleTbody(table); // Toggle body if no data
		}
		self.renderRows = function(table, data, resume, styles) {
			return table ? fnRenderRows(table, data, resume, styles) : self;
		}
		self.list = function(selector, data, resume, styles) {
			return self.each(self.getTables(selector), table => fnRenderRows(table, data, resume, styles));
		}

		function fnRenderTable(table, data, resume, styles) {
			self.renderRows(table, data, resume, styles);
			return fnPagination(table); // Update pagination
		}
		self.renderTable = function(table, data, resume, styles) {
			return table ? fnRenderTable(table, data, resume, styles) : self;
		}
		self.renderTables = function(selector, data, resume, styles) {
			return self.each(self.getTables(selector), table => fnRenderTable(table, data, resume, styles));
		}

		// Initialize all tables
		self.each(tables, table => {
			const links = self.getAll(".sort", table.tHead); // All orderable columns
			if (table.dataset.sortDir) {
				fnToggleOrder(links, // Update sort icons
							self.find(".sort-" + table.dataset.sortBy, links), // Ordered column
							table.dataset.sortDir); // Sort direction
			}

			// Add click event for order table
			self.click(links, el => { // Sort event click
				const dir = self.hasClass(el, "sort-asc") ? "desc" : "asc"; // Toggle sort direction
				fnToggleOrder(links, el, dir); // Update all sort indicators
			});

			fnToggleTbody(table); // Toggle body if no data
			fnPagination(table); // Update pagination
		});
		/**************** Tables/rows helper ****************/

		// Clipboard function
		TEXT.style.position = "absolute";
		TEXT.style.left = "-9999px";
		document.body.prepend(TEXT);
	});
}
