
const util = require("app/lib/util-box.js");

const DEFAULT = {
	size: 0, pages: 0, page: 0, psize: 40, 
	start: 0, end: 0, index: 0, i: 0, last: 0
};

function Pagination() {
	const self = this; //self instance
	let opts = DEFAULT;

	this.get = function(name) { return opts[name]; }
	this.set = function(name, value) { opts[name] = value; return self; }
	this.init = function(data) { opts = Object.assign(data, DEFAULT); return self; }
	this.load = function(data) { opts = data; return self; }

	this.first = function() { opts.i = 0; return 0; }
	this.prev = function() { opts.i = Math.max(opts.i - 1, 0); return opts.i; }
	this.find = function(rows, id) {
		opts.i = id ? util.ab.ifind(rows, row => (row.id == id)) : -1;
		return opts.i;
	}
	this.next = function() { opts.i = Math.min(opts.i + 1, opts.size - 1); return opts.i; }
	this.last = function() { opts.i = opts.size - 1; return opts.i; }
	this.isInLast = function() { return (opts.pages * opts.psize) <= opts.i; }
	this.isInCurrent = function() { return (opts.index <= opts.i) && (opts.i < opts.last); }
	this.navto = function(page) {
		opts.page = Math.min(page, opts.pages);
		opts.end = Math.min(page + 4, opts.pages);
		opts.start = Math.max(opts.end - 7, 0);
		opts.index = page * opts.psize; //base 0
		opts.last = Math.min(opts.index + opts.psize, opts.size);
		return self;
	}

	this.resize = function(size) {
		opts.size = size; //set new size
		opts.pages = Math.floor(size / opts.psize);
		return self.navto(opts.page);
	}
	this.update = function(page, psize) {
		opts.page = isNaN(page) ? opts.page : +page;
		opts.psize = isNaN(psize) ? opts.psize : +psize;
		return self.resize(opts.size);
	}
	this.slice = function(rows) {
		return rows.slice(opts.index, opts.index + opts.psize);
	}
}

module.exports = new Pagination();
