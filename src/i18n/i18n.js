
import i18n from "../lib/i18n-box.js"

import en from "./en.js";
import es from "./es.js";

import test_en from "./test/en.js";
import test_es from "./test/es.js";

import web_en from "./web/en.js";
import web_es from "./web/es.js";


i18n.addLang("en", en).addLang("es", es);
i18n.addModule("test", "en", test_en).addModule("test", "es", test_es);
i18n.addModule("web", "en", web_en).addModule("web", "es", web_es);

export default i18n;
