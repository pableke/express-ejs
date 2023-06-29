
import nb from "./lib/number-box.js";
import dom from "./lib/dom-box.js";
import menu from "./model/menu.js";

//DOM is fully loaded
dom.ready(function() {
    const tabs = {};

    tabs["tab-3"] = tab => {
        const filter = dom.getForm("#fmenu");
        const table = dom.get("table#menus", tab);
        const linksCreate = dom.getAll(".create-data", tab); // ojo uno/varios por tab
        const linksReset = dom.getAll("a[href='#reset']", tab); // ojo uno/varios por tab

        const tabForm = dom.getTab(4); // Menu form tab
        const updateOnly = tabForm.querySelectorAll(".update-only"); // ojo uno/varios por tab

        function fnFormMenu(data) {
            const form = dom.getForm("#menu");
            const validate = menu.getValidator("menu", "validate");
            const endSubmit = () => dom.backTab().showOk("saveOk");
            const endClone = () => dom.hide(updateOnly).setInputVal(form, "id").showOk("saveOk");
            const FORM_MENU = { validate, update: table.update, insert: table.insert };

            // Rewrite submit event when show form tab
            form.onsubmit = ev => { ev.preventDefault(); dom.validate(form, FORM_MENU).then(endSubmit); }
            dom.setClickFrom(tabForm, "button#clone", el => dom.validate(form, FORM_MENU).then(endClone))
                .load(form, data).viewTab(4);
        }
        function fnCreateMenu() {
            dom.hide(updateOnly);
            fnFormMenu();
        }
        function fnViewMenu(data) {
            // Eventos de control para el formulario de datos
            dom.setClickFrom(tabForm, "a[href='#first-item']", ev => fnViewMenu(table.first().data))
                .setClickFrom(tabForm, "a[href='#prev-item']", ev => fnViewMenu(table.prev().data))
                .setClickFrom(tabForm, "a[href='#next-item']", ev => fnViewMenu(table.next().data))
                .setClickFrom(tabForm, "a[href='#last-item']", ev => fnViewMenu(table.last().data))
                .setClickFrom(tabForm, "a[href='#remove-item']", ev => table.remove())
                .show(updateOnly);
            fnFormMenu(data);
        }

        //const RESUME = {};
        const TABLE_MENUS = {
            beforeRender: data => dom.toggleHide(linksReset, !data.size),
            onRender: menu.get("menu"), // Render object
            find: ev => fnViewMenu(ev.data), // Show current data
            "find-padre": ev => fnViewMenu(ev.rows.find(row => (row.id == ev.data.padre))),
            "sort-orden": (a, b) => nb.cmp(a.orden, b.orden),
            "sort-imp": (a, b) => nb.cmp(a.imp, b.imp),
            remove: ev => dom.viewTab(3)
        };

		// Eventos de control para el filtro de la tabla
        const fnList = data => dom.table(table, data, TABLE_MENUS).autofocus(filter?.elements);
		dom.setRangeDate(filter, "#f1", "#f2") // Filter range date
			.afterReset(filter, ev => dom.send(filter).then(fnList))
			.submit(filter, ev => !dom.send(filter).then(fnList))
            .click(linksCreate, el => fnCreateMenu())
            .click(linksReset, el => table.reset())
            .send(filter).then(fnList); // autoload data in table
        delete tabs["tab-3"]; // run once
        return true;
    }

    dom.tabs(".tab-content", tabs) // Tabs hendlres
});
