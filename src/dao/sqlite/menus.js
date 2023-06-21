
import sb from "app/lib/string-box.js";
import i18n from "app/model/menu.js";

const tpl = '<li id="@id;" data-padre="@padre;" data-orden="@orden;"><a href="@enlace;" title="@titulo_i18n;">@icono;@nombre_i18n;</a></li>';

export default class Menus {
    constructor(db) {
        this.db = db;
    }

    init() {
        const sql = "select * from menus where (tipo = 1) and (mask & 1) = 1"; // menus publicos
        this.db.all(sql, [], (err, menus) => {
            const langs = i18n.getLangs(); // Language container
            langs.en.menus = err ? null : sb.render(tpl, menus, langs.en.menu);
            langs.es.menus = err ? null : sb.render(tpl, menus, langs.es.menu);
        });
    }

    filter(data) {
        const sql = "select * from menus where (? is null or tipo = ?) and (? is null or nombre like ?)";
        return this.db.filter(sql, [data.tipo, data.tipo, data.nombre, data.nombre + "%"]);
    }

    getById(id) {
        return this.db.find("select * from menus where id = ?", id);
    }
 
    getPublic() { return i18n.get("menus") };
    getActions(user) { return this.db.filter("select * from v_actions where usuario_id = ?", user); }
    getMenus(user) { return this.db.filter("select * from v_menus where usuario_id is null or usuario_id = ?", user) };
    serialize(user) {
        const fnRender = i18n.get("menu");
        return this.getMenus(user).then(menus => Promise.resolve(sb.render(tpl, menus, fnRender)));
    }

    insert(data) {
        const sql = "insert into menus (tipo, padre, icono, nombre, titulo, enlace, orden, mask) values (?, ?, ?, ?, ?, ?, ?, ?)";
        const params = [data.tipo, data.padre, data.icono, data.nombre, data.titulo, data.enlace, data.orden, data.mask];
        return new Promise((resolve, reject) => { // Important! declare function to use this!!
            this.db.run(sql, params, function(err) { err ? reject(err) : resolve(this.lastID); });
        });
    }
    update(data) {
        const sql = "update menus set tipo = ?, padre = ?, icono = ?, nombre = ?, titulo = ?, enlace = ?, orden = ?, mask = ? where id = ?";
        const params = [data.tipo, data.padre, data.icono, data.nombre, data.titulo, data.enlace, data.orden, data.mask, data.id];
        return new Promise((resolve, reject) => { // Important! declare function to use this!!
            this.db.run(sql, params, function(err) { err ? reject(err) : resolve(this.changes); });
        });
    }
    save(data) {
        return data.id ? this.update(data) : this.insert(data);
    }
    delete(id) {
        const sql = "delete from menus where id = ?";
        return new Promise((resolve, reject) => { // Important! declare function to use this!!
            this.db.run(sql, id, function(err) { err ? reject(err) : resolve(this.changes); });
        });
    }
}
