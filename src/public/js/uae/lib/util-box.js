
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
const fnFirmar = () => i18n.confirm("msgFirmar") && loading();
const fnIntegrar = () => i18n.confirm("msgIntegrar") && loading();
const fnRemove = () => i18n.confirm("removeSolicitud") && loading();
const handleMessages = (xhr, status, args) => { unloading(); dom.showAlerts(ab.parse(args.msgs)); }
const handleReport = (xhr, status, args) => { unloading(); dom.showAlerts(ab.parse(args.msgs)).redir(args.url); }
const fnRechazar = () => dom.closeAlerts().required("#rechazo", "Debe indicar un motivo para el rechazo de la solicitud.").isOk() && i18n.confirm("msgRechazar");

//Autocomplete helper
let _search = false; //call source indicator
function handleJson() {} //default handler
function fnFalse() { return false; } //always false
function fnAcSearch() { return _search; } //lunch source
function fnAcChange(ev) { _search = (ev.keyCode == 8) || sb.between(ev.keyCode, 46, 111) || sb.between(ev.keyCode, 160, 223); } //backspace or alfanum
function fnAcFilter(data, columns, term) { return data && data.filter(row => sb.olike(row, columns, term)).slice(0, 8); } //filter max 8 results
function fnAcRender(jqel, fnRender) { jqel.autocomplete("instance")._renderItem = (ul, item) => $("<li></li>").append("<div>" + sb.iwrap(fnRender(item), jqel.val()) + "</div>").appendTo(ul); }
function fnAcLoad(el, id, txt) { return !$(el).val(txt).siblings("[type=hidden]").first().val(id); }
function fnSelectItem(ev, ui) { return fnAcLoad(this, ui.item.value, ui.item.label); } 
function fnAcReset() { this.value || fnAcLoad(this, "", ""); }
function fnSourceItems(req, res) {
	loading();
	window.handleJson = function(xhr, status, args) {
		res(ab.parse(args?.data) || []);
		unloading();
	}
	fnAcRender(this.element, item => item.label);
	this.element.siblings("[id^='find-']").click(); //ajax call
}
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

// Show / Hide related info
dom.toggleInfo = el => {
	el.querySelectorAll("a[href='#toggle']").forEach(link => {
		const names = sb.split(link.dataset.toggle, " "); // multi class name
		const fnToggle = child => { names.forEach(name => child.classList.toggle(name)); }
		link.onclick = () => dom.toggleLink(link).eachChild(link, "i", fnToggle);
	});
	return dom;
}

	//DOM is fully loaded
dom.ready(function() {
	// Loading
	dom.append('<div class="ibox"><div class="ibox-wrapper"><b class="fas fa-spinner fa-3x fa-spin"></b></div></div>');
	const ibox = document.body.lastElementChild;
	dom.loading = window.loading = window.MostrarProgreso = () => { $(ibox).show(); return dom.closeAlerts(); }
	dom.working = dom.unloading = window.unloading = () => { $(ibox).hide(); return dom; }

	// Inputs formated
	dom.eachInput(".ui-bool", el => { el.value = i18n.fmtBool(el.value); })
		.onChangeInputs(".ui-integer", el => { el.value = i18n.fmtInt(el.value); dom.toggle(el, "texterr", sb.starts(el.value, "-")); })
		.onChangeInputs(".ui-float", el => { el.value = i18n.fmtFloat(el.value); dom.toggle(el, "texterr", sb.starts(el.value, "-")); })
		.setAttrInputs(".ui-date", "type", "date").setAttrInputs(".disabled,.ui-state-disabled", "readonly", true);
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
	dom.leToday = (el, msg, msgtip) => dom.setError(el, msg, msgtip, i18n.leToday);
	dom.geToday = (el, msg, msgtip) => dom.setError(el, msg, msgtip, i18n.geToday);

	dom.eachInput(".ac-xeco-item:not(.ui-state-disabled)", el => {
		$(el).attr("type", "search").keydown(fnAcChange).change(fnAcReset).on("search", fnAcReset).autocomplete({
			delay: 500, //milliseconds between keystroke occurs and when a search is performed
			minLength: 4, //reduce matches
			focus: fnFalse, //no change focus on select
			search: fnAcSearch, //lunch source
			source: fnSourceItems, //show datalist
			select: fnSelectItem //show item selected
		});
	});
	dom.toggleInfo(document);
});
