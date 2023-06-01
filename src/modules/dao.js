
import test from "./test/dao/factory.js";
import web from "./web/dao/factory.js";

export default {
	test, web, // Modules

	open: function() {
		test.open();
		web.open();
		console.log("> DAO Factory open.");
		return this;
	},

	close: function() {
		test.close();
		web.close();
		console.log("> DAO Factory closed.");
		return this;
	}
};
