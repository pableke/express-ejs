
js.ready(function() {
	const msgs = i18n.getLang(); //messages container

	/*** ALL TABLES **/
	js.getAll("table").forEach(table => { //tables
		let pages = js.next(".pagination", table)[0];
		let links = js.getAll("a.sort", table.thead);
		let tbody = table.tBodies[0]; //data body
		let empty = table.tBodies[1]; //no data body

		function fnRemove(el, ev) {
			if (confirm(msgs.remove)) {
				if (pages && (tbody.children.length == 1))
					return true; // last row in current page
				js.ajax(el.href, data => {
					el.closest("tr").remove();
					let size = tbody.children.length;
					size || js.removeClass("hide", empty);
					js.load("#rows", table.tfoot).text(size)
						.load("#size", table.tfoot).text(data.size || size)
						.showAlerts(data);
				});
			}
			ev.preventDefault();
		}
		function fnTbody(html) {
			js.html(html, tbody).load("a.remove", tbody).click(fnRemove);
		}
		function fnSort(el, ev) {
			let dir = js.set(el).hasClass("asc") ? "desc" : "asc";
			js.removeClass("asc desc", links).addClass(dir);
			js.ajax(el.href + "&dir=" + dir, fnTbody);
			ev.preventDefault();
		}
		js.click(fnSort, links)
			.load(".name-sort", table.thead).click((el, ev) => fnSort(el.nextElementSibling, ev))
			.load("a.remove", tbody).click(fnRemove);
		tbody.children.length || js.removeClass("hide", empty);

		if (pages) { //has pagination asociated?
			let ranges = js.getAll("input[type=range]", pages);
			js.set(ranges).change((el, ev) => {
				let url = el.dataset.basename + "/pages.html?page=0&psize=" + el.value;
				js.val(el.value, ranges).ajax(url, fnTbody);
				el.title = el.value;
			});

			js.load("a", pages).click((el, ev) => {
				js.ajax(el.href, fnTbody);
				ev.preventDefault();
			});
		}
		/*** END TABLES ***/
	});
});
