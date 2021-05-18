
js.ready(function() {
	const msgs = i18n.getLang(); //messages container

	js.getAll("table").forEach(table => {
		let links = js.getAll("a.sort", table.thead);
		js.click(links, (el, ev) => {
			ev.preventDefault();
			let dir = js.hasClass(el, "asc") ? "desc" : "asc";
			js.removeClass(links, "asc desc");
			js.addClass(el, dir);
			js.ajax(el.href + "&dir=" + dir, data => {
				table.tBodies[0].innerHTML = data;
			}, js.showAlerts);
		});

		for (let i = 0; i < table.tBodies.length; i++) {
			let tbody = table.tBodies[i];
			js.click(js.getAll("a.remove-row", tbody), (el, ev) => {
				confirm(msgs.remove) && js.ajax(el.href, data => {
					let num = js.get("#rows", table.tfoot);
					if (num)
						num.innerText = isNaN(num.innerText) ? 0 : (+num.innerText - 1);
					tbody.innerHTML = data;
					js.showOk(msgs.msgOk);
				}, js.showAlerts);
				ev.preventDefault();
			});
		}
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
