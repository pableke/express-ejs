
import en from "./en.js";
import es from "./es.js";
import i18n from "../public/js/i18n/langs.js";

// Important! i18n same instance than client
const client = i18n.getLangs();
Object.assign(client.en, en);
Object.assign(client.es, es);

// Server language container
export default i18n;
