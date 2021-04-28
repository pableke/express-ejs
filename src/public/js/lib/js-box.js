
/**
 * Vanilla JS Box module
 * @module jsBox
 */
function JsBox() {
	const self = this; //self instance

	function fnSize(list) { return list ? list.length : 0; } //string o array
	function isElem(el) { return el && (el.nodeType === 1); } //is DOMElement
	function fnMatch(el, selector) { return isElem(el) && el.matches(selector); }
	function addSiblings(el, selector, results) {
		for (let sibling = el.nextElementSibling; sibling; sibling = sibling.nextElementSibling)
			sibling.matches(selector) && results.push(sibling);
		for (let sibling = el.previousElementSibling; sibling; sibling = sibling.previousElementSibling)
			sibling.matches(selector) && results.push(sibling);
	}

	this.getLang = function() {
		let lang = document.querySelector("html").getAttribute("lang"); //get lang by tag
		return lang || navigator.language || navigator.userLanguage; //default browser language
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
	this.getAll = function(selector, el) {
		el = el || document;
		return el.querySelectorAll(selector);
	}
	this.get = function(selector, el) {
		el = el || document;
		return el.querySelector(selector);
	}
	this.find = function(list, selector) {
		let size = fnSize(list);
		for (let i = 0; i < size; i++) {
			let el = list[i]; //get element
			if (fnMatch(el, selector))
				return el;
		}
		return null;
	}
	this.filter = function(list, selector) {
		let results = []; //elem container
		self.each(list, el => {
			el.matches(selector) && results.push(el);
		});
		return results;
	}
	this.siblings = function(list, selector) {
		let results = []; //elem container
		if (isElem(list))
			addSiblings(list, selector, results);
		else
			self.each(list, el => addSiblings(el, selector, results));
		return results;
	}

	// Contents
	this.focus = function(list) {
		if (isElem(list))
			list.focus();
		else {
			let el = self.find(list, "[tabindex]:not([type=hidden][readonly][disabled]):not([tabindex='-1'][tabindex=''])");
			el && el.focus();
		}
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

	// Events
	function fnEvent(el, name, fn) {
		el.addEventListener(name, fn);
		return self;
	}
	this.ready = function(fn) {
		return fnEvent(document, "DOMContentLoaded", fn);
	}
	this.click = function(list, fn) {
		return isElem(list) ? fnEvent(list, "click", fn) 
							: self.each(list, el => fnEvent(el, "click", fn));
	}
}
