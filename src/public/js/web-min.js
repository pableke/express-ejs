dom.ready(function(){sb.isset(window.grecaptcha)&&grecaptcha.ready(function(){grecaptcha.execute("6LeDFNMZAAAAAKssrm7yGbifVaQiy1jwfN8zECZZ",{action:"submit"}).then(e=>dom.setValue("#token",e)).catch(dom.showError)}),dom.submit(r=>{dom.closeAlerts().required("#info","errSendContact","errRequired").required("#asunto","errSendContact","errRequired").email("#correo","errSendContact","errCorreo").required("#nombre","errSendContact","errRequired"),dom.isOk()&&dom.ajax(r.action,e=>{dom.showOk(e).val("",r.elements).moveFocus("#nombre")})},dom.get("#contact")),dom.submit(e=>dom.closeAlerts().login("#clave","errUserNotFound","errRegex").user("#usuario","errUserNotFound","errRegex").isOk(),dom.get("#login"))});