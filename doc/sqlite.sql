BEGIN TRANSACTION;
CREATE TABLE IF NOT EXISTS "usuarios" (
	"id"	INTEGER NOT NULL UNIQUE,
	"nif"	TEXT NOT NULL UNIQUE,
	"nombre"	TEXT NOT NULL,
	"apellido1"	NUMERIC NOT NULL,
	"apellido2"	TEXT DEFAULT NULL,
	"email"	TEXT NOT NULL UNIQUE,
	"clave"	TEXT NOT NULL,
	"activado"	TEXT DEFAULT NULL,
	"creado"	TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
	UNIQUE("nif"),
	UNIQUE("email"),
	PRIMARY KEY("id" AUTOINCREMENT)
);
CREATE TABLE IF NOT EXISTS "usuario_menu" (
	"usuario_id"	INTEGER NOT NULL,
	"menu_id"	INTEGER NOT NULL,
	"creado"	TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY("usuario_id") REFERENCES "usuarios"("id"),
	FOREIGN KEY("menu_id") REFERENCES "menus"("id"),
	PRIMARY KEY("usuario_id","menu_id")
);
CREATE TABLE IF NOT EXISTS "menus" (
	"id"	INTEGER NOT NULL UNIQUE,
	"tipo"	INTEGER NOT NULL DEFAULT 1,
	"padre"	INTEGER DEFAULT NULL,
	"icono"	TEXT DEFAULT NULL,
	"nombre"	TEXT NOT NULL,
	"titulo"	TEXT DEFAULT NULL,
	"enlace"	TEXT NOT NULL DEFAULT '#',
	"orden"	INTEGER NOT NULL DEFAULT 1,
	"mask"	INTEGER NOT NULL DEFAULT 0,
	"creado"	TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY("padre") REFERENCES "menus"("id"),
	PRIMARY KEY("id" AUTOINCREMENT)
);
CREATE TABLE IF NOT EXISTS "grupos" (
	"id"	INTEGER NOT NULL,
	"tipo"	INTEGER NOT NULL DEFAULT 1,
	"codigo"	TEXT NOT NULL UNIQUE,
	"nombre"	TEXT NOT NULL,
	"desc"	TEXT DEFAULT NULL,
	"mask"	INTEGER NOT NULL DEFAULT 0,
	"creado"	TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY("id" AUTOINCREMENT)
);
CREATE TABLE IF NOT EXISTS "usuario_grupo" (
	"usuario_id"	INTEGER NOT NULL,
	"grupo_id"	INTEGER NOT NULL,
	"creado"	TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY("usuario_id") REFERENCES "usuarios"("id"),
	FOREIGN KEY("grupo_id") REFERENCES "grupos"("id"),
	PRIMARY KEY("usuario_id","grupo_id")
);
INSERT INTO "usuarios" ("id","nif","nombre","apellido1","apellido2","email","clave","activado","creado") VALUES (1,'23024374V','Pablo','Rosique','Vidal','pableke','$2b$10$wrKp3VW4HQKXtj0hTs.4Ve0YZQW3OAuu8U7DHcEv/XGqcV3K9Ixri','','2023-05-31 10:28:27'),
 (2,'11111111H','Heladio','Argón','','heladio','$2b$10$3/VyqccSGbWoO1Uzi0IakeZ0Lqb/f4tbK4FOlT7Fl.YRIN.ISPqPq','','2023-05-31 10:37:04');
INSERT INTO "usuario_menu" ("usuario_id","menu_id","creado") VALUES (1,3,'2023-06-02 11:07:43'),
 (1,19,'2023-06-05 06:47:29'),
 (1,20,'2023-06-05 06:48:32');
INSERT INTO "menus" ("id","tipo","padre","icono","nombre","titulo","enlace","orden","mask","creado") VALUES (1,1,NULL,'<i class="fas fa-address-card nav-icon"></i>','About','Nav Link About','#',5,1,'2023-06-02 10:45:57'),
 (2,1,NULL,'<i class="fas fa-home nav-icon"></i>','Inicio','Nav Link Inicio','/',1,1,'2023-06-02 10:46:12'),
 (3,1,NULL,NULL,'Privado','Nav Link Privado','#',1,0,'2023-06-02 10:48:31'),
 (4,1,5,NULL,'Sub Nav Link 1','Sub Nav Link 1','#',1,1,'2023-06-03 12:02:27'),
 (5,1,NULL,'<i class="fas fa-euro-sign nav-icon"></i>','Ingresos','Nav Link 1','#',2,1,'2023-06-03 12:07:13'),
 (6,1,5,NULL,'Sub Nav Link 2','Sub Nav Link 2','#',2,1,'2023-06-03 12:08:58'),
 (7,1,5,NULL,'Sub Nav Link 3','Sub Nav Link 3','#',3,1,'2023-06-03 12:09:42'),
 (8,1,5,'','Sub Nav Link 4','Sub Nav Link 4','#',4,1,'2023-06-04 14:50:44'),
 (9,1,5,NULL,'Sub Nav Link 5','Sub Nav Link 5','#',5,1,'2023-06-04 14:51:51'),
 (10,1,NULL,NULL,'Nav Link 3','Nav Link 3','#',3,1,'2023-06-04 14:55:44'),
 (11,1,10,NULL,'Sub Nav Link 6','Sub Nav Link 6','#',1,1,'2023-06-04 15:03:28'),
 (12,1,NULL,NULL,'Nav Link 5','Nav Link 5','#',4,1,'2023-06-04 15:03:58'),
 (13,1,NULL,NULL,'Nav Link 4','Nav Link 4','#',3,1,'2023-06-04 15:04:32'),
 (14,1,12,NULL,'Sub Nav Link 8','Sub Nav Link 8','#',1,1,'2023-06-04 15:05:22'),
 (15,1,12,NULL,'Sub Nav Link 9','Sub Nav Link 9','#',1,1,'2023-06-04 15:05:51'),
 (16,1,12,NULL,'Sub Nav Link 10','Sub Nav Link 10','#',1,1,'2023-06-04 15:06:35'),
 (17,1,6,NULL,'Sub Nav Link 11','Sub Nav Link 11','#',1,1,'2023-06-04 15:09:52'),
 (18,1,6,NULL,'Sub Nav Link 12','Sub Nav Link 12','#',2,1,'2023-06-04 15:10:23'),
 (19,2,NULL,'menuedit.png','Menús','Gestión de menús','#tab-3',1,0,'2023-06-05 06:43:43'),
 (20,2,NULL,'user1_edit.png','Usuarios','Gestión de usuarios','#tab-5',1,0,'2023-06-05 06:44:47');
CREATE VIEW v_menus as 
select *
from (select m.*, null usuario_id
	from menus m 
	where (m.tipo = 1) and ((m.mask & 1) = 1)
	union
	select m.*, um.usuario_id
	from menus m 
		inner join usuario_menu um on (um.menu_id=m.id)
	where (m.tipo = 1))
order by orden, id;
CREATE VIEW v_actions as 
select m.*, um.usuario_id
from menus m 
	inner join usuario_menu um on (um.menu_id=m.id)
where (m.tipo = 2)
order by orden, id;
CREATE VIEW v_usuario_menu as select um.*, 
	m.nombre menu, m.tipo, m.padre, m.icono, m.titulo, m.enlace, m.orden, m.mask mmask,
	u.nif, u.nombre, u.apellido1, u.apellido2, u.email
from usuario_menu um 
	left join usuarios u on (um.usuario_id=u.id)
	left join menus m on (um.menu_id=m.id);
CREATE VIEW v_menu_padre as 
select m.*, p.nombre padre_es
from menus m 
	left join menus p on (m.padre=p.id);
COMMIT;
