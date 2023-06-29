
import mysql from "mysql2/promise"; // MySql connector
import config from "app/dist/config.js"; // Configurations

const pool = mysql.createPool({
	host: config.MYSQL_HOST,
	database: config.MYSQL_NAME,
	connectionLimit: 10,
	port: config.MYSQL_PORT,
	user: config.MYSQL_USER,
	password: config.MYSQL_PASS
});

// Add actions as promises
pool.list = (sql, params) => pool.query(sql, params).then(result => Promise.resolve(result.rows));
pool.find = (sql, params) => pool.query(sql, params).then(result => Promise.resolve(result.rows[0]));
pool.insert = (sql, params) => pool.query(sql, params).then(result => Promise.resolve(result.insertId));
const fnUpdate = (sql, params) => pool.query(sql, params).then(result => {console.log(result);return Promise.resolve(result.affectedRows)});
pool.delete = pool.update = fnUpdate;

export default {
	open: function() {
	},
	close: function() {
		pool.end(function(err) { // close all connections
			err ? console.error(err) : console.log("> MySql DAO closed.");
		});
	}
};
