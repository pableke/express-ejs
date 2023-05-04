
import ab from "./array-box.js";
import dt from "./date-box.js";
import nb from "./number-box.js";
import sb from "./string-box.js";
import api from "./api-box.js";
import dom from "./dom-box.js";
import i18n from "./i18n-box.js";

//DOM is fully loaded
dom.ready(function() {
	// Scroll body to top on click and toggle back-to-top arrow
	const _top = document.body.lastElementChild;
	window.onscroll = function() { dom.toggle(_top, "hide", this.pageYOffset < 80); }
	dom.click(_top, el => !dom.scroll());

	// Loading div
	const _loading = _top.previousElementSibling;
	dom.loading = () => dom.show(_loading).closeAlerts();
	dom.working = () => dom.fadeOut(_loading);
	// End loading div

	// Extends dom-box actions (require jquery)
	dom.autocomplete = function(selector, opts) {
		const input = dom.get(selector); //Autocomplete inputs
		const id = dom.sibling(input, "[type=hidden]"); //id associated

		const fnNull = param => null;
		const fnClear = param => { dom.setValue(input).setValue(id); opts.remove(input); }
		let _search = false; // call source indicator (reduce calls)

		opts = opts || {}; //default config
		opts.action = opts.action || "#"; //request
		opts.minLength = opts.minLength || 3; //length to start
		opts.maxResults = opts.maxResults || 10; //max showed rows (default = 10)
		opts.delay = opts.delay || 500; //milliseconds between keystroke occurs and when a search is performed
		opts.open = opts.open || fnNull; //triggered if the value has changed
		opts.focus = opts.focus || fnNull; //no change focus on select
		opts.sort = opts.sort || ((data) => data); //sort array data received
		opts.remove = opts.remove || fnNull; //triggered when no item selected
		opts.render = opts.render || fnNull; //render on input
		opts.load = opts.load || fnNull; //triggered when select an item
		opts.search = (ev, ui) => _search; //lunch source
		opts.source = function(req, res) {
			this.element.autocomplete("instance")._renderItem = function(ul, item) {
				let label = sb.iwrap(opts.render(item, input, id), req.term); //decore matches
				return $("<li>").append("<div>" + label + "</div>").appendTo(ul);
			}
			dom.ajax(opts.action + "?term=" + req.term).then(data => {
				res(opts.sort(data).slice(0, opts.maxResults));
			});
		}
		opts.select = function(ev, ui) { //triggered when select an item
			opts.load(ui.item, input, id); //update inputs values
			return false; //preserve inputs values from load event
		}
		// Triggered when the field is blurred, if the value has changed
		opts.change = (ev, ui) => { ui.item || fnClear(); }
		dom.event(input, "search", fnClear);

		$(input).autocomplete(opts);
		return dom.keydown(input, (el, ev) => { // Reduce server calls, only for backspace or alfanum
			_search = (ev.keyCode == 8) || sb.between(ev.keyCode, 46, 111) || sb.between(ev.keyCode, 160, 223);
			return true; // preserve default event
		});
	}

	// Testing....
	const RESUME = {};
	const ftest = dom.get("form#test");
	const filter = dom.get("form#filter");
	const pruebas = dom.get("table#pruebas");
	const fnList = data => dom.table(pruebas, data, RESUME).autofocus("#filter");
	let current; // pointer tu current row

	dom.tabs(".tab-content") // Tabs hendlres
		.autofocus("form > input") // Focus on first form
		.toggleInfo("[href='#toggle']") // Info events
		.alerts(_loading.previousElementSibling)
		.click("a[href='#clear-pruebas']", el => pruebas.reset())
		.event(pruebas, "sort-email", ev => { ev.detail.sort = (a, b) => sb.cmp(a.email, b.email); })
		.event(pruebas, "sort-imp", ev => { ev.detail.sort = (a, b) => nb.cmp(a.imp, b.imp); })
		.event(pruebas, "remove", ev => dom.viewTab(2));

	dom.click(".create-data", el => {
		current = {};
		dom.load(ftest)
			.checkbin(ftest, "binary").checklist(ftest, "values")
			.viewTab(3);
	})
	.event(pruebas, "before-render", ev => {
		RESUME.c4 = RESUME.imp = 0;
		dom.toggleHide("a[href='#clear-pruebas']", !ev.detail.size);
	})
	.event(pruebas, "on-render", ev => {
		const data = ev.detail.data;
		const view = ev.detail.view;

		data.memo = data.memo ?? sb.rand();
		data.c4 = data.c4 ?? nb.rand(0, 300);
		data.imp = data.imp ?? nb.rand(100);
		data.fecha = data.fecha || dt.rand().toISOString();
		data.binary = data.binary ?? nb.randInt(0, 15);
		data.values = data.values || [];

		RESUME.c4 += data.c4; RESUME.imp += data.imp;
		ab.copy(["name", "email", "memo"], data, view);
		view.c4 = i18n.isoFloat(data.c4);
		view.imp = i18n.isoFloat(data.imp);
		view.fecha = i18n.fmtDate(data.fecha);
	})
	.event(pruebas, "after-render", ev => {
		ev.detail.c4 = i18n.isoFloat(RESUME.c4);
		ev.detail.imp = i18n.isoFloat(RESUME.imp);
	})
	.event(pruebas, "find", ev => {
		current = ev.detail.data;
		const view = ab.copy(["name", "email", "memo"], current, {});
		view.c4 = i18n.isoFloat(current.c4);
		view.imp = i18n.isoFloat(current.imp);
		view.fecha = sb.isoDate(current.fecha);
		dom.load(ftest, view)
			.checkbin(ftest, "binary", current.binary)
			.checklist(ftest, "values", current.values)
			.viewTab(3);
	})
	.event(pruebas, "change-test", ev => {
		RESUME.c4 -= ev.detail.data.c4;
		ev.detail.data.c4 = i18n.toFloat(ev.detail.element.value);
		RESUME.c4 += ev.detail.data.c4;
	});

	const ENDPOINT = "https://jsonplaceholder.typicode.com/users";
	dom.ajax(ENDPOINT).then(fnList); //call to simulate read data from server

	// Eventos de control para el filtro de la tabla
	dom.setRangeDate(filter, "#f1", "#f2") // Filter range date
		.afterReset(filter, ev => dom.send(filter).then(fnList))
		.submit(filter, ev => !dom.send(filter).then(fnList));

	// Eventos de control para el formulario de datos
	dom.click("a[href='#first-item']", el => pruebas.first())
		.click("a[href='#prev-item']", el => pruebas.prev())
		.click("a[href='#next-item']", el => pruebas.next())
		.click("a[href='#last-item']", el => pruebas.last())
		.click("a[href='#remove-item']", el => pruebas.remove())
		.autocomplete("#name", {
			action: ENDPOINT,
			render: item => item.name,
			load: (item, input, id) => { input.value = item.name; id.value = item.id; }
		});

	dom.click("button#clone", el => {
		if (dom.validate(ftest, current)) {
			// save current on server ....
			current = Object.assign({}, current);
			delete current.id;
		}
	})
	.afterReset(ftest, ev => dom.closeAlerts())
	.submit(ftest, ev => {
		if (dom.validate(ftest, current)) {
			pruebas.update();
			dom.viewTab(2);
		}
	});
});
