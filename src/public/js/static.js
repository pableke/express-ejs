
$(document).ready(function() {
	const lang = $("html").attr("lang"); //|| navigator.language || navigator.userLanguage; //default browser language
	const msgs = i18n.setI18n(lang).getLang(); //messages container
	const sb = new StringBox(); //helpers

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
		let link = this; //self reference
		ev.preventDefault(); //stop event
		if (link.classList.contains("remove") && !confirm(msgs.remove))
			return false; //stop call
		fnLoading(); //show loading frame
		function fnLoad(html) { return fnLoadHtml(link, html); }
		fetch(link.href) //default method="GET"
			.then(res => res.text().then(res.ok ? fnLoad : showError))
			.catch(showError) //error handler
			.finally(fnUnloading); //allways
	});

	let forms = document.querySelectorAll("form");
	for (let i = forms.length - 1; (i > -1); i--) {
		const CLS_INVALID = "input-error";
		const CLS_FEED_BACK = ".msg-error";
		const COUNTER_SELECTOR = "textarea[maxlength]";

		let form = forms[i]; //element
		let inputs = form.elements; //list

		// Initialize all textarea counter
		function fnCounter() { $("#counter-" + this.id, form).text(Math.abs(this.getAttribute("maxlength") - sb.size(this.value))); }
		$(inputs).filter(COUNTER_SELECTOR).keyup(fnCounter).each(fnCounter);
		// End initialize all textarea counter

		function fnFocus() { $(inputs).filter(":not([type=hidden])[tabindex]:not([readonly])").first().focus(); }
		function fnClean() { //reset message and state inputs
			$(inputs).removeClass(CLS_INVALID).siblings(CLS_FEED_BACK).text("");
			$(inputs).filter(COUNTER_SELECTOR).each(fnCounter);
			closeAlerts(); //close previous messages
			fnFocus(); //focus on first
		}

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

		$(inputs).filter("[type=reset]").click(ev => {
			//Do what you need before reset the form
			form.reset(); //Reset manually the form
			//Do what you need after reset the form
			fnClean(); //reset message and state inputs
		});

		fnFocus(); //focus on first
		form.addEventListener("submit", function(ev) {
			function fnLoad(html) {
				$(inputs).val(""); //clean input values
				fnClean(); //reset message and state inputs
				fnLoadHtml(form, html); //load html section
			}
			function fnShowErrors(errors) {
				fnClean(); //reset message and state inputs
				let _last = sb.size(inputs) - 1; //last input
				for (let i = _last; (i > -1); i--) { //reverse
					let el = inputs[i]; //element
					let msg = el.name && errors[el.name]; //exists message error?
					msg && $(el).focus().addClass(CLS_INVALID).siblings(CLS_FEED_BACK).html(msg);
				}
				showOk(errors.msgOk);
				showInfo(errors.msgInfo);
				showWarn(errors.msgWarn);
				showError(errors.msgError);
			}

			let _data = valid.values(inputs); //input list to object
			if (!valid.validate(form.getAttribute("action"), _data, msgs)) { //error => stop
				fnShowErrors(valid.addMsg("msgError", msgs.errForm).getErrors());
				return ev.preventDefault();
			}
			if (!form.classList.contains("ajax"))
				return true; //submit form

			fnLoading(); //show loading
			let fd = new FormData(form); //build pair key/value
			fetch(form.action, { //init options
				method: form.method,
				body: (form.enctype === "multipart/form-data") ? fd : new URLSearchParams(fd),
				headers: {
					"Content-Type": form.enctype || "application/x-www-form-urlencoded",
					"x-requested-with": "XMLHttpRequest"
				}
			}).then(res => {
				return res.ok ? res.text().then(fnLoad) : res.json().then(fnShowErrors);
			}).catch(showError) //error handler
				.finally(fnUnloading); //allways
			ev.preventDefault();
		});
	}
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


/**
 * Message-Box module
 * @module Message-Box
 */
function MessageBox() {
	const self = this; //self instance
	const langs = {
		en: { //english
			lang: "en",
			errForm: "Form validation failed",
			errRequired: "Required field!",
			errMinlength8: "The minimum required length is 8 characters",
			errNif: "Wrong ID format",
			errCorreo: "Wrong Mail format",
			errDate: "Wrong date format",
			errDateLe: "Date must be less or equals than current",
			errDateGe: "Date must be greater or equals than current",
			errNumber: "Wrong number format",
			errGt0: "Price must be great than 0.00 &euro;", 
			errRegex: "Wrong format",
			errReclave: "Passwords typed do not match",
			errRange: "Value out of allowed range",

			remove: "Are you sure to delete element?",
			cancel: "Are you sure to cancel element?"
		},

		es: { //spanish
			lang: "es",
			errForm: "Error al validar los campos del formulario",
			errRequired: "Campo obligatorio!",
			errMinlength8: "La longitud mínima requerida es de 8 caracteres",
			errNif: "Formato de NIF / CIF incorrecto",
			errCorreo: "Formato de E-Mail incorrecto",
			errDate: "Formato de fecha incorrecto",
			errDateLe: "La fecha debe ser menor o igual a la actual",
			errDateGe: "La fecha debe ser mayor o igual a la actual",
			errNumber: "Valor no numérico",
			errGt0: "El importe debe ser mayor de 0,00 &euro;", 
			errRegex: "Formato incorrecto",
			errReclave: "Las claves introducidas no coinciden",
			errRange: "Valor fuera del rango permitido",

			remove: "¿Confirma que desea eliminar este registro?",
			cancel: "¿Confirma que desea cancelar este registro?"
		}
	}

	let _lang = langs.es; //default
	this.getLang = function(lang) { return lang ? langs[lang] : _lang; }
	this.setLang = function(lang, data) { langs[lang] = data; return self; }
	this.getI18n = function(lang) { return (lang) ? (langs[lang] || langs[lang.substr(0, 2)] || langs.es) : langs.es; }
	this.setI18n = function(lang) { _lang = self.getI18n(lang); return self; }

	this.get = function(name) { return _lang[name]; }
	this.set = function(name, value) { _lang[name] = value; return self; }
	this.format = function(str) {
		return str.replace(/@(\w+);/g, (m, k) => { return nvl(_lang[k], m); });
	}
}


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


/**
 * ValidatorBox module
 * @module ValidatorBox
 */
function ValidatorBox() {
	const self = this; //self instance
	const ERRORS = {}; //errors container
	const FORMS = {}; //forms by id => unique id
	const OUTPUT = {}; //data formated container
	const EMPTY = ""; //empty string

	//RegEx for validating
	const RE_DIGITS = /^\d+$/;
	const RE_NO_DIGITS = /\D+/g;
	const RE_IDLIST = /^\d+(,\d+)*$/;
	const RE_MAIL = /\w+[^\s@]+@[^\s@]+\.[^\s@]+/;
	const RE_LOGIN = /^[\w#@&°!§%;:=\^\/\(\)\?\*\+\~\.\,\-\$]{8,}$/;
	const RE_IPv4 = /^([0-9]{1,3}\.){3}[0-9]{1,3}(\/([0-9]|[1-2][0-9]|3[0-2]))?$/;
	const RE_IPv6 = /^([0-9A-Fa-f]{1,4}:){7}[0-9A-Fa-f]{1,4}$/;
	const RE_SWIFT = /^[A-Z]{6,6}[A-Z2-9][A-NP-Z0-9]([A-Z0-9]{3,3}){0,1}$/; //SWIFT / BIC
	const RE_URL = /(http|fttextp|https):\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])?/;
	// Spanish Id's
	const RE_DNI = /^(\d{8})([A-Z])$/;
	const RE_CIF = /^([ABCDEFGHJKLMNPQRSUVW])(\d{7})([0-9A-J])$/;
	const RE_NIE = /^[XYZ]\d{7,8}[A-Z]$/;
	// Cards Numbers
	const RE_VISA = /^(?:4[0-9]{12}(?:[0-9]{3})?)$/;
	const RE_MASTER_CARD = /^(?:5[1-5][0-9]{14})$/;
	const RE_AMEX = /^(?:3[47][0-9]{13})$/;
	const RE_DISCOVER = /^(?:6(?:011|5[0-9][0-9])[0-9]{12})$/;
	const RE_DINER_CLUB = /^(?:3(?:0[0-5]|[68][0-9])[0-9]{11})$/;
	const RE_JCB = /^(?:(?:2131|1800|35\d{3})\d{11})$/;

	function fnSize(str) { return str ? str.length : 0; }; //string o array
	function fnTrim(str) { return str ? str.trim() : str; } //string only
	function minify(str) { return str ? str.trim().replace(/\W+/g, EMPTY).toUpperCase() : str; }; //remove spaces and upper

	this.size = function(value, min, max) {
		let size = fnSize(value);
		return (min <= size) && (size <= max);
	}
	this.regex = function(re, value) {
		try {
			return re.test(value);
		} catch(e) {}
		return false;
	}

	this.login = function(name, value) { return self.regex(RE_LOGIN, value); }
	this.digits = function(name, value) { return self.regex(RE_DIGITS, value); }
	this.idlist = function(name, value) { return self.regex(RE_IDLIST, value); }
	this.email = function(name, value, msgs) {
		return self.regex(RE_MAIL, value) && self.setData(name, value.toLowerCase());
	}

	function setDate(date, yyyy, mm, dd) { date.setFullYear(+yyyy, +mm - 1, +dd); }
	function setTime(date, hh, mm, ss, ms) { date.setHours(+hh || 0, +mm || 0, +ss || 0, +ms || 0); }
	this.date = function(name, value, msgs) {
		let parts = value && value.split(RE_NO_DIGITS); //parts = string
		if (parts[0] && parts[1] && parts[2]) { //year, month and day required
			let date = new Date(); //object date
			if (msgs.lang == "en")
				setDate(date, parts[0], parts[1], parts[2]);
			else
				setDate(date, parts[2], parts[1], parts[0]);
			setTime(date, parts[3], parts[4], parts[5], parts[6]);
			return isNaN(date.getTime()) ? false : self.setData(name, date);
		}
		return false
	}
	this.time = function(name, value, msgs) {
		let parts = value && value.split(RE_NO_DIGITS); //parts = string
		if (parts[0] && parts[1]) { //hours and minutes required
			let date = new Date(); //object date now
			setTime(date, parts[0], parts[1], parts[2], parts[3]);
			return isNaN(date.getTime()) ? false : self.setData(name, date);
		}
		return false
	}

	this.float = function(name, value, msgs) {
		if (value) {
			let dec = (msgs.lang == "en") ? "." : ",";
			let separator = value.lastIndexOf(dec);
			let sign = (value.charAt(0) == "-") ? "-" : EMPTY;
			let whole = (separator < 0) ? value : value.substr(0, separator); //extract whole part
			let decimal = (separator < 0) ? EMPTY : ("." + value.substring(separator + 1)); //decimal part
			let float = parseFloat(sign + whole.replace(RE_NO_DIGITS, EMPTY) + decimal); //float value
			return isNaN(float) ? false : self.setData(name, float);
		}
		return false
	}

	this.idES = function(name, value) {
		value = minify(value);
		if (value) {
			if (self.regex(RE_DNI, value))
				return self.dni(name, value);
			if (self.regex(RE_CIF, value))
				return self.cif(name, value);
			if (self.regex(RE_NIE, value))
				return self.nie(name, value);
		}
		return false;
	}
	this.dni = function(name, value) {
		self.setData(name, value); //save reformat
		var letras = "TRWAGMYFPDXBNJZSQVHLCKE";
		var letra = letras.charAt(parseInt(value, 10) % 23);
		return (letra == value.charAt(8));
	}
	this.cif = function(name, value) {
		self.setData(name, value); //save reformat
		var match = value.match(RE_CIF);
		var letter = match[1];
		var number  = match[2];
		var control = match[3];
		var sum = 0;

		for (var i = 0; i < number.length; i++) {
			var n = parseInt(number[i], 10);
			//Odd positions (Even index equals to odd position. i=0 equals first position)
			if ((i % 2) === 0) {
				n *= 2; //Odd positions are multiplied first
				// If the multiplication is bigger than 10 we need to adjust
				n = (n < 10) ? n : (parseInt(n / 10) + (n % 10));
			}
			sum += n;
		}

		sum %= 10;
		var control_digit = (sum !== 0) ? 10 - sum : sum;
		var control_letter = "JABCDEFGHI".substr(control_digit, 1);
		return letter.match(/[ABEH]/) ? (control == control_digit) //Control must be a digit
					: letter.match(/[KPQS]/) ? (control == control_letter) //Control must be a letter
					: ((control == control_digit) || (control == control_letter)); //Can be either
	}
	this.nie = function(name, value) {
		//Change the initial letter for the corresponding number and validate as DNI
		var prefix = value.charAt(0);
		var p0 = (prefix == "X") ? 0 : ((prefix == "Y") ? 1 : ((prefix == "Z") ? 2 : prefix));
		return self.dni(p0 + value.substr(1));
	}

	this.iban = function(name, IBAN) {
		IBAN = minify(IBAN);
		if (fnSize(IBAN) != 24)
			return false;
		self.setData(name, IBAN); //save reformat
		// Se coge las primeras dos letras y se pasan a números
		const LETRAS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
		let num1 = LETRAS.search(IBAN.substring(0, 1)) + 10;
		let num2 = LETRAS.search(IBAN.substring(1, 2)) + 10;
		//Se sustituye las letras por números.
		let aux = String(num1) + String(num2) + IBAN.substring(2);
		// Se mueve los 6 primeros caracteres al final de la cadena.
		aux = aux.substring(6) + aux.substring(0,6);

		//Se calcula el resto modulo 97
		let resto = EMPTY;
		let parts = Math.ceil(aux.length/7);
		for (let i = 1; i <= parts; i++)
			resto = String(parseFloat(resto + aux.substr((i-1)*7, 7))%97);
		return (1 == resto);
	}

	this.creditCardNumber = function(name, cardNo) { //Luhn check algorithm
		cardNo = minify(cardNo);
		if (fnSize(cardNo) != 16)
			return false;
		self.setData(name, cardNo); //save reformat

		let s = 0;
		let doubleDigit = false;
		cardNo = cardNo.trim().replace(/\s+/g, EMPTY); //remove spaces
		for (let i = 15; i >= 0; i--) {
			let digit = +cardNo[i];
			if (doubleDigit) {
				digit *= 2;
				digit -= (digit > 9) ? 9 : 0;
			}
			s += digit;
			doubleDigit = !doubleDigit;
		}
		return ((s % 10) == 0);
	}

	this.generatePassword = function(size, charSet) {
		charSet = charSet || "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_#@&°!§%;:=^/()?*+~.,-$";
		return Array.apply(null, Array(size || 10)).map(function() { 
			return charSet.charAt(Math.random() * charSet.length);
		}).join(EMPTY); 
	}
	this.testPassword = function(pass) {
		let strength = 0;
		//Check each group independently
		strength += /[A-Z]+/.test(pass) ? 1 : 0;
		strength += /[a-z]+/.test(pass) ? 1 : 0;
		strength += /[0-9]+/.test(pass) ? 1 : 0;
		strength += /[\W]+/.test(pass) ? 1 : 0;
		//Validation for length of password
		strength += ((strength > 2) && (fnSize(pass) > 8));
		return strength; //0 = bad, 1 = week, 2-3 = good, 4 = strong, 5 = very strong
	}

	//extends extra validations
	this.get = function(name) {
		return self[name];
	}
	this.set = function(name, fn) {
		self[name] = fn;
		return self;
	}
	/*****************************************************************/
	/************************ FIN VALIDADORES ************************/
	/*****************************************************************/

	// Errors asociated by fields
	this.getErrors = function() {
		return ERRORS;
	}
	this.getError = function(name) {
		return ERRORS[name];
	}
	this.addMsg = function(name, value) {
		ERRORS[name] = value;
		return self;
	}
	this.setError = function(name, value) {
		ERRORS.num++;
		return self.addMsg(name, value);
	}

	// OJO! sobrescritura de forms => id's unicos
	this.getForm = function(form) {
		return FORMS[form];
	}
	this.setForm = function(form, validators) {
		FORMS[form] = validators;
		return self;
	}
	this.setForms = function(forms) {
		Object.assign(FORMS, forms);
		return self;
	}
	this.getFields = function(form) {
		let fields = self.getForm(form);
		return fields ? Object.keys(fields) : [];
	}
	this.getData = function(name) {
		return name ? OUTPUT[name] : OUTPUT;
	}
	this.setData = function(name, value) {
		OUTPUT[name] = value;
		return self;
	}

	/**
	 * Return an object with the values from input list as pairs name / value
	 *
	 * @function values
	 * @param      {NodeList} list Input list to be translated to an output object as name value pairs
	 * @param      {Object} obj Initial object container by default is empty object {}
	 * @return     {Object} Object containing name value pairs from input list
	 */
	this.values = function(list, obj) {
		obj = obj || {}; //result
		let size = fnSize(list); //length
		for (let i = 0; i < size; i++) {
			let el = list[i]; //element
			if (el.name) //has value
				obj[el.name] = fnTrim(el.value);
		}
		return obj;
	}

	this.fails = function() { return ERRORS.num > 0; }
	this.isValid = function() { return ERRORS.num == 0; }
	this.validate = function(form, data, i18n) {
		for (let k in ERRORS) //clear prev errors
			delete ERRORS[k]; //delete error message
		ERRORS.num = 0; //num errors
		for (let k in OUTPUT) //clear prev data
			delete OUTPUT[k]; //delete forated data

		let validators = self.getForm(form);
		if (validators) { //validators exists?
			for (let field in validators) {
				let fn = validators[field];
				OUTPUT[field] = fnTrim(data[field]);
				fn(field, OUTPUT[field], i18n, data);
			}
		}
		return self.isValid();
	}
}


//extended config
const i18n = new MessageBox();
const valid = new ValidatorBox();

function toISODateString(date) { return date.toISOString().substring(0, 10); }

valid.set("required", function(name, value, msgs) {
	return valid.size(value, 1, 200) || !valid.setError(name, msgs.errRequired);
}).set("min8", function(name, value, msgs) {
	return valid.size(value, 8, 200) || !valid.setError(name, msgs.errMinlength8);
}).set("usuario", function(name, value, msgs) {
	return valid.min8(name, value, msgs) && (valid.idES(name, value) || valid.email(name, value) || !valid.setError(name, msgs.errRegex));
}).set("clave", function(name, value, msgs) {
	return valid.min8(name, value, msgs) && (valid.login(name, value) || !valid.setError(name, msgs.errRegex));
}).set("reclave", function(name, value, msgs, data) {
	return valid.clave(name, value, msgs) && ((value == data.clave) || !valid.setError(name, msgs.errReclave));
}).set("nif", function(name, value, msgs) {
	return valid.required(name, value, msgs) && (valid.idES(name, value) || !valid.setError(name, msgs.errNif));
}).set("correo", function(name, value, msgs) {
	return valid.required(name, value, msgs) && (valid.email(name, value) || !valid.setError(name, msgs.errCorreo));
}).set("ltNow", function(name, value, msgs) {
	return valid.required(name, value, msgs) 
			&& (valid.date(name, value, msgs) || !valid.setError(name, msgs.errDate)) 
			&& ((valid.getData(name).getTime() < Date.now()) || !valid.setError(name, msgs.errDateLe));
}).set("leToday", function(name, value, msgs) {
	return valid.required(name, value, msgs) 
			&& (valid.date(name, value, msgs) || !valid.setError(name, msgs.errDate)) 
			&& ((toISODateString(valid.getData(name)) <= toISODateString(new Date())) || !valid.setError(name, msgs.errDateLe));
}).set("gtNow", function(name, value, msgs) {
	return valid.required(name, value, msgs) 
			&& (valid.date(name, value, msgs) || !valid.setError(name, msgs.errDate)) 
			&& ((valid.getData(name).getTime() > Date.now()) || !valid.setError(name, msgs.errDateGe));
}).set("geToday", function(name, value, msgs) {
	return valid.required(name, value, msgs) 
			&& (valid.date(name, value, msgs) || !valid.setError(name, msgs.errDate)) 
			&& ((toISODateString(valid.getData(name)) >= toISODateString(new Date())) || !valid.setError(name, msgs.errDateGe));
}).set("gt0", function(name, value, msgs) {
	return valid.required(name, value, msgs) 
			&& (valid.float(name, value, msgs) || !valid.setError(name, msgs.errNumber)) 
			&& ((valid.getData(name) > 0) || !valid.setError(name, msgs.errGt0));
}).setForm("/login.html", {
	usuario: valid.usuario,
	clave: valid.clave
}).setForm("/test.html", {
	nombre: valid.required,
	correo: valid.correo,
	date: function(name, value, msgs) { //optional input
		return !value || valid.date(name, value, msgs) || !valid.setError(name, msgs.errDate);
	},
	number: valid.gt0,
	asunto: valid.required,
	info: function(name, value, msgs) {
		return valid.size(value, 1, 600) || !valid.setError(name, msgs.errRequired);
	}
});
