
const valid = require("app/lib/validator-box.js")

// Extends validators
valid.set("required", function(name, value, msgs) { //usefull for common inputs
	return valid.size(value, 1, 200) || !valid.setError(name, msgs.errRequired);
}).set("required50", function(name, value, msgs) { //usefull for codes, refs, etc.
	return valid.size(value, 1, 50) || !valid.setError(name, msgs.errRequired);
}).set("required800", function(name, value, msgs) { //usefull for textareas
	return valid.size(value, 1, 800) || !valid.setError(name, msgs.errRequired);
}).set("min8", function(name, value, msgs) {
	return valid.size(value, 8, 200) || !valid.setError(name, msgs.errMinlength8);
}).set("max50", function(name, value, msgs) { //empty or length le than 50 (optional)
	return valid.size(value, 0, 50) || !valid.setError(name, msgs.errMaxlength);
}).set("max200", function(name, value, msgs) { //empty or length le than 200 (optional)
	return valid.size(value, 0, 200) || !valid.setError(name, msgs.errMaxlength);
}).set("max800", function(name, value, msgs) { //empty or length le than 800 (optional)
	return valid.size(value, 0, 800) || !valid.setError(name, msgs.errMaxlength);
}).set("token", function(name, value, msgs) {
	return valid.size(value, 200, 800) || !valid.setError(name, msgs.errRegex);
}).set("usuario", function(name, value, msgs) {
	return valid.min8(name, value, msgs) && (valid.idES(name, value) || valid.email(name, value) || !valid.setError(name, msgs.errRegex));
}).set("clave", function(name, value, msgs) {
	return valid.min8(name, value, msgs) && (valid.login(name, value) || !valid.setError(name, msgs.errRegex));
}).set("reclave", function(name, value, msgs) {
	return valid.clave(name, value, msgs) && ((value == valid.getData("clave")) || !valid.setError(name, msgs.errReclave));
}).set("nif", function(name, value, msgs) {
	return valid.required(name, value, msgs) && (valid.idES(name, value) || !valid.setError(name, msgs.errNif));
}).set("correo", function(name, value, msgs) {
	return valid.required(name, value, msgs) && (valid.email(name, value) || !valid.setError(name, msgs.errCorreo));
}).set("dateval", function(name, value, msgs) { //required date
	return valid.date(name, value) || !valid.setError(name, msgs.errDate);
}).set("datenull", function(name, value, msgs) { //optional date
	return !value || valid.dateval(name, value, msgs);
}).set("ltNow", function(name, value, msgs) {
	return valid.required(name, value, msgs) && valid.dateval(name, value, msgs)
			&& ((valid.getData(name).getTime() < Date.now()) || !valid.setError(name, msgs.errDateLe));
}).set("leToday", function(name, value, msgs) {
	return valid.required(name, value, msgs) && valid.dateval(name, value, msgs)
			&& ((valid.toISODateString(valid.getData(name)) <= valid.toISODateString()) || !valid.setError(name, msgs.errDateLe));
}).set("gtNow", function(name, value, msgs) {
	return valid.required(name, value, msgs) && valid.dateval(name, value, msgs)
			&& ((valid.getData(name).getTime() > Date.now()) || !valid.setError(name, msgs.errDateGe));
}).set("geToday", function(name, value, msgs) {
	return valid.required(name, value, msgs) && valid.dateval(name, value, msgs)
			&& ((valid.toISODateString(valid.getData(name)) >= valid.toISODateString()) || !valid.setError(name, msgs.errDateGe));
}).set("intval", function(name, value, msgs) { //required int
	return valid.integer(name, value) || !valid.setError(name, msgs.errNumber);
}).set("intnull", function(name, value, msgs) { //optional int
	return !value || valid.intval(name, value, msgs);
}).set("floatval", function(name, value, msgs) { //required float
	return valid.float(name, value) || !valid.setError(name, msgs.errNumber);
}).set("floatnull", function(name, value, msgs) { //optional float
	return !value || valid.floatval(name, value, msgs);
}).set("key", function(name, value, msgs) {
	if  (!value) //optional for inserts
		return true;
	return valid.intval(name, value, msgs) //required>0 for udates
			&& (valid.getData(name) > 0) || !valid.setError(name, msgs.errGt0);
}).set("gt0", function(name, value, msgs) {
	return valid.required(name, value, msgs) && valid.floatval(name, value, msgs) 
			&& ((valid.getData(name) > 0) || !valid.setError(name, msgs.errGt0));
});

//Add modules validators
require("./tests/validators.js")
require("./web/validators.js")
module.exports = valid;
