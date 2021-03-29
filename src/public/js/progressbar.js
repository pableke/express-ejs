
document.addEventListener("DOMContentLoaded", function() {
	let steps = document.querySelectorAll("#progressbar li");
	let index = 0; //current step

	document.querySelectorAll(".next-tab").forEach(el => {
		el.addEventListener("click", ev => { //activate next step on progressbar
			(index < (steps.length - 1)) && steps[++index].classList.add("active");
			return false;
		});
	});
	$(".prev-tab").click(function() {
		//de-activate current step on progressbar
		index && steps[index--].classList.remove("active");
		return false;
	});
	$("a[href^='#tab-']").click(function() {
		//go to a specific step on progressbar
		let step = +this.href.substr(this.href.lastIndexOf("-") + 1);
		if ((0 <= step) && (step != index) && (step < steps.length)) {
			steps.forEach((el, i) => { el.classList.toggle("active", i <= step); });
			index = step;
		}
		return false;
	});
});
