
import ab from "../lib/array-box.js";
import sb from "../lib/string-box.js";
import i18n from "../i18n/langs.js";

const form = {}; // validators for model
const langs = i18n.getLangs(); // Languages container
const fields = ["id", "nif", "nombre", "apellido1", "apellido2", "email"];

langs.en.usuario = (data, view) => {
    view.activado = sb.isoDate(data.activado);
    view.activado_i18n = view.activado;
    view.creado = sb.isoDate(data.creado);
    view.creado_i18n = view.creado;
    return ab.copy(fields, data, view);
}
langs.es.usuario = (data, view) => {
    view.activado = sb.isoDate(data.activado);
    view.activado_i18n = sb.esDate(view.activado);
    view.creado = sb.isoDate(data.creado);
    view.creado_i18n = sb.esDate(data.creado);
    return ab.copy(fields, data, view);
}

form.filter = data => {
    return i18n.getData();
}
form.validate = data => {
    return i18n.isOk() ? i18n.getData() : !i18n.setError("errForm");
}

export default i18n.setForm("usuario", form);
