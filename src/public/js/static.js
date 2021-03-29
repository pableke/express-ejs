
$(document).ready(function() {
	let sb = new StringBox();

	// Alerts handlers
	function hideAlert(el) { el.parentNode.classList.add("d-none");  }
	function showAlert(el) { el.parentNode.classList.remove("d-none");  }
	function setAlert(el, txt) { el.innerHTML = txt; showAlert(el); }

	let texts = document.querySelectorAll(".alert-text");
	texts.forEach(el => {
		el.firstChild ? showAlert(el) : hideAlert(el);
	});

	let buttons = document.querySelectorAll(".alert-close");
	buttons.forEach(el => {
		el.addEventListener("click", function() {
			hideAlert(el);
		});
	});

	function showOk(txt) { txt && setAlert(texts[0], txt); }
	function showInfo(txt) { txt && setAlert(texts[1], txt); }
	function showWarn(txt) { txt && setAlert(texts[2], txt); }
	function showError(txt) { txt && setAlert(texts[3], txt); }
	function closeAlerts() { buttons.forEach(el => { el.click(); }); }
	// End alerts handlers

	// Loading div
	let _loading = document.querySelector(".loading");
	function fnLoading() { $(_loading).show(); closeAlerts(); }
	function fnUnloading() { $(_loading).fadeOut(); }
	// End loading div

	// Clearable text inputs
	function tog(v) { return v ? "addClass" : "removeClass"; }
	$(document).on("input", ".clearable", function() {
		$(this)[tog(this.value)]("x");
	}).on("mousemove", ".x", function(ev) {
		$(this)[tog(this.offsetWidth-28 < ev.clientX-this.getBoundingClientRect().left)]("onX");
	}).on("touchstart click", ".onX", function(ev) {
		ev.preventDefault();
		$(this).removeClass("x onX").val("").change();
	});
	// End clearable text inputs

	// AJAX links and forms
	function fnLoadHtml(el, html) {
		let _dest = el.dataset.dest; //selector
		if (_dest) { //load container?
			$(_dest).html(html);
			showOk(el.dataset.msg);
		}
		else
			showOk(html);
	}
	$("a.ajax").click(function(ev) {
		fnLoading();
		let link = this; //self reference
		function fnLoad(html) { return fnLoadHtml(link, html); }
		fetch(link.href) //default method="GET"
			.then(res => res.text().then(res.ok ? fnLoad : showError))
			.catch(showError) //error handler
			.finally(fnUnloading); //allways
		ev.preventDefault();
	});

	function setOk(el) { return $(el).removeClass("is-invalid").siblings(".invalid-feedback").html(""); }
	function setError(el, msg) { return msg && !$(el).focus().addClass("is-invalid").siblings(".invalid-feedback").html(msg); }
	const VALIDATORS = {};

	$("form").each(function(i, form) {
		let inputs = form.elements; //list
		// Initialize all textarea counter
		function fnCounter() { $("#counter-" + this.id, form).text(Math.abs(this.getAttribute("maxlength") - sb.size(this.value))); }
		$(inputs).filter("textarea[maxlength]").keyup(fnCounter).each(fnCounter);
		// End initialize all textarea counter

		// Autocomplete inputs
		function fnRenderUser(item) { return item.nif + " - " + item.nombre; }
		function fnAcLoad(el, id, txt) { return !$(el).val(txt).siblings("[type=hidden]").val(id); }
		$(inputs).filter(".ac-user").autocomplete({ //autocomplete for users
			minLength: 3,
			source: function(req, res) {
				fnLoading();
				this.element.autocomplete("instance")._renderItem = function(ul, item) {
					let label = sb.iwrap(fnRenderUser(item), req.term); //decore matches
					return $("<li></li>").append("<div>" + label + "</div>").appendTo(ul);
				}
				fetch("/usuarios.html?term=" + req.term) //js ajax call default get
					.then(res => res.json()) //default response allways json
					.then(data => { res(data.slice(0, 10)); }) //maxResults = 10
					.catch(showError) //error handler
					.finally(fnUnloading); //allways
			},
			focus: function() { return false; }, //no change focus on select
			//search: function(ev, ui) { return true; }, //lunch source
			select: function(ev, ui) { return fnAcLoad(this, ui.item.nif, fnRenderUser(ui.item)); }
		}).change(function(ev) {
			this.value || fnAcLoad(this, "", "");
		});
		// End autocomplete inputs
	}).submit(function(ev) {
		let form = this; //self reference
		let inputs = form.elements; //input list
		let _last = sb.size(inputs) - 1; //last input

		function fnLoad(html) {
			fnLoadHtml(form, html);
			for (let i = _last; i > -1; i--) { //reverse
				let el = inputs[i]; //element
				el.matches(":not([type=hidden])[tabindex]:not([readonly])") && el.focus();
				el.value = ""; //clear input
			}
		}
		function fnShowErrors(errors) {
			for (let i = _last; i > -1; i--) { //reverse
				let el = inputs[i]; //element
				setError(el, errors[el.name]);
			}
			showOk(errors.msgok);
			showError(errors.msgerr);
		}

		let ok = true; //valid form?
		for (let i = _last; i > -1; i--) { //reverse
			let el = inputs[i]; //element
			let fn = VALIDATORS[el.id];
			ok &= !fn || fn(el, sb.trim(el.value));
		}
		if (!ok || !form.classList.contains("ajax"))
			return ok; //false o true but no ajax

		fnLoading(); //show loading
		let fd = new FormData(this); //build pair key/value
		fetch(this.action, { //init options
			method: this.method,
			body: (this.enctype === "multipart/form-data") ? fd : new URLSearchParams(fd),
			headers: {
				"Content-Type": this.enctype || "application/x-www-form-urlencoded",
				"x-requested-with": "XMLHttpRequest"
			}
		}).then(res => {
			return res.ok ? res.text().then(fnLoad) : res.json().then(fnShowErrors);
		}).catch(showError) //error handler
			.finally(fnUnloading); //allways
		ev.preventDefault();
	});
	// End AJAX links and forms
});


$(document).ready(function() {
	// Build all menus as UL > Li
	$("ul.menu").each(function(i, menu) {
		// Build menuu as tree
		$(menu.children).filter("[parent][parent!='']").each((i, child) => {
			let node = $("#" + $(child).attr("parent"), menu); //get parent node
			node.children().last().is(menu.tagName)
				|| node.append('<ul class="sub-menu"></ul>').children("a").append('<b class="nav-tri">&rtrif;</b>');
			node.children().last().append(child);
		});

		// Remove empty sub-levels and empty icons
		$(menu.children).remove("[parent][parent!='']");
		menu.querySelectorAll("i").forEach(i => {
			(i.classList.length <= 1) && i.parentNode.removeChild(i);
		});

		// Add triangles mark for submenu items
		let triangles = $("b.nav-tri", menu); //find all marks
		triangles.parent().click(function(ev) {
			$(this.parentNode).toggleClass("active");
			ev.preventDefault(); //not navigate when click on parent
		});
		$("li", menu).hover(function() {
			triangles.html("&rtrif;"); //initialize triangles state
			$(this).children("a").find("b.nav-tri").html("&dtrif;"); //down
			$(this).parents("ul.sub-menu").prev().find("b.nav-tri").html("&dtrif;"); //up
		});

		// Disables links
		$("[disabled]", menu).each(function() {
			let mask = parseInt(this.getAttribute("disabled")) || 0;
			$(this).toggleClass("disabled", (mask & 3) !== 3);
		}).removeAttr("disabled");
	}).children().fadeIn(200); //show level=1

	// Show/Hide sidebar
	$(".sidebar-toggle").click(ev => {
		$("#sidebar").toggleClass("active");
		$(".sidebar-icon", this.parentNode).toggleClass("d-none");
		ev.preventDefault();
	});

	// Menu Toggle Script
	let toggles = $(".menu-toggle").click(ev => {
		ev.preventDefault();
		toggles.toggleClass("d-none");
		$("#wrapper").toggleClass("toggled");
	});

	//Scroll body to top on click and toggle back-to-top arrow
	let top = $("#back-to-top").click(function() { return !$("body,html").animate({ scrollTop: 0 }, 400); });
	$(window).scroll(function() { ($(this).scrollTop() > 50) ? top.fadeIn() : top.fadeOut(); });

	//Scroll anchors to its destination with a slow effect
	document.querySelectorAll('a[href^="#"]').forEach(anchor => {
		anchor.addEventListener("click", function(ev) {
			ev.preventDefault();
			try {
				document.querySelector(this.href).scrollIntoView({ behavior: "smooth" });
			} catch (ex) {}
		});
	});
});


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


//String Box extensions
function StringBox() {
	const self = this; //self instance
	//const ZEROS = "0000000000";
	const TR1 = "àáâãäåāăąÀÁÂÃÄÅĀĂĄÆßèéêëēĕėęěÈÉĒĔĖĘĚìíîïìĩīĭÌÍÎÏÌĨĪĬòóôõöōŏőøÒÓÔÕÖŌŎŐØùúûüũūŭůÙÚÛÜŨŪŬŮçÇñÑþÐŔŕÿÝ";
	const TR2 = "aaaaaaaaaAAAAAAAAAABeeeeeeeeeEEEEEEEiiiiiiiiIIIIIIIIoooooooooOOOOOOOOOuuuuuuuuUUUUUUUUcCnNdDRryY";
	/*const B64 = {
		xls: "data:application/vnd.ms-excel;base64,",
		pdf: "data:application/pdf;base64,",
		txt: "data:text/plain;base64,"
	}*/

	//helpers
	function isstr(val) { return (typeof val === "string") || (val instanceof String); }
	function fnTrim(str) { return isstr(str) ? str.trim() : str; } //string only
	function fnSize(str) { return str ? str.length : 0; } //string o array
	function tr(str) {
		var output = "";
		var size = fnSize(fnTrim(str));
		for (var i = 0; i < size; i++) {
			var chr = str.charAt(i);
			var j = TR1.indexOf(chr);
			output += (j < 0) ? chr : TR2.charAt(j);
		}
		return output.toLowerCase();
	}

	this.isstr = isstr;
	this.trim = fnTrim;
	this.size = fnSize;
	this.eq = function(str1, str2) { return tr(str1) == tr(str2); }
	this.indexOf = function(str1, str2) { return str1 ? str1.indexOf(str2) : -1; }
	this.iIndexOf = function(str1, str2) { return tr(str1).indexOf(tr(str2)); }
	this.prevIndexOf = function(str1, str2, i) { return str1 ? str1.substr(0, i).lastIndexOf(str2) : -1; }
	this.prefix = function(str1, str2) { return str1.startsWith(str2) ? str1 : (str2 + str1); }
	this.suffix = function(str1, str2) { return str1.endsWith(str2) ? str1 : (str1 + str2); }
	this.trunc = function(str, size) { return (fnSize(str) > size) ? (str.substr(0, size).trim() + "...") : str; }
	this.itrunc = function(str, size) {
		var i = (fnSize(str) > size) ? self.prevIndexOf(str, " ", size) : -1;
		return self.trunc(str, (i < 0) ? size : i);
	}

	this.removeAt = function(str, i, n) { return (i < 0) ? str : str.substr(0, i) + str.substr(i + n); }
	this.insertAt = function(str1, str2, i) { return str1 ? (str1.substr(0, i) + str2 + str1.substr(i)) : str2; }
	this.replaceAt = function(str1, str2, i, n) { return (i < 0) ? str1 : (str1.substr(0, i) + str2 + str1.substr(i + n)); }
	this.replaceLast = function(str1, find, str2) { return str1 ? str1.replaceAt(str1.lastIndexOf(find), find.length, str2) : str2; }
	this.wrapAt = function(str, i, n, open, close) { return (i < 0) ? str : self.insertAt(self.insertAt(str, open, i), close, i + open.length + n); }
	this.iwrap = function(str1, str2, open, close) { return str1 && str2 && self.wrapAt(str1, self.iIndexOf(str1, str2), str2.length, open || "<u><b>", close || "</b></u>"); }
	this.rand = function(size) { return Math.random().toString(36).substr(2, size || 8); } //random char
	this.lopd = function(str) { return str ? ("***" + str.substr(3, 4) + "**") : str; }; //hide protect chars

	this.split = function(str, sep) { return str ? str.trim().split(sep || ",") : []; }
	this.minify = function(str) { return str ? str.trim().replace(/\s{2}/g, "") : str; }
	this.lines = function(str) { return self.split(str, /[\n\r]+/); }
	this.words = function(str) { return self.split(str, /\s+/); }

	this.ilike = function(str1, str2) { return self.iIndexOf("" + str1, str2) > -1; }; //object value type = string
	this.olike = function(obj, names, val) { return names.some(function(k) { return self.ilike(obj[k], val); }); };
	this.alike = function(obj, names, val) { return self.words(val).some(function(v) { return self.olike(obj, names, v); }); };

	//chunk string in multiple parts
	this.ltr = function(str, size) {
		var result = []; //parts container
		for (var i = fnSize(str); i > size; i -= size)
			result.unshift(str.substr(i - size, size));
		(i > 0) && result.unshift(str.substr(0, i));
		return result;
	}
	this.rtl = function(str, size) {
		var result = []; //parts container
		var n = fnSize(str); //maxlength
		for (var i = 0; i < n; i += size)
			result.push(str.substr(i, size));
		return result;
	}
	this.slices = function(str, sizes) {
		var j = 0; //string position
		var result = []; //parts container
		var k = fnSize(str); //maxlength
		for (let i = 0; (j < k) && (i < sizes.length); i++) {
			let n = sizes[i];
			result.push(str.substr(j, n));
			j += n;
		}
		if (j < k) //last slice?
			result.push(str.substr(j));
		return result;
	}
}
