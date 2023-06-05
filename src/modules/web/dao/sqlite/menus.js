
import sb from "app/lib/string-box.js";
import i18n from "app/lib/i18n-box.js";

const MENUS = {};
const tpl = '<li id="@id;" data-padre="@padre;" data-orden="@orden;"><a href="@enlace;" title="@titulo;">@icono;@nombre;</a></li>';

export default class Menus {
    constructor(db) {
        this.db = db;
    }

    init() {
        const sql = "select * from menus where (tipo = 1) and (mask & 1) = 1"; // menus publicos
        this.db.all(sql, [], (err, menus) => {
            const langs = i18n.getLangs(); // Get all langs
            MENUS.en = err ? null : sb.render(tpl, menus, langs.en.menu);
            MENUS.es = err ? null : sb.render(tpl, menus, langs.es.menu);
        });
    }

    getPublic(lang) {
        return MENUS[lang] || MENUS.es;
    }
    getMenus(user) {
        const sql = "select * from v_menus where usuario_id is null or usuario_id = ?";
        return new Promise((resolve, reject) => {
            this.db.all(sql, user, (err, menus) => err ? reject(err) : resolve(menus));
        });
    }
    serialize(user) {
        const fnRender = i18n.get("menu");
        return this.getMenus(user).then(menus => Promise.resolve(sb.render(tpl, menus, fnRender)));
    }

    getActions(user) {
        const sql = "select * from v_actions where usuario_id = ?";
        return new Promise((resolve, reject) => {
            this.db.all(sql, user, (err, menus) => err ? reject(err) : resolve(menus));
        });
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
