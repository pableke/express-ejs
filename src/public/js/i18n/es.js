
import ab from "../lib/array-box.js";
import sb from "../lib/string-box.js";
import nb from "../lib/number-box.js";

export default {
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
    monthNames: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
    monthNamesShort: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"],
    dayNames: ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"],
    dayNamesShort: ["Dom", "Lun", "Mar", "Mié", "Juv", "Vie", "Sáb"],
    dayNamesMin: ["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sa"],

    //numbers helpers
    toInt: nb.toInt,
    isoInt: nb.esIsoInt,
    fmtInt: nb.esFmtInt,
    toFloat: nb.esFloat,
    isoFmt: nb.isoFloatToEsFmt,
    isoFloat: nb.esIsoFloat,
    fmtFloat: nb.esFmtFloat,
    fmtBool: nb.esBool,

    // Render Models
    menu: (data, view) => {
        view.creado = sb.isoDate(data.creado);
        view.creado_i18n = sb.esDate(data.creado);
        view.nombre_i18n = data.nombre;
        view.titulo_i18n = data.titulo;
        return ab.copy(["id", "padre", "orden", "enlace", "icono", "nombre", "nombre_en", "titulo", "titulo_en"], data, view);
    },
    test: (data, view) => {
        view.c4 = nb.esIsoFloat(data.c4);
        view.imp = nb.esIsoFloat(data.imp);
        view.fecha = sb.isoDate(data.fecha);
        view.fecha_i18n = sb.esDate(data.fecha);
        view.memo_i18n = data.memo;
        view["ac-name"] = data.nif + " - " + data.name;
        const fields = ["id", "nif", "name", "email", "memo", "memo_en"];
        return ab.copy(fields, data, view);
    }
}
