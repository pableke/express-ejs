
import nb from "./lib/number-box.js";
import sb from "./lib/string-box.js";
import dom from "./lib/dom-box.js";
import i18n from "./lib/i18n-box.js";
import langs from "./i18n/langs.js";

//DOM is fully loaded
dom.ready(function() {
	i18n.setLangs(langs).load();

	// Scroll body to top on click and toggle back-to-top arrow
	const _top = document.body.lastElementChild;
	window.onscroll = function() { dom.toggle(_top, "hide", this.scrollY < 80); }
	dom.click(_top, el => document.body.scrollIntoView({ behavior: "smooth" }));

	// Loading div
	const _loading = _top.previousElementSibling;
	dom.loading = () => dom.show(_loading).closeAlerts();
	dom.working = () => dom.fadeOut(_loading);
	// End loading div

	// Build tree menu as UL > Li > *
	const menu = dom.get("ul.menu");
	const fnSort = (a, b) => nb.cmp(a.dataset.orden, b.dataset.orden);
	Array.from(menu?.children).sort(fnSort).forEach(child => {
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

	dom.tabs(".tab-content") // Tabs hendlres
		.toggleInfo("[href='#toggle']") // Info links
		.autofocus(document.forms[0]?.elements) // Focus on first input
		.alerts(_loading.previousElementSibling);

	dom.onChangeFields(".ui-bool", (ev, el) => { el.value = i18n.fmtBool(el.value); })
		.onChangeFields(".ui-integer", (ev, el) => { el.value = i18n.fmtInt(el.value); dom.toggle(el, "text-err", sb.starts(el.value, "-")); })
		.onChangeFields(".ui-float", (ev, el) => { el.value = i18n.fmtFloat(el.value); dom.toggle(el, "text-err", sb.starts(el.value, "-")); })
});
