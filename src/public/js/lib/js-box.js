
/**
 * Vanilla JS Box module
 * @module jsBox
 */
function JsBox() {
	const self = this; //self instance
	const sysdate = new Date(); //global sysdate
	let elements; //elements container

	function fnParam(param) { return param; }
	function fnLog(data) { console.log("Log:", data); }
	function fnSize(list) { return list ? list.length : 0; } //string o array
	function isElem(el) { return el && (el.nodeType === 1); } //is DOMElement
	//function fnId() { return "_" + Math.random().toString(36).substr(2, 9); }
	function fnSplit(str) { return str ? str.split(" ") : []; } //class separator
	function addMatch(el, selector, results) { el.matches(selector) && results.push(el); }

	function toDateTime(str) { return str ? new Date(str) : null; }
	function fnIsoString(date) { return date.toISOString().substr(0, 10); } //ej: "2021-07-21"
	function fnIsoDate(date) { return date ? fnIsoString(date) : null; }
	function buildTime(str) { return str ? new Date(fnIsoString(sysdate) + "T" + str) : null; } //ej: "2021-07-21T11:48:29"
	function fnIsoTime(date) { return date ? date.toISOString().substr(11, 8) : null; } //ej: "11:48:29"
	function buildWeek(str) { return str ? new Date() : null; } // not implemented (calculate date for first day of week)
	function fnIsoWeek(date) { return date ? (date.getFullYear() + "-W" + self.getWeek(date)) : null; } //ej: "2021-W27"
	let i18n = { // fotmats + parsers + messages
		toInt: parseInt, isoInt: fnParam,
		toFloat: parseFloat, isoFloat: fnParam,
		toDate: toDateTime, isoDate: fnIsoDate,
		toTime: buildTime, isoTime: fnIsoTime,
		toWeek: buildWeek, isoWeek: fnIsoWeek
	};

	this.get = function(selector, el) { return (el || document).querySelector(selector); }
	this.getAll = function(selector, el) { return (el || document).querySelectorAll(selector); }
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

	this.getI18n = function() { return i18n; }
	this.setI18n = function(obj) { i18n = obj; return self; }
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
	this.text = function(value, list) { return self.each(el => { el.innerText = value; }, list); }
	this.html = function(value, list) { return self.each(el => { el.innerHTML = value; }, list); }
	this.focus = function(list) {
		const el = self.find("[tabindex]:not([type=hidden][readonly][disabled]):not([tabindex='-1'][tabindex=''])", list);
		el && el.focus();
		return self;
	}
	this.mask = function(mask, list) { //hide elements by mask 
		const fn = (el, i) => {
			return (((mask>>i)&1)==0) ? self.addClass("hide", el) : self.removeClass("hide", el);
		}
		return self.each(fn, list);
	}
	this.select = function(mask, list) {
		return self.each(el => {
			self.mask(mask, el.querySelectorAll("option"));
			let option = el.querySelector("option[value='" + el.value + "']");
			if (self.hasClass("hide", option)) //current option is hidden => force change
				el.selectedIndex = self.findIndex("option:not(.hide)", el.children);
		}, list);
	}

	// Format and parse contents
	this.import = function(inputs, data) {
		if (data)
			self.each(el => {
				if (el.classList.contains("integer"))
					el.value = i18n.isoInt(data[el.name]);
				else if (el.classList.contains("float"))
					el.value = i18n.isoFloat(data[el.name]);
				else if ((el.type == "date") || (el.type == "month"))
					el.value = fnIsoDate(data[el.name]);
				else if (el.type == "week") //ej: "2021-W27"
					el.value = fnIsoWeek(data[el.name]);
				else if (el.classList.contains("date"))
					el.value = i18n.isoDate(data[el.name]);
				else if ((el.type == "time") || el.classList.contains("time"))
					el.value = i18n.isoTime(data[el.name]);
				else
					fnSetVal(el, data[el.name]);
			}, inputs);
		else
			self.val("", inputs);
		return self;
	}
	this.export = function(inputs, data) {
		data = data || {}; //output container
		self.each(el => {
			if (el.classList.contains("integer"))
				data[el.name] = i18n.toInt(el.value);
			else if (el.classList.contains("float"))
				data[el.name] = i18n.toFloat(el.value);
			else if (el.type == "date")
				data[el.name] = toDateTime(el.value);
			else if (el.type == "month") //ej: "2021-06" => default day = 1
				data[el.name] = el.value ? new Date(el.value + "-1") : null;
			else if (el.type == "week") //ej: "2021-W27"
				data[el.name] = i18n.toWeek(el.value);
			else if (el.classList.contains("date"))
				data[el.name] = i18n.toDate(el.value);
			else if ((el.type == "time") || el.classList.contains("time"))
				data[el.name] = i18n.toTime(el.value);
			else
				data[el.name] = el.value; 
		}, inputs);
		delete data.undefined; //no name element
		return data;
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
		list = list || elements;
		const el = fnSize(list) ? list[0] : list; //first element
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
	this.trigger = function(name, list) { return self.each(el => el.dispatchEvent(new Event(name)), list); }
}
