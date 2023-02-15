
import dt from "./date-box.js";
import nb from "./number-box.js";
import sb from "./string-box.js";

 // Client language container
export default {
	en: {
		lang: "en", // English
		none: "", // cadena vacia

		//inputs errors messages
		errForm: "Form validation failed",
		errRequired: "Required field!",
		errMinlength8: "The minimum required length is 8 characters",
		errMaxlength: "Max length exceded",
		errNif: "Wrong ID format",
		errCorreo: "Wrong Mail format",
		errDate: "Wrong date format",
		errDateLe: "Date must be less or equals than current",
		errDateGe: "Date must be greater or equals than current",
		errDateGt: "Date must be greater than current",
		errNumber: "Wrong number format",
		errGt0: "Price must be great than 0.00 &euro;", 
		errRegex: "Wrong format",
		errReclave: "Passwords typed do not match",
		errRange: "Value out of allowed range",
		errRefCircular: "Circular reference",

		//confirm cuestions
		saveOk: "Element saved successfully!",
		remove: "Are you sure to delete this element?",
		removeSolicitud: "Are you sure to delete this request?",
		removeAll: "Are you sure to delete all elements?",
		removeOk: "Element removed successfully!",
		cancel: "Are you sure to cancel element?",
		cancelOk: "Element canceled successfully!",
		unlink: "Are you sure to unlink those elements?",
		unlinkOk: "Elements unlinked successfully!",
		linkOk: "Elements linked successfully!",

		//datepicker language
		closeText: "close", prevText: "prev", nextText: "next", currentText: "current",
		monthNames: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
		monthNamesShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
		dayNames: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
		dayNamesShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
		dayNamesMin: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
		dateFormat: "yy-mm-dd", firstDay: 0,

		//datetime helpers
		toDate: dt.enDate,
		isoDate: dt.isoEnDate,
		isoDateTime: dt.isoEnDateTime,
		fmtDate: dt.fmtEnDate,
		acDate: dt.acEnDate,
		toTime: dt.toTime,
		minTime: dt.minTime,
		isoTime: dt.isoTime,
		acTime: dt.acTime,

		//numbers helpers
		toInt: nb.toInt,
		isoInt: nb.enIsoInt,
		fmtInt: nb.enFmtInt,
		toFloat: nb.enFloat,
		isoFloat: nb.enIsoFloat,
		fmtFloat: nb.enFmtFloat,
		fmtBool: nb.enBool,
		val: sb.enVal //object lang access
	},

	es: {
		lang: "es", // Spanish
		none: "", // cadena vacia

		//inputs errors messages
		errForm: "Error al validar los campos del formulario",
		errRequired: "¡Campo obligatorio!",
		errMinlength8: "La longitud mínima requerida es de 8 caracteres",
		errMaxlength: "Longitud máxima excedida",
		errNif: "Formato de NIF / CIF incorrecto",
		errCorreo: "Formato de E-Mail incorrecto",
		errDate: "Formato de fecha incorrecto",
		errDateLe: "La fecha debe ser menor o igual a la actual",
		errDateGe: "La fecha debe ser mayor o igual a la actual",
		errDateGt: "La fecha debe ser mayor a la actual",
		errNumber: "Valor no numérico",
		errGt0: "El importe debe ser mayor de 0,00 &euro;", 
		errRegex: "Formato incorrecto",
		errReclave: "Las claves introducidas no coinciden",
		errRange: "Valor fuera del rango permitido",
		errRefCircular: "Referencia circular",

		//confirm cuestions
		saveOk: "Datos actualizados correctamente",
		remove: "¿Confirma que desea eliminar este registro?",
		removeSolicitud: "¿Confirma que desea eliminar esta solicitud?",
		removeAll: "¿Confirma que desea eliminar todos los elementos?",
		removeOk: "Registro eliminado correctamente.",
		cancel: "¿Confirma que desea cancelar este registro?",
		cancelOk: "Elemento cancelado correctamente.",
		unlink: "¿Confirma que desea desasociar estos registros?",
		unlinkOk: "Registros desasociados correctamente",
		linkOk: "Registros asociados correctamente.",

		//datepicker language
		closeText: "cerrar", prevText: "prev.", nextText: "sig.", currentText: "hoy",
		monthNames: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
		monthNamesShort: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"],
		dayNames: ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"],
		dayNamesShort: ["Dom", "Lun", "Mar", "Mié", "Juv", "Vie", "Sáb"],
		dayNamesMin: ["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sa"],
		dateFormat: "dd/mm/yy", firstDay: 1,

		//datetime helpers
		toDate: dt.esDate,
		isoDate: dt.isoEsDate,
		isoDateTime: dt.isoEsDateTime,
		fmtDate: dt.fmtEsDate,
		acDate: dt.acEsDate,
		toTime: dt.toTime,
		minTime: dt.minTime,
		isoTime: dt.isoTime,
		acTime: dt.acTime,

		//numbers helpers
		toInt: nb.toInt,
		isoInt: nb.esIsoInt,
		fmtInt: nb.esFmtInt,
		toFloat: nb.esFloat,
		isoFloat: nb.esIsoFloat,
		fmtFloat: nb.esFmtFloat,
		fmtBool: nb.esBool,
		val: sb.val //object lang access
	}
};
