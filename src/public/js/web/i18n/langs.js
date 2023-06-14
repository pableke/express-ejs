
import en from "./en.js";
import es from "./es.js";
import ab from "../../lib/array-box.js";
import sb from "../../lib/string-box.js";
import i18n from "../../lib/i18n-box.js";
import langs from "../../i18n/langs.js";

Object.assign(langs.en, en);
Object.assign(langs.es, es);

i18n.setForm("fmenu", data => {
    return i18n.getData();
});

i18n.setForm("menu", data => {
    return i18n.isOk() ? i18n.getData() : !i18n.setError("errForm");
});

i18n.setForm("login", data => {
    i18n.reset()
        .user("usuario", data.usuario, "errUsuario")
        .login("clave", data.clave, "errClave");
    return i18n.isOk() ? i18n.getData() : !i18n.setError("errUserNotFound");
});

i18n.setForm("contact", data => {
    i18n.reset()
        .required("usuario", data.usuario).email("correo", data.correo)
        .required("asunto", data.asunto).required("info", data.info);
    return i18n.isOk() ? i18n.getData() : !i18n.setError("errSendContact");
});

i18n.setForm("ftest", data => {
    i18n.reset() // All data optional
        .setData("name", data.name).setData("memo", data.memo)
        .setFloat("imp1", data.imp1).setFloat("imp2", data.imp2)
        .setData("f1", data.f1).setData("f2", data.f2);
    return i18n.getData();
});

i18n.setForm("test", data => {
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
});

// Client language container
export default langs;
