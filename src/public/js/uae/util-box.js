
const ab = new ArrayBox(); //array-box
const dt = new DateBox(); //datetime-box
const nb = new NumberBox(); //number box
const sb = new StringBox(); //string box
const valid = new ValidatorBox(); //validators
const i18n = new I18nBox(); //messages
const dom = new DomBox(); //HTML-DOM box

//funciones sinonimas de traduccion de datos y formatos (boolean, date, datepicker, number...)
const npLatin = i18n.toFloat;
const nfLatin = i18n.isoFloat;
const dpLatin = i18n.toDate;
const dfLatin = i18n.isoDate;

//gestion de informes y mensajes
function handleReport(xhr, status, args) { dom.closeAlerts().showError(args && args.msgerr).redir(args && args.url); }
function handleMessages(xhr, status, args) { dom.closeAlerts().showError(args && args.msgerr).showOk(args && args.msgok); }
function fnRechazar() { //envia el rechazo al servidor si hay motivo
	return dom.closeAlerts().required("#rechazo", "Debe indicar un motivo para el rechazo de la solicitud.").isOk() && i18n.confirm("msgRechazar");
}

//Autocomplete helper
let _search = false; //call source indicator
function handleJson() {} //default handler
function fnFalse() { return false; } //always false
function fnAcSearch() { return _search; } //lunch source
function fnAcChange(ev) { _search = (ev.keyCode == 8) || sb.between(ev.keyCode, 46, 111) || sb.between(ev.keyCode, 160, 223); } //backspace or alfanum
function fnAcFilter(data, columns, term) { return data && data.filter(row => sb.olike(row, columns, term)).slice(0, 8); } //filter max 8 results
function fnAcRender(jqel, fnRender) { jqel.autocomplete("instance")._renderItem = (ul, item) => $("<li></li>").append("<div>" + sb.iwrap(fnRender(item), jqel.val()) + "</div>").appendTo(ul); }
function fnAcLoad(el, id, txt) { return !$(el).val(txt).siblings("[type=hidden]").val(id); }
function fnAcReset() { this.value || fnAcLoad(this, "", ""); }
function fnAutocomplete(el, columns, fnResponse, fnRender) {
	loading();
	window.handleJson = function(xhr, status, args) {
		let data = ab.parse(args?.data) || []; // JSON returned by server
		ab.multisort(data, sb.multicmp(columns)); // order by column name
		fnResponse(fnAcFilter(data, columns, el.val()));
		unloading();
	}
	fnAcRender(el, fnRender);
	el.siblings("[id^='find-']").click(); //ajax call
}

//DOM is fully loaded
dom.ready(function() {
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

	// Inputs formated
	dom.each(dom.getInputs(".ui-bool"), el => { el.value = i18n.fmtBool(el.value); })
		.onChangeInputs(".ui-integer", el => { el.value = i18n.fmtInt(el.value); dom.toggle(el, "texterr", sb.starts(el.value, "-")); })
		.onChangeInputs(".ui-float", el => { el.value = i18n.fmtFloat(el.value); dom.toggle(el, "texterr", sb.starts(el.value, "-")); })
		.setAttrInputs(".ui-date", "type", "date").setAttrInputs(".disabled,.ui-state-disabled", "readonly", true);
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
	dom.addError = dom.setError = dom.setInputError; // Synonym
	dom.required = (el, msg) => dom.setError(el, msg, null, i18n.required);
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

	const tabs = dom.getTabs(); // All tabs list
	$("a.rechazar", tabs).click(function() { //muestra el tab de rechazo
		$("input#id-rechazo", tabs).val(this.id); //rechazo para el nuevo cv
		$("a.btn-rechazar", tabs).attr("id", this.id); //rechazo para antiguo portal
		return !dom.setFocus("#rechazo"); //foco en el textarea
	});
});
