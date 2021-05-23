
const valid = require("app/lib/validator-box.js")

// Extends validators
valid.set("required", function(name, value, msgs) { //usefull for common inputs
	return valid.size(value, 1, 200) ? value : valid.addError(name, msgs.errRequired);
}).set("required50", function(name, value, msgs) { //usefull for codes, refs, etc.
	return valid.size(value, 1, 50) ? value : valid.addError(name, msgs.errRequired);
}).set("required800", function(name, value, msgs) { //usefull for textareas
	return valid.size(value, 1, 800) ? value : valid.addError(name, msgs.errRequired);
}).set("min8", function(name, value, msgs) {
	return valid.size(value, 8, 200) ? value : valid.addError(name, msgs.errMinlength8);
}).set("max50", function(name, value, msgs) { //empty or length le than 50 (optional)
	return valid.size(value, 0, 50) ? value : valid.addError(name, msgs.errMaxlength);
}).set("max200", function(name, value, msgs) { //empty or length le than 200 (optional)
	return valid.size(value, 0, 200) ? value : valid.addError(name, msgs.errMaxlength);
}).set("max800", function(name, value, msgs) { //empty or length le than 800 (optional)
	return valid.size(value, 0, 800) ? value : valid.addError(name, msgs.errMaxlength);
}).set("token", function(name, value, msgs) {
	return valid.size(value, 200, 800) ? value : valid.addError(name, msgs.errRegex);
}).set("usuario", function(name, value, msgs) {
	return valid.min8(name, value, msgs) && (valid.idES(value) || valid.email(value) || valid.addError(name, msgs.errRegex));
}).set("clave", function(name, value, msgs) {
	return valid.min8(name, value, msgs) && (valid.login(value) || valid.addError(name, msgs.errRegex));
}).set("reclave", function(name, value, msgs) {
	return valid.clave(name, value, msgs) && ((value == valid.getData("clave")) ? value : valid.addError(name, msgs.errReclave));
}).set("nif", function(name, value, msgs) {
	return valid.required(name, value, msgs) && (valid.idES(value) || valid.addError(name, msgs.errNif));
}).set("correo", function(name, value, msgs) {
	return valid.required(name, value, msgs) && (valid.email(value) || valid.addError(name, msgs.errCorreo));
}).set("dateval", function(name, value, msgs) { //required date
	return valid.date(value) || valid.addError(name, msgs.errDate);
}).set("datenull", function(name, value, msgs) {
	return valid.date(value); //optional date
}).set("ltNow", function(name, value, msgs) {
	let date = valid.required(name, value, msgs) && valid.dateval(name, value, msgs);
	return (date && (date.getTime() < Date.now())) ? value : valid.addError(name, msgs.errDateLe);
}).set("leToday", function(name, value, msgs) {
	let date = valid.required(name, value, msgs) && valid.dateval(name, value, msgs);
	return (date && (valid.toISODateString(date) <= valid.toISODateString()) ? date : valid.addError(name, msgs.errDateLe));
}).set("gtNow", function(name, value, msgs) {
	let date = valid.required(name, value, msgs) && valid.dateval(name, value, msgs);
	return (date && (date.getTime() > Date.now()) ? date : valid.addError(name, msgs.errDateGe));
}).set("geToday", function(name, value, msgs) {
	let date = valid.required(name, value, msgs) && valid.dateval(name, value, msgs);
	return (date && (valid.toISODateString(date) >= valid.toISODateString()) ? date : valid.addError(name, msgs.errDateGe));
}).set("intval", function(name, value, msgs) { //required int
	return valid.isset(valid.integer(value), name, msgs.errNumber);
}).set("intnull", function(name, value, msgs) {
	return valid.integer(value); //optional integer
}).set("floatval", function(name, value, msgs) { //required float
	return valid.isset(valid.float(value), name, msgs.errNumber);
}).set("floatnull", function(name, value, msgs) {
	return valid.float(value); //optional float
}).set("key", function(name, value, msgs) {
	let keyval = valid.integer(value); // Optional for inserts but required>0 for udates
	return ((keyval === null) || (keyval > 0)) ? keyval : valid.addError(name, msgs.errGt0);
}).set("gt0", function(name, value, msgs) {
	let float = valid.required(name, value, msgs) && valid.floatval(name, value, msgs);
	return (float > 0) ? float : valid.addError(name, msgs.errGt0);
});

//Add modules validators
require("./tests/validators.js")
require("./web/validators.js")
module.exports = valid;
