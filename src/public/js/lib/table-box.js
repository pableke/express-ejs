
// Tables helper
dom.ready(function() {
	const tables = dom.getAll("table");
	dom.getTable = (selector) => dom.find(selector, tables);
	dom.getTables = (selector) => dom.filter(selector, tables);

	function fnToggleTbody(table) {
		let tr = dom.get("tr.tb-data", table); //has data rows?
		return dom.toggle("hide", !tr, table.tBodies[0]).toggle("hide", tr, table.tBodies[1]);
	}
	function fnToggleOrder(links, link, dir) { // Update all sort indicators
		dom.removeClass("sort-asc sort-desc", links) // Remove prev order
			.addClass("sort-none", links) // Reset all orderable columns
			.swap("sort-none sort-" + dir, link); // Column to order table
	}
	function fnPagination(table) { // Paginate table
		const pageSize = nb.intval(table.dataset.pageSize);
		const pagination = dom.get(".pagination", table.parentNode);
		if (pagination && (pageSize > 0)) {
			table.dataset.page = nb.intval(table.dataset.page);
			let pages = Math.ceil(table.dataset.total / pageSize);

			function renderPagination(page) {
				let output = ""; // Output buffer
				function addControl(i, text) {
					i = nb.range(i, 0, pages - 1); // Close range limit
					output += '<a href="#" data-page="' + i + '">' + text + '</a>';
				}
				function addPage(i) {
					i = nb.range(i, 0, pages - 1); // Close range limit
					output += '<a href="#" data-page="' + i + '"';
					output += (i == page) ? ' class="active">' : '>';
					output += (i + 1) + '</a>';
				}

				let i = 0; // Index
				addControl(page - 1, "&laquo;");
				(pages > 1) && addPage(0);
				i = Math.max(page - 3, 1);
				(i > 2) && addControl(i - 1, "...");
				let max = Math.min(page + 3, pages);
				while (i < max)
					addPage(i++);
				(i < (pages - 1)) && addControl(i, "...");
				(i < pages) && addPage(pages - 1);
				addControl(page + 1, "&raquo;");
				pagination.innerHTML = output;

				dom.click(el => { // Reload pagination click event
					const i = +el.dataset.page; // Current page
					const params = { index: i * pageSize, length: pageSize }; // Event data

					renderPagination(i); // Render all pages
					table.dataset.page = i; // Update current
					table.dispatchEvent(new CustomEvent("pagination", { "detail": params })); // Triger event
				}, dom.getAll("a", pagination));
			}
			renderPagination(table.dataset.page);
		}
		return dom;
	}

	function fnRenderRows(table, data, resume, styles) {
		resume.size = data.length; // Numrows
		resume.total = resume.total ?? (+table.dataset.total || data.length); // Parse to int
		dom.render(table.tFoot, tpl => sb.format(resume, tpl, styles)) // Render footer
			.render(table.tBodies[0], tpl => ab.format(data, tpl, styles)); // Render rows

		dom.click((el, ev, i) => { // Find data event
			table.dispatchEvent(new CustomEvent("find", { "detail": data[i] }));
		}, dom.getAll("a[href='#find']", table));
		dom.click((el, ev, i) => { // Remove event
			if (i18n.confirm(styles?.remove || "remove")) {
				resume.total--; // dec. total rows
				const obj = data.splice(i, 1)[0]; // Remove from data
				table.dispatchEvent(new CustomEvent("remove", { "detail": obj })); // Triger event
			}
		}, dom.getAll("a[href='#remove']", table));

		table.dispatchEvent(new Event("render")); // Triger event
		return fnToggleTbody(table); // Toggle body if no data
	}
	dom.renderRows = function(table, data, resume, styles) {
		return table ? fnRenderRows(table, data, resume, styles) : dom;
	}
	dom.renderTablesRows = function(selector, data, resume, styles) {
		return dom.each(table => fnRenderRows(table, data, resume, styles), dom.getTables(selector));
	}

	function fnRenderTable(table, data, resume, styles) {
		dom.renderRows(table, data, resume, styles);
		return fnPagination(table); // Update pagination
	}
	dom.renderTable = function(table, data, resume, styles) {
		return table ? fnRenderTable(table, data, resume, styles) : dom;
	}
	dom.renderTables = function(selector, data, resume, styles) {
		return dom.each(table => fnRenderTable(table, data, resume, styles), dom.getTables(selector));
	}

	// Initialize all tables
	dom.each(table => {
		const links = dom.getAll(".sort", table.tHead); // All orderable columns
		if (table.dataset.sortDir) {
			fnToggleOrder(links, // Update sort icons
						dom.find(".sort-" + table.dataset.sortBy, links), // Ordered column
						table.dataset.sortDir); // Sort direction
		}

		dom.click((el, ev) => { // Sort event click
			const dir = dom.hasClass("sort-asc", el) ? "desc" : "asc"; // Toggle sort direction
			fnToggleOrder(links, el, dir); // Update all sort indicators
		}, links); // Add click event for order table

		dom.click((el, ev) => { // Find data event
			table.dispatchEvent(new CustomEvent("find", { "detail": el }));
		}, dom.getAll("a[href='#find']", table));
		dom.click((el, ev) => { // Remove event
			if (i18n.confirm("remove"))
				table.dispatchEvent(new CustomEvent("remove", { "detail": el }));
		}, dom.getAll("a[href='#remove']", table));

		fnToggleTbody(table); // Toggle body if no data
		fnPagination(table); // Update pagination
	}, tables);
});
