
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

        function fnViewMenu(data) {
            const form = dom.getForm("#menu"); // form associated to tab
            const updateOnly = form.querySelectorAll(".update-only"); // ojo uno/varios por tab
            const validate = menu.getValidator("menu", "validate");
            const endSubmit = () => dom.backTab().showOk("saveOk");
            const endClone = () => dom.hide(updateOnly).setInputVal(form, "id").showOk("saveOk");
            const FORM_MENU = { validate, update: table.update, insert: table.insert };

            // Rewrite click and submit event when show form tab
            form.onsubmit = ev => { ev.preventDefault(); dom.validate(form, FORM_MENU).then(endSubmit); }
            dom.setAction(form, "#clone", el => dom.validate(form, FORM_MENU).then(endClone))
                .setAction(form, "#remove-item", ev => table.remove())
                .setAction(form, "#first-item", ev => fnViewMenu(table.first().data))
                .setAction(form, "#prev-item", ev => fnViewMenu(table.prev().data))
                .setAction(form, "#next-item", ev => fnViewMenu(table.next().data))
                .setAction(form, "#last-item", ev => fnViewMenu(table.last().data))
                .toggleHide(updateOnly, !data?.id).load(form, data).viewTab(4);
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
		dom.setRangeDate(filter, "#f1", "#f2") // Filter range date
			.afterReset(filter, ev => dom.send(filter).then(fnList))
			.submit(filter, ev => !dom.send(filter).then(fnList))
            .click(linksCreate, el => fnViewMenu())
            .click(linksReset, el => table.reset())
            .send(filter).then(fnList); // autoload data in table
        delete tabs["tab-3"]; // run once
        return true;
    }

    dom.tabs(".tab-content", tabs) // Tabs hendlres
});
