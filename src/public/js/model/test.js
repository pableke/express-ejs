
import ab from "../lib/array-box.js";
import nb from "../lib/number-box.js";
import sb from "../lib/string-box.js";
import i18n from "../i18n/langs.js";

const form = {}; // validators for model
const langs = i18n.getLangs(); // Languages container
const fields = ["id", "nif", "name", "email", "memo", "memo_en"];

langs.en.test = (data, view) => {
    view.c4 = nb.enIsoFloat(data.c4);
    view.imp = nb.enIsoFloat(data.imp);
    view.fecha = sb.isoDate(data.fecha);
    view.fecha_i18n = view.fecha;
    view.memo_i18n = data.memo_en || data.memo;
    view["ac-name"] = data.nif + " - " + data.name;
    return ab.copy(fields, data, view);
}
langs.es.test = (data, view) => {
    view.c4 = nb.esIsoFloat(data.c4);
    view.imp = nb.esIsoFloat(data.imp);
    view.fecha = sb.isoDate(data.fecha);
    view.fecha_i18n = sb.esDate(data.fecha);
    view.memo_i18n = data.memo;
    view["ac-name"] = data.nif + " - " + data.name;
    return ab.copy(fields, data, view);
}

form.filter = data => {
    i18n.reset() // All data optional
        .setData("name", data.name).setData("memo", data.memo)
        .setFloat("imp1", data.imp1).setFloat("imp2", data.imp2)
        .setData("f1", data.f1).setData("f2", data.f2);
    return i18n.getData();
}
form.validate = data => {
    // calculated data from autocomplete
    const ac = sb.split(data["ac-name"], " - ");
    i18n.reset() // required fields
        .gt0("imp", data.imp)
        .required("ac-name", data["ac-name"])
        .required("name", ab.pop(ac)).required("nif", data.nif)
        .date("fecha", data.fecha).text300("memo", data.memo);
    // Optionals fields
    i18n.setInteger("id", data.id)
        .setIntval("binary", data.binary)
        .setArray("values", data.values)
        .setIntval("icons", data.icons);
    return i18n.isOk() ? i18n.getData() : !i18n.setError("errForm");
}

export default i18n.setForm("test", form);
