
js.ready(function() {
	let navs = document.querySelectorAll("ul#tab-nav li");
	let tabs = document.querySelectorAll(".tab-contents");
	let steps = document.querySelectorAll("ul#progressbar li");
	let index = 0; //current step

	function fnTabs() {
		js.removeClass(navs, "active").addClass(navs[index], "active");
		return !js.removeClass(tabs, "active").addClass(tabs[index], "active");
	}

	//activate next step on progressbar
	js.click(js.getAll(".next-tab"), () => {
		(index < (steps.length - 1)) && js.addClass(steps[++index], "active");
		return fnTabs();
	});

	//de-activate current step on progressbar
	js.click(js.getAll(".prev-tab"), () => {
		index && js.removeClass(steps[index--], "active");
		return fnTabs();
	});

	//go to a specific step on progressbar
	let anchors = js.getAll("a[href^='#']");
	js.click(js.filter(anchors, "[href^='#tab-']"), (el) => {
		index = +el.href.substr(el.href.lastIndexOf("-") + 1) - 1; //base 0
		steps.forEach((el, i) => { js.toggle(el, "active", i <= index); });
		return fnTabs();
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
