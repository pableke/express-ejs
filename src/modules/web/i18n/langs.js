
import en from "./en.js";
import es from "./es.js";
import client from "app/js/web/i18n/langs.js";

Object.assign(client.en, en);
Object.assign(client.es, es);

// Server language container
export default client;
