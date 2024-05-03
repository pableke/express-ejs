
import alerts from "./Alerts.js";
import coll from "./CollectionHTML.js";
import sb from "./StringBox.js";

const EMPTY = [];
const fnEmpty = () => EMPTY;
const fnParam = param => param;
window.loadItems = globalThis.void; // Hack PF (only for CV-UAE)

export default function(autocomplete, opts) {
    opts = opts || {};
	opts.delay = opts.delay || 400; //milliseconds between keystroke occurs and when a search is performed
	opts.minLength = opts.minLength || 3; //length to start
	opts.maxLength = opts.maxLength || 16; //max length for searching
	opts.maxResults = opts.maxResults || 10; //max showed rows (default = 10)
    opts.optionClass = opts.optionClass || "option"; // child name class
    opts.activeClass = opts.activeClass || "active"; // active option class
	opts.blockSelector = opts.blockSelector || ".autocomplete"; // Parent node selector
    opts.resultsSelector = opts.resultsSelector || ".results"; // results list selector

    opts.source = opts.source || fnEmpty; //empty source by default
    opts.render = opts.render || fnParam; //render label on autocomplete
    opts.select = opts.select || fnParam; //set value in id input
    opts.afterSelect = opts.afterSelect || globalThis.void; //fired after an item is selected
    opts.onReset = opts.onReset || globalThis.void; //fired when no value selected

	const self = this; //self instance
    const block = autocomplete.closest(opts.blockSelector);
    const resultsHTML = block.querySelector(opts.resultsSelector);
    const inputValue = autocomplete.nextElementSibling;
    autocomplete.type = "search"; // Force type

    let _searching, _time; // call and time indicator (reduce calls)
    let _results = EMPTY; // default = empty array
    let _index = -1 // current item position in results

    this.getData = () => _results;
    this.getIndex = () => _index;
    this.getItem = i => _results[i ?? _index];
    this.getCurrentItem = () => _results[_index];
    this.getCurrentOption = () => resultsHTML.children[_index];
	this.getCode = sep => sb.getCode(autocomplete.value, sep);
    this.isItem = () => (_index > -1);

    this.getInputValue = () => inputValue;
    this.getAutocomplete = () => autocomplete;
    this.setValue = (value, label) => {
        if (value) {
            inputValue.value = value;
            autocomplete.value = label;
        }
        else
            inputValue.value = autocomplete.value = "";
        return self;
    }

    const isChildren = i => ((0 <= i) && (i < coll.size(resultsHTML.children)));
    const unselect = () => { _index = -1; inputValue.value = ""; return self; }
    const removeList = () => { resultsHTML.innerHTML = ""; return self; }
    const fnClear = () => { unselect(); return removeList(); }

    function activeItem(i) {
        _index = isChildren(i) ? i : _index; // current item
        resultsHTML.children.forEach((li, i) => li.classList.toggle(opts.activeClass, i == _index));
    }
    function selectItem(li, i) {
        if (li && isChildren(i)) {
            _index = i; // Update current index
            self.setValue(opts.select(_results[i], self), li.innerText);
            opts.afterSelect(_results[i], self);
            removeList();
        }
    }
    function fnSearch() {
        _searching = true; // Avoid new searchs
        alerts.loading(); // Show loading frame
        window.loadItems = (xhr, status, args) => { // Only PF
            window.loadItems = globalThis.void; // Avoid extra loads
            self.render(coll.parse(args?.data)); // specific for PF
        }
        opts.source(autocomplete.value, self); // Fire source
        _searching = false; // restore sarches
    }

    this.reset = () => {
        fnClear(); // Reset previous values
        autocomplete.value = ""; // Clear input
        opts.onReset(self); // Fire event onFinish
        return self;
    }
    this.reload = () => {
        autocomplete.focus(); // Set focus
        return self.reset(); // Reset all data
    }
    this.render = data => {
        fnClear(); // clear previous results
        _results = data || EMPTY; // Force not unset var
        _results.slice(0, opts.maxResults).forEach((data, i) => {
            const label = sb.wrap(opts.render(data, i, _results), autocomplete.value);
            resultsHTML.innerHTML += `<li class="${opts.optionClass}">${label}</li>`;
        });
        resultsHTML.children.forEach((li, i) => {
            li.addEventListener("click", ev => selectItem(li, i));
        });
        alerts.working(); // Hide loading frame
        return self;
    }

     // Event fired before char is writen in text
    autocomplete.onkeydown = ev => {
        const TAB = 9;
        const UP = 38;
        const DOWN = 40;
        const ENTER = 13;

        if (ev.keyCode == UP)
            return activeItem(_index - 1);
        if (ev.keyCode == DOWN)
            return activeItem(_index + 1);
        if ((ev.keyCode == TAB) || (ev.keyCode == ENTER))
            selectItem(self.getCurrentOption(), _index);
    }
    // Event fired when value changes, ignore ctrl, alt...
    autocomplete.oninput = ev => {
        const size = coll.size(autocomplete.value);
        if (size < opts.minLength)
            return fnClear(); // Min legnth required
        if ((size < opts.maxLength) && !_searching) { // Reduce server calls
            clearTimeout(_time); // Clear previous searches
            _time = setTimeout(fnSearch, opts.delay);
        }
    }
    //event occurs when a user presses the "ENTER" key or clicks the "x" button in an <input> element with type="search"
    autocomplete.onsearch = ev => {
        autocomplete.value || self.reset();
    }
    // Event fired before onblur only when text changes
    autocomplete.onchange = ev => {
        if (!autocomplete.value)
            self.reset();
        else // Delay reset event after click on list
            setTimeout(() => { inputValue.value || opts.onReset(self); }, 270);
    }
    autocomplete.onblur = ev => {
        setTimeout(removeList, 280);
    }
}
