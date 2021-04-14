
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

	function showOk(txt) { txt && setAlert(texts[0], txt); } //green
	function showInfo(txt) { txt && setAlert(texts[1], txt); } //blue
	function showWarn(txt) { txt && setAlert(texts[2], txt); } //yellow
	function showError(txt) { txt && setAlert(texts[3], txt); } //red
	function closeAlerts() { buttons.forEach(el => { el.click(); }); }
	function showAlerts(msgs) {
		closeAlerts(); //close previous messages
		//show posible multiple messages types
		showOk(msgs.msgOk); //green
		showInfo(msgs.msgInfo); //blue
		showWarn(msgs.msgWarn); //yellow
		showError(msgs.msgError); //red
	}
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
		$(this)[tog((this.offsetWidth-28) < (ev.clientX-this.getBoundingClientRect().left))]("onX");
	}).on("touchstart click", ".onX", function(ev) {
		$(this).removeClass("x onX").val("").change();
		ev.preventDefault();
	});
	// End clearable text inputs

	// AJAX links and forms
	function fnResponseOk(res) { //response = 200 read type
		let contentType = res.headers.get("content-type");
		if (contentType && (contentType.indexOf("application/json") > -1))
			return res.json().then(data => {
				data.update && $(data.update).html(data.html); //update selector dest
				showAlerts(data); //show alerts
			});
		return res.text().then(showOk);
	}
	$("a.ajax").click(function(ev) {
		ev.preventDefault(); //always stop event
		if (this.classList.contains("remove") && !confirm(msgs.remove))
			return false; //stop call
		fnLoading(); //show loading frame
		fetch(this.href) //default method="GET"
			.then(res => res.ok ? fnResponseOk(res) : res.text().then(showError))
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

		$(inputs).filter(".integer").change(function() { this.value = msgs.intHelper(this.value); });
		$(inputs).filter(".float").change(function() { this.value = msgs.floatHelper(this.value); });
		$(inputs).filter(".date").keyup(function() { this.value = msgs.acDate(this.value); }).change(function() { this.value = msgs.dateHelper(this.value); });
		$(inputs).filter(".time").keyup(function() { this.value = msgs.acTime(this.value); }).change(function() { this.value = msgs.timeHelper(this.value); });

		// Initialize all textarea counter
		function fnCounter() { $("#counter-" + this.id, form).text(Math.abs(this.getAttribute("maxlength") - sb.size(this.value))); }
		$(inputs).filter(COUNTER_SELECTOR).keyup(fnCounter).each(fnCounter);
		// End initialize all textarea counter

		function fnFocus() { $(inputs).filter(":not([type=hidden])[tabindex]:not([readonly])").first().focus(); }
		function fnClean() { //reset message and state inputs
			$(inputs).removeClass(CLS_INVALID).siblings(CLS_FEED_BACK).text("");
			$(inputs).filter(COUNTER_SELECTOR).each(fnCounter);
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
			closeAlerts(); //close previous messages
			form.reset(); //Reset manually the form
			//Do what you need after reset the form
			fnClean(); //reset message and state inputs
		});

		fnFocus(); //focus on first
		form.addEventListener("submit", function(ev) {
			function fnShowErrors(errors) {
				fnClean(); //reset message and state inputs
				let _last = sb.size(inputs) - 1; //last input
				for (let i = _last; (i > -1); i--) { //reverse
					let el = inputs[i]; //element
					let msg = el.name && errors[el.name]; //exists message error?
					msg && $(el).focus().addClass(CLS_INVALID).siblings(CLS_FEED_BACK).html(msg);
				}
				showAlerts(errors);
			}

			let _data = valid.values(inputs); //input list to object
			if (!valid.validate(form.getAttribute("action"), _data, msgs)) { //error => stop
				fnShowErrors(valid.setMsgError(msgs.errForm).getErrors());
				return ev.preventDefault();
			}
			if (!form.classList.contains("ajax"))
				return true; //submit form

			fnLoading(); //show loading
			ev.preventDefault(); //stop default
			let fd = new FormData(form); //build pair key/value
			fetch(form.action, { //init options
				method: form.method,
				body: (form.enctype === "multipart/form-data") ? fd : new URLSearchParams(fd),
				headers: { "x-requested-with": "XMLHttpRequest" }
			}).then(res => {
				if (res.ok)
					return fnResponseOk(res).then(() => {
						$(inputs).val(""); //clean input values
						fnClean(); //reset message and state inputs
					});
				return res.json().then(fnShowErrors);
			}).catch(showError) //error handler
				.finally(fnUnloading); //allways
		});
	}
	// End AJAX links and forms
});
