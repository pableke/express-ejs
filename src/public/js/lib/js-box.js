
/**
 * Vanilla JS Box module
 * @module jsBox
 */
function JsBox() {
	const self = this; //self instance

	function fnLog(data) { console.log("Log:", data); }
	function fnSize(list) { return list ? list.length : 0; } //string o array
	function isElem(el) { return el && (el.nodeType === 1); } //is DOMElement
	function fnId() { return "_" + Math.random().toString(36).substr(2, 9); }
	function fnMatch(el, selector) { return isElem(el) && el.matches(selector); }
	function fnGet(el, selector) { return selector && el.querySelector(selector); }
	function fnGetAll(el, selector) { return selector && el.querySelectorAll(selector); }
	function addMatch(el, selector, results) { el.matches(selector) && results.push(el); }
	function addSiblings(el, selector, results) {
		for (let sibling = el.nextElementSibling; sibling; sibling = sibling.nextElementSibling)
			addMatch(sibling, selector, results);
		for (let sibling = el.previousElementSibling; sibling; sibling = sibling.previousElementSibling)
			addMatch(sibling, selector, results);
	}
	function addAllSiblings(el, results) {
		for (let sibling = el.nextElementSibling; sibling; sibling = sibling.nextElementSibling)
			results.push(sibling);
		for (let sibling = el.previousElementSibling; sibling; sibling = sibling.previousElementSibling)
			results.push(sibling);
	}

	this.create = function(name, attrs) {
		attrs = attrs || {}; //extra attributes
		let elem = document.createElement(name);
		elem.className = attrs.className || "none";
		elem.id = attrs.id || fnId();
		return elem;
	}
	this.getLang = function() {
		let lang = document.querySelector("html").getAttribute("lang"); //get lang by tag
		return lang || navigator.language || navigator.userLanguage; //default browser language
	}
	this.scrollTop = function(time) {
		time = time || 600; //default duration
		var scrollStep = -window.scrollY / (time / 15);
		var scrollInterval = setInterval(() => {
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
		return fetch(opts.action, opts).then(res => {
			let contentType = res.headers.get("content-type") || ""; //response type
			let promise = (contentType.indexOf("application/json") > -1) ? res.json() : res.text(); //response
			return promise.then(res.ok ? opts.resolve : opts.reject); //ok = 200
		});
	}
	this.mask = function(list, mask) {
		return self.each(list, (el, i) => { //hide elements by mask
			(((mask>>i)&1)==0) ? self.addClass(el, "hide") : self.removeClass(el, "hide");
		});
	}
	this.select = function(el, mask) {
		self.mask(el.querySelectorAll("option"), mask);
		let option = el.querySelector("option[value='" + el.value + "']");
		if (self.hasClass(option, "hide")) { //current option is hidden => change
			option = self.find(el.children, "option:not(.hide)");
			el.value = option ? option.value : null;
		}
		return self;
	}

	// Iterators
	this.each = function(list, cb) {
		let size = fnSize(list);
		for (let i = 0; i < size; i++)
			cb(list[i], i);
		return self;
	}
	this.reverse = function(list, cb) {
		for (let i = fnSize(list) - 1; i > -1; i--)
			cb(list[i], i);
		return self;
	}

	// Filters
	this.matches = function(el, selector) {
		return selector && fnMatch(el, selector);
	}
	this.find = function(list, selector) {
		if (selector) {
			if (fnMatch(list, selector))
				return list; //only one element
			let size = fnSize(list);
			for (let i = 0; i < size; i++) {
				let el = list[i]; //get element
				if (fnMatch(el, selector))
					return el;
			}
		}
		return null;
	}
	this.filter = function(list, selector) {
		let results = []; //elem container
		selector && self.each(list, el => { addMatch(el, selector, results); });
		return results;
	}
	this.get = function(selector, el) {
		return fnGet(el || document, selector);
	}
	this.getAll = function(selector, el) {
		return fnGetAll(el || document, selector);
	}
	this.siblings = function(list, selector) {
		let results = []; //elem container
		if (isElem(list))
			selector ? addSiblings(list, selector, results)
					: addAllSiblings(list, results);
		else
			selector ? self.each(list, el => addSiblings(el, selector, results))
					: self.each(list, el => addAllSiblings(el, results));
		return results;
	}

	// Contents
	this.focus = function(list) {
		const selector = "[tabindex]:not([type=hidden][readonly][disabled]):not([tabindex='-1'][tabindex=''])";
		const el = self.find(list, selector);
		el && el.focus();
		return self;
	}
	this.val = function(list, value) {
		if (isElem(list))
			list.value = value;
		else
			self.each(list, el => { el.value = value; });
		return self;
	}
	this.text = function(list, value) {
		if (isElem(list))
			list.innerText = value;
		else
			self.each(list, el => { el.innerText = value; });
		return self;
	}
	this.html = function(list, value) {
		if (isElem(list))
			list.innerHTML = value;
		else
			self.each(list, el => { el.innerHTML = value; });
		return self;
	}

	// Styles
	this.isVisible = function(el) {
		return !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length);
	}
	this.show = function(list, display) {
		display = display || "block";
		if (isElem(list))
			list.style.display = display;
		else
			self.each(list, el => { el.style.display = display; });
		return self;
	}
	this.hide = function(list) {
		if (isElem(list))
			list.style.display = "none";
		else
			self.each(list, el => { el.style.display = "none"; });
		return self;
	}
	this.hasClass = function(list, name) {
		let el = fnSize(list) ? list[0] : list;
		return el && el.classList.contains(name);
	};
	this.addClass = function(list, name) {
		if (isElem(list))
			list.classList.add(name);
		else
			self.each(list, el => el.classList.add(name));
		return self;
	}
	this.removeClass = function(list, name) {
		if (isElem(list))
			list.classList.remove(name);
		else
			self.each(list, el => el.classList.remove(name));
		return self;
	}
	this.toggle = function(list, name, display) {
		if (isElem(list))
			list.classList.toggle(name, display);
		else
			self.each(list, el => el.classList.toggle(name, display));
		return self;
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

		if (isElem(list))
			fnFadeOut(list);
		else
			self.each(list, fnFadeOut);
		return self;
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

		if (isElem(list))
			fnFadeIn(list);
		else
			self.each(list, fnFadeIn);
		return self;
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
	this.ready = function(fn) {
		return fnEvent(document, "DOMContentLoaded", fn);
	}
	this.click = function(list, fn) {
		return isElem(list) ? fnEvent(list, "click", fn) 
							: self.each(list, el => fnEvent(el, "click", fn));
	}
	this.change = function(list, fn) {
		return isElem(list) ? fnEvent(list, "change", fn) 
							: self.each(list, el => fnEvent(el, "change", fn));
	}
	this.keyup = function(list, fn) {
		return isElem(list) ? fnEvent(list, "keyup", fn) 
							: self.each(list, el => fnEvent(el, "keyup", fn));
	}
	this.keydown = function(list, fn) {
		return isElem(list) ? fnEvent(list, "keydown", fn) 
							: self.each(list, el => fnEvent(el, "keydown", fn));
	}
}
