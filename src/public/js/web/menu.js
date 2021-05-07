
js.ready(function() {
	// Build all menus as UL > Li
	js.getAll("ul.menu").forEach(function(menu) {
		// Build menu as tree
		js.filter(menu.children, "[parent]:not([parent=''])").forEach(child => {
			let node = $("#" + $(child).attr("parent"), menu); //get parent node
			node.children().last().is(menu.tagName)
				|| node.append('<ul class="sub-menu"></ul>').children("a").append('<b class="nav-tri">&rtrif;</b>');
			node.children().last().append(child);
		});

		// Remove empty sub-levels and empty icons
		/*$(menu.children).remove("[parent][parent!='']");
		menu.querySelectorAll("i").forEach(i => {
			(i.classList.length <= 1) && i.parentNode.removeChild(i);
		});*/

		// Add triangles mark for submenu items
		let triangles = $("b.nav-tri", menu); //find all marks
		triangles.parent().click(function(ev) {
			$(this.parentNode).toggleClass("active");
			ev.preventDefault(); //not navigate when click on parent
		});
		$("li", menu).hover(function() {
			triangles.html("&rtrif;"); //initialize triangles state
			$(this).children("a").find("b.nav-tri").html("&dtrif;"); //down
			$(this).parents("ul.sub-menu").prev().find("b.nav-tri").html("&dtrif;"); //up
		});

		// Disables links
		$("[disabled]", menu).each(function() {
			let mask = parseInt(this.getAttribute("disabled")) || 0;
			$(this).toggleClass("disabled", (mask & 3) !== 3);
		}).removeAttr("disabled");

		js.fadeIn(menu.children);
	});

	// Show/Hide sidebar
	js.click(js.getAll(".sidebar-toggle"), (el, ev) => {
		js.toggle(js.getAll(".sidebar-icon", el.parentNode), "d-none");
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
