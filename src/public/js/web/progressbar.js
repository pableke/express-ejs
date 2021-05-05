
js.ready(function() {
	let steps = document.querySelectorAll("#progressbar li");
	let index = 0; //current step

	//activate next step on progressbar
	js.click(js.getAll(".next-tab"), () => {
		(index < (steps.length - 1)) && js.addClass(steps[++index], "active");
		return false;
	});

	//de-activate current step on progressbar
	js.click(js.getAll(".prev-tab"), () => {
		index && js.removeClass(steps[index--], "active");
		return false;
	});

	//go to a specific step on progressbar
	let anchors = js.getAll("a[href^='#']");
	js.click(js.filter(anchors, "[href^='#tab-']"), () => {
		let step = +this.href.substr(this.href.lastIndexOf("-") + 1);
		if ((0 <= step) && (step != index) && (step < steps.length)) {
			steps.forEach((el, i) => { js.toggle(el, "active", i <= step); });
			index = step;
		}
		return false;
	});

	//Scroll anchors to its destination with a slow effect
	js.click(js.filter(anchors, ":not([href^='#tab-'])"), function(el, ev) {
		let dest = document.querySelector(el.getAttribute("href"));
		dest && dest.scrollIntoView({ behavior: "smooth" });
		ev.preventDefault();
	});
});
