
import dt from "./lib/date-box.js";
import nb from "./lib/number-box.js";
import sb from "./lib/string-box.js";
import dom from "./lib/dom-box.js";
import menu from "./model/menu.js";
import test from "./model/test.js";

//DOM is fully loaded
dom.ready(function() {
    const tabs = {};

    tabs["tab-3"] = tab => {
        const filter = dom.getForm("#fmenu");
        const table = dom.get("table#menus", tab);
        const linksCreate = dom.getAll(".create-data", tab); // ojo uno/varios por tab
        const linksReset = dom.getAll("a[href='#reset']", tab); // ojo uno/varios por tab

        function fnViewMenu(data) {
            const form = dom.getForm("#menu"); // form associated to tab
            const updateOnly = form.querySelectorAll(".update-only"); // ojo uno/varios por tab
            const validate = menu.getValidator("menu", "validate");

            const goTo = ev => fnViewMenu(ev.data);
            const endSubmit = () => dom.backTab().showOk("saveOk");
            const endClone = () => dom.hide(updateOnly).setInputVal(form, "id").showOk("saveOk");
            const FORM_SETTINGS = { validate, update: table.update, insert: table.insert };

            // Rewrite click and submit event when show form tab
            form.onsubmit = ev => { ev.preventDefault(); dom.validate(form, FORM_SETTINGS).then(endSubmit); }
            dom.setAction(form, ".clone-item", el => dom.validate(form, FORM_SETTINGS).then(endClone))
                .setAction(form, ".remove-item", ev => table.remove())
                .setAction(form, ".first-item", ev => goTo(table.first()))
                .setAction(form, ".prev-item", ev => goTo(table.prev()))
                .setAction(form, ".next-item", ev => goTo(table.next()))
                .setAction(form, ".last-item", ev => goTo(table.last()))
                .toggleHide(updateOnly, !data.id).load(form, data).viewTab(4);
        }

        //const RESUME = {};
        const TABLE_MENUS = {
            beforeRender: data => dom.toggleHide(linksReset, !data.size),
            onRender: menu.get("menu"), // Render object
            find: ev => fnViewMenu(ev.data), // Show current data
            "find-padre": ev => {
                table.find(row => (row.id == ev.data.padre));
                fnViewMenu(ev.data);
            },
            "sort-orden": (a, b) => nb.cmp(a.orden, b.orden),
            "sort-imp": (a, b) => nb.cmp(a.imp, b.imp),
            remove: ev => dom.viewTab(3)
        };

		// Eventos de control para el filtro de la tabla
        const fnList = data => dom.table(table, data, TABLE_MENUS).autofocus(filter?.elements);
		dom.setRangeDate(filter, "#fmenu-f1", "#fmenu-f2") // Filter range date
			.afterReset(filter, ev => dom.send(filter).then(fnList))
			.submit(filter, ev => !dom.send(filter).then(fnList))
            .click(linksCreate, el => fnViewMenu({ tipo: 1, creado: dt.isoSysDate() }))
            .click(linksReset, el => table.reset())
            .send(filter).then(fnList); // autoload data in table
        delete tabs["tab-3"]; // run once
        return true;
    }

    tabs["tab-5"] = tab => {
		const filter = dom.getForm("#ftest");
        const table = dom.get("table#pruebas", tab);
        const linksCreate = dom.getAll(".create-data", tab); // ojo uno/varios por tab
        const linksReset = dom.getAll("a[href='#reset']", tab); // ojo uno/varios por tab

        const fnRender = test.get("test");

        function fnViewTest(data) {
            const form = dom.getForm("#test"); // form associated to tab
            const updateOnly = form.querySelectorAll(".update-only"); // ojo uno/varios por tab
            const validate = test.getValidator("test", "validate");

            const goTo = ev => fnViewTest(ev.data);
            const endSubmit = () => dom.backTab().showOk("saveOk");
            const endClone = () => dom.hide(updateOnly).setInputVal(form, "id").showOk("saveOk");
            const FORM_SETTINGS = { validate, update: table.update, insert: table.insert };

            // Load click and submit event when show form tab
            const ENDPOINT = "https://jsonplaceholder.typicode.com/users";
            dom.request(form, "a#uploads", msg => dom.setOk(form, msg))
                .onChangeFile(form, "#adjuntos", console.log)
                .autocomplete(form, "#test-nif", {
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
                })
                .checkbin(form, "binary", data?.binary).checkbin(form, "values", data?.values)
                .setAction(form, ".clone-item", el => dom.validate(form, FORM_SETTINGS).then(endClone))
                .setAction(form, ".remove-item", ev => table.remove())
                .setAction(form, ".first-item", ev => goTo(table.first()))
                .setAction(form, ".prev-item", ev => goTo(table.prev()))
                .setAction(form, ".next-item", ev => goTo(table.next()))
                .setAction(form, ".last-item", ev => goTo(table.last()))
                .submit(form, ev => !dom.validate(form, FORM_SETTINGS).then(endSubmit))
                .toggleHide(updateOnly, !data?.id).load(form, data).viewTab(6);
        }

 		const RESUME = {};
		const TABLE_PRUEBAS = {
			beforeRender: data => {
				RESUME.c4 = RESUME.imp = 0;
				dom.toggleHide(linksReset, !data.size);
			},
			onRender: (data, i) => {
				data.nif = data.nif ?? sb.rand(9);
				data.memo = data.memo ?? (sb.rand(nb.randInt(9, 15)) + " " + sb.rand(nb.randInt(5, 12)) + " " + sb.rand(nb.randInt(3, 9)));
				data.c4 = data.c4 ?? nb.rand(0, 300);
				data.imp = data.imp ?? nb.rand(100);
				data.fecha = data.fecha || dt.rand().toISOString();
				data.binary = data.binary ?? nb.randInt(0, 15);
				data.values = data.values || [];
				data.icons = data.icons ?? nb.randInt(0, 3);

				RESUME.c4 += data.c4; RESUME.imp += data.imp;
				return fnRender(data, i);
			},
			afterRender: data => {
				data.c4_i18n = test.isoFloat(RESUME.c4);
				data.imp_i18n = test.isoFloat(RESUME.imp);
			},

			find: ev => fnViewTest(ev.data),
			"change-test": ev => {
				RESUME.c4 -= ev.data.c4;
				ev.data.c4 = test.toFloat(ev.element.value);
				RESUME.c4 += ev.data.c4;
			},

			"sort-email": (a, b) => sb.cmp(a.email, b.email),
			"sort-imp": (a, b) => nb.cmp(a.imp, b.imp),
			remove: ev => dom.viewTab(5)
		}

		// Eventos de control para el filtro de la tabla
		const fnList = data => dom.table(table, data, TABLE_PRUEBAS).autofocus(filter?.elements);
		dom.setRangeDate(filter, "#ftest-f1", "#ftest-f2") // Filter range date
			.afterReset(filter, ev => dom.send(filter).then(fnList))
			.submit(filter, ev => !dom.send(filter).then(fnList))
			.click(linksCreate, el => fnViewTest())
			.click(linksReset, el => table.reset())
			.send(filter).then(fnList); // autoload data in table
        delete tabs["tab-5"]; // run once
        return true;
    }

    dom.tabs(".tab-content", tabs) // Tabs hendlres
});
