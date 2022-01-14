
// Tables helper
dom.ready(function() {
	const tables = dom.getAll("table");
	dom.getTable = (selector) => dom.find(selector, tables);
	dom.getTables = (selector) => dom.filter(selector, tables);

	function fnToggleTbody(table) {
		let tr = dom.get("tr.tb-data", table); //has data rows?
		dom.toggle("hide", !tr, table.tBodies[0]).toggle("hide", tr, table.tBodies[1]);
	}
	function fnToggleOrder(links, link, dir) { // Update all sort indicators
		dom.removeClass("sort-asc sort-desc", links) // Remove prev order
			.addClass("sort-none", links) // Reset all orderable columns
			.swap("sort-none sort-" + dir, link); // Column to order table
	}

	dom.pagination = function(table) { // Paginate table
		const pageSize = nb.intval(table.dataset.pageSize);
		const pagination = dom.get(".pagination", table.parentNode);
		if (pagination && (pageSize > 0)) {
			table.dataset.page = nb.intval(table.dataset.page);
			let pages = Math.ceil(+table.dataset.total / pageSize);

			function renderPagination(page) {
				let output = ""; // Output buffer
				function addPage(i, text) {
					i = nb.range(i, 0, pages - 1); // Close range limit
					text = text || (i + 1); // Define text to show
					output += '<a href="#page-' + i + '"';
					output += (i == page) ? ' class="active">' : '>';
					output += text + '</a>';
				}

				let i = 0; // Index
				addPage(page - 1, "&laquo;");
				(pages > 1) && addPage(0);
				i = Math.max(page - 3, 1);
				(i > 2) && addPage(i - 1, "...");
				let max = Math.min(page + 3, pages);
				while (i < max)
					addPage(i++);
				(i < (pages - 1)) && addPage(i, "...");
				(i < pages) && addPage(pages - 1);
				addPage(page + 1, "&raquo;");
				pagination.innerHTML = output;

				dom.click(el => { // Reload pagination click event
					const i = dom.hrefIndex(el.href, pages - 1); // Current index
					const params = { index: i * pageSize, length: pageSize }; // Event data
					const ev = new CustomEvent("pagination-end", { "detail": params });

					renderPagination(i); // Render all pages
					table.dataset.page = i; // Update current
					pagination.dispatchEvent(ev); // Triger event
				}, dom.getAll("a", pagination));
			}
			renderPagination(table.dataset.page);
		}
		return dom;
	}

	dom.reloadTable = function(selector, data, resume, styles) {
		resume.size = data.length; //numrows
		return dom.each(table => {
			resume.total = +table.dataset.total || resume.size; // Total rows
			dom.render(table.tFoot, tpl => sb.format(resume, tpl, styles)) // Render footer
				.render(table.tBodies[0], tpl => ab.format(data, tpl, styles)); // Render rows

			fnToggleTbody(table); // Toggle body if no data
			dom.pagination(table); // Update pagination
		}, dom.getTables(selector));
	}

	// Initialize all tables
	dom.each(table => {
		const links = dom.getAll(".sort", table.tHead); // All orderable columns
		if (table.dataset.sortDir) {
			fnToggleOrder(links, // Update sort icons
						dom.find(".sort-" + table.dataset.sortBy, links), // Ordered column
						table.dataset.sortDir); // Sort direction
		}

		dom.click(el => { // Sort event click
			let dir = dom.hasClass("sort-asc", el) ? "desc" : "asc"; // Toggle sort direction
			fnToggleOrder(links, el, dir); // Update all sort indicators
		}, links); // Add click event for order table

		fnToggleTbody(table); // Toggle body if no data
		dom.pagination(table); // Update pagination
	}, tables);
});
