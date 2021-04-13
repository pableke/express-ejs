
module.exports = function(dbs) {
	let table = dbs.get("company").get("menus");

	return {
		getAll: table.getAll
	}	
}
