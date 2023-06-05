
import sqlite from "sqlite3"; //Database
import config from "app/dist/config.js"; // Configurations

import Menus from "./menus.js"; //Users DAO
import Usuarios from "./usuarios.js"; //Users DAO

// Database connection
const db = new sqlite.Database(config.SQLITE_PATH, sqlite.OPEN_READWRITE, err => {
	if (err)
		return console.error(err);
	menus.init(); // initialize caches
	console.log("> Sqlite " + config.SQLITE_PATH + " open.");
});

const menus = new Menus(db);
const usuarios = new Usuarios(db);

export default {
	menus, usuarios, 

	open: function() {
	},
	close: function() {
		db.close();
		console.log("> Sqlite " + config.SQLITE_PATH + " closed.")
	}
};
