
exports.main = { // Default
	en: require("./en.js"),
	es: require("./es.js")
};

exports.test = { // Test module
	en: require("./test/en.js"),
	es: require("./test/es.js")
};

exports.web = { // Web module
	en: require("./web/en.js"), 
	es: require("./web/es.js")
};
