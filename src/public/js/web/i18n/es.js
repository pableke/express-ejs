
import ab from "../../lib/array-box.js";
import sb from "../../lib/string-box.js";
import nb from "../../lib/number-box.js";

export default {
    module: "web", // Spanish
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
