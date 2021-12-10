
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
	dom.refocus(inputs); //focus on first input

	// Alerts handlers
	const alerts = dom.getAll("div.alert");
	const texts = dom.getAll(".alert-text");
	let errors = 0; //errors counter

	function showAlert(el) { return dom.removeClass("hide", el.parentNode); }
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
	dom.closeAlerts = function() { //hide alerts
		errors = 0; //reinit error counter
		return dom.addClass("hide", alerts).removeClass("ui-error", inputs).set(dom.siblings(".ui-errtip", inputs)).html("").addClass("hide").set();
	}
	dom.setError = function(el, msg, msgtip) { return dom.showError(msg).addClass("ui-error", el).focus(el).set(dom.siblings(".ui-errtip", el)).html(msgtip).removeClass("hide").set(); }
	dom.addError = function(selector, msg, msgtip) { return dom.setError(dom.getInput(selector), msg, msgtip); }
	dom.each(el => { el.firstChild && showAlert(el); }, texts).onclick(".alert-close", closeAlert);

	// Inputs formater
	dom.each(el => { el.value = i18n.fmtBool(el.value); }, dom.getInputs(".ui-bool"));
	dom.onChangeInput(".ui-integer", el => { el.value = i18n.fmtInt(el.value); });
	dom.onChangeInput(".ui-float", el => { el.value = i18n.fmtFloat(el.value); dom.toggle("texterr", sb.starts(el.value, "-"), el); });
	dom.onChangeInput(".ui-date", dom.setDateRange); //auto range date inputs
	// Initialize all textarea counter
	function fnCounter(el) { dom.setText("#counter-" + el.id, Math.abs(el.getAttribute("maxlength") - sb.size(el.value))); }
	dom.set(dom.getInputs("textarea.counter")).attr("maxlength", "600").keyup(fnCounter).each(fnCounter).set();

	// Common validators for fields
	dom.isGt0 = function(el, msg, msgtip) { return i18n.gt0(el.name, el.value) ? dom : dom.setError(el, msg, msgtip); }
	dom.gt0 = function(selector, msg, msgtip) { return dom.isGt0(dom.getInput(selector), msg, msgtip); }
	dom.isRequired = function(el, msg, msgtip) { return i18n.required(el.name, el.value) ? dom : dom.setError(el, msg, msgtip); }
	dom.required = function(selector, msg, msgtip) { return dom.isRequired(dom.getInput(selector), msg, msgtip); }
	dom.isGeToday = function(el, msg, msgtip) { return i18n.geToday(el.name, el.value) ? dom : dom.setError(el, msg, msgtip); }
	dom.geToday = function(selector, msg, msgtip) { return dom.isGeToday(dom.getInput(selector), msg, msgtip); }

	// Show/Hide drop down info
	dom.onclick(".show-info", el => {
		return !dom.load("i.fas", el).toggle("fa-chevron-double-down fa-chevron-double-up").toggleHide(".extra-info-" + el.id).set();
	});

	// Tabs handler
	const tabs = dom.getAll("div.tab-content");
	dom.getTab = function(i) { return tabs.find("#tab-" + i); }
	dom.showTab = function(i) {
		const tab = dom.removeClass("active", tabs).getTab(i);
		return dom.addClass("active", tab).setFocus(tab);
	}
	dom.progressbar = function(i) {
		const step = "step-" + i; //go to a specific step on progressbar and tab
		return dom.forEach("ul#progressbar li", li => dom.toggle("active", li.id <= step, li));
	}
	dom.onclick("a[href^='#tab-']", el => {
		let i = el.href.substr(el.href.lastIndexOf("-") + 1);
		return !dom.progressbar(i).showTab(i);
	});

	// Tables helper
	const tables = dom.getAll("table.tb-xeco");
	dom.toggleTbody = function(table) {
		let tr = dom.get("tr.tb-data", table);
		return dom.toggle("hide", !tr, table.tBodies[0]).toggle("hide", tr, table.tBodies[1]);
	}
	dom.getTable = function(selector) { return dom.find(selector, tables); }
	dom.toggleTdata = function(selector) { return dom.toggleTbody(dom.getTable(selector)); }
	dom.reloadTable = function(selector, data, resume, styles) {
		const table = dom.getTable(selector);
		if (table) {
			resume.size = data.length; //numrows
			return dom.format(tpl => sb.format(resume, tpl, styles), table.tFoot)
						.format(tpl => ab.format(data, tpl, styles), table.tBodies[0])
						.toggleTbody(table)
		}
		return dom;
	}
	dom.each(dom.toggleTbody, tables);

	// Extends dom-box actions
	dom.ajax = function(action, resolve, reject) {
		return dom.loading().fetch({
			action: action,
			resolve: resolve || dom.showOk,
			reject: reject || dom.showError
		}).catch(dom.showError) //error handler
			.finally(dom.unloading); //allways
	}
	dom.autocomplete = function(opts) { // Autocomplete inputs
		let _search = false; //call source indicator
		function fnFalse() { return false; }
		function fnGetIds(el) { return dom.siblings("[type=hidden]", el); }

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
			dom.ajax(opts.action + "?term=" + req.term, data => res(data.slice(0, 10)));
		};
		// Triggered when the field is blurred, if the value has changed
		opts.change = function(ev, ui) {
			if (!ui.item) { //item selected?
				dom.val("", this).val("", fnGetIds(this));
				opts.remove(this);
			}
		};
		$(opts.inputs).autocomplete(opts);
		return dom.set(opts.inputs).keydown((el, ev) => { // Reduce server calls, only for backspace or alfanum
			_search = (ev.keyCode == 8) || sb.between(ev.keyCode, 46, 111) || sb.between(ev.keyCode, 160, 223);
		});
	}

	// Loading div
	const _loading = dom.get(".loading");
	dom.loading = function() { return dom.addClass("hide", _loading).closeAlerts(); }
	dom.unloading = function() { return dom.removeClass("hide", _loading); }
	// End loading div

	// Scroll body to top on click and toggle back-to-top arrow
	let top = dom.append('<a id="back-to-top" href="#top" class="hide back-to-top"><i class="fas fa-chevron-up"></i></a>').get("a#back-to-top");
	window.onscroll = function() { dom.toggle("hide", this.pageYOffset < 80, top); }
	dom.click(() => dom.scroll(), top);
});
