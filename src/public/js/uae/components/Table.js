
import coll from "./CollectionHTML.js";
import i18n from "../i18n/langs.js";

const EMPTY = [];
const fnTrue = () => true;

export default function(table, opts) {
    opts = opts || {}; // default options
    opts.sortClass = opts.sortClass || "sort";
    opts.sortAscClass = opts.sortAscClass || "sort-asc";
    opts.sortDescClass = opts.sortDescClass || "sort-desc";
    opts.sortNoneClass = opts.sortNoneClass || "sort-none";
    opts.rowActionClass = opts.rowActionClass || "row-action";
    opts.tableActionClass = opts.tableActionClass || "table-action";
    opts.msgConfirmRemove = opts.msgConfirmRemove || "remove";
    opts.msgConfirmReset = opts.msgConfirmReset || "removeAll";
    opts.rowEmptyTable = opts.rowEmptyTable || ('<tr><td class="no-data" colspan="99">' + i18n.get(opts.msgEmptyTable) + '</td></tr>');

    opts.beforeRender = opts.beforeRender || globalThis.void;
    opts.onHeader = opts.onHeader || (() => table.tHead.innerHTML);
    opts.onRender = opts.onRender || globalThis.void;
    opts.onFooter = opts.onFooter || (() => table.tFoot.innerHTML);
    opts.afterRender = opts.afterRender || globalThis.void;
    opts.onRemove = opts.onRemove || fnTrue;
    opts.onReset = opts.onReset || fnTrue;

	const self = this; //self instance
    const RESUME = {}; //Table parameters
    const tBody = table.tBodies[0]; //body element

    let _rows = EMPTY; // default = empty array
    let _index = -1; // current item position in data

    this.clear = () => { _index = -1; return self; }
    this.set = (name, fn) => { opts[name] = fn; return self; }

    this.getData = () => _rows;
    this.getIndex = () => _index;
    this.getResume = () => RESUME;
    this.getItem = i => _rows[i ?? _index];
    this.isItem = () => (_index > -1) && (_index < _rows.length);
    this.getCurrentItem = () => _rows[_index];
    this.getLastItem = () => _rows.at(-1);
    this.getCurrentRow = () => tBody.children[_index];
    this.isEmpty = () => !_rows.length;
    this.size = () => _rows.length;

    this.getTable = () => table;
	this.querySelector = selector => table.querySelector(selector); // Child element
	this.querySelectorAll = selector => table.querySelectorAll(selector); // Children elements
    this.html = selector => table.querySelector(selector).innerHTML; // read text

    function fnCallAction(name, link, i) {
        if (i18n.confirm(link.dataset.confirm)) {
            _index = i; // update current item
            opts[name](_rows[i], link, i); // Action call
        }
    }
    function fnRender(data) {
        _index = -1; // clear previous selects
        _rows = data || []; // data to render on table
        RESUME.size = _rows.length;

        opts.beforeRender(RESUME); // Fired init. event
        table.tHead.innerHTML = opts.onHeader(RESUME); // Render formatted header
        RESUME.columns = coll.size(table.tHead.rows[0]?.cells); // Number of columns <th>
        tBody.innerHTML = RESUME.size ? coll.render(_rows, opts.onRender, RESUME) : opts.rowEmptyTable; // body
        table.tFoot.innerHTML = opts.onFooter(RESUME); // render formatted footer
        opts.afterRender(RESUME); // After body and footer is rendered

        // Row listeners for change, find and remove items
        tBody.rows.forEach((tr, i) => {
            tr.onchange = ev => {
                _index = i; // current item
                const fnChange = opts[ev.target.name + "Change"] || globalThis.void;
                fnChange(_rows[i], ev.target, i);
            };
            tr.getElementsByClassName(opts.rowActionClass).setClick((ev, link) => {
                const href = link.getAttribute("href");
                fnCallAction(href, link, i); // Call action
                ev.preventDefault(); // avoid navigation
            });
        });
        return self;
    }

    table.tFoot.onchange = ev => {
        const input = ev.target; // element changed
        const fnChange = opts[input.name + "Change"] || globalThis.void;
        fnChange(input, self);
    }

    this.render = fnRender;
    this.push = row => { _rows.push(row); return fnRender(_rows); }  // Push data
    this.add = row => { delete row.id; return self.push(row); } // Force insert => remove PK
    this.insert = (row, id) => { row.id = id; return self.push(row); } // New row with PK
    this.update = row => { Object.assign(_rows[_index], row); return fnRender(_rows); }
    this.save = (row, id) => (id ? opts.insert(row, id) : opts.update(row)); // Insert or update

    // Define default table/row actions
    self.set("#remove", (data, link) => {
        const ok = link.dataset.confirm || i18n.confirm(opts.msgConfirmRemove); // force confirm
        if (ok && opts.onRemove(data)) { // Remove data row and rebuild table
            _rows.splice(_index, 1);
            fnRender(_rows);
        }
    });
    self.set("#reset", (data, link) => {
        const ok = link.dataset.confirm || i18n.confirm(opts.msgConfirmReset); // force confirm
        ok && opts.onReset(self) && fnRender(EMPTY);
    });

    // Orderable columns system
    const links = table.tHead.getElementsByClassName(opts.sortClass);
    links.setClick((ev, link) => {
        const dir = link.classList.contains(opts.sortAscClass) ? opts.sortDescClass : opts.sortAscClass; // Toggle sort direction
        const column = link.getAttribute("href").substring(1); // Column name

        // Update all sort icons
        links.forEach(link => { // Reset all orderable columns
            link.classList.remove(opts.sortAscClass, opts.sortDescClass);
            link.classList.add(opts.sortNoneClass);
        });
        link.classList.remove(opts.sortNoneClass);
        link.classList.add(dir);

        // Sort data by function and rebuild table
        const fnAsc = (a, b) => ((a[column] < b[column]) ? -1 : ((a[column] > b[column]) ? 1 : 0)); // Default sort
        const fnAux = opts["sort-" + column] || fnAsc; // Load specific sort function
        const fnSort = (dir == opts.sortDescClass) ? ((a, b) => fnAux(b, a)) : fnAux; // Set direction
        fnRender(_rows.sort(fnSort)); // render sorted table
    });

    this.setActions = el => { // Table acctions over data
        const fnMove = i => (i < 0) ? 0 : Math.min(i, _rows.length - 1);
        el.getElementsByClassName(opts.tableActionClass).setClick((ev, link) => {
            const href = link.getAttribute("href");
            // Navigate pre actions
            if (href == "#first")
                fnCallAction(href, link, fnMove(0));
            else if (href == "#prev")
                fnCallAction(href, link, fnMove(_index - 1));
            else if (href == "#next")
                fnCallAction(href, link, fnMove(_index + 1));
            else if (href == "#last")
                fnCallAction(href, link, fnMove(_rows.length));
            else // current item
                fnCallAction(href, link, _index);
            ev.preventDefault(); // avoid navigation
        });
        return self;
    }
}
