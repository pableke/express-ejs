
export default {
	//myjson, mysql, // BD's

	open: function() {
		console.log("> DAO Tests Factory open.");
		return this;
	},

	close: function() {
		console.log("> DAO Tests Factory closed.");
		return this;
	}
};
