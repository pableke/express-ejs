
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
		js.removeClass("active", navs).addClass("active", navs[index]);
		js.removeClass("active", tabs).addClass("active", tabs[index]);
		steps.forEach((el, i) => js.set(el).toggle("active", i <= index));
	}

	//de-activate current step on progressbar
	js.load(".prev-tab").click(() => {
		index = fnRange(index - 1);
		return fnSetTabs();
	});
	//activate next step on progressbar
	js.load(".next-tab").click(() => {
		index = fnRange(index + 1);
		return fnSetTabs();
	});
	//go to a specific step on progressbar
	let anchors = js.getAll("a[href^='#']");
	js.set(js.filter("[href^='#tab-']", anchors)).click((el) => {
		index = fnRange(+el.href.substr(el.href.lastIndexOf("-") + 1) - 1); //base 0
		return fnSetTabs();
	});

	//Scroll anchors to its destination with a slow effect
	js.set(js.filter(":not([href^='#tab-'])", anchors)).click((el, ev) => {
		try { //is anchor well build
			let dest = document.querySelector(el.getAttribute("href"));
			dest && dest.scrollIntoView({ behavior: "smooth" });
		} catch(ex) {}
		ev.preventDefault();
	});

	js.load("a.show-info").click((el, ev) => { //show/hide extra info
		js.load("i.fas", el).toggle("fa-angle-double-up fa-angle-double-down")
			.load(".extra-info-" + el.id).toggle("hide");
		ev.preventDefault();
	});
});
