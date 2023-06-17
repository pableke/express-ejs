
import ab from "../lib/array-box.js";
import sb from "../lib/string-box.js";
import i18n from "../i18n/langs.js";

const form = {}; // validators for model
const langs = i18n.getLangs(); // Languages container
const fields = ["id", "padre", "orden", "enlace", "icono", "nombre", "nombre_en", "titulo", "titulo_en"];

langs.en.menu = (data, view) => {
    view.creado = sb.isoDate(data.creado);
    view.creado_i18n = view.creado;
    view.nombre_i18n = data.nombre_en || data.nombre;
    view.titulo_i18n = data.titulo_en || data.titulo;
    return ab.copy(fields, data, view);
}
langs.es.menu = (data, view) => {
    view.creado = sb.isoDate(data.creado);
    view.creado_i18n = sb.esDate(data.creado);
    view.nombre_i18n = data.nombre;
    view.titulo_i18n = data.titulo;
    return ab.copy(fields, data, view);
}

form.filter = data => {
    return i18n.getData();
}
form.validate = data => {
    return i18n.isOk() ? i18n.getData() : !i18n.setError("errForm");
}

export default i18n.setForm("menu", form);
