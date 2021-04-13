
module.exports = function(table) {
	return {
		getAll: table.getAll,
		getPublic: function() { return table.filter(menu => menu.mask&1); }
	}	
}
