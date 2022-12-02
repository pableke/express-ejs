
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
const fnRemove = () => i18n.confirm("msgDelSolicitud") && loading();
const fnUnlink = () => i18n.confirm("msgUnlink") && loading();
const fnClone = () => i18n.confirm("msgReactivar") && loading();
const fnFirmar = () => i18n.confirm("msgFirmar") && loading();
