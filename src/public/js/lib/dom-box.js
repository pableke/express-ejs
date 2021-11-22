
/**
 * Vanilla JS DOM-Box module
 * @module DomBox
 */
function DomBox() {
	const self = this; //self instance
	const HIDE = "hide"; //css display: none
	let elements; //elements container

	function fnLog(data) { console.log("Log:", data); }
	function fnSize(list) { return list ? list.length : 0; } //string o array
	function isElem(el) { return el && (el.nodeType === 1); } //is DOMElement
	function fnId() { return "_" + Math.random().toString(36).substr(2, 9); }
	function fnSplit(str) { return str ? str.split(/\s+/) : []; } //class separator
	function addMatch(el, selector, results) { el.matches(selector) && results.push(el); }

	this.get = function(selector, el) { return (el || document).querySelector(selector); }
	this.getAll = function(selector, el) { return (el || document).querySelectorAll(selector); }
	this.getElements = function() { return elements; }
	this.set = function(list) {
		delete elements; //prev container
		elements = list; //new container
		return self;
	}
	this.load = function(param, parent) {
		if (!param)
			return self;
		if ((typeof param === "string") || (param instanceof String))
			return self.set(self.getAll(param, parent));
		return self.set(param); //param = element or array
	}

	this.getLang = function() {
		let lang = document.querySelector("html").getAttribute("lang"); //get lang by tag
		return lang || navigator.language || navigator.userLanguage; //default browser language
	}
	this.buildPath = function(parts, url) {
		url = url || window.location.pathname;
		let aux = new URLSearchParams(parts);
		let params = new URLSearchParams(window.location.search);
		aux.forEach((v, k) => params.set(k, v));
		return url + "?" + params.toString();
	}
	this.scrollTop = function(time) {
		time = time || 600; //default duration
		let scrollStep = -window.scrollY / (time / 15);
		let scrollInterval = setInterval(() => {
			if (window.scrollY > 0)
				window.scrollBy(0, scrollStep);
			else
				clearInterval(scrollInterval);
		}, 15);
		return self;
	}
	this.fetch = function(opts) {
		opts = opts || {}; //default config
		opts.headers = opts.headers || {}; //init. headers
		opts.reject = opts.reject || fnLog;
		opts.resolve = opts.resolve || fnLog;
		opts.headers["x-requested-with"] = "XMLHttpRequest"; //add ajax header
		opts.headers["Authorization"] = "Bearer " + window.localStorage.getItem("jwt");
		return window.fetch(opts.action, opts).then(res => {
			let contentType = res.headers.get("content-type") || ""; //response type
			let promise = (contentType.indexOf("application/json") > -1) ? res.json() : res.text(); //response
			return promise.then(res.ok ? opts.resolve : opts.reject); //ok = 200
		});
	}

	// Iterators
	this.each = function(cb, list) {
		list = list || elements;
		if (isElem(list))
			cb(list, 0);
		else {
			let size = fnSize(list);
			for (let i = 0; i < size; i++)
				cb(list[i], i, list);
		}
		return self;
	}
	this.reverse = function(cb, list) {
		list = list || elements;
		if (isElem(list))
			cb(list, 0);
		else {
			for (let i = fnSize(list) - 1; i > -1; i--)
				cb(list[i], i, list);
		}
		return self;
	}

	this.first = function(list) {
		list = list || elements;
		return fnSize(list) ? list[0] : list; //first element
	}
	this.getElement = function(i, list) {
		list = list || elements;
		return fnSize(list) ? list[i] : list;
	}
	this.reduce = function(i) {
		elements = fnSize(elements) ? elements[i] : elements;
		return self;
	}
	this.last = function(list) {
		list = list || elements;
		let size = fnSize(list);
		return size ? list[size-1] : list; //last element
	}

	// Filters
	function fnGetIndex(selector, list) {
		let size = fnSize(list);
		for (let i = 0; i < size; i++) {
			if (list[i].matches(selector))
				return i;
		}
		return -1;
	}
	this.findIndex = function(selector, list) {
		list = list || elements;
		if (isElem(list))
			return list.matches(selector) ? 0 : -1;
		return fnGetIndex(selector, list);
	}
	this.find = function(selector, list) {
		list = list || elements;
		if (isElem(list))
			return list.matches(selector) ? list : null;
		let i = fnGetIndex(selector, list);
		return (i < 0) ? null : list[i];
	}
	this.filter = function(selector, list) {
		let results = []; //elem container
		self.each(el => addMatch(el, selector, results), list);
		return results;
	}

	function addPrev(el, selector, results) {
		for (let sibling = el.previousElementSibling; sibling; sibling = sibling.previousElementSibling)
			addMatch(sibling, selector, results);
	}
	function addNext(el, selector, results) {
		for (let sibling = el.nextElementSibling; sibling; sibling = sibling.nextElementSibling)
			addMatch(sibling, selector, results);
	}
	function addSiblings(el, selector, results) {
		addPrev(el, selector, results);
		addNext(el, selector, results);
	}
	function addAllPrev(el, results) {
		for (let sibling = el.previousElementSibling; sibling; sibling = sibling.previousElementSibling)
			results.push(sibling);
	}
	function addAllNext(el, results) {
		for (let sibling = el.nextElementSibling; sibling; sibling = sibling.nextElementSibling)
			results.push(sibling);
	}
	function addAllSiblings(el, results) {
		addAllPrev(el, results);
		addAllNext(el, results);
	}
	this.prev = function(selector, list) {
		let results = []; //elem container
		selector ? self.each(el => addPrev(el, selector, results), list)
				: self.each(el => addAllPrev(el, results), list);
		return results;
	}
	this.next = function(selector, list) {
		let results = []; //elem container
		selector ? self.each(el => addNext(el, selector, results), list)
				: self.each(el => addAllNext(el, results), list);
		return results;
	}
	this.siblings = function(selector, list) {
		let results = []; //elem container
		selector ? self.each(el => addSiblings(el, selector, results), list)
				: self.each(el => addAllSiblings(el, results), list);
		return results;
	}

	// Contents
	function fnSetVal(el, value) {
		if (el.tagName === "SELECT") {
			value = value || el.getAttribute("value");
			el.selectedIndex = self.findIndex(opt => (opt.value == value), el.options);
		}
		else
			el.value = value;
		return self;
	}
	this.attr = function(name, value, list) { return self.each(el => el.setAttribute(name, value), list); }
	this.val = function(value, list) { return self.each(el => fnSetVal(el, value), list); }
	this.getVal = function(selector) { let el = self.get(selector); return el && el.value; }
	this.text = function(value, list) { return self.each(el => { el.innerText = value; }, list); }
	this.getText = function(selector) { let el = self.get(selector); return el && el.innerText; }
	this.html = function(value, list) { return self.each(el => { el.innerHTML = value; }, list); }
	this.getHtml = function(selector) { let el = self.get(selector); return el && el.innerHTML; }
	this.replace = function(value, list) { return self.each(el => { el.outerHTML = value; }, list); }
	this.empty = function(el) { return !el.innerHTML || (el.innerHTML.trim() === ""); }
	this.focus = function(list) {
		const el = self.find("[tabindex]:not([type=hidden][readonly][disabled]):not([tabindex='-1']):not([tabindex=''])", list);
		el && el.focus();
		return self;
	}
	this.mask = function(mask, list) { //hide elements by mask 
		const fn = (el, i) => {
			return (((mask>>i)&1) == 0) ? self.addClass(HIDE, el) : self.removeClass(HIDE, el);
		}
		return self.each(fn, list);
	}
	this.select = function(mask, list) {
		return self.each(el => {
			self.mask(mask, el.querySelectorAll("option"));
			let option = el.querySelector("option[value='" + el.value + "']");
			if (self.hasClass(HIDE, option)) //current option is hidden => force change
				el.selectedIndex = self.findIndex("option:not(.hide)", el.children);
		}, list);
	}

	// Format and parse contents
	this.import = function(inputs, data, opts) {
		opts = opts || {}; //default settings
		if (!data) //no data => clear inputs
			return self.val("", inputs);
		return self.each((el, i) => { //format data
			let fn = opts[el.name]; //field format function
			if (fn)
				el.value = fn(data[el.name], data, i);
			else
				fnSetVal(el, data[el.name]);
		}, inputs);
	}
	this.export = function(inputs, data, opts) {
		data = data || {}; //output data container
		opts = opts || {}; //default settings
		self.each((el, i) => { //parse inputs data
			let fn = opts[el.name]; //field format function
			data[el.name] = fn ? fn(data[el.name], data, i) : el.value;
		}, inputs);
		delete data.undefined; //no name element
		return data;
	}

	const TEMPLATES = {}; //container
	this.format = function(formatter, list) {
		return self.each(el => { //elements to be re-formated
			el.id = el.id || fnId(); //tpl associate by id
			TEMPLATES[el.id] = TEMPLATES[el.id] || el.innerHTML;
			el.innerHTML = formatter(TEMPLATES[el.id]);
			el.innerHTML && el.classList.remove(HIDE);
		}, list);
	}

	// Styles
	this.isVisible = function(el) {
		return !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length);
	}
	this.show = function(list, display) {
		display = display || "block";
		return self.each(el => { el.style.display = display; }, list);
	}
	this.hide = function(list) {
		return self.each(el => { el.style.display = "none"; }, list);
	}
	this.hasClass = function(name, list) {
		const el = self.first(list); //first element
		return el && fnSplit(name).some(name => el.classList.contains(name));
	}
	this.setClass = function(value, list) {
		return self.each(el => { el.className = value; }, list);
	}
	this.addClass = function(name, list) {
		const names = fnSplit(name); // Split value by " " (class separator)
		function fnAdd(el) { names.forEach(name => el.classList.add(name)); }
		return self.each(fnAdd, list);
	}
	this.removeClass = function(name, list) {
		const names = fnSplit(name); // Split value by " " (class separator)
		function fnRemove(el) { names.forEach(name => el.classList.remove(name)); }
		return self.each(fnRemove, list);
	}
	this.toggle = function(name, force) {
		const names = fnSplit(name); // Split value by " " (class separator)
		return self.each(el => names.forEach(name => el.classList.toggle(name, force)));
	}
	this.css = function(prop, value, list) {
		const camelProp = prop.replace(/(-[a-z])/, g => g.replace("-", "").toUpperCase());
		return self.each(el => { el.style[camelProp] = value; }, list);
	}

	// Efects Fade
	const FADE_INC = .03;
	this.fadeOut = function(list) {
		function fnFadeOut(el) {
			let val = parseFloat(el.style.opacity) || 0;
			function fade() {
				if ((val -= FADE_INC) < 0)
					el.style.display = "none";
				else
					requestAnimationFrame(fade);
				el.style.opacity = val;
			}
			fade();
		}

		return self.each(fnFadeOut, list);
	};
	this.fadeIn = function(list, display) {
		function fnFadeIn(el) {
			el.style.display = display || "block";
			let val = parseFloat(el.style.opacity) || 0;
			function fade() {
				if ((val += FADE_INC) < 1)
					requestAnimationFrame(fade);
				el.style.opacity = val;
			}
			fade();
		}

		return self.each(fnFadeIn, list);
	};
	this.fadeToggle = function(list, display) {
		let el = fnSize(list) ? list[0] : list;
		let val = parseFloat(el && el.style.opacity) || 0;
		return (val < FADE_INC) ? self.fadeIn(list, display) : self.fadeOut(list);
	};

	// Events
	function fnEvent(el, name, fn) {
		el.addEventListener(name, ev => fn(el, ev));
		return self;
	}
	this.ready = function(fn) { return fnEvent(document, "DOMContentLoaded", fn); }
	this.click = function(fn, list) { return self.each(el => fnEvent(el, "click", fn), list); }
	this.change = function(fn, list) { return self.each(el => fnEvent(el, "change", fn), list); }
	this.keyup = function(fn, list) { return self.each(el => fnEvent(el, "keyup", fn), list); }
	this.keydown = function(fn, list) { return self.each(el => fnEvent(el, "keydown", fn), list); }
	this.submit = function(fn, list) { return self.each(el => fnEvent(el, "submit", fn), list); }
	this.trigger = function(name, list) { return self.each(el => el.dispatchEvent(new Event(name)), list); }
}
