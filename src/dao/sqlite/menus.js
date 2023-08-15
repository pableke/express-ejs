
import sb from "app/lib/string-box.js";
import i18n from "app/i18n/langs.js";
import menu from "app/model/menu.js";

const tpl = '<li id="@id;" data-padre="@padre;" data-orden="@orden;"><a href="@enlace;" title="@titulo_i18n;">@icono;@nombre_i18n;</a></li>';

export default class Menus {
    constructor(db) {
        this.db = db;
    }

    init() {
        const sql = "select * from menus where (tipo = 1) and (mask & 1) = 1"; // menus publicos
        this.db.all(sql, [], (err, menus) => {
            const langs = i18n.getLangs(); // Language container
            langs.en.menus = err ? null : sb.render(tpl, menus, menu.enRender);
            langs.es.menus = err ? null : sb.render(tpl, menus, menu.esRender);
        });
    }

    filter(data) {
        const sql = "select * from v_menu_padre where (? is null or tipo = ?) and (? is null or nombre like ?)";
        return this.db.list(sql, [data.tipo, data.tipo, data.nombre, data.nombre + "%"]);
    }
    filterByParams(tipo, term) {
        const sql = "select * from v_menu_padre where (tipo = ?) and (UPPER(nombre) like ?)";
        return this.db.list(sql, [ tipo, "%" + term.toUpperCase() + "%" ]);
    }

    getById(id) {
        return this.db.find("select * from v_menu_padre where id = ?", id);
    }
 
    getPublic() { return i18n.get("menus") };
    getActions(user) { return this.db.list("select * from v_actions where usuario_id = ?", user); }
    getMenus(user) { return this.db.list("select * from v_menus where usuario_id is null or usuario_id = ?", user) };
    serialize(user) {
        const fnRender = i18n.get("renderMenu");
        return this.getMenus(user).then(menus => Promise.resolve(sb.render(tpl, menus, fnRender)));
    }

    insert(data) {
        const sql = "insert into menus (tipo, padre, icono, nombre, titulo, enlace, orden, mask) values (?, ?, ?, ?, ?, ?, ?, ?)";
        const params = [data.tipo, data.padre, data.icono, data.nombre, data.titulo, data.enlace, data.orden, data.mask];
        return this.db.insert(sql, params);
    }
    update(data) {
        const sql = "update menus set tipo = ?, padre = ?, icono = ?, nombre = ?, titulo = ?, enlace = ?, orden = ?, mask = ? where id = ?";
        const params = [data.tipo, data.padre, data.icono, data.nombre, data.titulo, data.enlace, data.orden, data.mask, data.id];
        return this.db.update(sql, params);
    }
    save(data) {
        return data.id ? this.update(data) : this.insert(data);
    }
    delete(id) {
        return this.db.delete("delete from menus where id = ?", id);
    }
}
