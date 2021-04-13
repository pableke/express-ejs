
const fs = require("fs"); //file system
const path = require("path"); //file and directory paths

const BASEDIR = path.join(__dirname, "../dbs");
const ALL = 511; //0777; //permisos
const DBS = {}; //container

function fnError(err) {
	console.log("\n--------------------", "MyJson", "--------------------");
	console.log("> " + (new Date()));
	//err.message = "Error " + err.errno + ": " + err.sqlMessage;
	console.log(err);
	console.log("--------------------", "MyJson", "--------------------\n");
	return err;
}

function Collection(db, pathname) {
	const self = this; //self instance
	let table = { seq: 1, data: [] };

	this.db = function() { return db; }
	this.get = function(name) { return db.get(name); }
	this.load = function() {
		return new Promise(function(resolve, reject) {
		fs.readFile(pathname + ".json", "utf-8", (err, data) => {
				if (err && err.code == "ENOENT")
					return resolve(self);
				if (err)
					return reject(fnError(err));
				table = JSON.parse(data);
				console.log("load", pathname);
				resolve(self);
			});
		});
	}
	this.commit = function() {
		return new Promise(function(resolve, reject) {
			fs.writeFile(pathname + ".json", JSON.stringify(table), err => {
				err ? reject(fnError(err)) : resolve(self);
			});
		});
	}
	this.drop = function() {
		return new Promise((resolve, reject) => {
			table.data.splice(0);
			delete table.seq; delete table.data; delete table;
			delete db[path.basename(pathname)]; //delete from db
			fs.unlink(pathname + ".json", err => {
				err ? reject(fnError(err)) : resolve(self);
			});
		});
	}

	this.getAll = function() { return table.data; }
	this.findAll = function() { return table.data; }
	this.find = function(cb) { return table.data.find(cb); }
	this.getById = function(id) { return this.find(row => (row._id == id)); }
	this.findById = function(id) { return this.getById(id); }
	this.filter = function(cb) { return table.data.filter(cb); }
	this.each = function(cb) { table.data.forEach(cb); return self; }
	this.format = function(str, arr, opts) { return JSON.format(str, arr || table.data, opts); }
	this.join = function(cb, tables) { return table.data.filter((row, i) => cb(row, i, tables)); }

	this.insert = function(data) {
		data._id = table.seq++;
		table.data.push(data);
		return this.commit();
	}
	this.update = function(cb, data) {
		table.data.forEach((row, i) => { cb(row, i) && Object.assign(row, data); });
		return this.commit();
	}
	this.updateById = function(data) {
		let row = this.find(row => (row._id == data._id));
		if (row) {
			Object.assign(row, data);
			return this.commit();
		}
		return Promise.resolve(self);
	}
	this.save = function(data) {
		return data._id ? this.updateById(data) : this.insert(data);
	}
	this.delete = function(cb) {
		table.data.forEach((row, i) => { cb(row, i) && table.data.splice(i, 1); });
		return this.commit();
	}
	this.deleteById = function(id) {
		let i = table.data.findIndex(row => (row._id == id));
		if (i < 0) //is table modified?
			return Promise.resolve(self);
		table.data.splice(i, 1);
		return this.commit();
	}
}

function Collections(dbs, pathname) {
	const self = this; //self instance
	const db = {}; //container

	this.create = function(name) { //create new table
		db[name] && db[name].drop(); //remove previos table
		db[name] = new Collection(self, path.join(pathname, name));
		return self;
	}
	this.drop = function() { //drop collections and all tables
		return new Promise(function(resolve, reject) {
			Object.values(db).forEach(table => table.drop());
			fs.rmdir(pathname, { recursive: true }, err => {
				err ? reject(fnError(err)) : resolve(self);
			});
		});
	}

	this.dbs = function() { return dbs; }
	this.get = function(name) { return name ? db[name] : db; }
	this.set = function(name, table) { db[name] = table; return self; }
}

exports.open = function() {
	let list = fs.readdirSync(BASEDIR);
	list.forEach(function(dir) {
		let pathname = path.join(BASEDIR, dir);
		let stat = fs.statSync(pathname);
		if (stat && stat.isDirectory()) { //load DB
			let bd = new Collections(DBS, pathname);
			let tables = fs.readdirSync(pathname);
			tables.forEach(function(file) {
				let table = new Collection(bd, path.join(pathname, file));
				table.load().then(coll => {bd.set(file, coll);console.log(coll);});
			});
			DBS[dir] = bd;
		}
	});
	console.log(DBS);
}

exports.close = function() {
	for (let db in DBS)
		DBS[db].drop();
}
