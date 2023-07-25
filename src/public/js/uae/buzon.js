
dom.ready(() => {
	const form = dom.find("#xeco-buzon", document.forms);
	$("#organica", form).attr("type", "search").keydown(fnAcChange).autocomplete({
		delay: 500, //milliseconds between keystroke occurs and when a search is performed
		focus: fnFalse, //no change focus on select
		search: fnAcSearch, //lunch source
		source: fnSourceItems, //show datalist
		select: fnSelectItem //load data
	}).change(fnAcReset).on("search", fnAcReset);

	dom.onclick("#proveedor", el => dom.setValue("#tipo", 1))
		.onclick("#cesionario", el => dom.setValue("#tipo", 2))
		.onChangeFile("#factura_input[type='file']", (el, file) => dom.toggleHide(".next-" + el.id, !file))
		.onChangeFile("#pago_input[type='file']", (el, file) => dom.toggleHide(".next-" + el.id, !file))
		.onShowTab(0, tab => dom.hide(".tab-file-next").each(document.forms, form => form.reset()));

	const fnHandleTabs = function(tab, mask) {
		dom.viewTab(tab).setTabMask(mask)
			.each("a[data-bitand]", el => { el.dataset.mask = mask & +el.dataset.bitand; }) // 111001111 = 463
			.each("a.load-mask", el => { el.dataset.mask = mask; });
	}
	window.handleLoad = (xhr, status, args) => fnHandleTabs(2, +args.mask);
	window.handleLoadOtros = (xhr, status, args) => fnHandleTabs(1, +args.mask);
	//window.handleAddBuzon = (xhr, status, args) => dom.val("#org-id,#organica");
	window.loadOrganica = link => dom.setText("#org-desc", link.innerText, form);

	dom.onShowTab(7, tab => {
		const factura = dom.find("#factura_input", form.elements).files[0];
		const jp = dom.find("#pago_input", form.elements).files[0];
		const select = dom.find("#tramit", form.elements);
		dom.setText("#file-name", factura.name + (jp ? (", " + jp.name) : ""), tab)
			.setText("#ut-desc", dom.getOptText(select), tab);
	});
});
