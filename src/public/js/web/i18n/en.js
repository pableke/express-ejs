
import ab from "../../lib/array-box.js";
import sb from "../../lib/string-box.js";
import nb from "../../lib/number-box.js";

export default {
    module: "web", // English
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
