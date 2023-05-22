
import web_en from "./web/i18n/en.js";
import web_es from "./web/i18n/es.js";

import test_en from "./test/i18n/en.js";
import test_es from "./test/i18n/es.js";

const langs = {};

langs.en = web_en;
langs.es = web_es;

langs.web = {}; // web module
langs.web.en = web_en;
langs.web.es = web_es;

langs.test = {}; // test module
langs.test.en = Object.assign({}, web_en, test_en);
langs.test.es = Object.assign({}, web_es, test_es);

export default langs;
