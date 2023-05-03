
import en from "./en.js";
import es from "./es.js";

import test_en from "./test/en.js";
import test_es from "./test/es.js";

import web_en from "./web/en.js";
import web_es from "./web/es.js";

const langs = { en, es };

langs.test = {}; // test module
langs.test.en = Object.assign({}, en, test_en);
langs.test.es = Object.assign({}, es, test_es);

langs.web = {}; // web module
langs.web.en = Object.assign({}, en, web_en);
langs.web.es = Object.assign({}, es, web_es);

export default langs;
