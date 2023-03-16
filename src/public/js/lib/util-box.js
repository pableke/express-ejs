
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
	dom.eachInput(".ui-bool", el => { el.value = i18n.fmtBool(el.value); })
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

	// Show / Hide related info
	dom.onclick("a[href='#toggle']", el => !dom.toggleLink(el))
		.onclick("[data-toggle]", el => !dom.eachChild(el, "i", child => dom.toggle(child, el.dataset.toggle)));
});
