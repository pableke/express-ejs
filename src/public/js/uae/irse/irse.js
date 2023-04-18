
dom.ready(function() {
	i18n.addLangs(IRSE_I18N).setCurrent(IRSE.lang); //Set init. config
	dom.tr(".i18n-tr-h1"); //local traductor
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
