
// Menus DAO
module.exports = function(table) {
	let _publicMenus = [];

	table.onload = function(menus) {
		menus.each(menu => { menu.alta = new Date(menu.alta); });
		_publicMenus = menus.filter(menu => menu.mask&1);
	}

	table.getPublic = function() {
		return _publicMenus;
	}

	// mask: bit0=public, bit1=visible, bit2=activo, bit3=has children
	return table.setField("padre").setField("href").setField("icon")
				.setField("nombre").setField("nombre_en")
				.setField("orden").setField("mask").setField("alta");
}
