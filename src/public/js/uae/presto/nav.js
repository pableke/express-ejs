
dom.ready(function() {
	/********** begin common portal js **********/
	const form = $("form#xeco");
	const eOp = $("input#op", form);
	const op2 = $("input#op2", form);
	const eId = $("input#id", form);
	function pop(str) { return str && str.split("/").pop(); }
	function navto(url, o2, id) { eOp.val(pop(url)); o2 && op2.val(o2); eId.val(id); return !form.submit(); }
	function nav(el) { return el ? navto(el.href, $(el).attr("op2"), el.id) : !form.submit(); }
	window.navto = navto;
	window.linkto = nav;
	/********************************************/

	ab.ss("eco3d", $("#eco3d-data").text()).ss("ant", $("#ant-data").text());
	/********** eco-ing autocomplete **********/
	let _eco030Data = ab.parse($("#eco030-data").text()) || []; //source data
	$(".eco-ing", form).attr("type", "search").keydown(fnAcChange).autocomplete({
		minLength: 3,
		focus: fnFalse, //no change focus on select
		search: fnAcSearch, //lunch source
		source: function(req, res) {
			fnAcRender(this.element, item => { return item.eco + " - " + item.desc + "<br>" + item.desc; });
			res(fnAcFilter(_eco030Data, ["eco", "desc"], req.term));
		},
		select: function(ev, ui) {
			return fnAcLoad(this, ui.item.id, ui.item.eco + " - " + ui.item.desc);
		}
	}).change(fnAcReset);

	/********** uxxiec autocomplete **********/
	let _uxxiData = ab.ss("uxxi", $("#uxxi-data").text()).read("uxxi"); //source data
	$("#uxxi", form).attr("type", "search").keydown(fnAcChange).autocomplete({
		minLength: 3,
		focus: fnFalse, //no change focus on select
		search: fnAcSearch, //lunch source
		source: function(req, res) {
			fnAcRender(this.element, item => { return item.num + " - " + item.uxxi + "<br>" + item.desc; });
			res(fnAcFilter(_uxxiData, ["num", "desc"], req.term));
		},
		select: function(ev, ui) {
			return fnAcLoad(this, ui.item.ec + "," + ui.item.tipo, ui.item.num);
		}
	}).change(fnAcReset);
	/********** end autocompletes inputs **********/

	$("a[href=unlink]").click(function() { return confirm("\277Desea desasociar esta operaci&oacute;n de UXXI-EC?'") && nav(this); });
	$("a[href=publish]").click(function() { return confirm("\277Desea notificar a los responsables de la solicitud, que esta ya esta mecanizada en UXXI-EC?'") && nav(this); });
	$("a[href=toggle]", form).click(function() { $("#ejCache", form).val(this.title); return nav(this); });

	$("a[href=accept]", form).click(function() { return confirm("\277Confirma que desea firmar esta solicitud?") && nav(this); });
	$("a[href=delete]", form).click(function() { return confirm("\277Confirma que desea eliminar esta solicitud?") && nav(this); });

	/********** end common portal js **********/
	$("a[name=nav],a[name=send]", form).click(function() { return nav(this); }); //send form on click
	$(".key-nav,.key-send", form).keydown(function(ev) { if (ev.keyCode == 13) { ev.preventDefault(); nav(); } }); //auto-nav form on key press
	/******************************************/
});
