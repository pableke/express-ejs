
// Configure JS client
const ab = new ArrayBox(); //array-box
const dt = new DateBox(); //datetime-box
const gb = new GraphBox(); //graph-box structure
const nb = new NumberBox(); //number box
const sb = new StringBox(); //string box
const tb = new TreeBox(); //tree-box structure

const valid = new ValidatorBox(); //validators
const i18n = new I18nBox(); //messages
const dom = new DomBox(); //HTML-DOM box

//DOM is fully loaded
dom.ready(function() {
	// Scroll body to top on click and toggle back-to-top arrow
	const _top = document.body.lastElementChild;
	window.onscroll = function() { dom.toggle(_top, "hide", this.pageYOffset < 80); }
	dom.addClick(_top, el => !dom.scroll());

	// Loading div
	const _loading = _top.previousElementSibling;
	dom.loading = () => dom.show(_loading).closeAlerts();
	dom.working = () => dom.fadeOut(_loading);
	// End loading div

	// Inputs formater
	dom.each(dom.getInputs(".ui-bool"), el => { el.value = i18n.fmtBool(el.value); })
		.onChangeInputs(".ui-integer", el => { el.value = i18n.fmtInt(el.value); dom.toggle(el, "texterr", sb.starts(el.value, "-")); })
		.onChangeInputs(".ui-float", el => { el.value = i18n.fmtFloat(el.value); dom.toggle(el, "texterr", sb.starts(el.value, "-")); });

	// Initialize all textarea counter
	const ta = dom.getInputs("textarea[maxlength]");
	function fnCounter(el) {
		let value = Math.abs(el.getAttribute("maxlength") - sb.size(el.value));
		dom.setText(dom.get(".counter", el.parentNode), value);
	}
	dom.keyup(ta, fnCounter).each(ta, fnCounter);

	// Common validators for fields
	dom.addError = dom.setError = dom.setInputError; // Synonym
	dom.required = (el, msg) => dom.setError(el, msg, null, i18n.required);
	dom.login = (el, msg, msgtip) => dom.setError(el, msg, msgtip, i18n.login);
	dom.email = (el, msg, msgtip) => dom.setError(el, msg, msgtip, i18n.email);
	dom.user = (el, msg, msgtip) => dom.setError(el, msg, msgtip, i18n.user);
	dom.intval = (el, msg, msgtip) => dom.setError(el, msg, msgtip, i18n.intval);
	dom.gt0 = (el, msg, msgtip) => dom.setError(el, msg, msgtip, i18n.gt0);
	dom.fk = (el, msg, msgtip) => dom.setError(el, msg, msgtip, i18n.fk);
	dom.past = (el, msg, msgtip) => dom.setError(el, msg, msgtip, i18n.past);
	dom.geToday = (el, msg, msgtip) => dom.setError(el, msg, msgtip, i18n.geToday);

	// Extends dom-box actions (require jquery)
	dom.autocomplete = function(selector, opts) {
		const fnFalse = () => false;
		const fnGetIds = el => dom.get("[type=hidden]", el.parentNode);
		const inputs = dom.getInputs(selector); //Autocomplete inputs
		let _search = false; //call source indicator (reduce calls)

		opts = opts || {}; //default config
		opts.action = opts.action || "#"; //request
		opts.minLength = opts.minLength || 3; //length to start
		opts.maxResults = opts.maxResults || 10; //max showed rows (default = 10)
		opts.delay = opts.delay || 500; //milliseconds between keystroke occurs and when a search is performed
		opts.open = opts.open || fnFalse; //triggered if the value has changed
		opts.focus = opts.focus || fnFalse; //no change focus on select
		opts.load = opts.load || fnFalse; //triggered when select an item
		opts.sort = opts.sort || data => data; //sort array data received
		opts.remove = opts.remove || fnFalse; //triggered when no item selected
		opts.render = opts.render || () => "-"; //render on input
		opts.search = (ev, ui) => _search; //lunch source
		opts.select = function(ev, ui) { //triggered when select an item
			opts.load(ui.item, this, fnGetIds(this)); //update inputs
			return false; //preserve inputs values from load event
		}
		opts.source = function(req, res) {
			this.element.autocomplete("instance")._renderItem = function(ul, item) {
				let label = sb.iwrap(opts.render(item), req.term); //decore matches
				return $("<li>").append("<div>" + label + "</div>").appendTo(ul);
			}
			dom.ajax(opts.action + "?term=" + req.term, data => {
				res(opts.sort(data).slice(0, opts.maxResults));
			});
		}
		// Triggered when the field is blurred, if the value has changed
		opts.change = function(ev, ui) {
			if (!ui.item) { //item selected?
				dom.val("", this).val("", fnGetIds(this));
				opts.remove(this);
			}
		}
		$(inputs).autocomplete(opts);
		return dom.keydown(inputs, (el, ev) => { // Reduce server calls, only for backspace or alfanum
			_search = (ev.keyCode == 8) || sb.between(ev.keyCode, 46, 111) || sb.between(ev.keyCode, 160, 223);
		});
	}
	// Extends dom-box actions

	// Build tree menu as UL > Li > *
	dom.each("ul.menu", menu => {
		const children = dom.sort(menu.children, (a, b) => (+a.dataset.orden - +b.dataset.orden));
		children.forEach(child => {
			let padre = child.dataset.padre; // Has parent?
			let mask = child.dataset.mask ?? 4; // Default mask = active
			if (padre) { // Move child with his parent
				let li = dom.get("li[id='" + padre + "']", menu);
				if (li) {
					let children = +li.dataset.children || 0;
					if (!children) { // Is first child?
						li.innerHTML += '<ul class="sub-menu"></ul>';
						li.firstElementChild.innerHTML += '<b class="nav-tri"></b>';
						dom.click(li.firstElementChild, el => !dom.toggle(li, "active")); //usfull on sidebar
					}
					mask &= li.dataset.mask ?? 4; // Propage disabled
					li.dataset.children = children + 1; // add child num
					li.lastElementChild.appendChild(child); // move child
				}
			}
			else // force reorder lebel 1
				menu.appendChild(child);
			dom.toggle(child.firstElementChild, "disabled", !(mask & 4));
		});
		// Show / Hide sidebar and show menu
		dom.onclick(".sidebar-toggle", el => !dom.toggle(menu, "active")).show(menu);
	});

	// TABS events and handlers
	dom.onExitTab(() => console.log("exit tabs"));
	dom.onShowTab(1, tab => console.log("show tab-1"));
	dom.onLoadTab(2, tab => { //table and form handlers
		const fnMemo = (a, b) => sb.cmp(a.memo, b.memo);
		const RESUME = { index: 0, start: 0, page: 0, pageSize: 5, sort: fnMemo };
		const PARSERS = { imp: i18n.toFloat, imp1: i18n.toFloat, imp2: i18n.toFloat };
		const STYLES = {
			imp: i18n.isoFloat, fecha: i18n.fmtDate,
			onRender: row => { RESUME.imp += (row.imp || 0); } // onRenderRow
		};

		var data, server_data; // Continers
		const fnCreate = row => !dom.createRow("#test", RESUME, STYLES, row).hide(".update-only");
		const fnView = index => !dom.selectRow("#test", data, RESUME, STYLES, index).show(".update-only").viewTab(3);
		const fnList = arr => { data = arr; dom.repaginate("#pruebas", data, RESUME, STYLES).setFocus("#filter-name"); }
		const fnUpdate = tab => dom.updateTable("#pruebas", data, RESUME, STYLES).viewTab(tab).showOk("saveOk");
		const fnPost = (obj, tab) => { data.push(obj); fnUpdate(tab); };
		const fnValidate = form => {
			var aux = dom.validate(form, {
				testFormError: "form err", fecha: i18n.leToday, imp: i18n.gt0, name: i18n.required, memo: i18n.required
			});
			return aux && Object.assign(RESUME.data, aux);
		}

		const ENDPOINT = "https://jsonplaceholder.typicode.com/users";
		dom.api.get(ENDPOINT).then(users => { //call to simulate read data from server
			const DB = [
				{id:1,name:"Row 1", memo: "jj234 234234 kjhl", imp: 10.7, fecha: "2022-05-20 12:00:01", binary: 5}, 
				{id:2,name:"Row 2", memo: "ab jdasklñlkaf jasfd", imp: 3256.1, binary: 7}, 
				{id:3,name:"Row 3", memo: "tt 8374 124893 aksdfj", imp: 154.81, binary: 9}, 
				{id:4,name:"Row 4", memo: "hh ñldjafj añskdj", imp: .34, fecha: "2022-03-21 09:41:35", binary: 3}, 
				{id:5,name:"Row 5", memo: "bc lfda lsañkdfj fjs", imp: 99.4}, 
				{id:6,name:"Row 6", memo: "lñasdkfdk sldañkf ddd", imp: 613.47, binary: 6},
				{id:7,name:"Row 7", memo: "lñasdkfdk sldañkf", fecha: "2022-01-17 14:25:11", binary: 15}
			];

			server_data = users; // Continers
			users.forEach((user, i) => {
				user.memo = DB[i]?.memo;
				user.imp = DB[i]?.imp;
				user.fecha = DB[i]?.fecha;
				user.binary = DB[i]?.binary;
			});
			fnList(users);
		});

		// Eventos de las tablas de consulta
		dom.onRenderTable("#pruebas", (table, ev) => {
			RESUME.imp = 0; // Init. resume: onRenderTable before onRenderRow
			dom.toggleHide("a[href='#clear-pruebas']", !data.length);
		});
		dom.onFindRow("#pruebas", (table, ev) => fnView(ev.detail.index))
			.onRemoveRow("#pruebas", (table, ev) => dom.viewTab(2).showOk("removeOk"))
			.addClick("a[href='#clear-pruebas']", el => i18n.confirm("removeAll") && !dom.clearTable("#pruebas", data, RESUME, STYLES))
			.onChangeTable("#pruebas", (table, ev) => console.log("change", ev.detail))
			//.onPaginationTable("#pruebas", (table, ev) => dom.table(table, data, RESUME, STYLES))
			.onTable("#pruebas", "sort-name", table => { delete RESUME.sort; })
			.onTable("#pruebas", "sort-memo", table => { RESUME.sort = fnMemo; }) // default sort as string
			.onTable("#pruebas", "sort-imp", table => { RESUME.sort = (a, b) => nb.cmp(a.imp, b.imp); })
			.onTable("#pruebas", "sort-fecha", table => { delete RESUME.sort; }) // default sort as string (isoDate)
			.onSortTable("#pruebas", table => dom.table(table, data, RESUME, STYLES))
			.onChangeInput("#page-size", el => { RESUME.pageSize = +el.value; fnList(data) });

		// Eventos de control para el filtro de la tabla
		dom.setRangeDate("#f1", "#f2") // Filter range date
			.onClick("a.create-data", () => fnCreate({}));
		dom.onResetForm("#filter", form => {
			setTimeout(function() { // Do what you need after reset the form
				fnList(server_data); // server call = dom.send(form).then(fnList);
			}, 1);
			// Do what you need before reset the form
			return dom.closeAlerts(); // default = reset
		}).onSubmitForm("#filter", form => {
			const FILTER = {}; // Container
			const fields = ["name", "memo"]; // Strings ilike filter
			const fnFilter = row => (sb.multilike(row, FILTER, fields) && nb.in(row.imp, FILTER.imp1, FILTER.imp2) && sb.in(row.fecha, FILTER.f1, FILTER.f2));
			dom.closeAlerts().load(form, FILTER, PARSERS);
			fnList(server_data.filter(fnFilter)); // server call = dom.send(form).then(fnList);
		});

		// Eventos de control para el formulario de datos
		dom.addClick("a[href='#first-item']", el => fnView(0))
			.addClick("a[href='#prev-item']", el => fnView(RESUME.index - 1))
			.addClick("a[href='#next-item']", el => fnView(RESUME.index + 1))
			.addClick("a[href='#last-item']", el => fnView(data.length))
			.addClick("a[href='#remove-item']", el => !dom.removeRow("#pruebas", data, RESUME, STYLES))
			.parse("#entidades", tpl => sb.entries(valid.getEntidades(), tpl));
		dom.addClick("button#clone", el => {
			if (!fnValidate(el.form))
				return; // errores de validacion
			RESUME.data.id 
					? dom.api.put(ENDPOINT + "/" + RESUME.data.id, RESUME.data).then(user => { fnCreate(ab.flush(user, ["id"])); fnUpdate(3); })
					: dom.api.post(ENDPOINT, RESUME.data).then(user => fnPost(user, 3));
		}).onSubmitForm("#test", form => {
			if (!fnValidate(form))
				return; // errores de validacion
			RESUME.data.id 
					? dom.api.put(ENDPOINT + "/" + RESUME.data.id, RESUME.data).then(user => fnUpdate(2))
					: dom.api.post(ENDPOINT, RESUME.data).then(user => fnPost(user, 2));
		});
	});

	// Onclose event tab/browser of client user
	/*window.addEventListener("unload", ev => {
		//dom.ajax("/session/destroy.html");
	});*/

	// Show / Hide related info
	dom.onclick("a[href='#toggle']", el => !dom.toggleLink(el).toggle(dom.get("i.fas", el), el.dataset.icon));
	//dom.onclick("a.ajax", el => !dom.api.get(el.href)).onclick("button.ajax", el => !dom.send(el.form)); // Ajax calls
});
