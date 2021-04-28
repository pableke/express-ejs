
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
		return results;
	}

	this.getLang = function() {
		let lang = document.querySelector("html").getAttribute("lang"); //get lang by tag
		return lang || navigator.language || navigator.userLanguage; //default browser language
	}

	this.each = function(list, cb) {
		let size = fnSize(list);
		for (let i = 0; i < size; i++)
			cb(list[i], i);
		return self;
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
			return addSiblings(list, selector, results);
		self.each(list, el => {
			addSiblings(list, selector, results);
		});
		return results;
	}

	this.setFocus = function(el) {
		el && el.focus();
		return self;
	}
	this.focus = function(list) {
		return self.setFocus(self.find(list, "[tabindex]:not([type=hidden][readonly][disabled]):not([tabindex='-1'][tabindex=''])"));
	}
	this.setText = function(el, value) {
		el.innerText = value;
		return self:
	}
	this.text = function(list, value) {
		return self.each(list, el => {
			el.innerText = value;
		});
	}
	this.setHtml = function(el, value) {
		el.innerHTML = value;
		return self:
	}
	this.html = function(list, value) {
		return self.each(list, el => {
			el.innerHTML = value;
		});
	}

	this.setClass = function(el, name) {
		el.classList.add(name);
		return self;
	}
	this.addClass = function(list, name) {
		return self.each(list, el => {
			el.classList.add(name);
		});
	}
	this.removeClass = function(list, name) {
		return self.each(list, el => {
			el.classList.remove(name);
		});
	}
	this.toggle = function(list, name) {
		return self.each(list, el => {
			el.classList.toggle(name);
		});
	}
}
