
js.ready(function() {
	const msgs = i18n.getLang(); //messages container

	js.getAll("table").forEach(table => {
		let links = js.getAll("a.sort", table.thead);
		let tbody = table.tBodies[0];

		function fnRemove(el, ev) {
			confirm(msgs.remove) && js.ajax(el.href, data => {
				tbody.innerHTML = data.html; //load new data
				js.text(js.get("#rows", table.tfoot), tbody.children.length);
				js.showAlerts(data);
			});
			ev.preventDefault();
		}

		js.click(links, (el, ev) => {
			ev.preventDefault();
			let dir = js.hasClass(el, "asc") ? "desc" : "asc";
			js.removeClass(links, "asc desc");
			js.addClass(el, dir);
			js.ajax(el.href + "&dir=" + dir, data => {
				js.html(tbody, data.html).click(js.getAll("a.remove-row", tbody), fnRemove);
			});
		});
		js.click(js.getAll("a.remove-row", tbody), fnRemove);
	});

	js.click(js.getAll("a.remove"), (el, ev) => {
		confirm(msgs.remove) || ev.preventDefault();
	});

	js.getAll(".pagination").forEach(pag => {
		let list = js.getAll("select", pag);
		js.val(list).change(list, (el) => {
			window.location.href = "?page=0&size=" + el.value;
		});
	});
});
