
js.ready(function() {
	// Build all tree menus as UL > Li
	js.getAll("ul.menu").forEach(function(menu) {
		let children = Array.from(menu.children);
		children.sort((a, b) => (+a.dataset.orden - +b.dataset.orden));
		children.forEach(child => {
			menu.appendChild(child); // force reorder
			let mask = child.dataset.mask; // get mask
			if ((mask&8) == 8) { // Is parent => add triangle
				child.innerHTML += '<ul class="sub-menu"></ul>';
				child.firstElementChild.innerHTML += '<b class="nav-tri">&rtrif;</b>';
				js.set(child.firstElementChild).click((el, ev) => { //usfull on sidebar
					js.toggle("active", child);
					ev.preventDefault();
				});
			}
			if ((mask&4) == 0) // Disables links
				js.addClass("disabled", child.firstElementChild);
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
	js.load(".sidebar-toggle").click((el, ev) => {
		js.toggle("hide", js.getAll(".sidebar-icon", el.parentNode));
		js.toggle("active", js.get("#sidebar", el.parentNode));
		ev.preventDefault();
	});

	// Scroll body to top on click and toggle back-to-top arrow
	let top = js.get("#back-to-top");
	js.click(() => js.scrollTop(400), top);
	window.onscroll = function() {
		(window.pageYOffset > 80) ? js.fadeIn(top) : js.fadeOut(top);
	}

	// Onclose event tab/browser of client user
	window.addEventListener("unload", function(ev) {
		js.ajax("/session/destroy.html");
	});
});
