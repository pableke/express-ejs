CREATE DATABASE IF NOT EXISTS empresa

USE empresa;
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'X#G05y4fmCj3qm7IDmMt@iYAgT@tI6HORGo^ReW0bRfvGJb7bqK1usbY';
ALTER USER 'pableke'@'localhost' IDENTIFIED WITH mysql_native_password BY '1*NPQ5wzgM9FOViG!rHOtLJWwV1ipAZ1VqASsPARI2s^p7I3!NUhmDkk';
FLUSH privileges;

CREATE TABLE IF NOT EXISTS users (
	id int(11) not null auto_increment primary key, //0 a 429.4967.295
	nif varchar(20) not null,
	nombre: varchar(100) not null,
	ap1: varchar(100) not null,
	ap2: varchar(100),
	correo: varchar(200) not null,
	salt: varchar(50) not null,
	clave: varchar(150) not null,
	mask: smallint() unsigned default 0, //0 a 65535
	created_at: timestamp not null default current_date,
	valid_at: timestamp default null
);

CREATE TABLE IF NOT EXISTS menus (
	id int(11) not null auto_increment primary key, //0 a 429.4967.295
	created_at: timestamp not null default current_date
);
