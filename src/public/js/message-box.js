
/**
 * Message-Box module
 * @module Message-Box
 */
function MessageBox(lang) {
	const self = this; //self instance
	const langs = {
		en: { //english
			errForm: "Form validation failed",
			errRequired: "Required field!",
			errMinlength8: "The min length required is 8 characters",
			errNif: "Wrong ID format",
			errCorreo: "Wrong Mail format",
			errRegex: "Wrong format",

			remove: "Are you sure to delete element?",
			cancel: "Are you sure to cancel element?"
		},

		es: { //spanish
			errForm: "Error al validar los campos del formulario",
			errRequired: "Campo obligatorio!",
			errMinlength8: "Valor mínimo requerido: 8 caracteres",
			errNif: "Formato de NIF / CIF incorrecto",
			errCorreo: "Formato de E-Mail incorrecto",
			errRegex: "Formato incorrecto",

			remove: "¿Confirma que desea eliminar este registro?",
			cancel: "¿Confirma que desea cancelar este registro?"
		}
	}

	let _lang = langs.es; //default
	this.getLang = function(lang) { return lang ? langs[lang] : _lang; }
	this.setLang = function(lang, data) { langs[lang] = data; return self; }
	this.getI18n = function(lang) { return (lang) ? (langs[lang] || langs[lang.substr(0, 2)] || langs.es) : langs.es; }
	this.setI18n = function(lang) { _lang = self.getI18n(lang); return self; }

	this.get = function(name) { return _lang[name]; }
	this.set = function(name, value) { _lang[name] = value; return self; }
	this.format = function(str) {
		return str.replace(/@(\w+);/g, (m, k) => { return nvl(_lang[k], m); });
	}

	//load default language
	self.setI18n(lang);
}
