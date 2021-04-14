
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
	let table = { seq: 1, fields: [], data: [] };

	this.load = function() {
		return new Promise(function(resolve, reject) {
			fs.readFile(pathname, "utf-8", (err, data) => {
				if (err)
					return reject(fnLogError(err));
				table = JSON.parse(data); //parse json
				self.onload && self.onload(self);
				resolve(self);
			});
		});
	}
	this.commit = function() {
		fs.writeFile(pathname, self.stringify(), fnError);
		return self;
	}
	this.drop = function() {
		table.seq = 1; //restart sequence
		delete table.sort; //remove sort id
		table.data.splice(0); //remove data array
		fs.unlink(pathname, fnError);
		return self;
	}

	this.db = function() { return db; }
	this.size = function() { return table.data.length; }
	this.stringify = function() { return JSON.stringify(table); }

	this.merge = function(item1, item2) {
		table.fields.forEach(field => {
			item1[field] = item2[field];
		});
		return self;
	}
	this.assign = function(item1, item2) {
		table.fields.forEach(field => {
			item1[field] = item2[field] ?? item1[field];
		});
		return self;
	}

	this.get = function(i) { return table.data[i]; }
	this.set = function(i, item) {
		return ((i > -1) && (i < table.data.length)) ? self.merge(table.data[i], item).commit() : self;
	}
	this.setById = function(item) {
		let row = self.find(row => (row._id == item._id));
		return row ? self.merge(row, item).commit() : self;
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
	this.find = function(cb) { return table.data.find(cb); }
	this.findIndex = function(id) { return table.data.findIndex(row => (row._id == id)); }
	this.getById = function(id) { return self.find(row => (row._id == id)); }
	this.findById = function(id) { return self.getById(id); }
	this.filter = function(cb) { return table.data.filter(cb); }
	this.each = function(cb) { table.data.forEach(cb); return self; }
	this.unsort = function() { delete table.sort; return self; }
	this.sort = function(name, cmp) {
		if (table.sort == name)
			return self;
		table.sort = name;
		table.data.sort(cmp);
		return self.commit();
	}

	this.insert = function(item) {
		delete table.sort;
		item._id = table.seq++;
		table.data.push(item);
		return self.commit();
	}
	this.update = function(cb, item) {
		let updates = 0; //counter
		table.data.forEach((row, i) => {
			if (cb(row, i)) {
				self.assign(row, item);
				updates++;
			}
		});
		return updates ? self.commit() : self;
	}
	this.updateById = function(item) {
		let row = self.find(row => (row._id == item._id));
		return row ? self.assign(row, item).commit() : self;
	}
	this.save = function(item) {
		return item._id ? self.updateById(item) : self.insert(item);
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
	this.deleteById = function(id) {
		let i = self.findIndex(id);
		if (i < 0) //table modified?
			return self;
		table.data.splice(i, 1);
		return self.commit();
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
		let table = new Collection(self, tablepath);

		self.dropTable(name); //remove previous table from db
		table.commit(); //write empty table on file system
		return self.set(name, table);
	}
	this.buildTable = function(name) {
		return db[name] || self.createTable(name).get(name);
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
	let basedir = __dirname; //default

	this.dbs = function() { return DBS; }
	this.get = function(name) { return name ? DBS[name] : DBS; }
	this.set = function(name, db) { DBS[name] = db; return self; }

	this.dropDB = function(name) {
		DBS[name] && DBS[name].drop(); //remove db
		delete DBS[name]; //remove form container
		return self;
	}
	this.createDB = function(name) { //create new table
		let dbpath = path.join(basedir, name); //new db path
		let db = new Collections(self, dbpath);

		self.dropDB(name);
		//create container directory if it doesn't exist
		fs.mkdir(dbpath, 511, fnMkdirError); //511 = 0777
		return self.set(name, db);
	}
	this.buildDB = function(name) {
		return DBS[name] || self.createDB(name).get(name);
	}

	this.drop = function() {
		for (let db in DBS) {
			DBS[db].drop();
			delete DBS[db];
		}
		return self;
	}

	this.open = function(pathname) {
		//define defaults paths
		pathname = pathname || basedir;
		basedir = pathname || basedir;
		// Sync auto-load on create new instance
		fs.mkdir(pathname, 511, fnMkdirError); //511 = 0777
		let list = fs.readdirSync(pathname);
		list.forEach(function(dir) {
			let dbpath = path.join(pathname, dir);
			let stat = fs.statSync(dbpath);
			if (stat && stat.isDirectory()) { //load DB
				let bd = new Collections(self, dbpath);
				let tables = fs.readdirSync(dbpath);
				tables.forEach(function(file) { //tables iterator
					let table = new Collection(bd, path.join(dbpath, file)); //instance
					bd.set(table.name(), table); //add table on db
					table.load(); //load data async
				});
				DBS[dir] = bd;
			}
		});
		return self;
	}
}

module.exports = new MyJson();
