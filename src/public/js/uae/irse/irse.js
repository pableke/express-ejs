
dom.ready(function() {
	i18n.addLangs(IRSE_I18N).setCurrent(IRSE.lang); //Set init. config
	dom.tr(".i18n-tr-h1"); //local traductor

	//Autocompletes expediente uxxiec
	const RESUME = {};
	const STYLES = { imp: i18n.isoFloat, fUxxi: i18n.fmtDate };
	let op, operaciones; // vinc. container
	$("#uxxi").attr("type", "search").keydown(fnAcChange).autocomplete({
		delay: 500, //milliseconds between keystroke occurs and when a search is performed
		minLength: 3, //force filter => reduce matches
		focus: fnFalse, //no change focus on select
		search: fnAcSearch, //lunch source
		source: function(req, res) {
			const fn = item => (item.num + " - " + item.uxxi + "<br>" + item.desc);
			fnAutocomplete(this.element,  ["num", "desc"], res, fn);
		},
		select: function(ev, ui) {
			op = ui.item; // current operation
			return fnAcLoad(this, null, op.num + " - " + op.desc);
		}
	}).change(fnAcReset).on("search", fnAcReset);

	operaciones = ab.parse(dom.getText("#op-json")) || [];
	dom.click("a#add-uxxi", el => {
		if (op) {
			delete op.id; //force insert
			operaciones.push(op); // save container
			dom.table("#op-table", operaciones, RESUME, STYLES);
		}
		dom.setValue("#uxxi", "").setFocus("#uxxi")
	});
	dom.table("#op-table", operaciones, RESUME, STYLES);
	dom.onRenderTable("#op-table", table => {
		dom.setValue("#operaciones", JSON.stringify(operaciones));
		op = null; // reinit vinc.
	});
});

//Global IRSE components
const ip = new IrsePerfil();
const io = new IrseOrganicas();
const ii = new IrseImputacion();
const ir = new IrseRutas();
const dietas = new IrseDietas();

//PF needs confirmation in onclick attribute
const fnUnlink = () => i18n.confirm("msgUnlink") && loading();
const fnClone = () => i18n.confirm("msgReactivar") && loading();
