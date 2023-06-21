
import ab from "../usuario/array-box.js";
import sb from "../usuario/string-box.js";
import i18n from "../i18n/langs.js";

const form = {}; // validators for model
const langs = i18n.getLangs(); // Languages container
const fields = ["id", "tipo", "padre", "orden", "enlace", "icono", "nombre", "nombre_en", "titulo", "titulo_en"];

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
    i18n.reset() // All data optional
        .setData("nombre", data.nombre).setData("titulo", data.titulo).setFloat("enlace", data.enlace)
        .setInteger("tipo", data.tipo).setInteger("orden", data.orden)
        .setData("f1", data.f1).setData("f2", data.f2);
    return i18n.getData();
}
form.validate = data => {
    i18n.reset() // required fields
        .required("nombre", data.nombre).required("enlace", data.enlace)
        .gt0("tipo", data.tipo).gt0("orden", data.orden);
    return i18n.isOk() ? i18n.getData() : !i18n.setError("errForm");
}

export default i18n.setForm("menu", form);
