
import ab from "./array-box.js";
import nb from "./number-box.js";
import ob from "./object-box.js";
import sb from "./string-box.js";
import i18n from "./i18n-box.js";
import forms from "./i18n-forms.js";
import valid from "./validator-box.js";
import dom from "./dom-box.js";

//DOM is fully loaded
dom.ready(function() {
	// Scroll body to top on click and toggle back-to-top arrow
	const _top = document.body.lastElementChild;
	window.onscroll = function() { dom.toggle(_top, "hide", this.pageYOffset < 80); }
	dom.addClick(_top, el => !dom.scroll());

	// Loading div
	const _loading = _top.previousElementSibling;
	dom.loading = () => dom.show(_loading).closeAlerts();
	dom.working = () => dom.fadeOut(_loading);
	// End loading div

	// Inputs formater
	dom.onChangeInputs(".ui-integer", el => { el.value = i18n.fmtInt(el.value); dom.toggle(el, "texterr", sb.starts(el.value, "-")); })
		.onChangeInputs(".ui-float", el => { el.value = i18n.fmtFloat(el.value); dom.toggle(el, "texterr", sb.starts(el.value, "-")); });

	// Initialize all textarea counter
	const ta = dom.getInputs("textarea[maxlength]");
	function fnCounter(el) {
		let value = Math.abs(el.getAttribute("maxlength") - sb.size(el.value));
		dom.setText(dom.get(".counter", el.parentNode), value);
	}
	dom.keyup(ta, fnCounter).each(ta, fnCounter);

	// Common validators for fields
	dom.addError = dom.setError = dom.setInputError; // Synonym
	dom.required = (el, msg) => dom.setError(el, msg, null, i18n.required);
	dom.gt0 = (el, msg, msgtip) => dom.setError(el, msg, msgtip, i18n.gt0);
	dom.leToday = (el, msg, msgtip) => dom.setError(el, msg, msgtip, i18n.leToday);
	dom.geToday = (el, msg, msgtip) => dom.setError(el, msg, msgtip, i18n.geToday);

	// Extends dom-box actions (require jquery)
	dom.autocomplete = function(selector, opts) {
		const fnFalse = () => false;
		const fnGetIds = el => dom.get("[type=hidden]", el.parentNode);
		const inputs = dom.getInputs(selector); //Autocomplete inputs
		let _search = false; //call source indicator (reduce calls)

		opts = opts || {}; //default config
		opts.action = opts.action || "#"; //request
		opts.minLength = opts.minLength || 3; //length to start
		opts.maxResults = opts.maxResults || 10; //max showed rows (default = 10)
		opts.delay = opts.delay || 500; //milliseconds between keystroke occurs and when a search is performed
		opts.open = opts.open || fnFalse; //triggered if the value has changed
		opts.focus = opts.focus || fnFalse; //no change focus on select
		opts.load = opts.load || fnFalse; //triggered when select an item
		opts.sort = opts.sort || ((data) => data); //sort array data received
		opts.remove = opts.remove || fnFalse; //triggered when no item selected
		opts.render = opts.render || (() => "-"); //render on input
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

	// Build tree menu as UL > Li > *
	dom.each("ul.menu", menu => {
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
	});

	// TABS events and handlers
	dom.onShowTab(1, tab => { // contact form
		dom.onChangeInput("#correo", el => { el.value = sb.lower(el.value); })
			.onSubmitForm("#contact", form => dom.validate(form, forms.contact) && !dom.send(form).then(msg => dom.setOk(form, msg))) // AJAX Forms
	});
	dom.onLoadTab(2, tab => { //table and form handlers
		const fnMemo = (a, b) => sb.cmp(a.memo, b.memo);
		const RESUME = { index: 0, start: 0, page: 0, pageSize: 5, sort: fnMemo };
		const PARSERS = { imp: i18n.toFloat, imp1: i18n.toFloat, imp2: i18n.toFloat };
		const STYLES = {
			imp: i18n.isoFloat, fecha: i18n.fmtDate,
			onRender: row => { RESUME.imp += (row.imp || 0); } // onRenderRow
		};

		var data; // Container
		const fnCreate = row => !dom.createRow("#test", RESUME, STYLES, row).hide(".update-only");
		const fnView = index => !dom.selectRow("#test", data, RESUME, STYLES, index).show(".update-only").viewTab(3);
		const fnList = arr => { data = arr; dom.repaginate("#pruebas", data, RESUME, STYLES).setFocus("#filter-name"); }
		const fnUpdate = (tab, msg) => dom.updateTable("#pruebas", data, RESUME, STYLES).viewTab(tab).showOk(msg || "saveOk");
		const fnPost = (obj, tab, msg) => { data.push(obj); fnUpdate(tab, msg); };
		const fnValidate = form => {
			var aux = dom.validate(form);
			return aux && Object.assign(RESUME.data, aux);
		}

		const ENDPOINT = "https://jsonplaceholder.typicode.com/users";
		dom.api.get(ENDPOINT).then(fnList); //call to simulate read data from server

		// Eventos de las tablas de consulta
		dom.onRenderTable("#pruebas", (table, ev) => {
			RESUME.imp = 0; // Init. resume: onRenderTable before onRenderRow
			dom.toggleHide("a[href='#clear-pruebas']", !data.length);
		});
		dom.onFindRow("#pruebas", (table, ev) => fnView(ev.detail.index))
			.onRemoveRow("#pruebas", (table, ev) => dom.viewTab(2).showOk("removeOk"))
			.setClick(tab, "a[href='#clear-pruebas']", el => i18n.confirm("removeAll") && !dom.clearTable("#pruebas", data, RESUME, STYLES))
			.onChangeTable("#pruebas", (table, ev) => console.log("change", ev.detail))
			//.onPaginationTable("#pruebas", (table, ev) => dom.table(table, data, RESUME, STYLES))
			.onTable("#pruebas", "sort-name", table => { delete RESUME.sort; })
			.onTable("#pruebas", "sort-memo", table => { RESUME.sort = fnMemo; }) // default sort as string
			.onTable("#pruebas", "sort-imp", table => { RESUME.sort = (a, b) => nb.cmp(a.imp, b.imp); })
			.onTable("#pruebas", "sort-fecha", table => { delete RESUME.sort; }) // default sort as string (isoDate)
			.onSortTable("#pruebas", table => dom.table(table, data, RESUME, STYLES))
			.onChangeInput("#page-size", el => { RESUME.pageSize = +el.value; fnList(data) });

		// Eventos de control para el filtro de la tabla
		dom.setRangeDate("#f1", "#f2") // Filter range date
			.onClick("a.create-data", () => fnCreate({}))
			.afterResetForm("#filter", form => dom.send(form).then(fnList))
			.onSubmitForm("#filter", form => !dom.send(form).then(fnList));

		// Eventos de control para el formulario de datos
		dom.addClick("a[href='#first-item']", el => fnView(0))
			.addClick("a[href='#prev-item']", el => fnView(RESUME.index - 1))
			.addClick("a[href='#next-item']", el => fnView(RESUME.index + 1))
			.addClick("a[href='#last-item']", el => fnView(data.length))
			.addClick("a[href='#remove-item']", el => !dom.removeRow("#pruebas", data, RESUME, STYLES))
			.parse("#entidades", tpl => sb.entries(valid.getEntidades(), tpl));
		dom.addClick("button#clone", el => {
			//return fnValidate(form) && !dom.send(form).then(msg => fnUpdate(2, msg));
			if (!fnValidate(el.form))
				return; // errores de validacion
			RESUME.data.id 
					? dom.api.put(ENDPOINT + "/" + RESUME.data.id, RESUME.data).then(user => { fnCreate(ob.flush(user, ["id"])); fnUpdate(3); })
					: dom.api.post(ENDPOINT, RESUME.data).then(user => fnPost(user, 3));
		}).onSubmitForm("#test", form => {
			return fnValidate(form) && !dom.send(form).then(msg => fnUpdate(2, msg));
			/*if (!fnValidate(form))
				return; // errores de validacion
			RESUME.data.id 
					? dom.api.put(ENDPOINT + "/" + RESUME.data.id, RESUME.data).then(user => fnUpdate(2))
					: dom.api.post(ENDPOINT, RESUME.data).then(user => fnPost(user, 2));*/
		});
	});

	// Onclose event tab/browser of client user
	window.addEventListener("unload", ev => dom.ajax("/destroy.html"));
	if (window.grecaptcha) { // Google recptcha
		grecaptcha.ready(function() { // Is ready for token
			grecaptcha.execute("6LeDFNMZAAAAAKssrm7yGbifVaQiy1jwfN8zECZZ", { action: "submit" })
				.then(token => dom.setInputValue("#token", token))
				.catch(dom.showError);
		});
	}

	// Show / Hide related info
	dom.onclick("a[href='#toggle']", el => !dom.toggleLink(el))
		.onclick("[data-toggle]", el => !dom.eachChild(el, "i", child => dom.toggle(child, el.dataset.toggle)));
	//dom.onclick("a.ajax", el => !dom.ajax(el.href)).onclick("button.ajax", el => !dom.send(el.form)); // Ajax calls
	//dom.api.post("/tests/sign", { usuario: "pablo", clave: "1234" }).then(token => window.sessionStorage.setItem("web", token)); // Read token
	//dom.api.get("/tests/api/users", "web").then(console.log);
});
