
import i18n from "../lib/i18n-box.js";

const form = {}; // validators for model
form.validate = data => {
    i18n.reset()
        .user("usuario", data.usuario, "errUsuario")
        .login("clave", data.clave, "errClave");
    return i18n.isOk() ? i18n.getData() : !i18n.setError("errUserNotFound");
}

form.contact = data => {
    i18n.reset()
        .required("usuario", data.usuario).email("correo", data.correo)
        .required("asunto", data.asunto).required("info", data.info);
    return i18n.isOk() ? i18n.getData() : !i18n.setError("errSendContact");
}

form.signup = data => {
    return i18n.isOk() ? i18n.getData() : !i18n.setError("errForm");
}

form.remember = data => {
    return i18n.isOk() ? i18n.getData() : !i18n.setError("errForm");
}

export default i18n.setForm("login", form);
