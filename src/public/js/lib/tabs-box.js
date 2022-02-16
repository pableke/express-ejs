
// Tabs handler
dom.ready(function() {
	let tabs = dom.getAll(".tab-content");
	let index = dom.findIndex(".active", tabs); //current index tab

	dom.hrefIndex = (href, max) => nb.maxval(+href.substr(href.lastIndexOf("-") + 1) || 0, max);
	dom.getTab = id => tabs[dom.findIndex("#tab-" + id, tabs)]; //find by id selector
	dom.getTabs = () => tabs; //all tabs
	dom.setTabs = () => { tabs = dom.getAll(".tab-content"); return dom; }

	dom.onSaveTab = (id, fn) => dom.event(dom.getTab(id), "save-" + id, fn);
	dom.onPrevTab = (id, fn) => dom.event(dom.getTab(id), "prev-" + id, fn);
	dom.onChangeTab = (id, fn) => dom.event(dom.getTab(id), "tab-" + id, fn);
	dom.onNextTab = (id, fn) => dom.event(dom.getTab(id), "next-" + id, fn);
	dom.onExitTab = fn => dom.event(tabs[0], "exit", fn);

	dom.isFirstTab = () => (index == 0);
	dom.isLastTab = () => (index == (tabs.length - 1));

	dom.showTab = function(i) { //show tab by index
		const size = tabs.length - 1; // tabs length
		i = nb.range(i, 0, size); // Force range

		let tab = tabs[index]; // current tab
		if ((i == 0) && (index == 0)) {
			tab.dispatchEvent(new Event("exit")); // Trigger event
			return dom; // exit tabs form
		}

		const id = dom.hrefIndex(tab.id, 50);
		if (i > index) // Trigger next event
			tab.dispatchEvent(new Event("next-" + id));
		else if (i < index) // Trigger prev event
			tab.dispatchEvent(new Event("prev-" + id));
		// Always trigger change event
		tab.dispatchEvent(new Event(tab.id));

		if (dom.isOk()) { // Only change tab if ok
			tab = tabs[i]; // next tab
			const progressbar = dom.get("#progressbar");
			if (progressbar) { // progressbar is optional
				const step = "step-" + i; //go to a specific step on progressbar
				dom.each(progressbar.children, li => dom.toggle(li, "active", li.id <= step));
			}
			index = i; // set current index
			dom.toggleHide("[href='#tab-0']", index < 2)
				.toggleHide("[href='#next-tab']", index >= size)
				.toggleHide("[href='#last-tab']", index >= (size - 1))
				.removeClass(tabs, "active").addClass(tab, "active").setFocus(tab).scroll();
		}
		return dom;
	}

	dom.prevTab = () => dom.showTab(index - 1);
	dom.nextTab = () => dom.showTab(index + 1);
	dom.lastTab = () => dom.showTab(tabs.length + 1);
	dom.viewTab = id => dom.showTab(dom.findIndex("#tab-" + id, tabs)); //find by id selector

	dom.onclick("a[href='#prev-tab']", () => !dom.prevTab());
	dom.onclick("a[href='#next-tab']", () => !dom.nextTab());
	dom.onclick("a[href='#last-tab']", () => !dom.lastTab());
	dom.onclick("a[href^='#tab-']", el => !dom.viewTab(dom.hrefIndex(el.href, 50)));
	dom.onClickElem("a[href='#save-tab']", el => { // Trigger save event
		const tab = tabs[index]; // Current tab
		const id = dom.hrefIndex(tab.id, 50);
		tab.dispatchEvent(new Event("save-" + id));
	});

	// Show/Hide drop down info
	dom.onclick(".toggle-angle", el => !dom.toggle(dom.get("i.fas", el), "fa-angle-double-down fa-angle-double-up").toggleHide(".info-" + el.id));
	dom.onclick(".toggle-caret", el => !dom.toggle(dom.get("i.fas", el), "fa-caret-right fa-caret-down").toggleHide(".info-" + el.id));

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
					dom.click(li.firstElementChild, el => !dom.toggle(li, "active")); //usfull on sidebar
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
	// Show / Hide sidebar and show menu
	dom.onclick(".sidebar-toggle", el => !dom.toggle(menu, "active")).show(menu);
});
