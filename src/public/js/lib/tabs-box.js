
// Tabs handler
dom.ready(function() {
	let progressbar = dom.get("#progressbar");
	let tabs = dom.getAll(".tab-content");
	let index = dom.findIndex(".active", tabs); //current index tab

	dom.getTab = (id) => tabs[dom.findIndex("#tab-" + id, tabs)]; //find by id selector
	dom.setTabs = () => { tabs = dom.getAll(".tab-content"); return dom; }
	dom.hrefIndex = (href, max) => nb.range(+href.substr(href.lastIndexOf("-") + 1) || 0, 0, max);

	dom.showTab = function(i) { //show tab by index
		index = nb.range(i, 0, tabs.length - 1);
		if (progressbar) { // progressbar is optional
			const step = "step-" + index; //go to a specific step on progressbar
			dom.each(li => dom.toggle("active", li.id <= step, li), progressbar.children);
		}
		const tab = tabs[index]; // current tab
		return dom.removeClass("active", tabs).addClass("active", tab).setFocus(tab).scroll();
	}
	dom.prevTab = () => dom.showTab(index - 1);
	dom.nextTab = () => dom.showTab(index + 1);
	dom.viewTab = (id) => dom.showTab(dom.findIndex("#tab-" + id, tabs)); //find by id selector

	dom.onclick("a[href='#prev-tab']", () => !dom.prevTab());
	dom.onclick("a[href='#next-tab']", () => !dom.nextTab());
	dom.onclick("a[href^='#tab-']", el => !dom.viewTab(dom.hrefIndex(el.href, 20)));

	// Show/Hide drop down info
	dom.onclick(".show-info", el => {
		return !dom.swapClass("i.fas", "fa-angle-double-down fa-angle-double-up", el).toggleHide(".extra-info-" + el.id);
	});

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
