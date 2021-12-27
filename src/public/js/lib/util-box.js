
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
			function handleAnimationEnd(el, i, ev) {
				dom.removeClass(animationName, list);
				ev.stopPropagation();
				resolve(el);
			}

			dom.addClass(animationName, list)
				.event("animationend", handleAnimationEnd, list);
		});
	}
	dom.cssAnimate = function(selector, animation) {
		return dom.animate(animation, dom.getAll(selector));
	}

	// Scroll body to top on click and toggle back-to-top arrow
	const _top = document.body.lastElementChild;
	window.onscroll = function() { dom.toggle("hide", this.pageYOffset < 80, _top); }
	dom.click(() => !dom.scroll(), _top);

	// Loading div
	const _loading = _top.previousElementSibling;
	dom.loading = function() { return dom.removeClass("hide", _loading).closeAlerts(); }
	dom.working = function() { return dom.animate("fadeOut", _loading).then(el => dom.addClass("hide", el)); }
	// End loading div

	// Inputs helpers
	const inputs = dom.inputs(); //all html inputs
	dom.getInput = function(selector) { return dom.find(selector, inputs); }
	dom.getInputs = function(selector) { return dom.filter(selector, inputs); }
	dom.moveFocus = function(selector) { return dom.focus(dom.getInput(selector)); }
	dom.findValue = function(selector) { return dom.getValue(dom.getInput(selector)); } //redefine default from dom
	dom.setValue = function(selector, value) { return dom.val(value, dom.getInputs(selector)); } //redefine default function
	dom.setAttr = function(selector, name, value) { return dom.attr(name, value, dom.getInputs(selector)); } //redefine default
	dom.setDateRange = function(el) { return dom.attr("max", el.value, dom.getInput(".ui-min-" + el.id)).attr("min", el.value, dom.getInput(".ui-max-" + el.id)); }
	dom.setDates = function(value, list) { return dom.val(value, list).each(dom.setDateRange, list); } //update value and range
	dom.setDate = function(selector, value) { return dom.setDates(value, dom.getInputs(selector)); }
	dom.onChangeInput = function(selector, fn) { return dom.change(fn, dom.getInputs(selector)); }

	// Alerts handlers
	const alerts = _loading.previousElementSibling;
	const texts = dom.getAll(".alert-text", alerts);
	let errors = 0; //errors counter

	function showAlert(el) { return dom.removeClass("hide", alert).animate("fadeIn", alert); }
	function closeAlert(el) { return dom.addClass("hide", el.parentNode); }
	function setAlert(el, txt) { return showAlert(el).html(txt, el).scroll(); }

	dom.isOk = function() { return (errors == 0); }
	dom.isError = function() { return (errors > 0); }
	dom.showOk = function(msg) { msg && setAlert(texts[0], msg); return dom; } //green
	dom.showInfo = function(msg) { msg && setAlert(texts[1], msg); return dom; } //blue
	dom.showWarn = function(msg) { msg && setAlert(texts[2], msg); return dom; } //yellow
	dom.showError = function(msg) { //red
		if (msg) {
			errors++; //inc new error
			setAlert(texts[3], msg);
		}
		return dom;
	}
	dom.showAlerts = function(msgs) { //show posible multiple messages types
		return msgs ? dom.showOk(msgs.msgOk).showInfo(msgs.msgInfo).showWarn(msgs.msgWarn).showError(msgs.msgError) : dom;
	}
	dom.closeAlerts = function() { //hide all div alerts
		errors = 0; //reinit error counter
		return dom.addClass("hide", alerts.children).removeClass("ui-error", inputs).set(dom.siblings(".ui-errtip", inputs)).html("").addClass("hide").set();
	}
	dom.setError = function(el, msg, msgtip) { return dom.showError(msg).addClass("ui-error", el).focus(el).set(dom.siblings(".ui-errtip", el)).html(msgtip).removeClass("hide").set(); }
	dom.addError = function(selector, msg, msgtip) { return dom.setError(dom.getInput(selector), msg, msgtip); }
	dom.i18nError = function(selector, key, keytip) { return dom.addError(selector, i18n.get(key), i18n.get(keytip)); }
	dom.each(el => { el.firstChild && showAlert(el); }, texts).onclick(".alert-close", closeAlert);

	// Inputs formater
	dom.each(el => { el.value = i18n.fmtBool(el.value); }, dom.getInputs(".ui-bool"));
	dom.onChangeInput(".ui-integer", el => { el.value = i18n.fmtInt(el.value); dom.toggle("texterr", sb.starts(el.value, "-"), el); });
	dom.onChangeInput(".ui-float", el => { el.value = i18n.fmtFloat(el.value); dom.toggle("texterr", sb.starts(el.value, "-"), el); });
	dom.onChangeInput(".ui-date", dom.setDateRange); //auto range date inputs
	// Initialize all textarea counter
	function fnCounter(el) { dom.setText("#counter-" + el.id, Math.abs(el.getAttribute("maxlength") - sb.size(el.value))); }
	dom.set(dom.getInputs("textarea.counter")).attr("maxlength", "600").keyup(fnCounter).each(fnCounter).set();

	// Common validators for fields
	dom.isGt0 = function(el, msg, msgtip) { return i18n.gt0(el.name, el.value) ? dom : dom.setError(el, msg, msgtip); }
	dom.gt0 = function(selector, msg, msgtip) { return dom.isGt0(dom.getInput(selector), msg, msgtip); }
	dom.i18nGt0 = function(selector, key, keytip) { return dom.gt0(selector, i18n.get(key), i18n.get(keytip)); }
	dom.isRequired = function(el, msg, msgtip) { return i18n.required(el.name, el.value) ? dom : dom.setError(el, msg, msgtip); }
	dom.required = function(selector, msg, msgtip) { return dom.isRequired(dom.getInput(selector), msg, msgtip); }
	dom.i18nRequired = function(selector, key, keytip) { return dom.required(selector, i18n.get(key), i18n.get(keytip)); }
	dom.isGeToday = function(el, msg, msgtip) { return i18n.geToday(el.name, el.value) ? dom : dom.setError(el, msg, msgtip); }
	dom.geToday = function(selector, msg, msgtip) { return dom.isGeToday(dom.getInput(selector), msg, msgtip); }
	dom.i18nGeToday = function(selector, key, keytip) { return dom.geToday(selector, i18n.get(key), i18n.get(keytip)); }

	// Show/Hide drop down info
	dom.onclick(".show-info", el => {
		return !dom.swapClass("i.fas", "fa-chevron-double-down fa-chevron-double-up", el).toggleHide(".extra-info-" + el.id);
	});

	// Tabs handler
	let tabs = dom.getAll(".tab-content.tab-active");
	let index = dom.findIndex(".active", tabs); //current index tab
	dom.setFocus(tabs[index]); //try to reallocate focus on active tab
	dom.getTab = function(i) { //get tab by index
		index = Math.min(Math.max(i, 0), tabs.length - 1);
		return tabs[index]; //get tab element
	}
	dom.setTabs = function() { tabs = dom.getAll(".tab-content.tab-active"); return dom; }
	dom.goTab = function(tab) { return dom.removeClass("active", tabs).addClass("active", tab).setFocus(tab); }
	dom.showTab = function(i) { return dom.goTab(dom.getTab(i)); } //show tab by index
	dom.viewTab = function(id) { return dom.showTab(dom.findIndex("#tab-" + id, tabs)); } //find by id selector
	dom.prevTab = function() { return dom.showTab(index - 1); }
	dom.nextTab = function() { return dom.showTab(index + 1); }
	dom.progressbar = function(i) {
		const step = "step-" + i; //go to a specific step on progressbar and tab
		return dom.forEach("ul#progressbar li", li => dom.toggle("active", li.id <= step, li));
	}
	dom.onclick("a[href='#prev-tab']", dom.prevTab);
	dom.onclick("a[href='#next-tab']", dom.nextTab);
	dom.onclick("a[href^='#tab-']", el => {
		let i = el.href.substr(el.href.lastIndexOf("-") + 1);
		return !dom.progressbar(i).viewTab(i);
	});

	// Tables helper
	const tables = dom.getAll("table.tb-xeco");
	dom.getTable = function(selector) { return dom.find(selector, tables); }
	dom.getTables = function(selector) { return dom.filter(selector, tables); }
	function fnToggleTable(table) {
		let tr = dom.get("tr.tb-data", table); //has data rows?
		dom.toggle("hide", !tr, table.tBodies[0]).toggle("hide", tr, table.tBodies[1]);
	}
	dom.reloadTable = function(selector, data, resume, styles) {
		resume.size = data.length; //numrows
		return dom.each(table => {
			dom.render(table.tFoot, tpl => sb.format(resume, tpl, styles))
				.render(table.tBodies[0], tpl => ab.format(data, tpl, styles));
			fnToggleTable(table);
		}, dom.getTables(selector));
	}
	dom.each(fnToggleTable, tables);

	// Extends internacionalization
	dom.tr = function(selector, opts) {
		const elements = dom.getAll(selector);
		i18n.set("size", elements.length); //size list
		return dom.each((el, i) => {
			i18n.set("index", i).set("count", i + 1);
			dom.render(el, tpl => i18n.format(tpl, opts));
		}, elements);
	}

	// Extends dom-box actions (require jquery)
	dom.ajax = function(action, resolve, reject) {
		return dom.loading().fetch({
			action: action,
			resolve: resolve || dom.showOk,
			reject: reject || dom.showError
		}).catch(dom.showError) //error handler
			.finally(dom.working); //allways
	}
	dom.autocomplete = function(selector, opts) {
		const inputs = dom.getInputs(selector); //Autocomplete inputs
		let _search = false; //call source indicator (reduce calls)

		function fnFalse() { return false; }
		function fnParam(data) { return data; }
		function fnGetIds(el) { return dom.siblings("[type=hidden]", el); }

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
		return dom.keydown((el, i, ev) => { // Reduce server calls, only for backspace or alfanum
			_search = (ev.keyCode == 8) || sb.between(ev.keyCode, 46, 111) || sb.between(ev.keyCode, 160, 223);
		}, inputs);
	}
	// Extends dom-box actions

	// Build tree menu as UL > Li > *
	const menu = dom.get("ul.menu"); // Find unique menu
	const children = Array.from(menu.children); // JS Array
	function setMenuDisabled(node, mask) { //Disable link?
		mask = mask ?? 4; // Default mask = active
		(mask & 4) || dom.addClass("disabled", node.firstElementChild);
	}

	children.sort((a, b) => (+a.dataset.orden - +b.dataset.orden));
	children.forEach(child => {
		let padre = child.dataset.padre; // Has parent?
		if (padre) { // Move child with his parent
			let li = dom.get("li[id='" + padre + "']", menu);
			if (li) {
				let children = li.dataset.children || 0;
				if (!children) { // Is first child?
					li.innerHTML += '<ul class="sub-menu"></ul>';
					li.firstElementChild.innerHTML += '<b class="nav-tri">&rtrif;</b>';
					dom.click(el => !dom.toggle("active", undefined, li), li.firstElementChild); //usfull on sidebar
				}
				li.dataset.children = children + 1;
				li.lastElementChild.appendChild(child);
				setMenuDisabled(child, li.dataset.mask); // Propage disabled
			}
		}
		else // force reorder lebel 1
			menu.appendChild(child);
		setMenuDisabled(child, child.dataset.mask);
	});
	// Show / Hide sidebar and show menu
	dom.onclick(".sidebar-toggle", el => !dom.toggle("active", undefined, menu))
		.removeClass("hide", menu);

	// Onclose event tab/browser of client user
	window.addEventListener("unload", ev => {
		//dom.ajax("/session/destroy.html");
	});
});
