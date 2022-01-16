
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
					output += '<a href="#page-' + i + '">' + text + '</a>';
				}
				function addPage(i) {
					i = nb.range(i, 0, pages - 1); // Close range limit
					output += '<a href="#page-' + i + '"';
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
					const i = dom.hrefIndex(el.href, pages - 1); // Current index
					const params = { index: i * pageSize, length: pageSize }; // Event data
					const ev = new CustomEvent("pagination", { "detail": params });

					renderPagination(i); // Render all pages
					table.dataset.page = i; // Update current
					table.dispatchEvent(ev); // Triger event
				}, dom.getAll("a", pagination));
			}
			renderPagination(table.dataset.page);
		}
		return dom;
	}

	dom.renderTfoot = function(table, resume, styles) {
		return dom.render(table.tFoot, tpl => sb.format(resume, tpl, styles)); // Render footer
	}
	dom.renderRows = function(table, data, resume, styles) {
		resume.size = data.length; // Numrows
		resume.total = resume.total ?? (+table.dataset.total || data.length); // Parse to int
		dom.renderTfoot(table, resume, styles) // Render footer
			.render(table.tBodies[0], tpl => ab.format(data, tpl, styles)); // Render rows

		dom.click((el, i) => { // Find data event
			table.dispatchEvent(new CustomEvent("find", { "detail": data[i] }));
		}, dom.getAll("a[href^='#find-']", table));
		dom.click((el, i) => { // Remove event
			let msg = styles?.remove || "remove";
			if (i18n.confirm(msg)) {
				const ev = new CustomEvent("remove", { "detail": data[i] });

				el.closest("tr").remove(); // Remove from table view
				data.splice(i, 1); // Remove from data

				resume.total--;
				table.dispatchEvent(ev); // Triger event
				dom.renderRows(table, data, resume, styles);
			}
		}, dom.getAll("a[href^='#remove-']", table));

		table.dispatchEvent(new Event("change")); // Triger event
		return fnToggleTbody(table); // Toggle body if no data
	}

	dom.renderTable = function(table, data, resume, styles) {
		dom.renderRows(table, data, resume, styles);
		return fnPagination(table); // Update pagination
	}
	dom.renderTables = function(selector, data, resume, styles) {
		return dom.each(table => dom.renderTable(table, data, resume, styles), dom.getTables(selector));
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
		fnPagination(table); // Update pagination
	}, tables);
});
