
/**
 * Vanilla JS DOM-Box module
 * @module DomBox
 */
function DomBox() {
	const self = this; //self instance
	const EMPTY = ""; //empty string
	const HIDE = "hide"; //css display: none
	const DIV = document.createElement("div");
	const TEXT = document.createElement("textarea");
	//const parser = new DOMParser(); //parser
	let elements; //elements container

	function fnLog(data) { console.log("Log:", data); }
	function fnSize(list) { return list ? list.length : 0; } //string o array
	function isElem(el) { return el && (el.nodeType === 1); } //is DOMElement
	function fnId() { return "_" + Math.random().toString(36).substr(2, 9); }
	function fnSplit(str) { return str ? str.split(/\s+/) : []; } //class separator
	function addMatch(el, selector, results) { el.matches(selector) && results.push(el); }

	this.get = function(selector, el) { return (el || document).querySelector(selector); }
	this.getAll = function(selector, el) { return (el || document).querySelectorAll(selector); }
	this.closest = function(selector, el) { return el && el.closest(selector); }
	this.toArray = function() { return elements ? Array.from(elements) : []; }
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

	this.getNavLang = function() { return navigator.language || navigator.userLanguage; } //default browser language
	this.getLang = function() { return self.getAttr(self.get("html"), "lang") || self.getNavLang(); } //get lang by tag
	this.redir = function(url, target) { url && window.open(url, target || "_blank"); return self; };
	//this.unescape = function(html) { return html && parser.parseFromString(html); }
	this.unescape = function(html) { TEXT.innerHTML = html; return TEXT.value; }
	this.escape = function(text) { DIV.innerHTML = text; return DIV.innerHTML; }
	this.buildPath = function(parts, url) {
		url = url || window.location.pathname;
		let aux = new URLSearchParams(parts);
		let params = new URLSearchParams(window.location.search);
		aux.forEach((v, k) => params.set(k, v));
		return url + "?" + params.toString();
	}
	this.scroll = function(el, win) {
		win = win || window; //window to apply scroll
		el = el || win.document.body; //destination elem
		el.scrollIntoView({ behavior: "smooth" }); //Scroll to destination with a slow effect
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
			let contentType = res.headers.get("content-type") || EMPTY; //response type
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
	this.forEach = function(selector, cb) {
		return self.each(cb, self.getAll(selector));
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
	this.inverse = function(selector, cb) {
		return self.reverse(cb, self.getAll(selector));
	}

	function fnItem(i, list) {
		if (isElem(list))
			return list;
		return fnSize(list) ? list[i] : null;
	}
	this.first = function(list) { return fnItem(0, list || elements); } //first element
	this.elem = function(i, list) { return fnItem(i, list || elements); } //by position
	this.last = function(list) { //last element
		list = list || elements;
		return fnItem(fnSize(list)-1, list);
	}

	// Filters
	this.findIndex = function(selector, list) {
		list = list || elements;
		if (isElem(list))
			return list.matches(selector) ? 0 : -1;
		let size = fnSize(list);
		for (let i = 0; i < size; i++) {
			if (list[i].matches(selector))
				return i;
		}
		return -1;
	}
	this.find = function(selector, list) {
		list = list || elements;
		if (isElem(list))
			return list.matches(selector) ? list : null;
		return list[self.findIndex(selector, list)];
	}
	this.filter = function(selector, list) {
		let results = []; //elem container
		self.each(el => addMatch(el, selector, results), list);
		return results;
	}

	// Inputs selectors and focusableds
	const FOCUSABLE = ":not([type=hidden],[readonly],[disabled],[tabindex='-1'])";
	function fnVisible(el) { return el.offsetWidth || el.offsetHeight || el.getClientRects().length; }
	this.inputs = function(el) { return self.getAll("input,textarea,select", el); }
	this.focus = function(el) { el && el.focus(); return self; }
	this.setFocus = function(el) {
		return self.reverse(input => { //set focus on first input
			fnVisible(input) && input.matches(FOCUSABLE) && input.focus();
		}, self.inputs(el));
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
			el.selectedIndex = value ? self.findIndex("[value='" + value + "']", el.options) : 0;
		}
		else
			el.value = value;
		return self;
	}
	this.getValue = function(el) { return el && el.value; }
	this.findValue = function(selector, el) { return self.getValue(self.get(selector, el)); }
	this.val = function(value, list) { return self.each(el => fnSetVal(el, value), list); }
	this.setValue = function(selector, value, el) { return self.val(value, self.getAll(selector, el)); }
	this.getAttr = function(el, name) { return el && el.getAttribute(name); }
	this.attr = function(name, value, list) { return self.each(el => el.setAttribute(name, value), list); }
	this.setAttr = function(selector, name, value, el) { return self.attr(name, value, self.getAll(selector, el)); }
	this.getText = function(el) { return el && el.innerText; }
	this.findText = function(selector, el) { return self.getText(self.get(selector, el)); }
	this.text = function(value, list) { value = value || EMPTY; return self.each(el => { el.innerText = value; }, list); }
	this.setText = function(selector, value, el) { return self.text(value, self.getAll(selector, el)); }
	this.getHtml = function(el) { return el && el.innerHTML; }
	this.findHtml = function(selector, el) { return self.getHtml(self.get(selector, el)); }
	this.html = function(value, list) { value = value || EMPTY; return self.each(el => { el.innerHTML = value; }, list); }
	this.setHtml = function(selector, value, el) { return self.html(value, self.getAll(selector, el)); }
	this.replace = function(value, list) { return self.each(el => { el.outerHTML = value; }, list); }
	this.empty = function(el) { return !el.innerHTML || (el.innerHTML.trim() === EMPTY); }
	this.add = function(node, list) { return self.each(el => node.appendChild(el), list); }
	this.append = function(text, list) { DIV.innerHTML = text; return self.each(el => self.add(el, DIV.childNodes), list || document.body); }
	this.mask = function(name, mask, list) { return self.each((el, i) => el.classList.toggle(name, (mask>>i)&1), list); } //toggle class by mask
	this.optText = function(sel) { return sel ? self.getText(sel.options[sel.selectedIndex]) : null; }
	this.select = function(mask, list) {
		return self.each(el => { //iterate over all selects
			let option = self.mask(HIDE, ~mask, el.options).get("[value='" + el.value + "']", el);
			if (self.hasClass(HIDE, option)) //current option is hidden => force change
				el.selectedIndex = self.findIndex(":not(.hide)", el.options);
		}, list);
	}

	// Format and parse contents
	this.import = function(inputs, data, opts) {
		opts = opts || {}; //default settings
		if (!data) //no data => clear inputs
			return self.val(EMPTY, inputs);
		return self.each((el, i) => { //format data
			let fn = opts[el.name]; //field format function
			if (fn)
				el.value = fn(data[el.name], data, i);
			else //default string if not defined same value
				fnSetVal(el, data[el.name] ?? el.value);
		}, inputs);
	}
	this.export = function(inputs, data, opts) {
		data = data || {}; //output data container
		opts = opts || {}; //default settings
		self.each((el, i) => { //parse inputs data
			let fn = opts[el.name]; //field format function
			data[el.name] = fn ? fn(el.value, data, i) : el.value;
		}, inputs);
		delete data.undefined; //no name element
		return data;
	}

	const TEMPLATES = {}; //container
	this.render = function(el, formatter) {
		el.id = el.id || fnId(); //tpl associate by id
		TEMPLATES[el.id] = TEMPLATES[el.id] || el.innerHTML;
		el.innerHTML = formatter(TEMPLATES[el.id]);
		el.classList.toggle(HIDE, !el.innerHTML);
		return self;
	}
	this.format = function(formatter, list) {
		return self.each(self.render, list);
	}
	this.reformat = function(selector, formatter) {
		return self.format(formatter, self.getAll(selector));
	}

	// Styles
	this.isVisible = function(el) { return el && fnVisible(el); }
	this.visible = function(selector, el) { return self.isVisible(dom.get(selector, el)); }
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
	this.addStyle = function(selector, name, el) {
		return self.addClass(name, self.getAll(selector, el));
	}
	this.removeClass = function(name, list) {
		const names = fnSplit(name); // Split value by " " (class separator)
		function fnRemove(el) { names.forEach(name => el.classList.remove(name)); }
		return self.each(fnRemove, list);
	}
	this.removeStyle = function(selector, name, el) {
		return self.removeClass(name, self.getAll(selector, el));
	}
	this.toggle = function(name, force, list) {
		const names = fnSplit(name); // Split value by " " (class separator)
		return self.each(el => names.forEach(name => el.classList.toggle(name, force)), list);
	}
	this.toggleClass = function(selector, name, force, el) {
		return self.toggle(name, force, self.getAll(selector, el));
	}
	this.toggleHide = function(selector, force, el) {
		return self.toggleClass(selector, HIDE, force, el);
	}
	this.swap = function(name, list) {
		const names = fnSplit(name); // Split value by " " (class separator)
		return self.each(el => names.forEach(name => el.classList.toggle(name)), list);
	}
	this.swapClass = function(selector, name, el) {
		return self.swap(name, self.getAll(selector, el));
	}
	this.swapHide = function(selector, el) {
		return self.swapClass(selector, HIDE, el);
	}
	this.css = function(prop, value, list) {
		const camelProp = prop.replace(/(-[a-z])/, g => g.replace("-", EMPTY).toUpperCase());
		return self.each(el => { el.style[camelProp] = value; }, list);
	}

	// Events
	function fnEvent(name, el, i, fn) {
		el.addEventListener(name, ev => fn(el, i, ev) || ev.preventDefault());
		return self;
	}
	this.event = function(name, fn, list) { return self.each((el, i) => fnEvent(name, el, i, fn), list); }
	this.addEvent = function(name, selector, fn) { return self.event(name, fn, self.getAll(selector)); }

	this.ready = function(fn) { return fnEvent("DOMContentLoaded", document, 0, fn); }
	this.click = function(fn, list) { return self.each((el, i) => fnEvent("click", el, i, fn), list); }
	this.onclick = function(selector, fn) { return self.click(fn, self.getAll(selector)); }
	this.change = function(fn, list) { return self.each((el, i) => fnEvent("change", el, i, fn), list); }
	this.onchange = function(selector, fn) { return self.change(fn, self.getAll(selector)); }
	this.keyup = function(fn, list) { return self.each((el, i) => fnEvent("keyup", el, i, fn), list); }
	this.onkeyup = function(selector, fn) { return self.keyup(fn, self.getAll(selector)); }
	this.keydown = function(fn, list) { return self.each((el, i) => fnEvent("keydown", el, i, fn), list); }
	this.onkeydown = function(selector, fn) { return self.keydown(fn, self.getAll(selector)); }
	this.submit = function(fn, list) { return self.each((el, i) => fnEvent("submit", el, i, fn), list); }
	this.onsubmit = function(selector, fn) { return self.submit(fn, self.getAll(selector)); }
	this.trigger = function(name, list) { return self.each(el => el.dispatchEvent(new Event(name)), list); }
}
