
//const myjson = require("./myjson/factory.js");
import mysql from "./mysql/factory.js";

export default {
	/*myjson,*/ mysql, // BD's

	open: function() {
		//myjson.open();
		mysql.open();
		console.log("> DAO Web Factory open.");
		return this;
	},

	close: function() {
		//myjson.close();
		mysql.close();
		console.log("> DAO Web Factory closed.");
		return this;
	}
};
