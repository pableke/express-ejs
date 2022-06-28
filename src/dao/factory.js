
import tests from "./tests/factory.js";
import web from "./web/factory.js";

export default {
	tests, web, // Modules

	open: function() {
		tests.open();
		web.open();
		console.log("> DAO Factory open.");
		return this;
	},

	close: function() {
		tests.close();
		web.close();
		console.log("> DAO Factory closed.");
		return this;
	}
};
