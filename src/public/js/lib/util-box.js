
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
	const inputs = dom.getInputs(); // All inputs list

	// Extends with animationCSS lib
	dom.animate = function(list, animation) {
		// We create a Promise and return it
		return new Promise((resolve, reject) => {
			const animationName = "animate__animated animate__" + animation;

			// When the animation ends, we clean the classes and resolve the Promise
			dom.addClass(list, animationName)
				.events(list, "animationend", (el, ev) => {
					dom.removeClass(list, animationName);
					ev.stopPropagation();
					resolve(el);
				});
		});
	}
	dom.fadeIn = list => { dom.show(list).animate(list, "fadeIn"); return dom; }
	dom.fadeOut = list => { dom.animate(list, "fadeOut").then(dom.hide); return dom; }

	// Scroll body to top on click and toggle back-to-top arrow
	const _top = document.body.lastElementChild;
	window.onscroll = function() { dom.toggle(_top, "hide", this.pageYOffset < 80); }
	dom.addClick(_top, el => !dom.scroll());

	// Loading div
	const _loading = _top.previousElementSibling;
	dom.loading = () => dom.show(_loading).closeAlerts();
	dom.working = () => dom.fadeOut(_loading);
	// End loading div

	// Alerts handlers
	const alerts = _loading.previousElementSibling;
	const texts = dom.getAll(".alert-text", alerts);
	function setAlert(el, txt) {
		return txt ? dom.fadeIn(el.parentNode).setHtml(el, txt).scroll() : dom;
	}

	dom.showOk = msg => setAlert(texts[0], msg); //green
	dom.showInfo = msg => setAlert(texts[1], msg); //blue
	dom.showWarn = msg => setAlert(texts[2], msg); //yellow
	dom.showError = msg => setAlert(texts[3], msg); //red
	dom.showAlerts = function(msgs) { //show posible multiple messages types
		return msgs ? dom.showOk(msgs.msgOk).showInfo(msgs.msgInfo).showWarn(msgs.msgWarn).showError(msgs.msgError) : dom;
	}
	dom.closeAlerts = function() { //hide all alerts
		i18n.start(); //reinit. error counter
		const tips = dom.getAll(".ui-errtip"); //tips messages
		return dom.hide(alerts.children).removeClass(inputs, "ui-error").html(tips, "").hide(tips);
	}

	// Show posible server messages and close click event
	dom.each(texts, el => { el.firstChild && dom.fadeIn(el.parentNode); })
		.click(dom.getAll(".alert-close", alerts), el => dom.fadeOut(el.parentNode));

	// Individual input error messages
	dom.setError = function(selector, msg, msgtip, fn) {
		const el = dom.getInput(selector);
		if (el && !(fn && fn(el.name, el.value, msg, msgtip))) {
			i18n.setError(msg, el.name, msgtip); // Show error
			const tip = dom.sibling(el, ".ui-errtip"); // Show tip error
			dom.showError(i18n.getError()).addClass(el, "ui-error").focus(el)
				.setHtml(tip, i18n.getMsg(el.name)).show(tip);
		}
		return dom;
	}
	dom.setErrors = function(data) {
		dom.closeAlerts(); //close prev errros
		if (sb.isstr(data)) //Is string
			return dom.showError(data);
		for (const k in data) //errors list
			dom.setError("[name='" + k + "']", null, data[k]);
		return dom.showAlerts(data); //show global menssages
	}

	// Inputs formater
	dom.each(dom.getInputs(".ui-bool"), el => { el.value = i18n.fmtBool(el.value); });
	dom.onChangeInputs(".ui-integer", el => { el.value = i18n.fmtInt(el.value); dom.toggle(el, "texterr", sb.starts(el.value, "-")); });
	dom.onChangeInputs(".ui-float", el => { el.value = i18n.fmtFloat(el.value); dom.toggle(el, "texterr", sb.starts(el.value, "-")); });

	// Initialize all textarea counter
	const ta = dom.getInputs("textarea[maxlength]");
	function fnCounter(el) {
		let value = Math.abs(el.getAttribute("maxlength") - sb.size(el.value));
		dom.setText(dom.get(".counter", el.parentNode), value);
	}
	dom.keyup(ta, fnCounter).each(ta, fnCounter);

	// Common validators for fields
	dom.addError = dom.setError; // Synonym
	dom.required = (el, msg, msgtip) => dom.setError(el, msg, msgtip, i18n.required);
	dom.login = (el, msg, msgtip) => dom.setError(el, msg, msgtip, i18n.login);
	dom.email = (el, msg, msgtip) => dom.setError(el, msg, msgtip, i18n.email);
	dom.user = (el, msg, msgtip) => dom.setError(el, msg, msgtip, i18n.user);
	dom.intval = (el, msg, msgtip) => dom.setError(el, msg, msgtip, i18n.intval);
	dom.gt0 = (el, msg, msgtip) => dom.setError(el, msg, msgtip, i18n.gt0);
	dom.fk = (el, msg, msgtip) => dom.setError(el, msg, msgtip, i18n.fk);
	dom.past = (el, msg, msgtip) => dom.setError(el, msg, msgtip, i18n.past);
	dom.geToday = (el, msg, msgtip) => dom.setError(el, msg, msgtip, i18n.geToday);

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
		function fnGetIds(el) { return dom.get("[type=hidden]", el.parentNode); }

		opts = opts || {}; //default config
		opts.action = opts.action || "#"; //request
		opts.minLength = opts.minLength || 3; //length to start
		opts.maxResults = opts.maxResults || 10; //max showed rows (default = 10)
		opts.delay = opts.delay || 500; //milliseconds between keystroke occurs and when a search is performed
		opts.open = opts.open || fnFalse; //triggered if the value has changed
		opts.focus = opts.focus || fnFalse; //no change focus on select
		opts.load = opts.load || fnFalse; //triggered when select an item
		opts.sort = opts.sort || data => data; //sort array data received
		opts.remove = opts.remove || fnFalse; //triggered when no item selected
		opts.render = opts.render || () => "-"; //render on input
		opts.search = (ev, ui) => _search; //lunch source
		opts.select = function(ev, ui) { //triggered when select an item
			opts.load(ui.item, this, fnGetIds(this)); //update inputs
			return false; //preserve inputs values from load event
		}
		opts.source = function(req, res) {
			this.element.autocomplete("instance")._renderItem = function(ul, item) {
				let label = sb.iwrap(opts.render(item), req.term); //decore matches
				return $("<li>").append("<div>" + label + "</div>").appendTo(ul);
			}
			dom.ajax(opts.action + "?term=" + req.term, data => {
				res(opts.sort(data).slice(0, opts.maxResults));
			});
		}
		// Triggered when the field is blurred, if the value has changed
		opts.change = function(ev, ui) {
			if (!ui.item) { //item selected?
				dom.val("", this).val("", fnGetIds(this));
				opts.remove(this);
			}
		}
		$(inputs).autocomplete(opts);
		return dom.keydown(inputs, (el, ev) => { // Reduce server calls, only for backspace or alfanum
			_search = (ev.keyCode == 8) || sb.between(ev.keyCode, 46, 111) || sb.between(ev.keyCode, 160, 223);
		});
	}
	// Extends dom-box actions

	// Build tree menu as UL > Li > *
	const menu = dom.get("ul.menu"); // Find unique menu
	if (menu) { // menu exists?
		const children = dom.sort(menu.children, (a, b) => (+a.dataset.orden - +b.dataset.orden));
		children.forEach(child => {
			let padre = child.dataset.padre; // Has parent?
			let mask = child.dataset.mask ?? 4; // Default mask = active
			if (padre) { // Move child with his parent
				let li = dom.get("li[id='" + padre + "']", menu);
				if (li) {
					let children = +li.dataset.children || 0;
					if (!children) { // Is first child?
						li.innerHTML += '<ul class="sub-menu"></ul>';
						li.firstElementChild.innerHTML += '<b class="nav-tri"></b>';
						dom.click(li.firstElementChild, el => !dom.toggle(li, "active")); //usfull on sidebar
					}
					mask &= li.dataset.mask ?? 4; // Propage disabled
					li.dataset.children = children + 1; // add child num
					li.lastElementChild.appendChild(child); // move child
				}
			}
			else // force reorder lebel 1
				menu.appendChild(child);
			dom.toggle(child.firstElementChild, "disabled", !(mask & 4));
		});
		// Show / Hide sidebar and show menu
		dom.onclick(".sidebar-toggle", el => !dom.toggle(menu, "active")).show(menu);
	}

	// Onclose event tab/browser of client user
	/*window.addEventListener("unload", ev => {
		//dom.ajax("/session/destroy.html");
	});*/

	// Show/Hide drop down info
	dom.onclick(".toggle-angle", el => !dom.toggle(dom.get("i.fas", el), "fa-angle-double-down fa-angle-double-up").toggleHide(".info-" + el.id));
	dom.onclick(".toggle-caret", el => !dom.toggle(dom.get("i.fas", el), "fa-caret-right fa-caret-down").toggleHide(".info-" + el.id));
	/**************** Tabs helper ****************/

	// Set error input styles and reallocate focus
	dom.reverse(inputs, el => {
		const tip = dom.get(".ui-errtip", el.parentNode);
		dom.empty(tip) || dom.addClass(el, "ui-error").focus(el);
	});
});
