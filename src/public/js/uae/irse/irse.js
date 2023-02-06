
dom.ready(function() {
	i18n.addLangs(IRSE_I18N).setCurrent(IRSE.lang); //Set init. config
	dom.tr(".i18n-tr-h1"); //local traductor

	/********** uxxiec autocomplete **********/
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
			let text = ui.item.num + " - " + ui.item.desc;
			return fnAcLoad(this, ui.item.ec + "," + ui.item.tipo, text);
		}
	}).change(fnAcReset);
	/********** uxxiec autocomplete **********/

	dom.click("a#add-uxxi", el => {
		if (op) {
			delete op.id; //force insert
			operaciones.push(op); // save container
			dom.table("#operaciones", operaciones, RESUME, STYLES);
		}
		dom.setValue("#uxxi", "").setFocus("#uxxi")
	});
	dom.onRenderTable("#operaciones", table => {
		dom.setValue("#op-vinc", JSON.stringify(operaciones));
		op = null; // reinit vinc.
	});
	window.onLoadUxxi = sol => {
		loading();
		dom.setText("#info-vinc", sol.cod + ": " + sol.memo);
	}
	window.loadUxxi = (xhr, status, args) => {
		operaciones = ab.parse(args.data) || []; // JSON returned by server
		dom.table("#operaciones", operaciones, RESUME, STYLES).viewTab(15);
		unloading();
	}
});

//Global IRSE components
const ip = new IrsePerfil();
const io = new IrseOrganicas();
const ii = new IrseImputacion();
const ir = new IrseRutas();
const dietas = new IrseDietas();

//PF needs confirmation in onclick attribute
const fnRemove = () => i18n.confirm("msgDelSolicitud") && loading();
const fnUnlink = () => i18n.confirm("msgUnlink") && loading();
const fnClone = () => i18n.confirm("msgReactivar") && loading();
const fnFirmar = () => i18n.confirm("msgFirmar") && loading();
