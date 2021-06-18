
js.ready(function() {
	const msgs = i18n.getLang(); //messages container
	let pages = js.getAll(".pagination");

	/*** ALL TABLES **/
	js.getAll("table").forEach(table => { //tables
		let isPaginable = js.hasClass(table, "paginable");
		let names = js.getAll(".name-sort", table.thead);
		let links = js.getAll("a.sort", table.thead);
		let tbody = table.tBodies[0];

		function fnRemove(el, ev) {
			if (confirm(msgs.remove)) {
				if (isPaginable)
					return true;
				js.ajax(el.href, data => {
					el.closest("tr").remove();
					let size = tbody.children.length;
					size || js.removeClass(table.tBodies[1], "hide");
					js.text(js.get("#rows", table.tfoot), size)
						.text(js.get("#size", table.tfoot), data.size || size)
						.showAlerts(data);
				});
			}
			ev.preventDefault();
		}
		function fnTbody(html) {
			js.html(tbody, html).click(js.getAll("a.remove", tbody), fnRemove);
		}
		function fnSort(el, ev) {
			let dir = js.hasClass(el, "asc") ? "desc" : "asc";
			js.removeClass(links, "asc desc").addClass(el, dir);
			js.ajax(el.href + "&dir=" + dir, fnTbody);
			ev.preventDefault();
		}
		js.click(names, (el, ev) => fnSort(el.nextElementSibling, ev));
		js.click(links, fnSort);

		js.click(js.getAll("a.remove", tbody), fnRemove);
		tbody.children.length || js.removeClass(table.tBodies[1], "hide");

		if (isPaginable) {
			js.each(pages, pag => {
				let ranges = js.getAll("input[type=range]", pag);
				js.change(ranges, (el, ev) => {
					let url = el.dataset.basename + "/pages.html?page=0&psize=" + el.value;
					js.val(ranges, el.value).ajax(url, fnTbody);
					el.title = el.value;
				});

				js.click(js.getAll("a", pag), (el, ev) => {
					js.ajax(el.href, fnTbody);
					ev.preventDefault();
				});
			});
		}
		/*** END TABLES ***/
	});
});
