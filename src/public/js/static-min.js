function MessageBox(){const t=this,e={en:{lang:"en",errForm:"Form validation failed",errRequired:"Required field!",errMinlength8:"The minimum required length is 8 characters",errNif:"Wrong ID format",errCorreo:"Wrong Mail format",errDate:"Wrong date format",errDateLe:"Date must be less or equals than current",errDateGe:"Date must be greater or equals than current",errNumber:"Wrong number format",errGt0:"Price must be great than 0.00 &euro;",errRegex:"Wrong format",errReclave:"Passwords typed do not match",errRange:"Value out of allowed range",remove:"Are you sure to delete element?",cancel:"Are you sure to cancel element?"},es:{lang:"es",errForm:"Error al validar los campos del formulario",errRequired:"Campo obligatorio!",errMinlength8:"La longitud mínima requerida es de 8 caracteres",errNif:"Formato de NIF / CIF incorrecto",errCorreo:"Formato de E-Mail incorrecto",errDate:"Formato de fecha incorrecto",errDateLe:"La fecha debe ser menor o igual a la actual",errDateGe:"La fecha debe ser mayor o igual a la actual",errNumber:"Valor no numérico",errGt0:"El importe debe ser mayor de 0,00 &euro;",errRegex:"Formato incorrecto",errReclave:"Las claves introducidas no coinciden",errRange:"Valor fuera del rango permitido",remove:"¿Confirma que desea eliminar este registro?",cancel:"¿Confirma que desea cancelar este registro?"}};let r=e.es;this.getLang=function(t){return t?e[t]:r},this.setLang=function(r,n){return e[r]=n,t},this.getI18n=function(t){return t&&(e[t]||e[t.substr(0,2)])||e.es},this.setI18n=function(e){return r=t.getI18n(e),t},this.get=function(t){return r[t]},this.set=function(e,n){return r[e]=n,t},this.format=function(t){return t.replace(/@(\w+);/g,(t,e)=>nvl(r[e],t))}}function StringBox(){const t=this,e="àáâãäåāăąÀÁÂÃÄÅĀĂĄÆßèéêëēĕėęěÈÉĒĔĖĘĚìíîïìĩīĭÌÍÎÏÌĨĪĬòóôõöōŏőøÒÓÔÕÖŌŎŐØùúûüũūŭůÙÚÛÜŨŪŬŮçÇñÑþÐŔŕÿÝ",r="aaaaaaaaaAAAAAAAAAABeeeeeeeeeEEEEEEEiiiiiiiiIIIIIIIIoooooooooOOOOOOOOOuuuuuuuuUUUUUUUUcCnNdDRryY";function n(t){return"string"==typeof t||t instanceof String}function i(t){return n(t)?t.trim():t}function a(t){return t?t.length:0}function o(t){for(var n="",o=a(i(t)),s=0;s<o;s++){var u=t.charAt(s),l=e.indexOf(u);n+=l<0?u:r.charAt(l)}return n.toLowerCase()}this.isstr=n,this.trim=i,this.size=a,this.eq=function(t,e){return o(t)==o(e)},this.indexOf=function(t,e){return t?t.indexOf(e):-1},this.iIndexOf=function(t,e){return o(t).indexOf(o(e))},this.prevIndexOf=function(t,e,r){return t?t.substr(0,r).lastIndexOf(e):-1},this.prefix=function(t,e){return t.startsWith(e)?t:e+t},this.suffix=function(t,e){return t.endsWith(e)?t:t+e},this.trunc=function(t,e){return a(t)>e?t.substr(0,e).trim()+"...":t},this.itrunc=function(e,r){var n=a(e)>r?t.prevIndexOf(e," ",r):-1;return t.trunc(e,n<0?r:n)},this.removeAt=function(t,e,r){return e<0?t:t.substr(0,e)+t.substr(e+r)},this.insertAt=function(t,e,r){return t?t.substr(0,r)+e+t.substr(r):e},this.replaceAt=function(t,e,r,n){return r<0?t:t.substr(0,r)+e+t.substr(r+n)},this.replaceLast=function(t,e,r){return t?t.replaceAt(t.lastIndexOf(e),e.length,r):r},this.wrapAt=function(e,r,n,i,a){return r<0?e:t.insertAt(t.insertAt(e,i,r),a,r+i.length+n)},this.iwrap=function(e,r,n,i){return e&&r&&t.wrapAt(e,t.iIndexOf(e,r),r.length,n||"<u><b>",i||"</b></u>")},this.rand=function(t){return Math.random().toString(36).substr(2,t||8)},this.lopd=function(t){return t?"***"+t.substr(3,4)+"**":t},this.split=function(t,e){return t?t.trim().split(e||","):[]},this.minify=function(t){return t?t.trim().replace(/\s{2}/g,""):t},this.lines=function(e){return t.split(e,/[\n\r]+/)},this.words=function(e){return t.split(e,/\s+/)},this.ilike=function(e,r){return t.iIndexOf(""+e,r)>-1},this.olike=function(e,r,n){return r.some(function(r){return t.ilike(e[r],n)})},this.alike=function(e,r,n){return t.words(n).some(function(n){return t.olike(e,r,n)})},this.ltr=function(t,e){for(var r=[],n=a(t);n>e;n-=e)r.unshift(t.substr(n-e,e));return n>0&&r.unshift(t.substr(0,n)),r},this.rtl=function(t,e){for(var r=[],n=a(t),i=0;i<n;i+=e)r.push(t.substr(i,e));return r},this.slices=function(t,e){var r=0,n=[],i=a(t);for(let a=0;r<i&&a<e.length;a++){let i=e[a];n.push(t.substr(r,i)),r+=i}return r<i&&n.push(t.substr(r)),n}}function ValidatorBox(){const t=this,e={},r={},n={},i="",a=/^\d+$/,o=/\D+/g,s=/^\d+(,\d+)*$/,u=/\w+[^\s@]+@[^\s@]+\.[^\s@]+/,l=/^[\w#@&°!§%;:=\^\/\(\)\?\*\+\~\.\,\-\$]{8,}$/,c=/^(\d{8})([A-Z])$/,d=/^([ABCDEFGHJKLMNPQRSUVW])(\d{7})([0-9A-J])$/,f=/^[XYZ]\d{7,8}[A-Z]$/;function h(t){return t?t.length:0}function m(t){return t?t.trim():t}function g(t){return t?t.trim().replace(/\W+/g,i).toUpperCase():t}function v(t,e,r,n){t.setFullYear(+e,+r-1,+n)}function p(t,e,r,n,i){t.setHours(+e||0,+r||0,+n||0,+i||0)}this.size=function(t,e,r){let n=h(t);return e<=n&&n<=r},this.regex=function(t,e){try{return t.test(e)}catch(t){}return!1},this.login=function(e,r){return t.regex(l,r)},this.digits=function(e,r){return t.regex(a,r)},this.idlist=function(e,r){return t.regex(s,r)},this.email=function(e,r,n){return t.regex(u,r)&&t.setData(e,r.toLowerCase())},this.date=function(e,r,n){let i=r&&r.split(o);if(i[0]&&i[1]&&i[2]){let r=new Date;return"en"==n.lang?v(r,i[0],i[1],i[2]):v(r,i[2],i[1],i[0]),p(r,i[3],i[4],i[5],i[6]),!isNaN(r.getTime())&&t.setData(e,r)}return!1},this.time=function(e,r,n){let i=r&&r.split(o);if(i[0]&&i[1]){let r=new Date;return p(r,i[0],i[1],i[2],i[3]),!isNaN(r.getTime())&&t.setData(e,r)}return!1},this.float=function(e,r,n){if(r){let a="en"==n.lang?".":",",s=r.lastIndexOf(a),u="-"==r.charAt(0)?"-":i,l=s<0?r:r.substr(0,s),c=s<0?i:"."+r.substring(s+1),d=parseFloat(u+l.replace(o,i)+c);return!isNaN(d)&&t.setData(e,d)}return!1},this.idES=function(e,r){if(r=g(r)){if(t.regex(c,r))return t.dni(e,r);if(t.regex(d,r))return t.cif(e,r);if(t.regex(f,r))return t.nie(e,r)}return!1},this.dni=function(e,r){t.setData(e,r);return"TRWAGMYFPDXBNJZSQVHLCKE".charAt(parseInt(r,10)%23)==r.charAt(8)},this.cif=function(e,r){t.setData(e,r);for(var n=r.match(d),i=n[1],a=n[2],o=n[3],s=0,u=0;u<a.length;u++){var l=parseInt(a[u],10);u%2==0&&(l=(l*=2)<10?l:parseInt(l/10)+l%10),s+=l}var c=0!==(s%=10)?10-s:s,f="JABCDEFGHI".substr(c,1);return i.match(/[ABEH]/)?o==c:i.match(/[KPQS]/)?o==f:o==c||o==f},this.nie=function(e,r){var n=r.charAt(0),i="X"==n?0:"Y"==n?1:"Z"==n?2:n;return t.dni(i+r.substr(1))},this.iban=function(e,r){if(24!=h(r=g(r)))return!1;t.setData(e,r);const n="ABCDEFGHIJKLMNOPQRSTUVWXYZ";let a=n.search(r.substring(0,1))+10,o=n.search(r.substring(1,2))+10,s=String(a)+String(o)+r.substring(2);s=s.substring(6)+s.substring(0,6);let u=i,l=Math.ceil(s.length/7);for(let t=1;t<=l;t++)u=String(parseFloat(u+s.substr(7*(t-1),7))%97);return 1==u},this.creditCardNumber=function(e,r){if(16!=h(r=g(r)))return!1;t.setData(e,r);let n=0,a=!1;r=r.trim().replace(/\s+/g,i);for(let t=15;t>=0;t--){let e=+r[t];a&&(e*=2,e-=e>9?9:0),n+=e,a=!a}return n%10==0},this.generatePassword=function(t,e){return e=e||"abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_#@&°!§%;:=^/()?*+~.,-$",Array.apply(null,Array(t||10)).map(function(){return e.charAt(Math.random()*e.length)}).join(i)},this.testPassword=function(t){let e=0;return e+=/[A-Z]+/.test(t)?1:0,e+=/[a-z]+/.test(t)?1:0,e+=/[0-9]+/.test(t)?1:0,e+=/[\W]+/.test(t)?1:0,e+=e>2&&h(t)>8},this.get=function(e){return t[e]},this.set=function(e,r){return t[e]=r,t},this.getErrors=function(){return e},this.getError=function(t){return e[t]},this.addMsg=function(r,n){return e[r]=n,t},this.setError=function(r,n){return e.num++,t.addMsg(r,n)},this.getForm=function(t){return r[t]},this.setForm=function(e,n){return r[e]=n,t},this.setForms=function(e){return Object.assign(r,e),t},this.getFields=function(e){let r=t.getForm(e);return r?Object.keys(r):[]},this.getData=function(t){return t?n[t]:n},this.setData=function(e,r){return n[e]=r,t},this.values=function(t,e){e=e||{};let r=h(t);for(let n=0;n<r;n++){let r=t[n];r.name&&(e[r.name]=m(r.value))}return e},this.fails=function(){return e.num>0},this.isValid=function(){return 0==e.num},this.validate=function(r,i,a){for(let t in e)delete e[t];e.num=0;for(let t in n)delete n[t];let o=t.getForm(r);if(o)for(let t in o){let e=o[t];n[t]=m(i[t]),e(t,n[t],a,i)}return t.isValid()}}$(document).ready(function(){const t=$("html").attr("lang"),e=i18n.setI18n(t).getLang(),r=new StringBox;function n(t){t.parentNode.classList.add("d-none")}function i(t){t.parentNode.classList.remove("d-none")}function a(t,e){t.innerHTML=e,i(t)}let o=document.querySelectorAll(".alert-text");o.forEach(t=>{t.firstChild?i(t):n(t)});let s=document.querySelectorAll(".alert-close");function u(t){t&&a(o[0],t)}function l(t){t&&a(o[2],t)}function c(t){t&&a(o[3],t)}function d(){s.forEach(t=>{t.click()})}s.forEach(t=>{t.addEventListener("click",function(){n(t)})});let f=document.querySelector(".loading");function h(){$(f).show(),d()}function m(){$(f).fadeOut()}function g(t){return t?"addClass":"removeClass"}function v(t,e){let r=t.dataset.dest;r?($(r).html(e),u(t.dataset.msg)):u(e)}$(document).on("input",".clearable",function(){$(this)[g(this.value)]("x")}).on("mousemove",".x",function(t){$(this)[g(this.offsetWidth-28<t.clientX-this.getBoundingClientRect().left)]("onX")}).on("touchstart click",".onX",function(t){t.preventDefault(),$(this).removeClass("x onX").val("").change()}),$("a.ajax").click(function(t){let r=this;if(t.preventDefault(),r.classList.contains("remove")&&!confirm(e.remove))return!1;function n(t){return v(r,t)}h(),fetch(r.href).then(t=>t.text().then(t.ok?n:c)).catch(c).finally(m)});let p=document.querySelectorAll("form");for(let t=p.length-1;t>-1;t--){const n="input-error",i=".msg-error",s="textarea[maxlength]";let f=p[t],g=f.elements;function b(){$("#counter-"+this.id,f).text(Math.abs(this.getAttribute("maxlength")-r.size(this.value)))}function D(){$(g).filter(":not([type=hidden])[tabindex]:not([readonly])").first().focus()}function E(){$(g).removeClass(n).siblings(i).text(""),$(g).filter(s).each(b),d(),D()}function x(t){return t.nif+" - "+t.nombre}function A(t,e,r){return!$(t).val(r).siblings("[type=hidden]").val(e)}$(g).filter(s).keyup(b).each(b),$(g).filter(".ac-user").autocomplete({minLength:3,source:function(t,e){h(),this.element.autocomplete("instance")._renderItem=function(e,n){let i=r.iwrap(x(n),t.term);return $("<li></li>").append("<div>"+i+"</div>").appendTo(e)},fetch("/usuarios.html?term="+t.term).then(t=>t.json()).then(t=>{e(t.slice(0,10))}).catch(c).finally(m)},focus:function(){return!1},select:function(t,e){return A(this,e.item.nif,x(e.item))}}).change(function(t){this.value||A(this,"","")}),$(g).filter("[type=reset]").click(t=>{f.reset(),E()}),D(),f.addEventListener("submit",function(t){function s(t){$(g).val(""),E(),v(f,t)}function d(t){E();for(let e=r.size(g)-1;e>-1;e--){let r=g[e],a=r.name&&t[r.name];a&&$(r).focus().addClass(n).siblings(i).html(a)}var e;u(t.msgOk),(e=t.msgInfo)&&a(o[1],e),l(t.msgWarn),c(t.msgError)}let p=valid.values(g);if(!valid.validate(f.getAttribute("action"),p,e))return d(valid.addMsg("msgError",e.errForm).getErrors()),t.preventDefault();if(!f.classList.contains("ajax"))return!0;h();let b=new FormData(f);fetch(f.action,{method:f.method,body:"multipart/form-data"===f.enctype?b:new URLSearchParams(b),headers:{"Content-Type":f.enctype||"application/x-www-form-urlencoded","x-requested-with":"XMLHttpRequest"}}).then(t=>t.ok?t.text().then(s):t.json().then(d)).catch(c).finally(m),t.preventDefault()})}}),$(document).ready(function(){$("ul.menu").each(function(t,e){$(e.children).filter("[parent][parent!='']").each((t,r)=>{let n=$("#"+$(r).attr("parent"),e);n.children().last().is(e.tagName)||n.append('<ul class="sub-menu"></ul>').children("a").append('<b class="nav-tri">&rtrif;</b>'),n.children().last().append(r)}),$(e.children).remove("[parent][parent!='']"),e.querySelectorAll("i").forEach(t=>{t.classList.length<=1&&t.parentNode.removeChild(t)});let r=$("b.nav-tri",e);r.parent().click(function(t){$(this.parentNode).toggleClass("active"),t.preventDefault()}),$("li",e).hover(function(){r.html("&rtrif;"),$(this).children("a").find("b.nav-tri").html("&dtrif;"),$(this).parents("ul.sub-menu").prev().find("b.nav-tri").html("&dtrif;")}),$("[disabled]",e).each(function(){let t=parseInt(this.getAttribute("disabled"))||0;$(this).toggleClass("disabled",3!=(3&t))}).removeAttr("disabled")}).children().fadeIn(200),$(".sidebar-toggle").click(t=>{$("#sidebar").toggleClass("active"),$(".sidebar-icon",this.parentNode).toggleClass("d-none"),t.preventDefault()});let t=$(".menu-toggle").click(e=>{e.preventDefault(),t.toggleClass("d-none"),$("#wrapper").toggleClass("toggled")}),e=$("#back-to-top").click(function(){return!$("body,html").animate({scrollTop:0},400)});$(window).scroll(function(){$(this).scrollTop()>50?e.fadeIn():e.fadeOut()}),document.querySelectorAll('a[href^="#"]').forEach(t=>{t.addEventListener("click",function(t){t.preventDefault();try{document.querySelector(this.href).scrollIntoView({behavior:"smooth"})}catch(t){}})})}),document.addEventListener("DOMContentLoaded",function(){let t=document.querySelectorAll("#progressbar li"),e=0;document.querySelectorAll(".next-tab").forEach(r=>{r.addEventListener("click",r=>(e<t.length-1&&t[++e].classList.add("active"),!1))}),$(".prev-tab").click(function(){return e&&t[e--].classList.remove("active"),!1}),$("a[href^='#tab-']").click(function(){let r=+this.href.substr(this.href.lastIndexOf("-")+1);return 0<=r&&r!=e&&r<t.length&&(t.forEach((t,e)=>{t.classList.toggle("active",e<=r)}),e=r),!1})});const i18n=new MessageBox,valid=new ValidatorBox;function toISODateString(t){return t.toISOString().substring(0,10)}valid.set("required",function(t,e,r){return valid.size(e,1,200)||!valid.setError(t,r.errRequired)}).set("min8",function(t,e,r){return valid.size(e,8,200)||!valid.setError(t,r.errMinlength8)}).set("usuario",function(t,e,r){return valid.min8(t,e,r)&&(valid.idES(t,e)||valid.email(t,e)||!valid.setError(t,r.errRegex))}).set("clave",function(t,e,r){return valid.min8(t,e,r)&&(valid.login(t,e)||!valid.setError(t,r.errRegex))}).set("reclave",function(t,e,r,n){return valid.clave(t,e,r)&&(e==n.clave||!valid.setError(t,r.errReclave))}).set("nif",function(t,e,r){return valid.required(t,e,r)&&(valid.idES(t,e)||!valid.setError(t,r.errNif))}).set("correo",function(t,e,r){return valid.required(t,e,r)&&(valid.email(t,e)||!valid.setError(t,r.errCorreo))}).set("ltNow",function(t,e,r){return valid.required(t,e,r)&&(valid.date(t,e,r)||!valid.setError(t,r.errDate))&&(valid.getData(t).getTime()<Date.now()||!valid.setError(t,r.errDateLe))}).set("leToday",function(t,e,r){return valid.required(t,e,r)&&(valid.date(t,e,r)||!valid.setError(t,r.errDate))&&(toISODateString(valid.getData(t))<=toISODateString(new Date)||!valid.setError(t,r.errDateLe))}).set("gtNow",function(t,e,r){return valid.required(t,e,r)&&(valid.date(t,e,r)||!valid.setError(t,r.errDate))&&(valid.getData(t).getTime()>Date.now()||!valid.setError(t,r.errDateGe))}).set("geToday",function(t,e,r){return valid.required(t,e,r)&&(valid.date(t,e,r)||!valid.setError(t,r.errDate))&&(toISODateString(valid.getData(t))>=toISODateString(new Date)||!valid.setError(t,r.errDateGe))}).set("gt0",function(t,e,r){return valid.required(t,e,r)&&(valid.float(t,e,r)||!valid.setError(t,r.errNumber))&&(valid.getData(t)>0||!valid.setError(t,r.errGt0))}).setForm("/login.html",{usuario:valid.usuario,clave:valid.clave}).setForm("/test.html",{nombre:valid.required,correo:valid.correo,date:function(t,e,r){return!e||valid.date(t,e,r)||!valid.setError(t,r.errDate)},number:valid.gt0,asunto:valid.required,info:function(t,e,r){return valid.size(e,1,600)||!valid.setError(t,r.errRequired)}});