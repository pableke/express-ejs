
js.ready(function() {
	// Build all tree menus as UL > Li
	js.getAll("ul.menu").forEach(function(menu) {
		let children = Array.from(menu.children);
		children.sort((a, b) => (+a.dataset.orden - +b.dataset.orden));
		children.forEach(child => {
			let mask = child.dataset.mask;
			if ((mask&8) == 8) { // Is parent => add triangle
				child.innerHTML += '<ul class="sub-menu"></ul>';
				child.firstElementChild.innerHTML += '<b class="nav-tri">&rtrif;</b>';
				js.click(child.firstElementChild, (el, ev) => { //usfull on sidebar
					js.toggle(child, "active");
					ev.preventDefault();
				});
			}
			if ((mask&4) == 0) // Disables links
				js.addClass(child.firstElementChild, "disabled");
		});

		for (let i = 0; i < menu.children.length; ) {
			let child = menu.children[i];
			let padre = child.dataset.padre;
			if (padre) { // Move child with his parent
				let li = js.get("li[id='" + padre + "']", menu);
				li && li.lastElementChild.appendChild(child);
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
