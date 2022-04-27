
const env = require("dotenv").config(); //load env const
const mysql = require("mysql"); //MySql connector

const pool = mysql.createPool({
	host: "localhost",
	database: "empresa",
	connectionLimit: 10,
	port: process.env.MYSQL_PORT,
	user: process.env.MYSQL_USER,
	password: process.env.MYSQL_PASS
});

pool.exec = function(sql) {
	return new Promise((resolve, reject) => {
		pool.query(sql, (err, results) => {
			err ? reject(err) : resolve(results);
		});
	});
};

exports.open = function() {
	pool.getConnection((err, connection) => {
		if (err)
			console.error(err);
		else
			connection.release();
	});
	return this;
};

exports.close = function() {
	pool.end(function(err) {
		if (err)
			return console.error(err);
		// close all connections
	});
	return this;
};
