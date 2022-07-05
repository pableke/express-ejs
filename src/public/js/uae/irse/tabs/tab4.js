
dom.ready(function() {
	const tab4 = dom.get("#tab-4");

	function setAc() {
		let val = ip.getTribunal(eMiembro.val() + eCategoria.val());
		eImpAc.val(nfLatin(val * (+eAsist.val() || 0)));
		eImpAcCalc.val(nfLatin(val));
	}

	var eMiembro = $("#miembro", tab4).change(setAc);
	var eCategoria = $("#categoria", tab4).change(setAc);
	var eAsist = $("#asist", tab4).change(setAc);
	var eImpAcCalc = $("#impAcCalc", tab4);
	var eImpAc = $("#impAc", tab4);
	$("#undo-ac", tab4).click(() => {
		eImpAc.val(eImpAcCalc.val());
		eAsist.val("1");
	});
	if (eImpAcCalc.length)
		setAc(); //init imp
});
