
import url from "url"; // Url handler
import env from "dotenv"; // Environment

env.config(); // Initialize process.env

export const PORT = process.env.PORT || 3000;
export const DIR_SRC = url.fileURLToPath(new URL(".", import.meta.url));
export const DIR_PUBLIC = url.fileURLToPath(new URL("./public", import.meta.url));
export const DIR_FILES = url.fileURLToPath(new URL("./public/files", import.meta.url));
export const DIR_VIEWS = url.fileURLToPath(new URL("./views", import.meta.url));

export const SESSION_NAME = process.env.SESSION_NAME || "SESSION_NAME";
export const SESSION_SECRET = process.env.SESSION_SECRET || "EI1*cMijUIFg4^Q6uvmgB#D8lD&3iat1Axg%x@gj9OsgjN^bV1CO2R5q";

export const GMAIL_USER = process.env.GMAIL_USER;
export const GMAIL_PASS = process.env.GMAIL_PASS;

export const MYSQL_HOST = process.env.MYSQL_HOST || "localhost";
export const MYSQL_NAME = process.env.MYSQL_NAME;
export const MYSQL_PORT = process.env.MYSQL_PORT;
export const MYSQL_USER = process.env.MYSQL_USER;
export const MYSQL_PASS = process.env.MYSQL_PASS;
