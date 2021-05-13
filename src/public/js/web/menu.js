
js.ready(function() {
	// Build all tree menus as UL > Li
	const opts = { className: "sub-menu" };
	js.getAll("ul.menu").forEach(function(menu) {
		for (let i = 0; i < menu.children.length; ) {
			let child = menu.children[i];
			let mask = child.dataset.mask;
			if ((mask&8) == 8) { // Is parent => add triangle
				child.lastElementChild.innerHTML += '<b class="nav-tri">&rtrif;</b>';
				js.click(child.lastElementChild, (el, ev) => { //usfull on sidebar
					js.toggle(child, "active");
					ev.preventDefault();
				});
			}
			if ((mask&4) == 0) // Disables links
				js.addClass(child.lastElementChild, "disabled");
			let padre = child.dataset.padre;
			if (padre) {
				let li = js.get("li[id='" + padre + "']", menu);
				let submenu = (li.lastElementChild.tagName == "UL") ? li.lastElementChild : js.create("ul", opts);
				li.appendChild(submenu).appendChild(child);
			}
			else
				i++;
		}
		js.fadeIn(menu.children);
	});

	// Show/Hide sidebar
	js.click(js.getAll(".sidebar-toggle"), (el, ev) => {
		js.toggle(js.getAll(".sidebar-icon", el.parentNode), "hide");
		js.toggle(js.get("#sidebar", el.parentNode), "active");
		ev.preventDefault();
	});

	// Scroll body to top on click and toggle back-to-top arrow
	let top = js.get("#back-to-top");
	js.click(top, () => { js.scrollTop(400); });
	window.onscroll = function() {
		(window.pageYOffset > 80) ? js.fadeIn(top) : js.fadeOut(top);
	};

	// Onclose event tab/browser of client user
	window.addEventListener("unload", function(ev) {
		js.ajax("/session/destroy.html");
	});
});
