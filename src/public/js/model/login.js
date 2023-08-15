
import i18n from "../lib/i18n-box.js";

function Login() {
    this.signin = data => {
        i18n.reset()
            .required("token", data.token)
            .user("usuario", data.usuario, "errUsuario")
            .login("clave", data.clave, "errClave");
        return i18n.isOk() ? i18n.getData() : !i18n.setError("errUserNotFound");
    }
    
    this.contact = data => {
        i18n.reset()
            .required("token", data.token)
            .required("nombre", data.nombre).email("correo", data.correo)
            .required("asunto", data.asunto).required("info", data.info);
        return i18n.isOk() ? i18n.getData() : !i18n.setError("errSendContact");
    }
    
    this.signup = data => {
        return i18n.isOk() ? i18n.getData() : !i18n.setError("errForm");
    }
    
    this.remember = data => {
        return i18n.isOk() ? i18n.getData() : !i18n.setError("errForm");
    }
}

export default new Login();
