
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
	dom.click(_top, el => document.body.scrollIntoView({ behavior: "smooth" }));

	// Loading div
	const _loading = _top.previousElementSibling;
	dom.loading = () => dom.show(_loading).closeAlerts();
	dom.working = () => dom.fadeOut(_loading);
	// End loading div

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

	// Build tree menu as UL > Li > *
	dom.each("ul.menu", menu => {
		const fnSort = (a, b) => nb.cmp(a.dataset.orden, b.dataset.orden);
		Array.from(menu.children).sort(fnSort).forEach(child => {
			let padre = child.dataset.padre; // Has parent?
			let mask = child.dataset.mask ?? 4; // Default mask = active
			if (padre) { // Move child with his parent
				const li = dom.get("li[id='" + padre + "']", menu);
				if (li) {
					const children = +li.dataset.children || 0;
					if (!children) { // Is first child?
						li.innerHTML += '<ul class="sub-menu"></ul>';
						dom.addClass(li.firstElementChild, "nav-tri")
							.click(li.firstElementChild, ev => !dom.toggle(li, "active")); //usfull on sidebar
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
		dom.show(menu);
	});

	// Testing....
	const RESUME = {};
	const ftest = dom.get("form#test");
	const filter = dom.get("form#filter");
	const pruebas = dom.get("table#pruebas");

	dom.tabs(".tab-content") // Tabs hendlres
		.autofocus("form > input") // Focus on first form
		.toggleInfo("[href='#toggle']") // Info events
		.alerts(_loading.previousElementSibling)
		.click("a[href='#clear-pruebas']", el => pruebas.reset())
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
		const view = ev.detail.view;

		data.nif = data.nif ?? sb.rand(9);
		data.memo = data.memo ?? (sb.rand(nb.randInt(9, 15)) + " " + sb.rand(nb.randInt(5, 12)) + " " + sb.rand(nb.randInt(3, 9)));
		data.c4 = data.c4 ?? nb.rand(0, 300);
		data.imp = data.imp ?? nb.rand(100);
		data.fecha = data.fecha || dt.rand().toISOString();
		data.binary = data.binary ?? nb.randInt(0, 15);
		data.values = data.values || [];
		data.icons = data.icons ?? nb.randInt(0, 3);

		RESUME.c4 += data.c4; RESUME.imp += data.imp;
		i18n.forms.test.render(data, view);
	})
	.event(pruebas, "after-render", ev => {
		ev.detail.c4 = i18n.isoFloat(RESUME.c4);
		ev.detail.imp = i18n.isoFloat(RESUME.imp);
	})
	.event(pruebas, "find", ev => {
		const current = ev.detail.data;
		const view = i18n.forms.test.render(current, {});
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

	const ENDPOINT = "https://jsonplaceholder.typicode.com/users";
	const fnList = data => dom.table(pruebas, data, RESUME).autofocus(filter.elements);
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
		validate: i18n.forms.test.parser,
		update: (data, id) => pruebas.save(data),
		insert: (data, id) => pruebas.save(data, id),
		end: data => dom.viewTab(2).showOk("saveOk")
	};
	const FORM_TEST_CLONE = {
		validate: i18n.forms.test.parser,
		update: (data, id) => pruebas.save(data),
		insert: (data, id) => pruebas.save(data, id),
		end: data => dom.hide(".update-only").setInputVal(ftest, "id").showOk("saveOk")
	};
	dom.click("button#clone", el => !dom.validate(ftest, FORM_TEST_CLONE)) // clone current on server
		.afterReset(ftest, ev => dom.closeAlerts().autofocus(ftest.elements)) // Reset form action
		.submit(ftest, ev => !dom.validate(ftest, FORM_TEST)); // save current on server

	// TESTING...
	const login = { usuario: "admin", clave: "1234" };
	api.post("http://localhost:3000/tests/api/sign", login).then(console.log).catch(dom.showError);
	console.log(ab.chunk([3, 5, 1, 9], "dsfakjksdjfaslp"));
});
