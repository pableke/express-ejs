
import sqlite from "./sqlite/factory.js";

export default {
	sqlite,

	open: function() {
		sqlite.open();
		console.log("> DAO Tests Factory open.");
	},
	close: function() {
		sqlite.close();
		console.log("> DAO Tests Factory closed.");
	}
};
