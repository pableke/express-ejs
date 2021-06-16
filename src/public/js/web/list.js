
js.ready(function() {
	const msgs = i18n.getLang(); //messages container
	let pages = js.getAll(".pagination");

	function fnRemove(el, ev) { confirm(msgs.remove) || ev.preventDefault(); }

	js.click(js.getAll("a.remove"), fnRemove);
	js.getAll("table").forEach(table => { //tables
		let links = js.getAll("a.sort", table.thead);
		let tbody = table.tBodies[0];

		function fnTbody(html) {
			js.html(tbody, html).click(js.getAll("a.remove", tbody), fnRemove);
		}

		js.click(links, (el, ev) => {
			let dir = js.hasClass(el, "asc") ? "desc" : "asc";
			js.removeClass(links, "asc desc").addClass(el, dir);
			js.ajax(el.href + "&dir=" + dir, fnTbody);
			ev.preventDefault();
		});

		if (js.hasClass(table, "paginable")) {
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
