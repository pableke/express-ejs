
// Menus DAO
module.exports = function(table, users, menus) {
	table.onLoad = function(data) {
		data.each(um => { um.alta = new Date(um.alta); });
	}

	table.getUserMenu = function(user, menu) { //find by UK
		return table.find(um => ((um.user == user._id) && (um.menu == menu._id)));
	}
	table.getMenus = function(id) {
		let aux = table.getAll().reduce((ids, um) => {
			(um.user == id) && ids.push(um.menu);
			return ids;
		}, []);
		return menus.filter(menu => (menus.isPublic(menu) || (aux.indexOf(menu._id) > -1)));
	}
	table.getUsers = function(id) {
		let aux = table.getAll().reduce((ids, um) => {
			(um.menu == id) && ids.push(um.user);
			return ids;
		}, []);
		return users.filter(user => (aux.indexOf(user._id) > -1));
	}

	table.newUserMenu = function(user, menu, date) {
		return { user: user._id, menu: menu._id, alta: date };
	}
	table.addUserMenu = function(user, menu, date) { //push menus once
		table.getUserMenu(user, menu) || table.push(newUserMenu(user, menu, fecha));
		return table;
	}

	function fnAddUser(user, parents, fecha) {
		parents.forEach(menu => { // Go up in menu tree
			table.addUserMenu(user, menu, fecha);
		});
	}
	table.addUser = function(menu, user) {
		if (!user)
			return table; //user not found
		fnAddUser(user, menus.getParents(menu), new Date());
		return table.commit();
	}
	table.addUsers = function(menu, users) {
		if (!users || (users.length < 1))
			return table; //empty users
		let fecha = new Date(); //sysdate
		let parents = menus.getParents(menu);
		users.forEach(user => {
			fnAddUser(user, parents, fecha);
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
