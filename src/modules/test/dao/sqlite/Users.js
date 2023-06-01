
import bcrypt from "bcrypt";

export default class Users {
    constructor(db) {
        this.db = db;
    }

    all() {
        const sql = "select * from users order by nif desc limit 10";
        return new Promise((resolve, reject) => {
            this.db.all(sql, [], (err, users) => err ? reject(err) : resolve(users));
        });
    }
    filter(data) {
        const sql = "select * from users where (? is null or nif like ?) and (? is null or email like ?)";
        //const sql2 = "select * from users where nif like :nif and email like :email"; //no named parameters
        const params = [data.nif, data.nif + "%", data.email, data.email + "%"];
        return new Promise((resolve, reject) => {
            this.db.all(sql, params, (err, users) => err ? reject(err) : resolve(users));
        });
    }

    getById(id) {
        const sql = "select * from users where id = ?";
        return new Promise((resolve, reject) => {
            this.db.get(sql, id, (err, user) => err ? reject(err) : resolve(user));
        });
    }
    getUser(login) {
        const sql = "select * from users where nif = ? or email = ?";
        return new Promise((resolve, reject) => {
            this.db.get(sql, [login, login], (err, user) => err ? reject(err) : resolve(user));
        });
    }
    login(login, pass) {
        pass = pass || "__none#pass__"; // not empty avoid exception
        const fnMatch = user => user ? Promise.resolve(user) : Promise.reject("Password not match!");
        const fnCompare = (pass, user) => bcrypt.compare(pass, user.clave).then(result => fnMatch(result && user));
        return this.getUser(login).then(user => user ? fnCompare(pass, user) : Promise.reject("Login not found!"));
    }

    insert(data) {
        const sql = "insert into users (nif, nombre, apellido1, apellido2, email, clave) values (?, ?, ?, ?, ?, ?)";
        const params = [data.nif, data.nombre, data.apellido1, data.apellido2, data.email];
        return new Promise((resolve, reject) => {
            params.push(bcrypt.hashSync(data.clave, 10)); // Add hash as last param
            // Store hash in the database, Important! declare function to use this!!
            this.db.run(sql, params, function(err) { err ? reject(err) : resolve(this.lastID); });
        });
    }
    update(data) {
        const sql = "update users set nif = ?, nombre = ?, apellido1 = ?, apellido2 = ?, email = ?, activado = ? where id = ?";
        const params = [data.nif, data.nombre, data.apellido1, data.apellido2, data.email, data.activado, data.id];
        return new Promise((resolve, reject) => { // Important! declare function to use this!!
            this.db.run(sql, params, function(err) { err ? reject(err) : resolve(this.changes); });
        });
    }
    save(data) {
        return data.id ? this.update(data) : this.insert(data);
    }
    delete(id) {
        const sql = "delete from users where id = ?";
        return new Promise((resolve, reject) => { // Important! declare function to use this!!
            this.db.run(sql, id, function(err) { err ? reject(err) : resolve(this.changes); });
        });
    }
};
