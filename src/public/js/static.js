
$(document).ready(function() {
	let lang = $("html").attr("lang");// || navigator.language || navigator.userLanguage; //default browser language
	let sb = new StringBox();
	let mb = new MessageBox(lang);

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

	let forms = document.querySelectorAll("form");
	for (let i = forms.length - 1; (i > -1); i--) {
		const CLS_INVALID = "is-invalid";
		const CLS_FEED_BACK = ".invalid-feedback";
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
					let msg = el.name && errors[el.name];
					msg && $(el).focus().addClass(CLS_INVALID).siblings(CLS_FEED_BACK).html(msg);
				}
				showOk(errors.msgOk);
				showInfo(errors.msgInfo);
				showWarn(errors.msgWarn);
				showError(errors.msgError);
			}

			let _data = valid.values(inputs); //input list to object
			if (!valid.validate(form.getAttribute("action"), _data, mb.getLang())) { //error => stop
				fnShowErrors(valid.addMsg("msgError", mb.get("errForm")).getErrors());
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
function MessageBox(lang) {
	const self = this; //self instance
	const langs = {
		en: { //english
			errForm: "Form validation failed",
			errRequired: "Required field!",
			errMinlength8: "The min length required is 8 characters",
			errNif: "Wrong ID format",
			errCorreo: "Wrong Mail format",
			errRegex: "Wrong format",

			remove: "Are you sure to delete element?",
			cancel: "Are you sure to cancel element?"
		},

		es: { //spanish
			errForm: "Error al validar los campos del formulario",
			errRequired: "Campo obligatorio!",
			errMinlength8: "Valor mínimo requerido de 8 caracteres",
			errNif: "Formato de NIF / CIF incorrecto",
			errCorreo: "Formato de E-Mail incorrecto",
			errRegex: "Formato incorrecto",

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

	//load default language
	self.setI18n(lang);
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
	const VALIDATORS = {}; //common multiforms validators
	const FORMS = {}; //forms by id => unique id

	//RegEx for validating
	const RE_DIGITS = /^\d+$/;
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
	function fnExec(fn, field, value, i18n) { return !fn || fn(self, field, value, i18n); } //run validate function
	function minify(str) { return str ? str.trim().replace(/\W+/g, "").toUpperCase() : str; }; //remove spaces and upper
	function reTest(re, elemval) { //regex test
		try {
			return re.test(elemval);
		} catch(e) {}
		return false;
	}

	this.size = function(elemval, min, max) {
		let size = fnSize(elemval);
		return (min <= size) && (size <= max);
	}

	this.regex = function(re, value) { return reTest(re, value); }
	this.login = function(elemval) { return reTest(RE_LOGIN, elemval); }
	this.email = function(elemval) { return reTest(RE_MAIL, elemval); }
	this.digits = function(elemval) { return reTest(RE_DIGITS, elemval); }
	this.idlist = function(elemval) { return reTest(RE_IDLIST, elemval); }

	this.idES = function(str) {
		str = minify(str);
		if (!str)
			return false;
		if (reTest(RE_DNI, str))
			return self.dni(str)
		if (reTest(RE_CIF, str))
			return self.cif(str)
		if (reTest(RE_NIE, str))
			return self.nie(str)
		return false;
	}
	this.dni = function(dni) {
		var letras = "TRWAGMYFPDXBNJZSQVHLCKE";
		var letra = letras.charAt(parseInt(dni, 10) % 23);
		return (letra == dni.charAt(8));
	}
	this.cif = function(cif) {
		var match = cif.match(RE_CIF);
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
	this.nie = function(nie) {
		//Change the initial letter for the corresponding number and validate as DNI
		var prefix = nie.charAt(0);
		var p0 = (prefix == "X") ? 0 : ((prefix == "Y") ? 1 : ((prefix == "Z") ? 2 : prefix));
		return self.dni(p0 + nie.substr(1));
	}

	this.iban = function(IBAN) {
		IBAN = minify(IBAN);
		if (fnSize(IBAN) != 24)
			return false;

		// Se coge las primeras dos letras y se pasan a números
		const LETRAS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
		let num1 = LETRAS.search(IBAN.substring(0, 1)) + 10;
		let num2 = LETRAS.search(IBAN.substring(1, 2)) + 10;
		//Se sustituye las letras por números.
		let aux = String(num1) + String(num2) + IBAN.substring(2);
		// Se mueve los 6 primeros caracteres al final de la cadena.
		aux = aux.substring(6) + aux.substring(0,6);

		//Se calcula el resto modulo 97
		let resto = "";
		let parts = Math.ceil(aux.length/7);
		for (let i = 1; i <= parts; i++)
			resto = String(parseFloat(resto + aux.substr((i-1)*7, 7))%97);
		return (1 == resto);
	}

	this.creditCardNumber = function(cardNo) { //Luhn check algorithm
		cardNo = minify(cardNo);
		if (fnSize(cardNo) != 16)
			return false;

		let s = 0;
		let doubleDigit = false;
		cardNo = cardNo.trim().replace(/\s+/g, ""); //remove spaces
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
		}).join(""); 
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
		return VALIDATORS[name];
	}
	this.set = function(name, fn) {
		VALIDATORS[name] = fn;
		return self;
	}
	this.call = function(name, field, value, msgs) {
		return fnExec(VALIDATORS[name], field, value, msgs);
	}

	// Errors asociated by fields
	function fnInit() {
		for (let k in ERRORS)
			delete ERRORS[k];
		ERRORS.num = 0;
		return self;
	}

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
	this.addForms = function(forms) {
		Object.assign(FORMS, forms);
		return self;
	}
	this.getFields = function(form) {
		let fields = self.getForm(form);
		return fields ? Object.keys(fields) : [];
	}
	this.initFields = function(form) {
		fnInit().getFields(form).forEach(field => { ERRORS[field] = ""; });
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
		fnInit(); //init service
		let validators = self.getForm(form) || {};
		self.getFields(form).forEach(field => {
			fnExec(validators[field], field, fnTrim(data[field]), i18n);
		});
		return self.isValid();
	}
}


const VALIDATORS = {};
VALIDATORS["/test.html"] = {
	nombre: function(valid, name, value, msgs) {
		return valid.call("required", name, value, msgs);
	},
	/*ap1: function(valid, name, value, msgs) {
		return valid.call("required", name, value, msgs);
	},
	ap2: function(valid, name, value, msgs) {
		valid.size(value, 0, 200) || !valid.setError(name, msgs.errNombre);
	},
	nif: function(valid, name, value, msgs) {
		return (valid.size(value, 1, 50) && valid.esId(fields.nif)) || !valid.setError(name, msgs.errNif);
	},*/
	correo: function(valid, name, value, msgs) {
		return valid.call("correo", name, value, msgs);
	},
	asunto: function(valid, name, value, msgs) {
		return valid.call("required", name, value, msgs);
	}
};

//extended config
const valid = new ValidatorBox();
valid.set("required", function(valid, name, value, msgs) {
	return valid.size(value, 1, 200) || !valid.setError(name, msgs.errRequired);
}).set("login", function(valid, name, value, msgs) {
	if (!valid.size(value, 8, 200))
		return !valid.setError(name, msgs.errMinlength8);
	return valid.idES(value) || valid.email(value)|| !valid.setError(name, msgs.errRegex);
}).set("clave", function(valid, name, value, msgs) {
	if (!valid.size(value, 8, 200))
		return !valid.setError(name, msgs.errMinlength8);
	return valid.login(value) || !valid.setError(name, msgs.errRegex);
}).set("nif", function(valid, name, value, msgs) {
	return (valid.size(value, 1, 50) && valid.idES(value)) || !valid.setError(name, msgs.errNif);
}).set("correo", function(valid, name, value, msgs) {
	if (!valid.size(value, 1, 200))
		return !valid.setError(name, msgs.errRequired);
	return valid.email(value) || !valid.setError(name, msgs.errCorreo);
}).addForms(VALIDATORS);
