
const ab = require("app/lib/array-box.js");

// Menus DAO
module.exports = function(table) {
	const TPL_MENU_ES = '<li id="@id;" data-padre="@padre;"><a href="@href;" title="@title;"><i class="@ico; nav-icon"></i>@nm;</a></li>';
	const TPL_MENU_EN = '<li id="@id;" data-padre="@padre;"><a href="@href;" title="@title_en;"><i class="@ico; nav-icon"></i>@nm_en;</a></li>';
	let esMenus, enMenus;

	function isParent(menu) { return menu && menu.padre; }
	function isPublic(menu) { return ((menu.mask&1) == 1); }

	table.onLoad = function(menus) {
		menus.each(menu => { menu.alta = new Date(menu.alta); });
		let aux = menus.filter(isPublic);
		esMenus = ab.format(aux, TPL_MENU_ES);
		enMenus = ab.format(aux, TPL_MENU_EN);
	}

	//table.onCommit = fnUpdate;
	table.isPublic = isPublic;
	table.getPublic = (lang) => ("en" == lang) ? enMenus : esMenus;
	table.format = (lang, menus)  => ab.format(menus, ("en" == lang) ? TPL_MENU_EN : TPL_MENU_ES);

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
		return isParent(menu) ? table.filter(row => (row.padre == menu.padre)) : [];
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

	function loadParent(menu, padre) {
		setParent(padre); //update mask
		menu.pn = padre.nm;
		menu.pn_en = padre.nm_en;
		menu.pi = padre.ico;
		return menu;
	}
	function unloadParent(menu) {
		delete menu.pn;
		delete menu.pn_en;
		delete menu.pi;
		return menu;
	}
	table.setFinal = function(id) {
		return (id && !table.getChildren(id).length) ? fnSetFinal(table.getById(id)) : table;
	}
	table.insertMenu = function(menu, msgs) {
		let padre = table.getParent(menu);
		padre ? loadParent(menu, padre) : unloadParent(menu);
		return table.push(menu).setFinal(menu.padre).commit();
	}
	table.updateMenu = function(menu, msgs) {
		let row = table.getById(menu.id)
		let padre = table.getParent(menu);
		return padre ? loadParent(row, padre) : unloadParent(row);
		return table.set(row, menu).setFinal(row.padre).commit();
	}
	table.saveMenu = function(menu, msgs) {
		return menu.id ? table.updateMenu(menu, msgs) : table.insertMenu(menu, msgs);
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
