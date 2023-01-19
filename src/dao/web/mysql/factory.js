
import mysql from "mysql"; // MySql connector
import config from "../../../config.js"

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
				console.error(err);
			else
				connection.release();
		});
		return this;
	},

	close: function() {
		pool.end(function(err) {
			if (err)
				return console.error(err);
			// close all connections
		});
		return this;
	}
};
