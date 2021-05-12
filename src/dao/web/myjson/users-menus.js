
// Menus DAO
module.exports = function(table, users, menus) {
	function getSubtree(menu) {
		let submenus = menus.getSubmenus(menu);
		submenus.push(menu); //add selected menu (parent)
		return submenus;
	}

	table.onload = function(data) {
		data.each(um => { um.alta = new Date(um.alta); });
	}

	table.getUserMenu = function(user, menu) { //find by UK
		return table.find(um => ((um.user == user._id) && (um.menu == menu._id)));
	}
	table.getMenus = function(user) {
		let aux = table.filter(um => (um.user == user._id));
		return menus.filter(menu => ((aux.indexOf(menu._id) > -1) || menus.isPublic(menu)));
	}

	table.newUserMenu = function(user, menu, date) {
		return { user: user._id, menu: menu._id, mask: menu.mask, alta: date };
	}
	table.addUserMenu = function(user, menu, date) { //push menus once
		table.getUserMenu(user, menu) || table.push(newUserMenu(user, menu, fecha));
		return table;
	}
	table.addUsers = function(menu, users) {
		let fecha = new Date(); //sysdate
		let submenus = menus.getSubtree(menu);
		users.forEach(user => {
			submenus.forEach(menu => {
				table.addUserMenu(user, menu, fecha);
			});
		});
		return table.commit();
	}
	table.unlinkUser = function(user) {
		return table.delete(um => (um.user == user._id));
	}
	table.unlinkMenu = function(menu) {
		let submenus = menus.getSubtree(menu);
		return table.delete(um => (submenus.indexOf(um.menu) > -1));
	}
	table.unlink = function(user, menu) {
		let submenus = menus.getSubtree(menu);
		return table.delete(um => ((um.user == user._id) && (submenus.indexOf(um.menu) > -1)));
	}
	table.deleteMenu = function(menu) {
		table.unlinkMenu(menu);
		menus.deleteMenu(menu);
		return table;
	}

	return table.setField("user").setField("menu").setField("mask").setField("alta");
}
