
// Menus DAO
module.exports = function(table) {
	const _submenus = [];
	let _publicMenus = [];

	function hasParent(menu) { return menu && menu.padre; }
	function isPublic(menu) { return ((menu.mask&1) == 1); }
	function hasChildren(menu) { return menu && ((menu.mask&8) == 8); }

	table.onload = function(menus) {
		menus.each(menu => { menu.alta = new Date(menu.alta); });
		_publicMenus = menus.filter(isPublic);
	}

	table.isPublic = isPublic;
	table.getPublic = function() { return _publicMenus; }

	function addSubmenus(menu) {
		table.each(submenu => {
			if (submenu.padre == menu._id) {
				_submenus.push(submenu);
				addSubmenus(submenu);
			}
		});
		return _submenus; // Remove without commit
	}
	table.getSubmenus = function(menu) {
		_submenus.splice(0); //init container
		return hasChildren(menu) ? addSubmenus(menu) : _submenus; //sub-tree
	}
	table.getSiblings = function(menu) {
		return hasParent(menu) ? table.filter(row => (row.padre == menu.padre)) : [];
	}

	table.insertMenu = function(menu, msgs) {
		let padre = menu.padre && table.findById(menu.padre);
		if (padre) //has parent
			padre.mask |= 8; //update mask
		return table.insert(menu);
	}

	table.deleteMenu = function(menu, msgs) {
		let siblings = table.getSiblings(menu);
		if (siblings.length == 1) { //has more than 1 brother?
			let padre = table.findById(menu.padre);
			padre.mask &= ~8; //update mask
		}
		table.getSubmenus(menu).forEach(table.extractItem);
		return table.deleteItem(menu); //implicit commit
	}

	// mask: bit0=public, bit1=visible, bit2=activo, bit3=has children
	return table.setField("padre").setField("href").setField("icon")
				.setField("nombre").setField("nombre_en")
				.setField("orden").setField("mask").setField("alta");
}
