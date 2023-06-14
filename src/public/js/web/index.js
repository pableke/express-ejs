
import dt from "../lib/date-box.js";
import nb from "../lib/number-box.js";
import sb from "../lib/string-box.js";
import dom from "../lib/dom-box.js";
import i18n from "../lib/i18n-box.js";
import langs from "./i18n/langs.js";

//DOM is fully loaded
dom.ready(function() {
	i18n.setLangs(langs).load();

	// Extends dom-box actions (require jquery)
	dom.autocomplete = function(form, selector, opts) {
		const input = dom.getInput(form, selector); //Autocomplete input
		const id = dom.sibling(input, "[type=hidden]"); //id associated

		const fnNull = param => null;
		const fnClear = param => { dom.setValue(input).setValue(id); opts.remove(input); }
		let _search, _searching; // call source indicator (reduce calls)

		opts = opts || {}; //default config
		opts.action = opts.action || "#"; //request
		opts.minLength = opts.minLength || 3; //length to start
		opts.maxResults = opts.maxResults || 10; //max showed rows (default = 10)
		opts.delay = opts.delay || 500; //milliseconds between keystroke occurs and when a search is performed
		opts.open = opts.open || fnNull; //triggered if the value has changed
		opts.focus = opts.focus || fnNull; //no change focus on select
		opts.sort = opts.sort || ((data) => data); //sort array data received
		opts.remove = opts.remove || fnNull; //triggered when no item selected
		//opts.render = opts.render || fnNull; //render on input (mandatory)
		//opts.load = opts.load || fnNull; //triggered when select an item (mandatory)
		opts.source = function(req, res) {
			if (_search && !_searching) {
				_searching = true; // Avoid new searchs
				this.element.autocomplete("instance")._renderItem = function(ul, item) {
					let label = sb.iwrap(opts.render(item, input, id), req.term); //decore matches
					return $("<li>").append("<div>" + label + "</div>").appendTo(ul);
				}
				dom.ajax(opts.action + "?term=" + req.term).then(data => {
					res(opts.sort(data).slice(0, opts.maxResults));
				}).finally(() => {
					_searching = false; // Allow next searchs
				});
			}
		}
		opts.select = function(ev, ui) { //triggered when select an item
			opts.load(ui.item, input, id); //update inputs values
			return false; //preserve inputs values from load event
		}
		// Triggered when the field is blurred, if the value has changed
		opts.change = (ev, ui) => { ui.item || fnClear(); }
		dom.event(input, "search", fnClear);

		$(input).autocomplete(opts);
		return dom.keydown(input, ev => { // Reduce server calls, only for backspace, alfanum or not is searching
			_search = ((ev.keyCode == 8) || sb.between(ev.keyCode, 46, 111) || sb.between(ev.keyCode, 160, 223));
			return true; // preserve default event
		});
	}

	dom.onLoadTab(2, (ev, tab) => {
		const RESUME = {};
		const ftest = dom.getForm("#test");
		const filter = dom.getForm("#filter");
		const pruebas = dom.get("table#pruebas");
		const fnRender = i18n.get("test");

		dom.click("a[href='#clear-pruebas']", el => pruebas.reset())
			.event(pruebas, "sort-email", ev => { ev.detail.sort = (a, b) => sb.cmp(a.email, b.email); })
			.event(pruebas, "sort-imp", ev => { ev.detail.sort = (a, b) => nb.cmp(a.imp, b.imp); })
			.event(pruebas, "remove", ev => dom.viewTab(2));

		dom.click(".create-data", el => {
			dom.hide(".update-only").load(ftest)
				.checkbin(ftest, "binary").checklist(ftest, "values").checkbin(ftest, "icons")
				.viewTab(3);
		})
		.event(pruebas, "before-render", ev => {
			RESUME.c4 = RESUME.imp = 0;
			dom.toggleHide("a[href='#clear-pruebas']", !ev.detail.size);
		})
		.event(pruebas, "on-render", ev => {
			const data = ev.detail.data;
			data.nif = data.nif ?? sb.rand(9);
			data.memo = data.memo ?? (sb.rand(nb.randInt(9, 15)) + " " + sb.rand(nb.randInt(5, 12)) + " " + sb.rand(nb.randInt(3, 9)));
			data.c4 = data.c4 ?? nb.rand(0, 300);
			data.imp = data.imp ?? nb.rand(100);
			data.fecha = data.fecha || dt.rand().toISOString();
			data.binary = data.binary ?? nb.randInt(0, 15);
			data.values = data.values || [];
			data.icons = data.icons ?? nb.randInt(0, 3);

			RESUME.c4 += data.c4; RESUME.imp += data.imp;
			fnRender(data, ev.detail.view);
		})
		.event(pruebas, "after-render", ev => {
			ev.detail.c4 = i18n.isoFloat(RESUME.c4);
			ev.detail.imp = i18n.isoFloat(RESUME.imp);
		})
		.event(pruebas, "find", ev => {
			const current = ev.detail.data;
			const view = fnRender(current, {});
			dom.show(".update-only").load(ftest, view)
				.checkbin(ftest, "binary", current.binary)
				.checklist(ftest, "values", current.values)
				.checkbin(ftest, "icons", current.icons)
				.viewTab(3);
		})
		.event(pruebas, "change-test", ev => {
			RESUME.c4 -= ev.detail.data.c4;
			ev.detail.data.c4 = i18n.toFloat(ev.detail.element.value);
			RESUME.c4 += ev.detail.data.c4;
		});

		// Gestión de formularios
		const ENDPOINT = "https://jsonplaceholder.typicode.com/users";
		const fnList = data => dom.table(pruebas, data, RESUME).autofocus(filter?.elements);
		dom.ajax(ENDPOINT).then(fnList); //call to simulate read data from server

		// Eventos de control para el filtro de la tabla
		dom.setRangeDate(filter, "#f1", "#f2") // Filter range date
			.afterReset(filter, ev => dom.send(filter).then(fnList))
			.submit(filter, ev => !dom.send(filter).then(fnList));

		// Eventos de control para el formulario de datos
		dom.request(ftest, "a#uploads", msg => dom.setOk(ftest, msg))
			.click("a[href='#first-item']", el => pruebas.first())
			.click("a[href='#prev-item']", el => pruebas.prev())
			.click("a[href='#next-item']", el => pruebas.next())
			.click("a[href='#last-item']", el => pruebas.last())
			.click("a[href='#remove-item']", el => pruebas.remove())
			.onChangeFile(ftest, "#adjuntos", console.log)
			.autocomplete(ftest, "#ac-name", {
				action: ENDPOINT,
				render: item => {
					item.nif = item.nif ?? sb.rand(9);
					return item.nif + " - " + item.name;
				},
				load: (item, ac, nif) => {
					item.nif = item.nif ?? sb.rand(9);
					ac.value = item.nif + " - " + item.name;
					nif.value = item.nif;
				}
			});

		const FORM_TEST = {
			validate: i18n.getForm("test"),
			update: (data, id) => pruebas.save(data),
			insert: (data, id) => pruebas.save(data, id),
			end: data => dom.viewTab(2).showOk("saveOk")
		};
		const FORM_TEST_CLONE = {
			validate: i18n.getForm("test"),
			update: (data, id) => pruebas.save(data),
			insert: (data, id) => pruebas.save(data, id),
			end: data => dom.hide(".update-only").setInputVal(ftest, "id").showOk("saveOk")
		};
		dom.click("button#clone", el => !dom.validate(ftest, FORM_TEST_CLONE)) // clone current on server
			.afterReset(ftest, ev => dom.closeAlerts().autofocus(ftest.elements)) // Reset form action
			.submit(ftest, ev => !dom.validate(ftest, FORM_TEST)); // save current on server
	})
});
