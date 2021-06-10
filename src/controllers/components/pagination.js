
const fs = require("fs"); //file system module
const path = require("path"); //file and directory paths
const ejs = require("ejs"); //tpl engine

const DEFAULT = {
	size: 0, page: 0, psize: 40, pages: 0, start: 0, end: 0,
	tpl: path.join(__dirname, "../../views/components/list/pagination.ejs")
};

module.exports = function(opts) {
	const self = this; //self instance
	opts = Object.assign(DEFAULT, opts);
	let contents = fs.readFileSync(opts.tpl, "utf-8");;

	this.get = function(name) {
		return opts[name];
	}
	this.set = function(name, value) {
		opts[name] = value;
		return self;
	}
	this.template = function(tpl) {
		contents = fs.readFileSync(tpl, "utf-8");
		return self;
	}

	this.update = function(page, psize) {
		opts.page = isNaN(page) ? opts.page : +page;
		opts.psize = isNaN(psize) ? opts.psize : +psize;
		opts.pages = Math.floor(opts.size / opts.psize);
		opts.end = Math.min(opts.page + 4, opts.pages);
		opts.start = Math.max(opts.end - 7, 0);
		opts.index = opts.page * opts.psize;
		return self;
	}
	this.slice = function(rows) {
		return rows.slice(opts.index, opts.index + opts.psize);
	}

	this.html = function(tpl) {
		return ejs.render(contents, opts);
	}
}
