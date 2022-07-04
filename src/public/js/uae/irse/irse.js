
dom.ready(function() {
	i18n.setI18n(IRSE.lang).addLangs(IRSE_I18N); //Set init. config
	Object.assign(IRSE, i18n.getMsgs()); //Add date config
	dom.tr(".i18n-tr-h1"); //local traductor

	/********** uxxiec autocomplete **********/
	$("#uxxi").attr("type", "search").keydown(fnAcChange).autocomplete({
		delay: 500, //milliseconds between keystroke occurs and when a search is performed
		minLength: 3, //force filter => reduce matches
		focus: fnFalse, //no change focus on select
		search: fnAcSearch, //lunch source
		source: function(req, res) {
			fnAutocomplete(this.element,  ["num", "desc"], res,
				item => { return item.num + " - " + item.uxxi + "<br>" + item.desc; }
			);
		},
		select: function(ev, ui) {
			let text = ui.item.num + " - " + ui.item.desc;
			return fnAcLoad(this, ui.item.ec + "," + ui.item.tipo, text);
		}
	}).change(fnAcReset);
	/********** uxxiec autocomplete **********/
});

//Global IRSE components
const ip = new IrsePerfil();
const io = new IrseOrganicas();
const ii = new IrseImputacion();
const ir = new IrseRutas();
const dietas = new IrseDietas();

//PF needs confirmation in onclick attribute
function fnRemove() { return i18n.confirm("msgDelSolicitud") && loading(); }
function fnUnlink() { return i18n.confirm("msgUnlink") && loading(); }
function fnClone() { return i18n.confirm("msgReactivar") && loading(); }
function fnFirmar() { return i18n.confirm("msgFirmar") && loading(); }

//Autocomplete helper
function handleJson() {}
function fnAutocomplete(el, columns, fnResponse, fnRender) {
	function fnSortColumns(a, b) {
		let aux = 0;
		for (let i = 0; (i < columns.length) && (aux == 0); i++) {
			let name = columns[i];
			aux = sb.cmp(a[name], b[name]);
		}
		return aux;
	}

	loading();
	window.handleJson = function(xhr, status, args) {
		let data = ab.parse(args && args.data) || [];
		ab.sort(data, "asc", fnSortColumns);
		fnResponse(fnAcFilter(data, columns, el.val()));
		unloading();
	}
	fnAcRender(el, fnRender);
	el.siblings("[id^='find-']").click(); //ajax call
}
