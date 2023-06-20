
import bcrypt from "bcrypt";

function fnError(reject, err) {
    return reject((err.errno == 19) ? "Users previously registered in the system" : err);
}
function fnUpdate(db, sql, params) {
    return new Promise((resolve, reject) => { // Important! declare function to use this!!
        db.run(sql, params, function(err) { err ? fnError(reject, err) : resolve(this.changes); });
    });
}

export default class Usuarios {
    constructor(db) {
        this.db = db;
    }

    all() {
        const sql = "select * from usuarios order by nif desc limit 10";
        return new Promise((resolve, reject) => {
            this.db.all(sql, [], (err, users) => err ? reject(err) : resolve(users));
        });
    }
    filter(data) {
        const sql = "select * from usuarios where (? is null or nif like ?) and (? is null or email like ?)";
        //const sql2 = "select * from usuarios where nif like :nif and email like :email"; //no named parameters
        const params = [data.nif, data.nif + "%", data.email, data.email + "%"];
        return new Promise((resolve, reject) => {
            this.db.all(sql, params, (err, users) => err ? reject(err) : resolve(users));
        });
    }

    getById(id) {
        const sql = "select * from usuarios where id = ?";
        return new Promise((resolve, reject) => {
            this.db.get(sql, id, (err, user) => err ? reject(err) : resolve(user));
        });
    }
    getByLogin(login) {
        const sql = "select * from usuarios where nif = ? or email = ?";
        const params = [login.toUpperCase(), login.toLowerCase()];
        return new Promise((resolve, reject) => {
            this.db.get(sql, params, (err, user) => err ? reject(err) : resolve(user));
        });
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
            this.db.run(sql, params, function(err) { err ? fnError(reject, err) : resolve(this.lastID); });
        });
    }
    update(data) {
        const sql = "update usuarios set nif = ?, nombre = ?, apellido1 = ?, apellido2 = ?, email = ?, activado = ? where id = ?";
        const params = [data.nif, data.nombre, data.apellido1, data.apellido2, data.email, data.activado, data.id];
        return fnUpdate(this.db, sql, params);
    }
    activate(user) { //datetime ej: datetime('2023-06-07T12:00:25.0Z')
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
        const sql = "delete from usuarios where id = ?";
        return new Promise((resolve, reject) => { // Important! declare function to use this!!
            this.db.run(sql, id, function(err) { err ? reject(err) : resolve(this.changes); });
        });
    }
}
