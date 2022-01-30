
// Tabs handler
dom.ready(function() {
	let progressbar = dom.get("#progressbar");
	let tabs = dom.getAll(".tab-content");
	let index = dom.findIndex(".active", tabs); //current index tab

	dom.hrefIndex = (href, max) => nb.range(+href.substr(href.lastIndexOf("-") + 1) || 0, 0, max);
	dom.getTab = (id) => tabs[dom.findIndex("#tab-" + id, tabs)]; //find by id selector
	dom.getTabs = () => tabs; //all tabs
	dom.setTabs = () => { tabs = dom.getAll(".tab-content"); return dom; }

	dom.onSaveTab = (id, fn) => dom.event("save-" + id, fn, dom.getTab(id));
	dom.onChangeTab = (id, fn) => dom.event("tab-" + id, fn, dom.getTab(id));
	dom.onExitTab = fn => dom.event("exit", fn, tabs[0]);

	dom.isFirstTab = () => (index == 0);
	dom.isLastTab = () => (index == (tabs.length - 1));

	dom.showTab = function(i) { //show tab by index
		let size = tabs.length; // tabs length
		i = nb.range(i, 0, size - 1); // Force range

		const tab = tabs[i]; // current tab
		if ((i == 0) && (index == 0)) {
			tab.dispatchEvent(new Event("exit")); // Trigger event
			return dom; // exit tabs form
		}
		tab.dispatchEvent(new Event(tab.id)); // Trigger event

		if (dom.isOk()) { // Only change tab if ok
			if (progressbar) { // progressbar is optional
				const step = "step-" + i; //go to a specific step on progressbar
				dom.each(li => dom.toggle("active", li.id <= step, li), progressbar.children);
			}
			index = i; // set current index
			dom.toggleHide("[href='#tab-0']", index < 2)
				.toggleHide("[href='#next-tab']", index >= (size - 1))
				.toggleHide("[href='#last-tab']", index >= (size - 2))
				.removeClass("active", tabs).addClass("active", tab).setFocus(tab).scroll();
		}
		return dom;
	}
	dom.prevTab = () => dom.showTab(index - 1);
	dom.nextTab = () => dom.showTab(index + 1);
	dom.lastTab = () => dom.showTab(tabs.length + 1);
	dom.viewTab = (id) => dom.showTab(dom.findIndex("#tab-" + id, tabs)); //find by id selector

	dom.onclick("a[href='#prev-tab']", () => !dom.prevTab());
	dom.onclick("a[href='#next-tab']", () => !dom.nextTab());
	dom.onclick("a[href='#last-tab']", () => !dom.lastTab());
	dom.onclick("a[href^='#tab-']", el => !dom.viewTab(dom.hrefIndex(el.href, 20)));
	dom.onClickElem("a[href='#save-tab']", el => !tabs[index].dispatchEvent(new Event("save-" + index))); // Trigger event

	// Show/Hide drop down info
	dom.onclick(".toggle-angle", el => !dom.swapClass("i.fas", "fa-angle-double-down fa-angle-double-up", el).toggleHide(".info-" + el.id));
	dom.onclick(".toggle-caret", el => !dom.swapClass("i.fas", "fa-caret-right fa-caret-down", el).toggleHide(".info-" + el.id));

	// Build tree menu as UL > Li > *
	const menu = dom.get("ul.menu"); // Find unique menu
	const children = Array.from(menu.children); // JS Array
	children.sort((a, b) => (+a.dataset.orden - +b.dataset.orden));
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
					dom.click(el => !dom.swap("active", li), li.firstElementChild); //usfull on sidebar
				}
				mask &= li.dataset.mask ?? 4; // Propage disabled
				li.dataset.children = children + 1; // add child num
				li.lastElementChild.appendChild(child); // move child
			}
		}
		else // force reorder lebel 1
			menu.appendChild(child);
		dom.toggle("disabled", !(mask & 4), child.firstElementChild);
	});
	// Show / Hide sidebar and show menu
	dom.onclick(".sidebar-toggle", el => !dom.swap("active", menu))
		.removeClass("hide", menu);
});
