
const valid = new ValidatorBox();

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
}).set("dtval", function(name, value, msgs) { //required date
	let date = value && new Date(value);
	return valid.isDate(date) ? date : valid.addError(name, msgs.errDate);
}).set("dateval", function(name, value, msgs) { //required date
	return msgs.toDate(value) || valid.addError(name, msgs.errDate);
}).set("dtnull", function(name, value, msgs) {
	return value ? new Date(value) : null; //optional date (en format)
}).set("datenull", function(name, value, msgs) {
	return msgs.toDate(value); //optional date
}).set("ltNow", function(name, value, msgs) {
	let date = valid.required(name, value, msgs) && valid.dateval(name, value, msgs);
	return (date && (date.getTime() < Date.now())) ? date : valid.addError(name, msgs.errDateLe);
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
	return valid.isset(name, msgs.toInt(value), msgs.errNumber);
}).set("intnull", function(name, value, msgs) {
	return msgs.toInt(value); //optional integer
}).set("floatval", function(name, value, msgs) { //required float
	return valid.isset(name, msgs.toFloat(value), msgs.errNumber);
}).set("floatnull", function(name, value, msgs) {
	return msgs.toFloat(value); //optional float
}).set("key", function(name, value, msgs) {
	let keyval = msgs.toInt(value); // Optional for inserts but required>0 for udates
	return ((keyval === null) || (keyval > 0)) ? keyval : valid.addError(name, msgs.errGt0);
}).set("gt0", function(name, value, msgs) {
	let float = valid.required(name, value, msgs) && valid.floatval(name, value, msgs);
	return (float > 0) ? float : valid.addError(name, msgs.errGt0);
});
