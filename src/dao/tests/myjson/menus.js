
module.exports = function(table) {
	let _publicMenus;

	table.onload = function(menus) {
		_publicMenus = menus.filter(menu => menu.mask&1);
	}

	table.setField("href").setField("icon")
		.setField("nombre").setField("orden")
		.setField("mask").setField("f_creacion");

	return {
		getAll: table.getAll,
		getPublic: function() { return _publicMenus; }
	}	
}
