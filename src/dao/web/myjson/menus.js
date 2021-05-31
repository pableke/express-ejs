
// Menus DAO
module.exports = function(table) {
	const _parents = [];
	const _submenus = [];

	let _publicMenus = [];

	function hasParent(menu) { return menu && menu.padre; }
	function isPublic(menu) { return ((menu.mask&1) == 1); }
	function hasChildren(menu) { return menu && ((menu.mask&8) == 8); }
	function setParent(menu) { menu.mask |= 8; return table; }
	function fnSetFinal(menu) { menu.mask &= ~8; return table; }

	table.onLoad = function(menus) {
		menus.each(menu => { menu.alta = new Date(menu.alta); });
		_publicMenus = menus.filter(isPublic);
	}
	table.onCommit = function() {
		_publicMenus = table.filter(isPublic);
	}

	table.isPublic = isPublic;
	table.getPublic = function() { return _publicMenus; }

	function addSubmenus(menu) {
		table.each(submenu => {
			if (submenu.padre == menu.id) {
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
	table.getSubtree = function(menu) {
		let submenus = table.getSubmenus(menu);
		submenus.push(menu); //add selected menu (parent)
		return submenus;
	}
	table.getSiblings = function(menu) {
		return hasParent(menu) ? table.filter(row => (row.padre == menu.padre)) : [];
	}
	table.getChildren = function(id) {
		return id ? table.filter(row => (row.padre == id)) : [];
	}
	table.getParent = function(menu) {
		return menu.padre && table.findById(menu.padre);
	}
	table.getParents = function(menu) {
		_parents.splice(0); //init container
		let parent = table.getParent(menu);
		while (parent) { //has parent
			_parents.push(parent);
			parent = table.getParent(menu);
		}
		return _parents;
	}

	table.loadParent = function(menu, padre) {
		setParent(padre); //update mask
		menu.pn = padre.nm;
		menu.pn_en = padre.nm_en;
		menu.pi = padre.ico;
		return table;
	}
	table.unloadParent = function(menu) {
		delete menu.pn;
		delete menu.pn_en;
		delete menu.pi;
		return table;
	}
	table.setFinal = function(id) {
		return (id && !table.getChildren(id).length) ? fnSetFinal(table.getById(id)) : table;
	}
	table.saveMenu = function(menu, msgs) {
		let row = table.getById(menu.id) || menu;
		let padre = table.getParent(menu);
		if (padre)
			table.loadParent(row, padre);
		else
			table.unloadParent(row);
		let id = row.padre;
		return table.save(row, menu).setFinal(id).commit();
	}
	table.deleteMenu = function(id) {
		let um = table.db().get("um");
		let menu = table.findById(id);
		table.getSubmenus(menu).forEach(table.extractItem);
		return table.extractItem(menu).setFinal(menu.padre).commit(); //implicit commit
	}

	// mask: bit0=public, bit1=visible, bit2=activo, bit3=has children
	return table.setField("nm").setField("nm_en").setField("padre").setField("href")
				.setField("ico").setField("orden").setField("mask").setField("alta");
}
