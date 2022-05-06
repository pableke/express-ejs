
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
	function fnSplit(str) { return str ? str.split(/\s+/) : []; } //class separator
	function fnQuery(elem, parent) { return sb.isstr(elem) ? self.get(elem, parent) : elem; }
	function fnQueryAll(list) { return sb.isstr(list) ? document.querySelectorAll(list) : list; }

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
	this.filter = (selector, list) => [...list].filter(el => el.matches(selector));
	this.sort = (list, cb)  => [...fnQueryAll(list)].sort(cb);
	this.map = (list, cb)  => [...fnQueryAll(list)].map(cb);
	this.values = list => self.map(list, el => el.value);
	this.apply = (selector, list, cb) => {
		ab.each(list, el => el.matches(selector) && cb(el));
		return self;
	}

	this.prev = (el, selector) => {
		el = el && el.previousElementSibling;
		while (el) {
			if (el.matches(selector))
				return el;
			el = el.previousElementSibling;
		}
		return null;
	}
	this.next = (el, selector) => {
		el = el && el.nextElementSibling;
		while (el) {
			if (el.matches(selector))
				return el;
			el = el.nextElementSibling;
		}
		return null;
	}
	this.children = (el, selector) => el.parentNode.querySelectorAll(selector);
	this.sibling = (el, selector) => self.prev(el, selector) || self.next(el, selector);

	// Inputs selectors and focusableds
	const INPUTS = "input,textarea,select";
	function fnVisible(el) { return el.offsetWidth || el.offsetHeight || el.getClientRects().length; }
	this.load = (list, data) => self.apply(INPUTS, list, el => { data[el.name] = el.value; });
	this.inputs = el => self.getAll(INPUTS, el);
	this.focus = el => { el && el.focus(); return self; }
	this.checked = el => self.getAll("input:checked", el);
	this.checks = el => self.getAll("input[type=checkbox]", el);
	this.check = (list, value) => self.each(list, el => { el.checked = value; });
	this.binary = (list, mask) => self.each(list, (el, i) => { el.checked = (mask>>i)&1; });
	this.intval = list => {
		let aux = ""; // Binary string, for example: "01001011"
		self.each(list, el => { aux += el.checked ? "1" : "0"; });
		return parseInt(aux, 2); // Bin2Int
	};

	// Contents
	function fnSetVal(el, value) {
		value = value ?? EMPTY; // define value as string
		if (el.tagName === "SELECT") // select option
			el.selectedIndex = self.findIndex("[value='" + value + "']", el.options);
		else if ((el.tagName === "CHECKBOX") || (el.tagName === "RADIO"))
			el.checked = (el.value == value);
		else
			el.value = value;
		return self;
	}
	this.val = (list, value) => self.each(list, el => fnSetVal(el, value));
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

	function fnSetText(el, value) {
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

	this.mask = (list, mask, name) => self.each(list, (el, i) => el.classList.toggle(name, (mask>>i)&1)); //toggle class by mask
	this.view = (list, mask) => self.mask(list, ~mask, HIDE); //toggle hide class by mask
	this.select = function(list, mask) {
		return self.each(list, el => { //iterate over all selects
			const option = el.options[el.selectedIndex]; // get current option
			if (self.view(el.options, mask).hasClass(option, HIDE)) //option hidden => force change
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
	this.loadTemplates = () => self.each("template[id]", tpl => self.setTpl(tpl.id, tpl.innerHTML));
	this.render = function(el, formatter) {
		el.id = el.id || ("_" + sb.rand()); // force unique id for element
		let key = el.dataset.tpl || el.id; // tpl asociated
		TEMPLATES[key] = TEMPLATES[key] || el.innerHTML;
		el.innerHTML = formatter(TEMPLATES[key]);
		el.classList.toggle(HIDE, !el.innerHTML);
		return self;
	}
	this.format = (list, formatter) => self.each(list, el => self.render(el, formatter));
	this.replace = (selector, value) => self.each(selector, el => { el.outerHTML = value; });
	this.parse = (selector, formatter)  => self.each(selector, el => { el.outerHTML = formatter(el.outerHTML); });

	// Styles
	this.isVisible = el => el && fnVisible(el);
	this.visible = (el, parent) => self.isVisible(fnQuery(el, parent));
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
	function fnAddEvents(selector, list, name, fn) {
		return self.apply(selector, list, (el, i) => fnEvent(el, name, i, fn));
	}

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

	this.change = (list, fn) => self.each(list, (el, i) => fnEvent(el, ON_CHANGE, i, fn));
	this.onchange = this.onChange = self.change;

	this.keyup = (list, fn) => self.each(list, (el, i) => fnEvent(el, "keyup", i, fn));
	this.onkeyup = this.onKeyup = self.keyup;

	this.keydown = (list, fn) => self.each(list, (el, i) => fnEvent(el, "keydown", i, fn));
	this.onkeydown = this.onKeydown = self.keydown;

	this.submit = (list, fn) => self.each(list, (el, i) => fnEvent(el, "submit", i, fn));
	this.onsubmit = this.onSubmit = self.submit;

	this.ready(function() {
		i18n.setI18n(self.getLang()); // Set language
		const elements = self.getAll(".tab-content,table,form," + INPUTS);
		const tabs = self.filter(".tab-content", elements); //all tabs
		const tables = self.filter("table", elements); //all html tables
		const forms = self.filter("form", elements); //all html forms
		const inputs = self.filter(INPUTS, elements); //all html inputs

		self.isOk = i18n.isOk;
		self.isError = i18n.isError;
		self.closeAlerts = () => self;

		self.getTable = elem =>  sb.isstr(elem) ? self.find(elem, tables) : elem;
		self.getTables = elem => elem ? self.filter(elem, tables) : tables;
		self.getForm = elem =>  sb.isstr(elem) ? self.find(elem, forms) : elem;
		self.getForms = elem => elem ? self.filter(elem, forms) : forms;
		self.getInput = elem => sb.isstr(elem) ? self.find(elem, inputs) : elem;
		self.getInputs = elem => elem ? self.filter(elem, inputs) : inputs;

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
		self.setInput = (selector, value, fnChange) => {
			const el = self.getInput(selector);
			if (el) {
				fnEvent(el, ON_CHANGE, 0, fnChange);
				fnSetVal(el, value);
			}
			return self;
		}

		const FOCUSABLE = "[tabindex]:not([type=hidden],[readonly],[disabled])";
		function fnFocus(input) { return fnVisible(input) && input.matches(FOCUSABLE); }
		self.setFocus = el => self.focus(sb.isstr(el) ? self.find(el, inputs) : ab.find(self.inputs(el), fnFocus));
		self.focus(inputs.find(fnFocus)); // Set focus on first visible input

		self.onChangeForm = (selector, fn) => fnAddEvent(self.getForm(selector), ON_CHANGE, fn);
		self.onSubmitForm = (selector, fn) => fnAddEvent(self.getForm(selector), "submit", fn);
		self.onChangeForms = (selector, fn) => fnAddEvents(selector, forms, ON_CHANGE, fn);
		self.onSubmitForms = (selector, fn) => fnAddEvents(selector, forms, "submit", fn);
		self.onChangeInput = (selector, fn) => fnAddEvent(self.getInput(selector), ON_CHANGE, fn);
		self.onChangeInputs = (selector, fn) => fnAddEvents(selector, inputs, ON_CHANGE, fn);
		self.onBlurInput = (selector, fn) => fnAddEvent(self.getInput(selector), "blur", fn);

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
		self.getCheckRows = selector => self.checks(self.getTable(selector));
		self.getCheckedRows = selector => self.checked(self.getTable(selector));
		self.onTable = (selector, name, fn) => fnAddEvent(self.getTable(selector), name, fn);
		self.onFindRow = (selector, fn) => self.onTable(selector, "find", fn);
		self.onRemoveRow = (selector, fn) => self.onTable(selector, "remove", fn);
		self.onChangeTable = (selector, fn) => self.onTable(selector, "recalc", fn);
		self.onChangeTables = (selector, fn) => fnAddEvents(selector, tables, "recalc", fn);
		self.onRenderTable = (selector, fn) => self.onTable(selector, "render", fn);
		self.onRenderTables = (selector, fn) => fnAddEvents(selector, tables, "render", fn);
		self.onPaginationTable = (selector, fn) => self.onTable(selector, "pagination", fn);

		function fnToggleTbody(table) {
			let tr = self.get("tr.tb-data", table); //has data rows?
			self.toggle(table.tBodies[0], "hide", !tr).toggle(table.tBodies[1], "hide", tr);
		}
		function fnRendetTfoot(table, resume, styles) {
			return self.render(table.tFoot, tpl => sb.format(resume, tpl, styles));
		}
		self.tfoot = function(table, resume, styles) {
			table = self.getTable(table); // find table on tables array
			return table ? fnRendetTfoot(table, resume, styles) : self; // Render footer
		}
		self.renderTfoot = self.tfoot;

		function fnPagination(table, resume) {
			const pagination = self.next(table, ".pagination"); // Pag section
			if ((resume.pageSize > 0) && pagination) { // Guard clausule
				let pages = Math.ceil(resume.total / resume.pageSize);
				function renderPagination(page) {
					let output = ""; // Output buffer
					function addControl(i, text) {
						i = nb.range(i, 0, pages - 1); // Close range limit
						output += '<a href="#' + i + '">' + text + '</a>';
					}
					function addPage(i) {
						i = nb.range(i, 0, pages - 1); // Close range limit
						output += '<a href="#' + i + '"';
						output += (i == page) ? ' class="active">' : '>';
						output += (i + 1) + '</a>';
					}

					if (pages > 1) {
						let i = 0; // Index
						addControl(page - 1, "&laquo;");
						(pages > 1) && addPage(0);
						i = Math.max(page - 3, 1);
						(i >= 2) && addControl(i - 1, "...");
						let max = Math.min(page + 3, pages - 1);
						while (i <= max)
							addPage(i++);
						(i < (pages - 1)) && addControl(i, "...");
						(i < pages) && addPage(pages - 1);
						addControl(page + 1, "&raquo;");
						pagination.innerHTML = output;

						// Reload pagination click event
						self.click(self.getAll("a", pagination), el => {
							resume.page = sb.lastId(el.href); // Current page
							resume.start = resume.page * resume.pageSize; // Start page index
							resume.end = resume.start + resume.pageSize; // End page index
							self.trigger(table, "pagination", resume); // Trigger event
							renderPagination(resume.page); // Render all pages
						});
					}
					else
						pagination.innerHTML = output;
				}
				renderPagination(resume.page);
			}
		}
		function fnRenderRows(table, data, resume, styles) {
			// Recalc table page indexes
			resume.total = data.length;
			resume.start = resume.start || 0;
			resume.pageSize = resume.pageSize || data.length;
			resume.sortDir = table.dataset.sortDir;
			resume.sortBy = table.dataset.sortBy;
			resume.end = resume.start + resume.pageSize;
			resume.page = +(resume.start / resume.pageSize);
			if (resume.sortBy && resume.sort) // Sort full array
				ab.sort(data, resume.sortDir, resume.sort);
			const aux = data.slice(resume.start, resume.end);
			resume.size = aux.length; // Num page rows

			styles = styles || {}; // Default styles
			styles.getValue = styles.getValue || i18n.val;

			const tbody = table.tBodies[0]; // Data rows
			self.render(tbody, tpl => ab.format(aux, tpl, styles)); // Render rows
			fnRendetTfoot(table, resume, styles); // Render footer

			// Change, find and remove events
			self.change(tbody.children, (row, ev, i) => {
				i += resume.start; // Real index
				self.trigger(table, "recalc", { index: i, data: data[i], element: ev.target, row });
			}).click(self.getAll("a[href]", tbody), el => {
				const name = el.getAttribute("href"); // Name event
				const row = el.closest("tr"); // TR parent row
				const i = resume.start + self.indexOf(row); // Real index
				// If click on remove row link and confirmation is ok, then fire trigger and if all is ok then update view
				if ((name == "#remove") && i18n.confirm(styles.remove || "remove") && self.trigger(table, "remove", data[i]).isOk()) {
					row.remove(); // Remove row 
					resume.size--; // Update size
					resume.total--; // Update total numrows
					data.splice(i, 1); // Remove data row
					if (resume.total == 0) { // Is empty table?
						fnToggleTbody(table); // Toggle body if no data
						fnPagination(table, resume); // Render asociated pages
						fnRendetTfoot(table, resume, styles); // Render footer
					}
					else if (resume.size == 0) { // Is empty Page?
						resume.start = 0; // Go first page
						fnRenderRows(table, data, resume, styles); // Build table rows
					}
					else
						fnRendetTfoot(table, resume, styles); // Render footer
				}
				else if (sb.starts(name, "#find")) // Is find event?
					self.trigger(table, name.substring(1), { index: i, data: data[i], element: el, row });
			});

			fnToggleTbody(table); // Toggle body if no data
			fnPagination(table, resume); // Render asociated pages
			return self.trigger(table, "render"); // Trigger event
		}
		self.table = function(table, data, resume, styles) {
			table = self.getTable(table); // find table on tables array
			return table ? fnRenderRows(table, data, resume, styles) : self;
		}
		self.list = function(selector, data, resume, styles) {
			return self.apply(selector, tables, table => fnRenderRows(table, data, resume, styles));
		}

		// Synonyms
		self.renderTables = self.tables = self.list;
		self.renderRows = self.renderTable = self.table;

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
		let index = self.findIndex(".active", tabs); //current index tab

		self.getTabs = () => tabs; //all tabs
		self.getTab = id => tabs[self.findIndex("#tab-" + id, tabs)]; // Find by id selector
		self.lastId = (str, max) => nb.range(sb.lastId(str) || 0, 0, max || 99); // Extract id

		self.onSaveTab = (id, fn) => self.event(self.getTab(id), "save-" + id, fn);
		self.onPrevTab = (id, fn) => self.event(self.getTab(id), "prev-" + id, fn);
		self.onChangeTab = (id, fn) => self.event(self.getTab(id), "tab-" + id, fn);
		self.onNextTab = (id, fn) => self.event(self.getTab(id), "next-" + id, fn);
		self.onExitTab = fn => self.event(tabs[0], "exit", fn);

		function fnShowTab(i) { //show tab by index
			const size = tabs.length - 1; // tabs length
			i = nb.range(i, 0, size); // Force range
			let tab = tabs[index]; // current tab

			if ((i > 0) || (index > 0)) { // Nav in tabs
				const id = self.closeAlerts().lastId(tab.id);
				if (i > index) // Trigger next event
					self.trigger(tab, "next-" + id);
				else if (i < index) // Trigger prev event
					self.trigger(tab, "prev-" + id);
				// Always trigger change event
				self.trigger(tab, tab.id);

				if (self.isOk()) { // Only change tab if ok
					tab = tabs[i]; // next tab
					const progressbar = self.get("#progressbar");
					if (progressbar) { // progressbar is optional
						const step = "step-" + i; //go to a specific step on progressbar
						self.each(progressbar.children, li => self.toggle(li, "active", li.id <= step));
					}
					index = i; // set current index
					self.toggleHide("[href='#tab-0']", index < 2)
						.toggleHide("[href='#next-tab']", index >= size)
						.toggleHide("[href='#last-tab']", index >= (size - 1))
						.removeClass(tabs, "active").addClass(tab, "active")
						.setFocus(tab).scroll();
				}
			}
			else // Is first tab and click on prev button
				self.trigger(tab, "exit"); // Trigger exit event
			return self;
		}

		self.prevTab = () => fnShowTab(index - 1);
		self.nextTab = () => fnShowTab(index + 1);
		self.viewTab = id => fnShowTab(self.findIndex("#tab-" + id, tabs)); //find by id selector
		self.lastTab = () => fnShowTab(99);

		self.onclick("a[href='#prev-tab']", () => !self.prevTab());
		self.onclick("a[href='#next-tab']", () => !self.nextTab());
		self.onclick("a[href='#last-tab']", () => !self.lastTab());
		self.onclick("a[href^='#tab-']", el => !self.viewTab(self.lastId(el.href)));
		self.addClick("a[href='#save-tab']", el => { // Trigger save event
			const tab = tabs[index]; // Current tab element
			self.trigger(tab, "save-" + self.lastId(tab.id));
		});

		// Clipboard function
		TEXT.style.position = "absolute";
		TEXT.style.left = "-9999px";
		document.body.prepend(TEXT);
	});
}
