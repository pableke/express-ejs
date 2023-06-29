
import bcrypt from "bcrypt";

function fnError(err) {
    return (err.errno == 19) ? "Users previously registered in the system" : err; //UK violated
}
function fnUpdate(db, sql, params) {
    return new Promise((resolve, reject) => { // Important! declare function to use this!!
        db.run(sql, params, function(err) { err ? reject(fnError(err)) : resolve(this.changes); });
    });
}

export default class Usuarios {
    constructor(db) {
        this.db = db;
    }

    all() {
        return this.db.list("select * from usuarios order by nif desc limit 10", []);
    }
    filter(data) {
        const sql = "select * from usuarios where (? is null or nif like ?) and (? is null or email like ?)";
        //const sql2 = "select * from usuarios where nif like :nif and email like :email"; //no named parameters
        return this.db.list(sql, [data.nif, data.nif + "%", data.email, data.email + "%"]);
    }

    getById(id) {
        return this.db.find("select * from usuarios where id = ?", id);
    }
    getByLogin(login) {
        const sql = "select * from usuarios where nif = ? or email = ?";
        return this.db.find(sql, [login.toUpperCase(), login.toLowerCase()]);
    }
    login(login, pass) {
        pass = pass || "__none#pass__"; // not empty avoid exception
        const fnMatch = user => user ? Promise.resolve(user) : Promise.reject("Password not match!");
        const fnCompare = (pass, user) => bcrypt.compare(pass, user.clave).then(result => fnMatch(result && user));
        return this.getByLogin(login).then(user => user ? fnCompare(pass, user) : Promise.reject("Login not found!"));
    }

    insert(data) {
        const sql = "insert into usuarios (nif, nombre, apellido1, apellido2, email, clave) values (?, ?, ?, ?, ?, ?)";
        const params = [data.nif.toUpperCase(), data.nombre, data.apellido1, data.apellido2, data.email.toLowerCase(), bcrypt.hashSync(data.clave, 10)];
        return new Promise((resolve, reject) => { // Store hash in the database, Important! declare function to use this!!
            this.db.run(sql, params, function(err) { err ? reject(fnError(err)) : resolve(this.lastID); });
        });
    }
    update(data) {
        const sql = "update usuarios set nif = ?, nombre = ?, apellido1 = ?, apellido2 = ?, email = ?, activado = ? where id = ?";
        const params = [data.nif, data.nombre, data.apellido1, data.apellido2, data.email, data.activado, data.id];
        return fnUpdate(this.db, sql, params);
    }
    activate(user) { //ej: select datetime('2023-06-07T12:00:25.0Z') -> select strftime('%Y-%m-%dT%H:%M:%fZ', 'now')
        const sql = "update usuarios set activado = datetime('now')  where id = ?";
        return fnUpdate(this.db, sql, user);
    }
    updatePassword(user, pass) {
        const sql = "update usuarios set clave = ? where id = ?";
        const params = [bcrypt.hashSync(pass, 10), user]; // user = id
        return fnUpdate(this.db, sql, params);
    }
    save(data) {
        return data.id ? this.update(data) : this.insert(data);
    }
    delete(id) {
        return this.db.delete("delete from usuarios where id = ?", id);
    }
}
