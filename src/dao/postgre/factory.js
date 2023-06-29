
import pg from "pg"; // PostgreSql connector
import config from "app/dist/config.js"; // Configurations

const pool = new pg.Pool({
	connectionString: config.POSTGRE_URL
});

// Add actions as promises
pool.list = (sql, params) => pool.query(sql, params).then(result => Promise.resolve(result.rows));
pool.find = (sql, params) => pool.query(sql, params).then(result => Promise.resolve(result.rows[0]));
pool.insert = (sql, params) => pool.query(sql, params).then(result => Promise.resolve(result.rows[0].id));
const fnUpdate = (sql, params) => pool.query(sql, params).then(result => Promise.resolve(result.rowCount));
pool.delete = pool.update = fnUpdate;

export default {
	open: function() {
		console.log("> PostgreSql DAO open.")
	},
	close: function() {
		pool.end(); // close all connections
		console.log("> PostgreSql DAO closed.")
	}
};
