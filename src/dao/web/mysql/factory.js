
import mysql from "mysql"; // MySql connector
import { MYSQL_HOST, MYSQL_NAME, MYSQL_PORT, MYSQL_USER, MYSQL_PASS } from "../../../config.js"

const pool = mysql.createPool({
	host: MYSQL_HOST,
	database: MYSQL_NAME,
	connectionLimit: 10,
	port: MYSQL_PORT,
	user: MYSQL_USER,
	password: MYSQL_PASS
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
