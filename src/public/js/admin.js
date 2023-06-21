
import sb from "./lib/string-box.js";
import nb from "./lib/number-box.js";
import dom from "./lib/dom-box.js";
import i18n from "./model/menu.js";

//DOM is fully loaded
dom.ready(function() {
	dom.onLoadTab(3, (ev, tab) => { // MENUS
        const menu = dom.getForm("#menu");
        const filter = dom.getForm("#fmenu");
        const menus = dom.get("table#menus", tab);
        const fnRender = i18n.get("menu");

        //const RESUME = {};
        const TABLE_MENUS = {
            beforeRender: data => dom.toggleHide("a[href='#reset']", !data.size),
            onRender: fnRender,
            find: ev => {
                const current = ev.data;
                const view = fnRender(current, {});
                dom.show(".update-only").load(menu, view).viewTab(4);
            },

            "sort-nombre": (a, b) => sb.cmp(a.nombre, b.nombre),
            "sort-titulo": (a, b) => sb.cmp(a.titulo, b.titulo),
            "sort-orden": (a, b) => nb.cmp(a.orden, b.orden),
            remove: ev => dom.viewTab(3)
        };

        const fnList = data => dom.table(menus, data, TABLE_MENUS).autofocus(filter?.elements);
        dom.ajax("http://localhost:3000/menu/list").then(fnList); //call to simulate read data from server

		// Eventos de control para el filtro de la tabla
		dom.setRangeDate(filter, "#f1", "#f2") // Filter range date
			.afterReset(filter, ev => dom.send(filter).then(fnList))
			.submit(filter, ev => !dom.send(filter).then(fnList));
    });
});
