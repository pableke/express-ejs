
import sqlite from "sqlite3"; //Database
import config from "app/dist/config.js"; // Configurations

import Usuarios from "./usuarios.js"; //Users DAO

// Database connection
const db = new sqlite.Database(config.SQLITE_PATH, sqlite.OPEN_READWRITE, err => {
	if (err)
		console.error(err);
	else
		console.log("> Sqlite " + config.SQLITE_PATH + " open.");
});

export default {
	users: new Usuarios(db),

	open: function() {
	},
	close: function() {
		db.close();
		console.log("> Sqlite " + config.SQLITE_PATH + " closed.")
	}
};