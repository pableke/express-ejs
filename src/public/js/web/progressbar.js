
js.ready(function() {
	let steps = document.querySelectorAll("#progressbar li");
	let index = 0; //current step

	//activate next step on progressbar
	js.click(js.getAll(".next-tab"), ev => {
		(index < (steps.length - 1)) && js.addClass(steps[++index], "active");
		return false;
	});

	//de-activate current step on progressbar
	js.click(js.getAll(".prev-tab"), ev => {
		index && js.removeClass(steps[index--], "active");
		return false;
	});

	//go to a specific step on progressbar
	js.click(js.getAll("a[href^='#tab-']"), ev => {
		let step = +this.href.substr(this.href.lastIndexOf("-") + 1);
		if ((0 <= step) && (step != index) && (step < steps.length)) {
			steps.forEach((el, i) => { js.toggle(el, "active", i <= step); });
			index = step;
		}
		return false;
	});
});
