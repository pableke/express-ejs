
import en from "./en.js";
import es from "./es.js";

import test_en from "./test/en.js";
import test_es from "./test/es.js";

import web_en from "./web/en.js";
import web_es from "./web/es.js";

export const main = { en, es }; // Default
export const test = { en: test_en, es: test_es }; // Test module
export const web = { en: web_en, es: web_es }; // Web module
