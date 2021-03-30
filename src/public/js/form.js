
$(document).ready(function() {
	let lang = $("html").attr("lang") || navigator.language || navigator.userLanguage; //default browser language
	let mb = new MessageBox(lang);
	let vs = new ValidatorService();
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
			const CLS_INVALID = "is-invalid";
			const CLS_FEED_BACK = ".invalid-feedback";
			for (let i = _last; i > -1; i--) { //reverse
				let el = inputs[i]; //element
				let _msg = el.name && errors[el.name];
				_msg ? $(el).focus().addClass(CLS_INVALID).siblings(CLS_FEED_BACK).html(_msg) 
					: $(el).removeClass(CLS_INVALID).siblings(CLS_FEED_BACK).html("");
			}
			showOk(errors.msgok);
			showError(errors.msgerr);
		}

		vs.init(mb.getLang()); //init service
		for (let i = _last; i > -1; i--) { //reverse
			let el = inputs[i]; //element
			vs.validate(el.name, el.value);
		}
		if (vs.fails()) { //if error => stop
			vs.setError("msgerr", mb.get("errForm"));
			fnShowErrors(vs.getErrors());
			return ev.preventDefault();
		}
		if (!form.classList.contains("ajax"))
			return true; //submit form

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
