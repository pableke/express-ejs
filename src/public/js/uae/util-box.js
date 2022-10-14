
const ab = new ArrayBox(); //array-box
const dt = new DateBox(); //datetime-box
const nb = new NumberBox(); //number box
const sb = new StringBox(); //string box
const valid = new ValidatorBox(); //validators
const i18n = new I18nBox(); //messages
const dom = new DomBox(); //HTML-DOM box

//funciones de traduccion de datos y formatos (boolean, date, datepicker, number...)
function npLatin(val) { return i18n.toFloat(val); }
function nfLatin(val) { return i18n.isoFloat(val); }
function dpLatin(val) { return i18n.toDate(val); }
function dfLatin(val) { return i18n.isoDate(val); }

//gestion de informes y mensajes
function handleReport(xhr, status, args) { dom.closeAlerts().showError(args && args.msgerr).redir(args && args.url); }
function handleMessages(xhr, status, args) { dom.closeAlerts().showError(args && args.msgerr).showOk(args && args.msgok); }
function fnRechazar() { //envia el rechazo al servidor si hay motivo
	return dom.closeAlerts().required("#rechazo", "Debe indicar un motivo para el rechazo de la solicitud.").isOk() && i18n.confirm("msgRechazar");
}

//autocomplete helpers
let _search = false; //call source indicator
function fnFalse() { return false; } //always false
function fnAcSearch() { return _search; } //lunch source
function fnAcChange(ev) { _search = (ev.keyCode == 8) || sb.between(ev.keyCode, 46, 111) || sb.between(ev.keyCode, 160, 223); } //backspace or alfanum
function fnAcFilter(data, columns, term) { return data && data.filter(row => sb.olike(row, columns, term)).slice(0, 8); } //filter max 8 results
function fnAcLoad(el, id, txt) { return !$(el).val(txt).siblings("[type=hidden]").val(id); }
function fnAcReset() { this.value || fnAcLoad(this, "", ""); }
function fnAcRender(jqel, fnRender) {
	jqel.autocomplete("instance")._renderItem = function(ul, item) {
		return $("<li></li>").append("<div>" + sb.iwrap(fnRender(item), jqel.val()) + "</div>").appendTo(ul);
	}
}

//DOM is fully loaded
dom.ready(function() {
	const tabs = dom.getTabs(); // All tabs list
	const inputs = dom.getInputs(); // All inputs list

	// Loading
	dom.append('<div class="ibox"><div class="ibox-wrapper"><b class="fas fa-spinner fa-3x fa-spin"></b></div></div>');
	const ibox = document.body.lastElementChild;
	window.loading = window.MostrarProgreso = () => $(ibox).show();
	window.unloading = () => $(ibox).hide();

	// Scroll body to top on click and toggle back-to-top arrow
	dom.append('<a id="back-to-top" href="#top" class="hide back-to-top"><i class="fas fa-chevron-up"></i></a>');
	const top = document.body.lastElementChild;
	window.onscroll = function() { dom.toggleHide(top, this.pageYOffset < 80); }
	dom.addClick(top, el => !dom.scroll().scroll(null, window.parent));

	// Alerts handlers
	const alerts = dom.get("div.alerts");
	const texts = dom.getAll(".alert-text", alerts);
	function showAlert(el) { return dom.show(el.parentNode); }
	function closeAlert(el) { return dom.hide(el.parentNode); }
	function setAlert(el, txt) { return txt ? showAlert(el).setHtml(el, txt).scroll() : dom; }

	dom.showOk = (msg) => setAlert(texts[0], msg); //green
	dom.showInfo = (msg) => setAlert(texts[1], msg); //blue
	dom.showWarn = (msg) => setAlert(texts[2], msg); //yellow
	dom.showError = (msg) => setAlert(texts[3], msg); //red
	dom.showAlerts = function(msgs) { //show posible multiple messages types
		return msgs ? dom.showOk(msgs.msgOk).showInfo(msgs.msgInfo).showWarn(msgs.msgWarn).showError(msgs.msgError) : dom;
	}
	dom.closeAlerts = function() { //hide all alerts
		i18n.start(); //reinit. error counter
		const tips = dom.getAll(".ui-errtip"); //tips messages
		return dom.each(texts, closeAlert).removeClass(inputs, "ui-error").html(tips, "").hide(tips);
	}

	// Show posible server messages and close click event
	dom.each(texts, el => { el.firstChild && showAlert(el); })
		.click(dom.getAll(".alert-close", alerts), closeAlert);

	// Individual input error messages
	dom.setError = function(selector, msg, msgtip, fn) {
		const el = dom.getInput(selector);
		if (el && !(fn && fn(el.name, el.value, msg, msgtip))) {
			i18n.setError(msg, el.name, msgtip); // Show error
			const tip = dom.sibling(el, ".ui-errtip"); // Show tip error
			dom.showError(i18n.getError()).addClass(el, "ui-error").focus(el)
				.setHtml(tip, i18n.getMsg(el.name)).show(tip);
		}
		return dom;
	}

	// Inputs formated
	dom.each(dom.getInputs(".ui-bool"), el => { el.value = i18n.fmtBool(el.value); });
	dom.onChangeInputs(".ui-integer", el => { el.value = i18n.fmtInt(el.value); dom.toggle(el, "texterr", sb.starts(el.value, "-")); });
	dom.onChangeInputs(".ui-float", el => { el.value = i18n.fmtFloat(el.value); dom.toggle(el, "texterr", sb.starts(el.value, "-")); });
	dom.setAttrInputs(".ui-date", "type", "date").setAttrInputs(".disabled,.ui-state-disabled", "readonly", true);
	// Initialize all textarea counter
	const ta = dom.getInputs("textarea[maxlength]");
	function fnCounter(el) {
		let value = Math.abs(el.getAttribute("maxlength") - sb.size(el.value));
		dom.setText(dom.get(".counter", el.parentNode), value);
	}
	dom.keyup(ta, fnCounter).each(ta, fnCounter);
	// Sistema de urgencia para las solicitudes
	dom.onChangeInput("#urgente", () => dom.toggleHide(".grp-urgente")).setAttrInput("#fMax", "min", dt.isoEnDate(dt.sysdate()));

	// Common validators for fields
	dom.addError = dom.setError; // Synonym
	dom.required = (el, msg, msgtip) => dom.setError(el, msg, msgtip, i18n.required);
	dom.login = (el, msg, msgtip) => dom.setError(el, msg, msgtip, i18n.login);
	dom.email = (el, msg, msgtip) => dom.setError(el, msg, msgtip, i18n.email);
	dom.user = (el, msg, msgtip) => dom.setError(el, msg, msgtip, i18n.user);
	dom.intval = (el, msg, msgtip) => dom.setError(el, msg, msgtip, i18n.intval);
	dom.gt0 = (el, msg, msgtip) => dom.setError(el, msg, msgtip, i18n.gt0);
	dom.fk = (el, msg, msgtip) => dom.setError(el, msg, msgtip, i18n.fk);
	dom.past = (el, msg, msgtip) => dom.setError(el, msg, msgtip, i18n.past);
	dom.geToday = (el, msg, msgtip) => dom.setError(el, msg, msgtip, i18n.geToday);

	// Show / Hide related info
	dom.onclick("a[href='#toggle']", el => !dom.toggleLink(el).toggle(dom.get("i.fas", el), el.dataset.icon));

	$("a.rechazar", tabs).click(function() { //muestra el tab de rechazo
		$("input#id-rechazo", tabs).val(this.id); //rechazo para el nuevo cv
		$("a.btn-rechazar", tabs).attr("id", this.id); //rechazo para antiguo portal
		return !dom.setFocus("#rechazo"); //foco en el textarea
	});
});
