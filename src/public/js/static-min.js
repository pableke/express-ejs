function JsBox(){const e=this;function t(e){return e?e.length:0}function r(e){return e&&1===e.nodeType}function n(e,t){return r(e)&&e.matches(t)}function i(e,t,r){e.matches(t)&&r.push(e)}function a(e,t,r){for(let n=e.nextElementSibling;n;n=n.nextElementSibling)i(n,t,r);for(let n=e.previousElementSibling;n;n=n.previousElementSibling)i(n,t,r)}function s(e,t){for(let r=e.nextElementSibling;r;r=r.nextElementSibling)t.push(r);for(let r=e.previousElementSibling;r;r=r.previousElementSibling)t.push(r)}this.getLang=function(){return document.querySelector("html").getAttribute("lang")||navigator.language||navigator.userLanguage},this.scrollTop=function(t){t=t||600;var r=-window.scrollY/(t/15),n=setInterval(()=>{window.scrollY>0?window.scrollBy(0,r):clearInterval(n)},15);return e},this.fetch=function(e){return(e=e||{}).headers=e.headers||{},e.headers["x-requested-with"]="XMLHttpRequest",fetch(e.action,e).then(t=>{let r=(t.headers.get("content-type")||"").indexOf("application/json")>-1;return t.ok?(r?t.json():t.text()).then(e.resolve):(r?t.json():t.text()).then(e.reject)})},this.each=function(r,n){let i=t(r);for(let e=0;e<i;e++)n(r[e],e);return e},this.reverse=function(r,n){for(let e=t(r)-1;e>-1;e--)n(r[e],e);return e},this.matches=function(e,t){return t&&n(e,t)},this.find=function(e,r){if(r){if(n(e,r))return e;let i=t(e);for(let t=0;t<i;t++){let i=e[t];if(n(i,r))return i}}return null},this.filter=function(t,r){let n=[];return r&&e.each(t,e=>{i(e,r,n)}),n},this.get=function(e,t){return function(e,t){return t&&e.querySelector(t)}(t||document,e)},this.getAll=function(e,t){return function(e,t){return t&&e.querySelectorAll(t)}(t||document,e)},this.siblings=function(t,n){let i=[];return r(t)?n?a(t,n,i):s(t,i):n?e.each(t,e=>a(e,n,i)):e.each(t,e=>s(e,i)),i},this.focus=function(t){const r=e.find(t,"[tabindex]:not([type=hidden][readonly][disabled]):not([tabindex='-1'][tabindex=''])");return r&&r.focus(),e},this.val=function(t,n){return r(t)?t.value=n:e.each(t,e=>{e.value=n}),e},this.text=function(t,n){return r(t)?t.innerText=n:e.each(t,e=>{e.innerText=n}),e},this.html=function(t,n){return r(t)?t.innerHTML=n:e.each(t,e=>{e.innerHTML=n}),e},this.isVisible=function(e){return!!(e.offsetWidth||e.offsetHeight||e.getClientRects().length)},this.show=function(t,n){return n=n||"block",r(t)?t.style.display=n:e.each(t,e=>{e.style.display=n}),e},this.hide=function(t){return r(t)?t.style.display="none":e.each(t,e=>{e.style.display="none"}),e},this.addClass=function(t,n){return r(t)?t.classList.add(n):e.each(t,e=>e.classList.add(n)),e},this.removeClass=function(t,n){return r(t)?t.classList.remove(n):e.each(t,e=>e.classList.remove(n)),e},this.toggle=function(t,n,i){return r(t)?t.classList.toggle(n,i):e.each(t,e=>e.classList.toggle(n,i)),e};let o=null;function u(t,r,n){return t.addEventListener(r,e=>n(t,e)),e}this.fadeOut=function(t){return window.cancelAnimationFrame(o),function e(){(t.style.opacity-=.03)<0?t.style.display="none":o=requestAnimationFrame(e)}(),e},this.fadeIn=function(t,r){window.cancelAnimationFrame(o),t.style.display=r||"block";let n=parseFloat(t.style.opacity);return function e(){(n+=.03)<1&&(t.style.opacity=n,o=requestAnimationFrame(e))}(),e},this.fadeToggle=function(t){return t.style.opacity<.03?e.fadeIn(t):e.fadeOut(t)},this.ready=function(e){return u(document,"DOMContentLoaded",e)},this.click=function(t,n){return r(t)?u(t,"click",n):e.each(t,e=>u(e,"click",n))},this.change=function(t,n){return r(t)?u(t,"change",n):e.each(t,e=>u(e,"change",n))},this.keyup=function(t,n){return r(t)?u(t,"keyup",n):e.each(t,e=>u(e,"keyup",n))},this.keydown=function(t,n){return r(t)?u(t,"keydown",n):e.each(t,e=>u(e,"keydown",n))}}function MessageBox(){const e=this,t="",r="0",n=".",i=new Date,a=/\D+/g,s=[31,28,31,30,31,30,31,31,30,31,30,31],o={en:{lang:"en",errAjax:"Error on ajax call",errForm:"Form validation failed",errRequired:"Required field!",errMinlength8:"The minimum required length is 8 characters",errNif:"Wrong ID format",errCorreo:"Wrong Mail format",errDate:"Wrong date format",errDateLe:"Date must be less or equals than current",errDateGe:"Date must be greater or equals than current",errNumber:"Wrong number format",errGt0:"Price must be great than 0.00 &euro;",errRegex:"Wrong format",errReclave:"Passwords typed do not match",errRange:"Value out of allowed range",remove:"Are you sure to delete element?",cancel:"Are you sure to cancel element?",decimals:n,intHelper:function(e,t){return e&&p(e,",")},floatHelper:function(e,t){return e&&b(e,",",n,2)},acDate:function(e){return e&&e.replace(/^(\d{4})(\d+)$/g,"$1-$2").replace(/^(\d{4}\-\d\d)(\d+)$/g,"$1-$2").replace(/[^\d\-]/g,t)},acTime:function(e){return e&&e.replace(/(\d\d)(\d+)$/g,"$1:$2").replace(/[^\d\:]/g,t)},dateHelper:function(e){return e&&g(c(e)).join("-")},timeHelper:function(e){return e&&m(e)}},es:{lang:"es",errAjax:"Error en la llamada al servidor",errForm:"Error al validar los campos del formulario",errRequired:"Campo obligatorio!",errMinlength8:"La longitud mínima requerida es de 8 caracteres",errNif:"Formato de NIF / CIF incorrecto",errCorreo:"Formato de E-Mail incorrecto",errDate:"Formato de fecha incorrecto",errDateLe:"La fecha debe ser menor o igual a la actual",errDateGe:"La fecha debe ser mayor o igual a la actual",errNumber:"Valor no numérico",errGt0:"El importe debe ser mayor de 0,00 &euro;",errRegex:"Formato incorrecto",errReclave:"Las claves introducidas no coinciden",errRange:"Valor fuera del rango permitido",remove:"¿Confirma que desea eliminar este registro?",cancel:"¿Confirma que desea cancelar este registro?",decimals:",",intHelper:function(e,t){return e&&p(e,n)},floatHelper:function(e,t){return e&&b(e,n,",",2)},acDate:function(e){return e&&e.replace(/^(\d\d)(\d+)$/g,"$1/$2").replace(/^(\d\d\/\d\d)(\d+)$/g,"$1/$2").replace(/[^\d\/]/g,t)},acTime:function(e){return e&&e.replace(/(\d\d)(\d+)$/g,"$1:$2").replace(/[^\d\:]/g,t)},dateHelper:function(e){return e&&d(g(d(c(e)))).join("/")},timeHelper:function(e){return e&&m(e)}}};let u=o.es;function l(e){return+e<10?r+e:e}function c(e){return e.split(a).map(e=>+e)}function d(e){var t=e[2];return e[2]=e[0],e[0]=t,e}function f(e,t,r){return Math.min(Math.max(+e,t),r)}function h(e){return e<100?t+parseInt(i.getFullYear()/100)+l(e):e}function g(e){var t,r,n;return e[0]=h(e[0]),e[1]=f(e[1],1,12),e[2]=f(e[2],1,(t=e[0],r=e[1]-1,s[r]+(1==r&&0==(3&(n=t))&&(n%25!=0||0==(15&n))))),e.map(l)}function m(e){let t=c(e);return t[0]=f(t[0],0,23),t[1]=f(t[1],0,59),t[2]=f(t[2],0,59),t.map(l).join(":")}function v(e,t){for(var r=[],n=e.length;n>t;n-=t)r.unshift(e.substr(n-t,t));return n>0&&r.unshift(e.substr(0,n)),r}function p(e,r){let n="-"==e.charAt(0)?"-":t,i=e.replace(a,t);return isNaN(i)?e:n+v(i,3).join(r)}function b(e,i,s,o){let l=e.lastIndexOf(u.decimals),c="-"==e.charAt(0)?"-":t,d=(l<0?e:e.substr(0,l)).replace(a,t).replace(/^0+(\d+)/,"$1"),f=l<0?r:e.substr(l+1),h=parseFloat(c+d+n+f);return isNaN(h)?e:c+v(d,3).join(i)+s+(l<0?r.repeat(o):f.padEnd(o,r))}this.getLang=function(e){return e?o[e]:u},this.setLang=function(t,r){return o[t]=r,e},this.getI18n=function(e){return e&&(o[e]||o[e.substr(0,2)])||o.es},this.setI18n=function(t){return u=e.getI18n(t),e},this.get=function(e){return u[e]},this.set=function(t,r){return u[t]=r,e},this.sysdate=function(){return i},this.format=function(e){return e.replace(/@(\w+);/g,(e,t)=>nvl(u[t],e))}}function StringBox(){const e=this,t="àáâãäåāăąÀÁÂÃÄÅĀĂĄÆßèéêëēĕėęěÈÉĒĔĖĘĚìíîïìĩīĭÌÍÎÏÌĨĪĬòóôõöōŏőøÒÓÔÕÖŌŎŐØùúûüũūŭůÙÚÛÜŨŪŬŮçÇñÑþÐŔŕÿÝ",r="aaaaaaaaaAAAAAAAAAABeeeeeeeeeEEEEEEEiiiiiiiiIIIIIIIIoooooooooOOOOOOOOOuuuuuuuuUUUUUUUUcCnNdDRryY";function n(e){return"string"==typeof e||e instanceof String}function i(e){return n(e)?e.trim():e}function a(e){return e?e.length:0}function s(e){for(var n="",s=a(i(e)),o=0;o<s;o++){var u=e.charAt(o),l=t.indexOf(u);n+=l<0?u:r.charAt(l)}return n.toLowerCase()}this.isstr=n,this.trim=i,this.size=a,this.eq=function(e,t){return s(e)==s(t)},this.indexOf=function(e,t){return e?e.indexOf(t):-1},this.iIndexOf=function(e,t){return s(e).indexOf(s(t))},this.prevIndexOf=function(e,t,r){return e?e.substr(0,r).lastIndexOf(t):-1},this.prefix=function(e,t){return e.startsWith(t)?e:t+e},this.suffix=function(e,t){return e.endsWith(t)?e:e+t},this.trunc=function(e,t){return a(e)>t?e.substr(0,t).trim()+"...":e},this.itrunc=function(t,r){var n=a(t)>r?e.prevIndexOf(t," ",r):-1;return e.trunc(t,n<0?r:n)},this.removeAt=function(e,t,r){return t<0?e:e.substr(0,t)+e.substr(t+r)},this.insertAt=function(e,t,r){return e?e.substr(0,r)+t+e.substr(r):t},this.replaceAt=function(e,t,r,n){return r<0?e:e.substr(0,r)+t+e.substr(r+n)},this.replaceLast=function(e,t,r){return e?e.replaceAt(e.lastIndexOf(t),t.length,r):r},this.wrapAt=function(t,r,n,i,a){return r<0?t:e.insertAt(e.insertAt(t,i,r),a,r+i.length+n)},this.iwrap=function(t,r,n,i){return t&&r&&e.wrapAt(t,e.iIndexOf(t,r),r.length,n||"<u><b>",i||"</b></u>")},this.rand=function(e){return Math.random().toString(36).substr(2,e||8)},this.lopd=function(e){return e?"***"+e.substr(3,4)+"**":e},this.split=function(e,t){return e?e.trim().split(t||","):[]},this.minify=function(e){return e?e.trim().replace(/\s{2}/g,""):e},this.lines=function(t){return e.split(t,/[\n\r]+/)},this.words=function(t){return e.split(t,/\s+/)},this.ilike=function(t,r){return e.iIndexOf(""+t,r)>-1},this.olike=function(t,r,n){return r.some(function(r){return e.ilike(t[r],n)})},this.alike=function(t,r,n){return e.words(n).some(function(n){return e.olike(t,r,n)})},this.ltr=function(e,t){for(var r=[],n=a(e);n>t;n-=t)r.unshift(e.substr(n-t,t));return n>0&&r.unshift(e.substr(0,n)),r},this.rtl=function(e,t){for(var r=[],n=a(e),i=0;i<n;i+=t)r.push(e.substr(i,t));return r},this.slices=function(e,t){var r=0,n=[],i=a(e);for(let a=0;r<i&&a<t.length;a++){let i=t[a];n.push(e.substr(r,i)),r+=i}return r<i&&n.push(e.substr(r)),n}}function ValidatorBox(){const e=this,t={},r={},n="",i=new Date;let a={},s={},o=0;const u=/^\d+$/,l=/\D+/g,c=/^\d+(,\d+)*$/,d=/\w+[^\s@]+@[^\s@]+\.[^\s@]+/,f=/^[\w#@&°!§%;:=\^\/\(\)\?\*\+\~\.\,\-\$]{8,}$/,h=/^(\d{8})([A-Z])$/,g=/^([ABCDEFGHJKLMNPQRSUVW])(\d{7})([0-9A-J])$/,m=/^[XYZ]\d{7,8}[A-Z]$/;function v(e){return e?e.length:0}function p(e){return e?e.trim().replace(/\W+/g,n).toUpperCase():e}function b(e,t,r,n){e.setFullYear(+t,+r-1,+n)}function j(e,t,r,n,i){e.setHours(+t||0,+r||0,+n||0,+i||0)}this.sysdate=function(){return i},this.toISODateString=function(e){return(e||i).toISOString().substring(0,10)},this.size=function(e,t,r){let n=v(e);return t<=n&&n<=r},this.range=function(e,t,r){let n=parseInt(e);return!isNaN(n)&&t<=n&&n<=r},this.close=function(e,t,r){return Math.min(Math.max(e,t),r)},this.regex=function(e,t){try{return e.test(t)}catch(e){}return!1},this.login=function(t,r){return e.regex(f,r)},this.digits=function(t,r){return e.regex(u,r)},this.idlist=function(t,r){return e.regex(c,r)},this.email=function(t,r,n){return e.regex(d,r)&&e.setData(t,r.toLowerCase())},this.date=function(t,r,n){let i=r&&r.split(l);if(i[0]&&i[1]&&i[2]){let r=new Date;return"en"==n.lang?b(r,i[0],i[1],i[2]):b(r,i[2],i[1],i[0]),j(r,i[3],i[4],i[5],i[6]),!isNaN(r.getTime())&&e.setData(t,r)}return!1},this.time=function(t,r,n){let i=r&&r.split(l);if(i[0]&&i[1]){let r=new Date;return j(r,i[0],i[1],i[2],i[3]),!isNaN(r.getTime())&&e.setData(t,r)}return!1},this.integer=function(t,r,i){if(r){str.charAt(0);let r=str.replace(l,n);return!isNaN(r)&&e.setData(t,parseInt(sing+r))}return!1},this.float=function(t,r,i){if(r){let a=r.lastIndexOf(i.decimals),s="-"==r.charAt(0)?"-":n,o=a<0?r:r.substr(0,a),u=a<0?n:"."+r.substr(a+1),c=parseFloat(s+o.replace(l,n)+u);return!isNaN(c)&&e.setData(t,c)}return!1},this.idES=function(t,r){if(r=p(r)){if(e.regex(h,r))return e.dni(t,r);if(e.regex(g,r))return e.cif(t,r);if(e.regex(m,r))return e.nie(t,r)}return!1},this.dni=function(t,r){e.setData(t,r);return"TRWAGMYFPDXBNJZSQVHLCKE".charAt(parseInt(r,10)%23)==r.charAt(8)},this.cif=function(t,r){e.setData(t,r);for(var n=r.match(g),i=n[1],a=n[2],s=n[3],o=0,u=0;u<a.length;u++){var l=parseInt(a[u],10);u%2==0&&(l=(l*=2)<10?l:parseInt(l/10)+l%10),o+=l}var c=0!==(o%=10)?10-o:o,d="JABCDEFGHI".substr(c,1);return i.match(/[ABEH]/)?s==c:i.match(/[KPQS]/)?s==d:s==c||s==d},this.nie=function(t,r){var n=r.charAt(0),i="X"==n?0:"Y"==n?1:"Z"==n?2:n;return e.dni(i+r.substr(1))},this.iban=function(t,r){let i=(r=p(r))&&r.match(/^([A-Z]{2})(\d{2})([A-Z\d]+)$/);if(!i||v(r)!=={AD:24,AE:23,AT:20,AZ:28,BA:20,BE:16,BG:22,BH:22,BR:29,CH:21,CR:21,CY:28,CZ:24,DE:22,DK:18,DO:28,EE:20,ES:24,FI:18,FO:18,FR:27,GB:22,GI:23,GL:18,GR:27,GT:28,HR:21,HU:28,IE:22,IL:23,IS:26,IT:27,JO:30,KW:30,KZ:20,LB:28,LI:21,LT:20,LU:20,LV:21,MC:27,MD:24,ME:22,MK:19,MR:27,MT:31,MU:30,NL:18,NO:15,PK:24,PL:28,PS:29,PT:25,QA:29,RO:24,RS:22,SA:24,SE:24,SI:19,SK:24,SM:27,TN:24,TR:26,AL:28,BY:28,CR:22,EG:29,GE:22,IQ:23,LC:32,SC:31,ST:25,SV:28,TL:23,UA:29,VA:22,VG:24,XK:20}[i[1]])return!1;let a=(i[3]+i[1]+i[2]).replace(/[A-Z]/g,e=>e.charCodeAt(0)-55),s=n,o=a.toString(),u=o.slice(0,2);for(let e=2;e<o.length;e+=7)s=u+o.substring(e,e+7),u=parseInt(s,10)%97;return 1===u&&e.setData(t,r)},this.creditCardNumber=function(t,r){if(16!=v(r=p(r)))return!1;e.setData(t,r);let i=0,a=!1;r=r.trim().replace(/\s+/g,n);for(let e=15;e>=0;e--){let t=+r[e];a&&(t*=2,t-=t>9?9:0),i+=t,a=!a}return i%10==0},this.generatePassword=function(e,t){return t=t||"abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_#@&°!§%;:=^/()?*+~.,-$",Array.apply(null,Array(e||10)).map(function(){return t.charAt(Math.random()*t.length)}).join(n)},this.testPassword=function(e){let t=0;return t+=/[A-Z]+/.test(e)?1:0,t+=/[a-z]+/.test(e)?1:0,t+=/[0-9]+/.test(e)?1:0,t+=/[\W]+/.test(e)?1:0,t+=t>2&&v(e)>8},this.get=function(t){return e[t]},this.set=function(t,r){return e[t]=r,e},this.initMsgs=function(){for(let e in t)delete t[e];return o=0,e},this.getMsgs=function(){return t},this.getMsg=function(e){return t[e]},this.setMsg=function(r,n){return t[r]=n,e},this.getMsgOk=function(){return t.msgOk},this.setMsgOk=function(r){return t.msgOk=r,e},this.getMsgInfo=function(){return t.msgInfo},this.setMsgInfo=function(r){return t.msgInfo=r,e},this.getMsgWarn=function(){return t.msgWarn},this.setMsgWarn=function(r){return t.msgWarn=r,e},this.getMsgError=function(){return t.msgError},this.setError=function(t,r){return o++,e.setMsg(t,r)},this.setMsgError=function(t){return e.setError("msgError",t)},this.getForm=function(e){return r[e]},this.setForm=function(t,n){return r[t]=n,e},this.getFields=function(t){let r=e.getForm(t);return r?Object.keys(r):[]},this.getData=function(e){return e?a[e]:a},this.setData=function(t,r){return a[t]=r,e},this.getInput=function(e){return s[e]},this.setInput=function(t,r){var n;return s[t]=(n=r)?n.trim():n,e},this.getInputs=function(){return s},this.setInputs=function(t){return s=t,e},this.fails=function(){return o>0},this.isValid=function(){return 0==o},this.validate=function(t,r){a={},i.setTime(Date.now());let n=e.initMsgs().getForm(t);for(let e in n){let t=n[e];a[e]=s[e],t(e,s[e],r)}return e.isValid()}}const js=new JsBox,sb=new StringBox,i18n=new MessageBox,valid=new ValidatorBox;valid.set("required",function(e,t,r){return valid.size(t,1,200)||!valid.setError(e,r.errRequired)}).set("min8",function(e,t,r){return valid.size(t,8,200)||!valid.setError(e,r.errMinlength8)}).set("usuario",function(e,t,r){return valid.min8(e,t,r)&&(valid.idES(e,t)||valid.email(e,t)||!valid.setError(e,r.errRegex))}).set("clave",function(e,t,r){return valid.min8(e,t,r)&&(valid.login(e,t)||!valid.setError(e,r.errRegex))}).set("reclave",function(e,t,r,n){return valid.clave(e,t,r)&&(t==n.clave||!valid.setError(e,r.errReclave))}).set("nif",function(e,t,r){return valid.required(e,t,r)&&(valid.idES(e,t)||!valid.setError(e,r.errNif))}).set("correo",function(e,t,r){return valid.required(e,t,r)&&(valid.email(e,t)||!valid.setError(e,r.errCorreo))}).set("ltNow",function(e,t,r){return valid.required(e,t,r)&&(valid.date(e,t,r)||!valid.setError(e,r.errDate))&&(valid.getData(e).getTime()<Date.now()||!valid.setError(e,r.errDateLe))}).set("leToday",function(e,t,r){return valid.required(e,t,r)&&(valid.date(e,t,r)||!valid.setError(e,r.errDate))&&(valid.toISODateString(valid.getData(e))<=valid.toISODateString()||!valid.setError(e,r.errDateLe))}).set("gtNow",function(e,t,r){return valid.required(e,t,r)&&(valid.date(e,t,r)||!valid.setError(e,r.errDate))&&(valid.getData(e).getTime()>Date.now()||!valid.setError(e,r.errDateGe))}).set("geToday",function(e,t,r){return valid.required(e,t,r)&&(valid.date(e,t,r)||!valid.setError(e,r.errDate))&&(valid.toISODateString(valid.getData(e))>=valid.toISODateString()||!valid.setError(e,r.errDateGe))}).set("gt0",function(e,t,r){return valid.required(e,t,r)&&(valid.float(e,t,r)||!valid.setError(e,r.errNumber))&&(valid.getData(e)>0||!valid.setError(e,r.errGt0))}).setForm("/login.html",{usuario:valid.usuario,clave:valid.clave}).setForm("/contact.html",{nombre:valid.required,correo:valid.correo,asunto:valid.required,info:valid.required}).setForm("/signup.html",{token:function(e,t,r){return valid.size(t,200,800)},nombre:valid.required,ap1:valid.required,nif:valid.nif,correo:valid.correo}).setForm("/reactive.html",{token:function(e,t,r){return valid.size(t,200,800)},correo:valid.correo}).setForm("/tests/email.html",{nombre:valid.required,correo:valid.correo,date:function(e,t,r){return!t||valid.ltNow(e,t,r)},number:valid.gt0,asunto:valid.required,info:function(e,t,r){return valid.size(t,1,600)||!valid.setError(e,r.errRequired)}}),js.ready(function(){const e=js.getLang(),t=i18n.setI18n(e).getLang();let r=js.getAll("div.alert"),n=js.getAll(".alert-text"),i=js.getAll(".alert-close");function a(e){js.fadeIn(e.parentNode,"flex")}function s(e,t){e.innerHTML=t,a(e)}function o(e){e&&s(n[0],e)}function u(e){e&&s(n[3],e)}js.each(n,e=>{e.firstChild&&a(e)}),js.click(i,e=>{js.fadeOut(e.parentNode)});let l=document.querySelector(".loading");function c(){js.show(l).closeAlerts(),valid.initMsgs()}function d(){js.fadeOut(l)}js.showAlerts=function(e){var t;return o(e.msgOk),(t=e.msgInfo)&&s(n[1],t),function(e){e&&s(n[2],e)}(e.msgWarn),u(e.msgError),js},js.closeAlerts=function(){return js.hide(r)},js.update=function(e){return js.html(js.getAll(e.update),e.html).showAlerts(e)},js.clean=function(e){return js.closeAlerts().removeClass(e,"input-error").text(js.siblings(e,".msg-error"),"").focus(e)},js.showErrors=function(e,t){return js.showAlerts(t).reverse(e,e=>{let r=e.name&&t[e.name];r&&js.focus(e).addClass(e,"input-error").html(js.siblings(e,".msg-error"),r)})},js.ajax=function(e,t,r){return c(),js.fetch({action:e,resolve:t||o,reject:r||u}).catch(u).finally(d)},js.autocomplete=function(e){function t(e,t,r){return!js.val(e,r).val(js.siblings(e,"[type=hidden]"),t)}let r=!1;return(e=e||{}).action=e.action||"#",e.minLength=e.minLength||3,e.render=e.render||function(){return"-"},e.focus=function(){return!1},e.search=function(e,t){return r},e.select=function(r,n){return t(this,n.item[e.id],e.render(n.item))},e.source=function(t,r){this.element.autocomplete("instance")._renderItem=function(r,n){let i=sb.iwrap(e.render(n),t.term);return $("<li></li>").append("<div>"+i+"</div>").appendTo(r)},js.ajax(e.action+"?term="+t.term,e=>r(e.slice(0,10)))},$(e.inputs).autocomplete(e),js.keydown(e.inputs,(e,t)=>{r=8==t.keyCode||t.keyCode>45&&t.keyCode<224}).change(e.inputs,e=>{e.value||t(e,"","")})},valid.validateForm=function(e){let r=e.elements;return js.clean(r).each(r,e=>{e.name&&valid.setInput(e.name,e.value)}),valid.validate(e.getAttribute("action"),t)||!js.showErrors(r,valid.setMsgError(t.errForm).getMsgs())},valid.submit=function(e,t,r,n){if(t.preventDefault(),valid.validateForm(e)){c();let t=new FormData(e);for(let e in valid.getInputs())t.has(e)||t.append(e,valid.getInput(e));js.fetch({method:e.method,action:r||e.action,body:"multipart/form-data"===e.enctype?t:new URLSearchParams(t),reject:function(t){js.showErrors(e.elements,t)},resolve:n||o}).catch(u).finally(d)}return valid},"undefined"!=typeof grecaptcha&&grecaptcha.ready(function(){js.click(js.getAll(".captcha"),(e,t)=>{grecaptcha.execute("6LeDFNMZAAAAAKssrm7yGbifVaQiy1jwfN8zECZZ",{action:"submit"}).then(r=>valid.setInput("token",r).submit(e.closest("form"),t)).catch(u),t.preventDefault()})}),js.reverse(js.getAll("form"),e=>{let r=e.elements;js.change(js.filter(r,".integer"),e=>{e.value=t.intHelper(e.value)}),js.change(js.filter(r,".float"),e=>{e.value=t.floatHelper(e.value)});let n=js.filter(r,".date");js.keyup(n,e=>{e.value=t.acDate(e.value)}).change(n,e=>{e.value=t.dateHelper(e.value)});let i=js.filter(r,".time");js.keyup(i,e=>{e.value=t.acTime(e.value)}).change(i,e=>{e.value=t.timeHelper(e.value)});let a=js.filter(r,"textarea[maxlength]");function s(t){let r=Math.abs(t.getAttribute("maxlength")-sb.size(t.value));js.text(e.querySelector("#counter-"+t.id),r)}js.keyup(a,s).each(a,s),js.autocomplete({inputs:js.filter(r,".ac-user"),id:"nif",action:"/tests/usuarios.html",render:function(e){return e.nif+" - "+e.nombre}}),js.click(js.filter(r,"[type=reset]"),()=>{e.reset(),js.clean(r).each(a,s)}).click(js.filter(r,"a.duplicate"),(t,n)=>{valid.submit(e,n,t.href,e=>{js.val(js.filter(r,".duplicate"),""),o(e)})}),js.focus(r),e.addEventListener("submit",t=>{e.classList.contains("ajax")?valid.submit(e,t,null,e=>{js.val(r,""),o(e)}):valid.validateForm(e)||t.preventDefault()})})}),$(document).ready(function(){$("ul.menu").each(function(e,t){$(t.children).filter("[parent][parent!='']").each((e,r)=>{let n=$("#"+$(r).attr("parent"),t);n.children().last().is(t.tagName)||n.append('<ul class="sub-menu"></ul>').children("a").append('<b class="nav-tri">&rtrif;</b>'),n.children().last().append(r)}),$(t.children).remove("[parent][parent!='']"),t.querySelectorAll("i").forEach(e=>{e.classList.length<=1&&e.parentNode.removeChild(e)});let r=$("b.nav-tri",t);r.parent().click(function(e){$(this.parentNode).toggleClass("active"),e.preventDefault()}),$("li",t).hover(function(){r.html("&rtrif;"),$(this).children("a").find("b.nav-tri").html("&dtrif;"),$(this).parents("ul.sub-menu").prev().find("b.nav-tri").html("&dtrif;")}),$("[disabled]",t).each(function(){let e=parseInt(this.getAttribute("disabled"))||0;$(this).toggleClass("disabled",3!=(3&e))}).removeAttr("disabled")}).children().fadeIn(200),$(".sidebar-toggle").click(e=>{$("#sidebar").toggleClass("active"),$(".sidebar-icon",this.parentNode).toggleClass("d-none"),e.preventDefault()});let e=$(".menu-toggle").click(t=>{t.preventDefault(),e.toggleClass("d-none"),$("#wrapper").toggleClass("toggled")}),t=js.get("#back-to-top");js.click(t,()=>{js.scrollTop(400)}),window.onscroll=function(){window.pageYOffset>80?js.fadeIn(t):js.fadeOut(t)},document.querySelectorAll('a[href^="#"]').forEach(e=>{e.addEventListener("click",function(e){e.preventDefault();try{document.querySelector(this.href).scrollIntoView({behavior:"smooth"})}catch(e){}})})}),js.ready(function(){let e=document.querySelectorAll("#progressbar li"),t=0;js.click(js.getAll(".next-tab"),r=>(t<e.length-1&&js.addClass(e[++t],"active"),!1)),js.click(js.getAll(".prev-tab"),r=>(t&&js.removeClass(e[t--],"active"),!1)),js.click(js.getAll("a[href^='#tab-']"),r=>{let n=+this.href.substr(this.href.lastIndexOf("-")+1);return 0<=n&&n!=t&&n<e.length&&(e.forEach((e,t)=>{js.toggle(e,"active",t<=n)}),t=n),!1})}),valid.setForm("/tests/email.html",{nombre:valid.required,correo:valid.correo,date:function(e,t,r){return!t||valid.ltNow(e,t,r)},number:valid.gt0,asunto:valid.required,info:function(e,t,r){return valid.size(t,1,600)||!valid.setError(e,r.errRequired)}});