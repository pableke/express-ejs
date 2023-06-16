
dom.ready(() => {
	const ECO_TEXT = "Seleccione una económica";
	const TPL_ECO_EMPTY = '<option value="">' + ECO_TEXT + '</option>';
	const TPL_ECO = '<option value="@value;">@label;</option>';

	const fnOrganica = (value, label) => dom.setValue("#org-id", value).setValue("#organica", label);
	const fnTramit = (value, label) => dom.setValue("#tramit-value", value).setValue("#tramit-label", label);
	function fnResetOrganica() {
		if (this.value) return;
		dom.hide("#ut").setHtml("#tramit", TPL_ECO_EMPTY);
		fnTramit(null, ECO_TEXT);
		fnOrganica();
	}
	$("#organica").attr("type", "search").keydown(fnAcChange).autocomplete({
		delay: 500, //milliseconds between keystroke occurs and when a search is performed
		focus: fnFalse, //no change focus on select
		search: fnAcSearch, //lunch source
		source: fnSourceItems, //show datalist
		select: function(ev, ui) {
			loading(); // muestro denuevo el cargando para cargar las economicas
			fnOrganica(ui.item.value, ui.item.label); //load data
			return !dom.trigger("#find-unidades-tramit", "click");
		}
	}).change(fnResetOrganica).on("search", fnResetOrganica);

	window.loadUnidadesTramit = (xhr, status, args) => {
		const uts = ab.parse(args.data);
		const ut = uts && uts[0];
		if (ut) {
			dom.setHtml("#tramit", uts.format(TPL_ECO));
			fnTramit(ut.value, ut.label);
		}
		dom.toggleHide("#ut", ab.size(uts) < 2);
		unloading(); // fin del calculo de las UT's
	}

	dom.onChangeInput("#tramit", el => fnTramit(el.value, dom.getOptText(el)));

	//dom.click("[href='#tab-0']", el => dom.setValue("#org-id").setValue("#tramit-value"));
	const file = dom.get("#factura_input");
	file.parentNode.style.padding = "3px";
	dom.click("[href='#tab-1']", el => {
		dom.setValue("#org-id", el.dataset.organica).setValue("#tramit-value", el.dataset.grupo);
		//file.click();
	});
});
