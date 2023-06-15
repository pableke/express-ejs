
import ab from "../lib/array-box.js";
import sb from "../lib/string-box.js";
import nb from "../lib/number-box.js";

export default {
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
    monthNames: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    monthNamesShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    dayNames: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    dayNamesShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    dayNamesMin: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],

    //numbers helpers
    toInt: nb.toInt,
    isoInt: nb.enIsoInt,
    fmtInt: nb.enFmtInt,
    toFloat: nb.enFloat,
    isoFmt: nb.isoFloatToEnFmt,
    isoFloat: nb.enIsoFloat,
    fmtFloat: nb.enFmtFloat,
    fmtBool: nb.enBool,

    // Render Models
    menu: (data, view) => {
        view.creado = sb.isoDate(data.creado);
        view.creado_i18n = view.creado;
        view.nombre_i18n = data.nombre_en || data.nombre;
        view.titulo_i18n = data.titulo_en || data.titulo;
        return ab.copy(["id", "padre", "orden", "enlace", "icono", "nombre", "titulo"], data, view);
    },
    test: (data, view) => {
        view.c4 = nb.enIsoFloat(data.c4);
        view.imp = nb.enIsoFloat(data.imp);
        view.fecha = sb.isoDate(data.fecha);
        view.fecha_i18n = view.fecha;
        view.memo_i18n = data.memo_en || data.memo;
        view["ac-name"] = data.nif + " - " + data.name;
        const fields = ["id", "nif", "name", "email", "memo"];
        return ab.copy(fields, data, view);
    }
}
