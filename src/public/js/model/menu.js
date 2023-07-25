
import sb from "../lib/string-box.js";
import i18n from "../i18n/langs.js";

const form = {}; // validators for model
const langs = i18n.getLangs(); // Languages container

//langs.es.menuTipoKeys = langs.en.menuTipoKeys = [ 1, 2 ];
langs.en.menuTipoValues = [ null, "Menu", "Action" ];
langs.es.menuTipoValues = [ null, "Menú", "Acción" ];

langs.en.menu = (data, i) => {
    data.count = i + 1;
    data.creado = sb.isoDate(data.creado);
    data.creado_i18n = data.creado;
    data.tipo_i18n = langs.en.menuTipoValues[data.tipo];
    data.nombre_i18n = data.nombre_en || data.nombre;
    data.titulo_i18n = data.titulo_en || data.titulo;
    data.padre_i18n = data.padre_en || data.padre_es;
    return data;
}
langs.es.menu = (data, i) => {
    data.count = i + 1;
    data.creado = sb.isoDate(data.creado);
    data.creado_i18n = sb.esDate(data.creado);
    data.tipo_i18n = langs.es.menuTipoValues[data.tipo];
    data.nombre_i18n = data.nombre;
    data.titulo_i18n = data.titulo;
    data.padre_i18n = data.padre_es;
    return data;
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
        .required("nombre", data.nombre).required("titulo", data.titulo).required("enlace", data.enlace)
        .iGt0("tipo", data.tipo).iGt0("orden", data.orden)
        .gt0("imp", data.imp_i18n);
    return i18n.isOk() ? i18n.getData() : !i18n.setError("errForm");
}

export default i18n.setForm("menu", form);
