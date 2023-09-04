
import sb from "../lib/string-box.js";
import i18n from "../i18n/langs.js";

function Usuario() {
    this.enRender = (data, view) => {
        view.activado = sb.isoDate(data.activado);
        view.activado_i18n = view.activado;
        view.creado = sb.isoDate(data.creado);
        view.creado_i18n = view.creado;
        return data;
    }
    this.esRender = (data, view) => {
        view.activado = sb.isoDate(data.activado);
        view.activado_i18n = sb.esDate(view.activado);
        view.creado = sb.isoDate(data.creado);
        view.creado_i18n = sb.esDate(data.creado);
        return data;
    }
    this.getRender = () => i18n.get("renderUsuario");

    this.filter = data => {
        return i18n.getData();
    }
    this.validate = data => {
        return i18n.isOk() ? i18n.getData() : !i18n.setError("errForm");
    }
}

const usuario = new Usuario();
const langs = i18n.getLangs(); // Languages container
langs.en.renderUsuario = usuario.enRender;
langs.es.renderUsuario = usuario.esRender;

export default usuario;
