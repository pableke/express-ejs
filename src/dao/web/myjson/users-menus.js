
// Menus DAO
module.exports = function(table, users, menus) {
	table.onload = function(data) {
		data.each(um => { um.alta = new Date(um.alta); });
	}

	table.getUserMenu = function(user, menu) { //find by UK
		return table.find(um => ((um.user == user._id) && (um.menu == menu._id)));
	}
	table.getPrivateMenus = function(user) {
		let aux = table.filter(um => (um.user == user._id));
		return menus.filter(menu => (aux.indexOf(menu._id) > -1));
	}
	table.getMenus = function(user) {
		let aux = table.filter(um => (um.user == user._id));
		return menus.filter(menu => ((aux.indexOf(menu._id) > -1) || menus.isPublic(menu)));
	}

	table.newUserMenu = function(user, menu, date) {
		return { user: user._id, menu: menu._id, alta: date };
	}
	table.addUserMenu = function(user, menu, date) { //push menus once
		table.getUserMenu(user, menu) || table.push(newUserMenu(user, menu, fecha));
		return table;
	}

	function fnAddUser(user, parents, submenus, fecha) {
		parents.forEach(menu => { // Go up in menu tree
			table.addUserMenu(user, menu, fecha);
		});
		submenus.forEach(menu => { // Go down in menu tree
			table.addUserMenu(user, menu, fecha);
		});
	}
	table.addUser = function(menu, user) {
		if (!user)
			return table; //user not found
		fnAddUser(user, menus.getParents(menu), menus.getSubtree(menu), new Date());
		return table.commit();
	}
	table.addUsers = function(menu, users) {
		if (!users || (users.length < 1))
			return table; //empty users
		let fecha = new Date(); //sysdate
		let parents = menus.getParents(menu);
		let submenus = menus.getSubtree(menu);
		users.forEach(user => {
			fnAddUser(user, parents, submenus, fecha);
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

	return table.setField("user").setField("menu").setField("alta");
}
