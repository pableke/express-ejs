
import sb from "../lib/string-box.js";
import i18n from "../i18n/langs.js";

const form = {}; // validators for model
const langs = i18n.getLangs(); // Languages container

const tplMenuTipo = '<option value="@value;">@label;</option>';
const enMenuTipo = { "1": "Menu", "2": "Action" }
const esMenuTipo = { "1": "Menú", "2": "Acción" }

langs.en.tplMenuTipo = sb.entries(tplMenuTipo, enMenuTipo);
langs.es.tplEmptyMenuTipo = "<option>Select a type</option>"
langs.es.tplMenuTipo = sb.entries(tplMenuTipo, esMenuTipo);
langs.es.tplEmptyMenuTipo = "<option>Seleccione un tipo</option>"

langs.en.menu = (data, i) => {
    data.count = i + 1;
    data.creado = sb.isoDate(data.creado);
    data.creado_i18n = data.creado;
    data.tipo_i18n = enMenuTipo[data.tipo];
    data.nombre_i18n = data.nombre_en || data.nombre;
    data.titulo_i18n = data.titulo_en || data.titulo;
    data.padre_i18n = data.padre_en || data.padre_es;
    data["ac-padre"] = data.padre_i18n ? (data.padre_i18n + " (" + data.tipo_i18n + ")") : "";
    return data;
}
langs.es.menu = (data, i) => {
    data.count = i + 1;
    data.creado = sb.isoDate(data.creado);
    data.creado_i18n = sb.esDate(data.creado);
    data.tipo_i18n = esMenuTipo[data.tipo];
    data.nombre_i18n = data.nombre;
    data.titulo_i18n = data.titulo;
    data.padre_i18n = data.padre_es;
    data["ac-padre"] = data.padre_i18n ? (data.padre_i18n + " (" + data.tipo_i18n + ")") : "";
    return data;
}

form.filter = data => {
    i18n.reset() // All data optional
        .setData("nombre", data.nombre).setData("titulo", data.titulo).setData("enlace", data.enlace)
        .setInteger("tipo", data.tipo).setInteger("orden", data.orden)
        .setData("f1", data.f1).setData("f2", data.f2);
    return i18n.getData();
}
form.validate = data => {
    i18n.reset() // required fields
        .required("nombre", data.nombre).required("titulo", data.titulo).required("enlace", data.enlace)
        .setInteger("padre", data.padre).iGt0("tipo", data.tipo).iGt0("orden", data.orden);
    return i18n.isOk() ? i18n.getData() : !i18n.setError("errForm");
}

export default i18n.setForm("menu", form);
