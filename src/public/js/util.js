
import nb from "./lib/number-box.js";
import sb from "./lib/string-box.js";
import dom from "./lib/dom-box.js";
import i18n from "./i18n/langs.js";

//DOM is fully loaded
dom.ready(function() {
	i18n.load(); // Set language
	const _nav = dom.find("nav", document.body.children);

	// Loading div
	const _loading = _nav.nextElementSibling;
	dom.loading = () => dom.show(_loading).closeAlerts();
	dom.working = () => dom.fadeOut(_loading);
	// End loading div

	// Scroll body to top on click and toggle back-to-top arrow
	const _top = _loading.nextElementSibling;
	window.onscroll = function() { dom.toggleHide(_top, this.scrollY < 80); }
	dom.click(_top, ev => document.body.scrollIntoView({ behavior: "smooth" }));

	// Extends dom-box actions (require jquery)
	dom.autocomplete = function(form, selector, opts) {
		const url = new URL("http://localhost:3000" + opts.action); //request
		const input = dom.getInput(form, selector); //Autocomplete input
		const id = dom.sibling(input, "[type=hidden]"); //id associated

		const fnNull = () => null;
		const fnClear = () => { dom.setValue(input).setValue(id); opts.remove(input); }
		let _search, _searching; // call source indicator (reduce calls)

		opts.minLength = opts.minLength || 3; //length to start
		opts.maxResults = opts.maxResults || 10; //max showed rows (default = 10)
		opts.delay = opts.delay || 500; //milliseconds between keystroke occurs and when a search is performed
		opts.open = opts.open || fnNull; //triggered if the value has changed
		opts.focus = opts.focus || fnNull; //no change focus on select
		opts.sort = opts.sort || ((data) => data); //sort array data received
		opts.remove = opts.remove || fnNull; //triggered when no item selected
		//opts.render = opts.render || fnNull; //render on input (mandatory)
		//opts.load = opts.load || fnNull; //triggered when select an item (mandatory)
		opts.source = function(req, res) {
			if (_search && !_searching) {
				_searching = true; // Avoid new searchs
				this.element.autocomplete("instance")._renderItem = function(ul, item) {
					let label = sb.iwrap(opts.render(item, input, id), req.term); //decore matches
					return $("<li>").append("<div>" + label + "</div>").appendTo(ul);
				}
				url.searchParams.set("term", req.term);
				dom.ajax(url.toString()).then(data => {
					res(opts.sort(data).slice(0, opts.maxResults));
				}).finally(() => {
					_searching = false; // Allow next searchs
				});
			}
		}
		opts.select = function(ev, ui) { //triggered when select an item
			opts.load(ui.item, input, id); //update inputs values
			return false; //preserve inputs values from load event
		}
		// Triggered when the field is blurred, if the value has changed
		opts.change = (ev, ui) => { ui.item || fnClear(); }
		dom.event(input, "search", fnClear);

		$(input).autocomplete(opts);
		return dom.keydown(input, ev => { // Reduce server calls, only for backspace, alfanum or not is searching
			_search = ((ev.keyCode == 8) || sb.between(ev.keyCode, 46, 111) || sb.between(ev.keyCode, 160, 223));
			return true; // preserve default event
		});
	}

	dom.toggleInfo("[href='#toggle']") // Info links
		.alerts(_top.nextElementSibling) // Alerts messages
		.autofocus(document.forms[0]?.elements) // Focus on first input
		.each(document.forms, form => dom.afterReset(form, ev => dom.closeAlerts().autofocus(form.elements)));

	dom.onChangeFields(".ui-bool", (ev, el) => { el.value = i18n.fmtBool(el.value); })
		//.onChangeFields(".ui-integer", (ev, el) => { el.value = i18n.fmtInt(el.value); dom.toggle(el, "text-red", sb.starts(el.value, "-")); })
		.onChangeFields(".ui-float", (ev, el) => { el.value = i18n.fmtFloat(el.value); dom.toggle(el, "text-red", sb.starts(el.value, "-")); })

	// Build tree menu as UL > Li > *
	const menu = dom.get("ul.menu", _nav);
	const fnSort = (a, b) => nb.cmp(a.dataset.orden, b.dataset.orden);
	Array.from(menu.children).sort(fnSort).forEach(child => {
		let padre = child.dataset.padre; // Has parent?
		let mask = child.dataset.mask ?? 4; // Default mask = active
		if (padre) { // Move child with his parent
			const li = dom.get("li[id='" + padre + "']", menu);
			if (li) {
				const children = +li.dataset.children || 0;
				if (!children) { // Is first child?
					li.innerHTML += '<ul class="sub-menu"></ul>';
					dom.addClass(li.firstElementChild, "nav-tri")
						.click(li.firstElementChild, ev => !dom.toggle(li, "active")); //usfull on sidebar
				}
				mask &= li.dataset.mask ?? 4; // Propage disabled
				li.dataset.children = children + 1; // add child num
				li.lastElementChild.appendChild(child); // move child
			}
		}
		else // force reorder lebel 1
			menu.appendChild(child);
		dom.toggle(child.firstElementChild, "disabled", !(mask & 4));
	});
	dom.show(menu);

	// Language selector
	const currentLang = dom.get("#currentLang", _nav);
	const linkLang = dom.get('[href="?lang=' + i18n.get("lang") + '"]', currentLang.nextElementSibling);
	currentLang.firstElementChild.src = linkLang.firstElementChild.src;
	dom.hide(linkLang.parentNode);

	// On page load or when changing themes, best to add inline in `head` to avoid FOUC
	const html = document.documentElement;
	const themeToggleBtn = dom.get("#theme-toggle", _nav);
	const themeToggleDarkIcon = themeToggleBtn.firstElementChild;
	const themeToggleLightIcon = themeToggleBtn.lastElementChild;
	if ((localStorage.getItem("color-theme") === "dark") || (!("color-theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
		html.classList.add("dark");
		themeToggleLightIcon.classList.remove("hidden");
	}
	else {
		html.classList.remove("dark");
		themeToggleDarkIcon.classList.remove("hidden");
	}
	themeToggleBtn.addEventListener("click", function() {
		// toggle icons inside button
		themeToggleDarkIcon.classList.toggle("hidden");
		themeToggleLightIcon.classList.toggle("hidden");

		// if set via local storage previously
		if (localStorage.getItem("color-theme")) {
			if (localStorage.getItem("color-theme") === "light") {
				html.classList.add("dark");
				localStorage.setItem("color-theme", "dark");
			} else {
				html.classList.remove("dark");
				localStorage.setItem("color-theme", "light");
			}
		}
		else { // if NOT set via local storage previously
			if (html.classList.contains("dark")) {
				html.classList.remove("dark");
				localStorage.setItem("color-theme", "light");
			} else {
				html.classList.add("dark");
				localStorage.setItem("color-theme", "dark");
			}
		}
	});
});
