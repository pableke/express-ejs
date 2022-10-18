
dom.ready(() => {
	$(".ac-tercero").attr("type", "search").keydown(fnAcChange).autocomplete({
		delay: 500, //milliseconds between keystroke occurs and when a search is performed
		minLength: 5, //reduce matches
		focus: fnFalse, //no change focus on select
		search: fnAcSearch, //lunch source
		source: function(req, res) {
			fnAutocomplete(this.element, ["nombre", "nif"], res,
				item => { return item.nif + " - " + item.nombre; }
			);
		},
		select: function(ev, ui) {
			return fnAcLoad(this, ui.item.nif, ui.item.nif + " - " + ui.item.nombre);
		}
	}).change(fnAcReset);

	$(".ac-pago").attr("type", "search").keydown(fnAcChange).autocomplete({
		delay: 500, //milliseconds between keystroke occurs and when a search is performed
		minLength: 3, //reduce matches
		focus: fnFalse, //no change focus on select
		search: fnAcSearch, //lunch source
		source: function(req, res) {
			fnAutocomplete(this.element, ["numJg", "numDc"], res,
				item => { return item.numJg + ": " + item.desc; }
			);
		},
		select: function(ev, ui) {
			return fnAcLoad(this, ui.item.numJg, ui.item.numJg + ": " + ui.item.desc);
		}
	}).change(fnAcReset);

	$(".ac-tramitador").attr("type", "search").keydown(fnAcChange).autocomplete({
		delay: 500, //milliseconds between keystroke occurs and when a search is performed
		minLength: 3, //reduce matches
		focus: fnFalse, //no change focus on select
		search: fnAcSearch, //lunch source
		source: function(req, res) {
			fnAutocomplete(this.element, ["nombre", "utCod", "utDesc"], res,
				item => { return item.nombre + "<br>" + item.utCod + " - " + item.utDesc; }
			);
		},
		select: function(ev, ui) {
			let text = ui.item.utCod + " - " + ui.item.utDesc;
			return fnAcLoad(this, ui.item.id, text);
		}
	}).change(fnAcReset);

	$(".ac-organica").attr("type", "search").keydown(fnAcChange).autocomplete({
		delay: 500, //milliseconds between keystroke occurs and when a search is performed
		focus: fnFalse, //no change focus on select
		search: fnAcSearch, //lunch source
		source: function(req, res) {
			fnAutocomplete(this.element, ["o", "dOrg"], res, item => (item.o + " - " + item.dOrg));
		},
		select: function(ev, ui) {
			return fnAcLoad(this, ui.item.id, ui.item.o + " - " + ui.item.dOrg);
		}
	}).change(fnAcReset);
});

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
