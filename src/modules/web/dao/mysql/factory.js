
import mysql from "mysql"; // MySql connector
import config from "app/dist/config.js"; // Configurations

const pool = mysql.createPool({
	host: config.MYSQL_HOST,
	database: config.MYSQL_NAME,
	connectionLimit: 10,
	port: config.MYSQL_PORT,
	user: config.MYSQL_USER,
	password: config.MYSQL_PASS
});

pool.exec = function(sql) {
	return new Promise((resolve, reject) => {
		pool.query(sql, (err, results) => {
			err ? reject(err) : resolve(results);
		});
	});
};

export default {
	open: function() {
		pool.getConnection((err, connection) => {
			if (err)
				return console.error(err);
			connection.release();
			console.log("> MySql DAO open.");
		});
	},
	close: function() {
		pool.end(function(err) {
			if (err)
				return console.error(err);
			// close all connections
			console.log("> MySql DAO closed.")
		});
	}
};
