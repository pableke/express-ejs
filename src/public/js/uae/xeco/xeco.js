
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
	}).change(fnAcReset).on("search", fnAcReset);

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
	}).change(fnAcReset).on("search", fnAcReset);

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
	}).change(fnAcReset).on("search", fnAcReset);

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
	}).change(fnAcReset).on("search", fnAcReset);
});
