
import dt from "./lib/date-box.js";
import nb from "./lib/number-box.js";
import sb from "./lib/string-box.js";
import dom from "./lib/dom-box.js";
import i18n from "./model/test.js";

//DOM is fully loaded
dom.ready(function() {
	dom.onLoadTab(2, (ev, tab) => {
		const ftest = dom.getForm("#test");
		const filter = dom.getForm("#filter");
		const pruebas = dom.get("table#pruebas");
		const fnRender = i18n.get("test");

		const RESUME = {};
		const TABLE_PRUEBAS = {
			beforeRender: data => {
				RESUME.c4 = RESUME.imp = 0;
				dom.toggleHide("a[href='#clear-pruebas']", !data.size);
			},
			onRender: (data, view) => {
				data.nif = data.nif ?? sb.rand(9);
				data.memo = data.memo ?? (sb.rand(nb.randInt(9, 15)) + " " + sb.rand(nb.randInt(5, 12)) + " " + sb.rand(nb.randInt(3, 9)));
				data.c4 = data.c4 ?? nb.rand(0, 300);
				data.imp = data.imp ?? nb.rand(100);
				data.fecha = data.fecha || dt.rand().toISOString();
				data.binary = data.binary ?? nb.randInt(0, 15);
				data.values = data.values || [];
				data.icons = data.icons ?? nb.randInt(0, 3);
	
				RESUME.c4 += data.c4; RESUME.imp += data.imp;
				fnRender(data, view);
			},
			afterRender: data => {
				data.c4 = i18n.isoFloat(RESUME.c4);
				data.imp = i18n.isoFloat(RESUME.imp);
			},

			find: ev => {
				const current = ev.data;
				const view = fnRender(current, {});
				dom.show(".update-only").load(ftest, view)
					.checkbin(ftest, "binary", current.binary)
					.checklist(ftest, "values", current.values)
					.checkbin(ftest, "icons", current.icons)
					.viewTab(3);
			},
			"change-test": ev => {
				RESUME.c4 -= ev.data.c4;
				ev.data.c4 = i18n.toFloat(ev.element.value);
				RESUME.c4 += ev.data.c4;
			},

			"sort-email": (a, b) => sb.cmp(a.email, b.email),
			"sort-imp": (a, b) => nb.cmp(a.imp, b.imp),
			remove: ev => dom.viewTab(2)
		}

		dom.click("a[href='#clear-pruebas']", el => pruebas.reset());
		dom.click(".create-data", el => {
			dom.hide(".update-only").load(ftest)
				.checkbin(ftest, "binary").checklist(ftest, "values").checkbin(ftest, "icons")
				.viewTab(3);
		});

		// Gestión de formularios
		const ENDPOINT = "https://jsonplaceholder.typicode.com/users";
		const fnList = data => dom.table(pruebas, data, TABLE_PRUEBAS).autofocus(filter?.elements);
		dom.ajax(ENDPOINT).then(fnList); //call to simulate read data from server

		// Eventos de control para el filtro de la tabla
		dom.setRangeDate(filter, "#f1", "#f2") // Filter range date
			.afterReset(filter, ev => dom.send(filter).then(fnList))
			.submit(filter, ev => !dom.send(filter).then(fnList));

		// Eventos de control para el formulario de datos
		dom.request(ftest, "a#uploads", msg => dom.setOk(ftest, msg))
			.click("a[href='#first-item']", ev => pruebas.first())
			.click("a[href='#prev-item']", ev => pruebas.prev())
			.click("a[href='#next-item']", ev => pruebas.next())
			.click("a[href='#last-item']", ev => pruebas.last())
			.click("a[href='#remove-item']", ev => pruebas.remove())
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
			.submit(ftest, ev => !dom.validate(ftest, FORM_TEST)); // save current on server
	})
});
