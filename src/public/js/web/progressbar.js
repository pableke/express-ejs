
js.ready(function() {
	let navs = document.querySelectorAll("ul#tab-nav li");
	let tabs = document.querySelectorAll(".tab-contents");
	let steps = document.querySelectorAll("ul#progressbar li");
	let size = steps.length || tabs.length;
	let index = 0; //current step

	function fnRange(index) {
		if (index < 0)
			return 0;
		return (index < size) ? index : (size - 1);
	}
	function fnSetTabs() {
		js.removeClass(navs, "active").addClass(navs[index], "active");
		js.removeClass(tabs, "active").addClass(tabs[index], "active");
		steps.forEach((el, i) => { js.toggle(el, "active", i <= index); });
	}

	//de-activate current step on progressbar
	js.click(js.getAll(".prev-tab"), () => {
		index = fnRange(index - 1);
		return fnSetTabs();
	});
	//activate next step on progressbar
	js.click(js.getAll(".next-tab"), () => {
		index = fnRange(index + 1);
		return fnSetTabs();
	});
	//go to a specific step on progressbar
	let anchors = js.getAll("a[href^='#']");
	js.click(js.filter(anchors, "[href^='#tab-']"), (el) => {
		index = fnRange(+el.href.substr(el.href.lastIndexOf("-") + 1) - 1); //base 0
		return fnSetTabs();
	});

	js.click(js.getAll("a.show-info"), (el, ev) => { //show/hide extra info
		js.toggle(el.lastElementChild, "fa-angle-double-up fa-angle-double-down").toggle(js.get(".extra-info-" + el.id), "hide");
		ev.preventDefault();
	});

	//Scroll anchors to its destination with a slow effect
	js.click(js.filter(anchors, ":not([href^='#tab-'])"), function(el, ev) {
		try { //is anchor well build
			let dest = document.querySelector(el.getAttribute("href"));
			dest && dest.scrollIntoView({ behavior: "smooth" });
		} catch(ex) {}
		ev.preventDefault();
	});
});
