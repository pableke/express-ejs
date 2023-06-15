
import url from "url"; // Url handler
import path from "path"; //file and directory paths
import env from "dotenv"; // Environment

env.config(); // Initialize process.env

const SRC = url.fileURLToPath(new URL(".", import.meta.url));
const FILES = url.fileURLToPath(new URL("./public/files", import.meta.url));

export default {
	PORT: process.env.PORT || 3000,

	DIR_SRC: SRC,
	DIR_FILES: FILES,
	DIR_UPLOADS: path.join(FILES, "uploads"),
	DIR_THUMBS: path.join(FILES, "thumbs"),
	DIR_PUBLIC: path.join(SRC, "public"),
	DIR_VIEWS: path.join(SRC, "views"),

	SESSION_NAME: process.env.SESSION_NAME || "SESSION_NAME",
	SESSION_EXPIRES: +process.env.SESSION_EXPIRES || 3600000, // default=1h
	SESSION_SECRET: process.env.SESSION_SECRET || "EI1*cMijUIFg4^Q6uvmgB#D8lD&3iat1Axg%x@gj9OsgjN^bV1CO2R5q",

	JWT_KEY: process.env.JWT_KEY || "2ioUHb2Lf0&U3sF49o%!mw3149G4H1qwHrE*14CmOrjTEM0*Jt",
	JWT_EXPIRES: +process.env.JWT_EXPIRES || 3600000, // default=1h

	GMAIL_USER: process.env.GMAIL_USER,
	GMAIL_PASS: process.env.GMAIL_PASS,

	SQLITE_PATH: path.join(SRC, "/dao/sqlite", "web.db"),

	MYSQL_HOST: process.env.MYSQL_HOST || "localhost",
	MYSQL_NAME: process.env.MYSQL_NAME,
	MYSQL_PORT: process.env.MYSQL_PORT,
	MYSQL_USER: process.env.MYSQL_USER,
	MYSQL_PASS: process.env.MYSQL_PASS
};
