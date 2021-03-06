
const fs = require("fs"); //file system
const path = require("path"); //file and directory paths

function fnLogError(err) {
	console.log("\n--------------------", "MyJson", "--------------------");
	console.log("> " + (new Date()));
	console.log(err);
	console.log("--------------------", "MyJson", "--------------------\n");
	return err;
}
function fnError(err) { return err ? fnLogError(err) : err; }
function fnMkdirError(err) { return (err && (err.code != "EEXIST")) ? fnLogError(err) : err; }

function Collection(db, pathname) {
	const self = this; //self instance
	const table = { seq: 1, fields: [], data: [] };

	/* Events */
	function fnVoid() {}
	this.onLoad = fnVoid;
	this.onCommit = fnVoid;

	this.load = function() {
		fs.readFile(pathname, "utf-8", (err, data) => {
			if (err)
				return fnLogError(err);
			let aux = data ? JSON.parse(data) : table; //parse json
			//only load data not structure (fields)
			table.seq = aux.seq || table.seq;
			table.data = aux.data || table.data;
			self.onLoad(self);
		});
		return self;
	}
	this.commit = function() {
		self.onCommit(self);
		fs.writeFile(pathname, self.stringify(), fnError);
		return self;
	}
	this.flush = function() {
		table.seq = 1; //restart sequence
		table.data.splice(0); //remove data array
		return self;
	}
	this.drop = function() {
		fs.unlink(pathname, fnError);
		return self.flush();
	}

	this.db = function() { return db; }
	this.size = function() { return table.data.length; }
	this.stringify = function() { return JSON.stringify(table); }

	this.first = function() { return table.data[0]; }
	this.get = function(i) { return table.data[i]; }
	this.last = function() { return table.data[table.data.length-1]; }
	this.set = function(item1, item2) {
		Object.assign(item1, item2);
		return self;
	}
	this.clone = function(row) {
		return Object.assign({}, row);
	}
	this.duplicate = function(row) {
		let item = self.clone(row);
		delete item.id;
		return item;
	}

	this.name = function() {
		let name = path.basename(pathname); //file.json
		return name.substr(0, name.lastIndexOf("."));
	}
	this.getFields = function() { return table.fields; }
	this.setField = function(field) {
		table.fields.push(field);
		return self;
	}

	this.getAll = function() { return table.data; }
	this.findAll = function() { return table.data; }
	this.copy = function() { return table.data.slice(); }
	this.find = function(cb) { return table.data.find(cb); }
	this.findIndex = function(id) { return id ? table.data.findIndex(row => (row.id == id)) : -1; }
	this.getById = function(id) { return self.find(row => (row.id == id)); }
	this.findById = function(id) { return self.getById(id); }
	this.filter = function(cb) { return table.data.filter(cb); }
	this.filterById = function(id) { return self.filter(row => (row.id == id)); }
	this.each = function(cb) { table.data.forEach(cb); return self; }
	this.sort = function(cmp) { table.data.sort(cmp); return self; }

	this.push = function(item) {
		item.id = table.seq++;
		table.data.push(item);
		return self;
	}
	this.insert = function(item) {
		return self.push(item).commit();
	}
	this.update = function(cb, item) {
		let updates = 0; //counter
		table.data.forEach((row, i) => {
			if (cb(row, i)) {
				self.set(row, item);
				updates++;
			}
		});
		return updates ? self.commit() : self;
	}
	this.updateItem = function(item) {
		let row = self.getById(item.id); //search row
		return row ? self.set(row, item).commit() : self;
	}
	this.save = function(item, data) {
		return item.id ? self.set(item, data) : self.push(item);
	}

	this.delete = function(cb) {
		let deletes = 0; //counter
		let results = []; //new container
		table.data.forEach((row, i) => {
			if (cb(row, i))
				deletes++;
			else
				results.push(row);
		});
		table.data = results; //new container
		return deletes ? self.commit() : self; //save data
	}
	this.extract = function(i) {
		(i > -1) && table.data.splice(i, 1);
		return self;
	}
	this.extractById = function(id) {
		return self.extract(self.findIndex(id));
	}
	this.extractItem = function(item) {
		return self.extractById(item.id);
	}
	this.deleteByIndex = function(i) {
		return self.extract(i).commit();
	}
	this.deleteById = function(id) {
		return self.deleteByIndex(self.findIndex(id));
	}
	this.deleteItem = function(item) {
		return self.deleteById(item.id);
	}
}

function Collections(dbs, pathname) {
	const self = this; //self instance
	const db = {}; //DB container

	this.dbs = function() { return dbs; }
	this.get = function(name) { return name ? db[name] : db; }
	this.set = function(name, table) { db[name] = table; return self; }

	this.dropTable = function(name) {
		db[name] && db[name].drop(); //remove table from db
		delete db[name]; //remove form container
		return self;
	}
	this.createTable = function(name) {
		let tablepath = path.join(pathname, name + ".json");
		let table = db[name] || new Collection(self, tablepath);
		return self.set(name, table.flush());
	}
	this.buildTable = function(name) {
		return self.createTable(name).get(name);
	}
	this.drop = function() {
		Object.keys(db).forEach(self.dropTable);
		fs.rmdir(pathname, { recursive: true }, fnError);
		return self;
	}
}

function MyJson() {
	const self = this; //self instance
	const DBS = {}; //DB's container
	let pathname; //base firectory

	this.dbs = function() { return DBS; }
	this.get = function(name) { return name ? DBS[name] : DBS; }
	this.set = function(name, db) { DBS[name] = db; return self; }
	this.setPath = function(path) { pathname = path; return self; }

	this.dropDB = function(name) {
		DBS[name] && DBS[name].drop(); //remove db
		delete DBS[name]; //remove form container
		return self;
	}
	this.createDB = function(name) { //create new table
		let dbpath = path.join(pathname, name); //new db path
		let db = DBS[name] || new Collections(self, dbpath);
		//create container directory if it doesn't exist
		fs.mkdir(dbpath, 511, fnMkdirError); //511 = 0777
		return self.set(name, db);
	}
	this.buildDB = function(name) {
		return self.createDB(name).get(name);
	}
	this.drop = function() {
		for (let db in DBS) {
			DBS[db].drop();
			delete DBS[db];
		}
		return self;
	}

	this.load = function() {
		// Sync load structure, load data table is async
		fs.mkdir(pathname, 511, fnMkdirError); //511 = 0777
		let list = fs.readdirSync(pathname);
		list.forEach(function(dir) {
			let dbpath = path.join(pathname, dir);
			let stat = fs.statSync(dbpath);
			if (stat && stat.isDirectory()) { //load DB
				let bd = self.buildDB(dir);
				let tables = fs.readdirSync(dbpath);
				tables.forEach(function(file) { //tables iterator
					// Build structure sync but load data async
					bd.buildTable(path.parse(file).name).load();
				});
				DBS[dir] = bd;
			}
		});
		return self;
	}
}

module.exports = new MyJson();
