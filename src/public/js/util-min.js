function I18nBox(){const r=this,u="",l="0",c=".",n=",",t=new Date,d=/\D+/g,i=[31,28,31,30,31,30,31,31,30,31,30,31];function a(e){return e.split(d)}function s(e){return e<10?l+e:e}function o(e){var t=e[2];return e[2]=e[0],e[0]=t,e}function f(e,t,r){return Math.min(Math.max(e||0,t),r)}function h(e){return f(e,0,59)}function m(e){return e<100?+(u+parseInt(t.getFullYear()/100)+s(e)):e}function v(e){return null==e}function g(e){var t,r;return e[0]=m(e[0]),e[1]=f(e[1],1,12),e[2]=f(e[2],1,(t=e[0],r=e[1]-1,i[r]+(1==r&&(0==(3&(t=t))&&(t%25!=0||0==(15&t)))))),e}function p(e){return e[0]=f(e[0],0,23),e[1]=h(e[1]),2<e.length&&(e[2]=h(e[2])),e}function j(e,t,r,n,i){return e.setHours(f(t,0,23),h(r),h(n),i||0),isNaN(e.getTime())?null:e}function b(e){if(!e||!e[0])return null;let t=new Date;return t.setFullYear(e[0],e[1]-1,e[2]),j(t,e[3],e[4],e[5],e[6])}function e(e){e=e&&p(a(e));return e?j(new Date,e[0],e[1],e[2],e[3]):null}function y(e,t){for(var r=[],n=e.length;t<n;n-=t)r.unshift(e.substr(n-t,t));return 0<n&&r.unshift(e.substr(0,n)),r}function A(e){if(!e)return null;var t="-"==e.charAt(0)?"-":u,e=parseInt(t+e.replace(d,u));return isNaN(e)?null:e}function E(e,t){if(v(e))return e;let r=""+e;var n="-"==r.charAt(0)?"-":u,e=r.replace(d,u);return isNaN(e)?r:n+y(e,3).join(t)}function x(e,t){if(!e)return null;var r=e.lastIndexOf(t),t="-"==e.charAt(0)?"-":u;let n=r<0?e:e.substr(0,r);r=r<0?u:c+e.substr(r+1),r=parseFloat(t+n.replace(d,u)+r);return isNaN(r)?null:r}function I(e,t,r,n){if(v(e))return e;n=isNaN(n)?2:n;let i=""+e;var a=i.lastIndexOf(c),s="-"==i.charAt(0)?"-":u,e=(a<0?i:i.substr(0,a)).replace(d,u).replace(/^0+(\d+)/,"$1");let o=a<0?l:i.substr(a+1,n);return s+y(e,3).join(t)+r+(a<0?l.repeat(n):o.padEnd(n,l))}const k={en:{errForm:"Form validation failed",errRequired:"Required field!",errMinlength8:"The minimum required length is 8 characters",errMaxlength:"Max length exceded",errNif:"Wrong ID format",errCorreo:"Wrong Mail format",errDate:"Wrong date format",errDateLe:"Date must be less or equals than current",errDateGe:"Date must be greater or equals than current",errNumber:"Wrong number format",errGt0:"Price must be great than 0.00 &euro;",errRegex:"Wrong format",errReclave:"Passwords typed do not match",errRange:"Value out of allowed range",remove:"Are you sure to delete element?",removeOk:"Element removed successfully!",cancel:"Are you sure to cancel element?",cancelOk:"Element canceled successfully!",unlink:"Are you sure to unlink those elements?",unlinkOk:"Elements unlinked successfully!",linkOk:"Elements linked successfully!",closeText:"close",prevText:"prev",nextText:"next",currentText:"current",monthNames:["January","February","March","April","May","June","July","August","September","October","November","December"],monthNamesShort:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],dayNames:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],dayNamesShort:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],dayNamesMin:["Su","Mo","Tu","We","Th","Fr","Sa"],dateFormat:"yy-mm-dd",firstDay:0,toInt:A,toTime:e,fmtInt:function(e){return E(e,n)},toFloat:function(e){return x(e,c)},fmtFloat:function(e,t){return I(e,n,c,t)},isoFloat:function(e,t){return this.fmtFloat(this.toFloat(e),t)},toDate:function(e){return e?b(g(a(e))):null},acDate:function(e){return e&&e.replace(/^(\d{4})(\d+)$/g,"$1-$2").replace(/^(\d{4}\-\d\d)(\d+)$/g,"$1-$2").replace(/[^\d\-]/g,u)},acTime:function(e){return e&&e.replace(/(\d\d)(\d+)$/g,"$1:$2").replace(/[^\d\:]/g,u)},isoDate:function(e){return e&&g(a(e)).map(s).join("-")},isoTime:function(e){return e&&p(a(e)).map(s).join(":")},get:function(e,t){return e[t+"_en"]||e[t]}},es:{errForm:"Error al validar los campos del formulario",errRequired:"Campo obligatorio!",errMinlength8:"La longitud mínima requerida es de 8 caracteres",errMaxlength:"Longitud máxima excedida",errNif:"Formato de NIF / CIF incorrecto",errCorreo:"Formato de E-Mail incorrecto",errDate:"Formato de fecha incorrecto",errDateLe:"La fecha debe ser menor o igual a la actual",errDateGe:"La fecha debe ser mayor o igual a la actual",errNumber:"Valor no numérico",errGt0:"El importe debe ser mayor de 0,00 &euro;",errRegex:"Formato incorrecto",errReclave:"Las claves introducidas no coinciden",errRange:"Valor fuera del rango permitido",remove:"¿Confirma que desea eliminar este registro?",removeOk:"Registro eliminado correctamente.",cancel:"¿Confirma que desea cancelar este registro?",cancelOk:"Elemento cancelado correctamente.",unlink:"¿Confirma que desea desasociar estos registros?",unlinkOk:"Registros desasociados correctamente",linkOk:"Registros asociados correctamente.",closeText:"close",prevText:"prev.",nextText:"sig.",currentText:"current",monthNames:["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"],monthNamesShort:["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"],dayNames:["Domingo","Lunes","Martes","Miércoles","Jueves","Viernes","Sábado"],dayNamesShort:["Dom","Lun","Mar","Mié","Juv","Vie","Sáb"],dayNamesMin:["Do","Lu","Ma","Mi","Ju","Vi","Sa"],dateFormat:"dd/mm/yy",firstDay:1,toInt:A,toTime:e,fmtInt:function(e){return E(e,c)},toFloat:function(e){return x(e,n)},fmtFloat:function(e,t){return I(e,c,n,t)},isoFloat:function(e,t){return this.fmtFloat(this.toFloat(e),t)},toDate:function(e){return e?b(g(o(a(e)))):null},acDate:function(e){return e&&e.replace(/^(\d\d)(\d+)$/g,"$1/$2").replace(/^(\d\d\/\d\d)(\d+)$/g,"$1/$2").replace(/[^\d\/]/g,u)},acTime:function(e){return e&&e.replace(/(\d\d)(\d+)$/g,"$1:$2").replace(/[^\d\:]/g,u)},isoDate:function(e){return e&&o(g(o(a(e))).map(s)).join("/")},isoTime:function(e){return e&&p(a(e)).map(s).join(":")},get:function(e,t){return e[t]}}};let M=k.es;this.getLang=function(e){return e?k[e]:M},this.setLang=function(e,t){return k[e]=t,r},this.addLang=function(e,t){return Object.assign(k[e],t),r},this.getI18n=function(e){return e&&(k[e]||k[e.substr(0,2)])||k.es},this.setI18n=function(e){return M=r.getI18n(e),r},this.get=function(e){return M[e]},this.set=function(e,t){return M[e]=t,r},this.sysdate=function(){return t}}function JsBox(){const a=this;function e(e){console.log("Log:",e)}function s(e){return e?e.length:0}function o(e){return e&&1===e.nodeType}function u(e){return e?e.split(" "):[]}function l(e,t){return o(e)&&e.matches(t)}function i(e,t,r){e.matches(t)&&r.push(e)}function n(t,r,n){for(let e=t.previousElementSibling;e;e=e.previousElementSibling)i(e,r,n)}function c(t,r,n){for(let e=t.nextElementSibling;e;e=e.nextElementSibling)i(e,r,n)}function d(e,t,r){n(e,t,r),c(e,t,r)}function f(t,r){for(let e=t.previousElementSibling;e;e=e.previousElementSibling)r.push(e)}function h(t,r){for(let e=t.nextElementSibling;e;e=e.nextElementSibling)r.push(e)}function m(e,t){f(e,t),h(e,t)}this.getLang=function(){return document.querySelector("html").getAttribute("lang")||navigator.language||navigator.userLanguage},this.buildPath=function(e,t){t=t||window.location.pathname;let r=new URLSearchParams(e),n=new URLSearchParams(window.location.search);return r.forEach((e,t)=>n.set(t,e)),t+"?"+n.toString()},this.scrollTop=function(e){e=e||600;let t=-window.scrollY/(e/15),r=setInterval(()=>{0<window.scrollY?window.scrollBy(0,t):clearInterval(r)},15);return a},this.fetch=function(n){return(n=n||{}).headers=n.headers||{},n.reject=n.reject||e,n.resolve=n.resolve||e,n.headers["x-requested-with"]="XMLHttpRequest",fetch(n.action,n).then(e=>{let t=e.headers.get("content-type")||"",r=-1<t.indexOf("application/json")?e.json():e.text();return r.then(e.ok?n.resolve:n.reject)})},this.mask=function(e,r){return a.each(e,(e,t)=>{0==(r>>t&1)?a.addClass(e,"hide"):a.removeClass(e,"hide")})},this.select=function(e,t){a.mask(e.querySelectorAll("option"),t);t=e.querySelector("option[value='"+e.value+"']");return a.hasClass(t,"hide")&&(t=a.find(e.children,"option:not(.hide)"),e.value=t?t.value:null),a},this.each=function(t,r){var n=s(t);for(let e=0;e<n;e++)r(t[e],e);return a},this.reverse=function(t,r){for(let e=s(t)-1;-1<e;e--)r(t[e],e);return a},this.matches=function(e,t){return t&&l(e,t)},this.find=function(t,r){if(r){if(l(t,r))return t;var n=s(t);for(let e=0;e<n;e++){var i=t[e];if(l(i,r))return i}}return null},this.filter=function(e,t){let r=[];return t&&a.each(e,e=>i(e,t,r)),r},this.get=function(e,t){return t=t||document,(e=e)&&t.querySelector(e)},this.getAll=function(e,t){return t=t||document,(e=e)&&t.querySelectorAll(e)},this.prev=function(e,t){let r=[];return o(e)?t?n(e,t,r):f(e,r):t?a.each(e,e=>n(e,t,r)):a.each(e,e=>f(e,r)),r},this.next=function(e,t){let r=[];return o(e)?t?c(e,t,r):h(e,r):t?a.each(e,e=>c(e,t,r)):a.each(e,e=>h(e,r)),r},this.siblings=function(e,t){let r=[];return o(e)?t?d(e,t,r):m(e,r):t?a.each(e,e=>d(e,t,r)):a.each(e,e=>m(e,r)),r},this.focus=function(e){const t=a.find(e,"[tabindex]:not([type=hidden][readonly][disabled]):not([tabindex='-1'][tabindex=''])");return t&&t.focus(),a},this.val=function(e,r){let n=s(e)?e[0]:e;if("SELECT"!==n.tagName)return o(e)?e.value=r:a.each(e,e=>{e.value=r}),a;{r=r||n.getAttribute("value");let t=Array.from(n.options).findIndex(e=>e.value==r);return a.each(e,e=>{e.selectedIndex=t})}},this.text=function(e,t){return o(e)?e.innerText=t:a.each(e,e=>{e.innerText=t}),a},this.html=function(e,t){return o(e)?e.innerHTML=t:a.each(e,e=>{e.innerHTML=t}),a},this.isVisible=function(e){return!!(e.offsetWidth||e.offsetHeight||e.getClientRects().length)},this.show=function(e,t){return t=t||"block",o(e)?e.style.display=t:a.each(e,e=>{e.style.display=t}),a},this.hide=function(e){return o(e)?e.style.display="none":a.each(e,e=>{e.style.display="none"}),a},this.hasClass=function(e,t){let r=s(e)?e[0]:e;return r&&r.classList.contains(t)},this.setClass=function(e,t){function r(e){e.className=t}return o(e)?r(e):a.each(e,r),a},this.addClass=function(e,t){let r=u(t);function n(t){r.forEach(e=>t.classList.add(e))}return o(e)?n(e):a.each(e,n),a},this.removeClass=function(e,t){let r=u(t);function n(t){r.forEach(e=>t.classList.remove(e))}return o(e)?n(e):a.each(e,n),a},this.toggle=function(e,t,r){let n=u(t);function i(t){n.forEach(e=>t.classList.toggle(e))}return o(e)?i(e):a.each(e,i),a};function r(t,e,r){return t.addEventListener(e,e=>r(t,e)),a}this.fadeOut=function(e){function t(t){let r=parseFloat(t.style.opacity)||0;!function e(){(r-=.03)<0?t.style.display="none":requestAnimationFrame(e),t.style.opacity=r}()}return o(e)?t(e):a.each(e,t),a},this.fadeIn=function(e,n){function t(t){t.style.display=n||"block";let r=parseFloat(t.style.opacity)||0;!function e(){(r+=.03)<1&&requestAnimationFrame(e),t.style.opacity=r}()}return o(e)?t(e):a.each(e,t),a},this.fadeToggle=function(e,t){var r=s(e)?e[0]:e;return(parseFloat(r&&r.style.opacity)||0)<.03?a.fadeIn(e,t):a.fadeOut(e)},this.ready=function(e){return r(document,"DOMContentLoaded",e)},this.click=function(e,t){return o(e)?r(e,"click",t):a.each(e,e=>r(e,"click",t))},this.change=function(e,t){return o(e)?r(e,"change",t):a.each(e,e=>r(e,"change",t))},this.keyup=function(e,t){return o(e)?r(e,"keyup",t):a.each(e,e=>r(e,"keyup",t))},this.keydown=function(e,t){return o(e)?r(e,"keydown",t):a.each(e,e=>r(e,"keydown",t))}}function StringBox(){const a=this;function t(e){return"string"==typeof e||e instanceof String}function s(e){return t(e)?e.trim():e}function o(e){return e?e.length:0}function r(e){for(var t="",r=o(s(e)),n=0;n<r;n++){var i=e.charAt(n),a="àáâãäåāăąÀÁÂÃÄÅĀĂĄÆßèéêëēĕėęěÈÉĒĔĖĘĚìíîïìĩīĭÌÍÎÏÌĨĪĬòóôõöōŏőøÒÓÔÕÖŌŎŐØùúûüũūŭůÙÚÛÜŨŪŬŮçÇñÑþÐŔŕÿÝ".indexOf(i);t+=a<0?i:"aaaaaaaaaAAAAAAAAAABeeeeeeeeeEEEEEEEiiiiiiiiIIIIIIIIoooooooooOOOOOOOOOuuuuuuuuUUUUUUUUcCnNdDRryY".charAt(a)}return t.toLowerCase()}this.isstr=t,this.trim=s,this.size=o,this.eq=function(e,t){return r(e)==r(t)},this.iiOf=function(e,t){return r(e).indexOf(r(t))},this.indexOf=function(e,t){return e?e.indexOf(t):-1},this.lastIndexOf=function(e,t){return e?e.lastIndexOf(t):-1},this.prevIndexOf=function(e,t,r){return e?e.substr(0,r).lastIndexOf(t):-1},this.starts=function(e,t){return e&&e.startsWith(t)},this.ends=function(e,t){return e&&e.endsWith(t)},this.prefix=function(e,t){return a.starts(e,t)?e:t+e},this.suffix=function(e,t){return a.ends(e,t)?e:e+t},this.trunc=function(e,t){return o(e)>t?e.substr(0,t).trim()+"...":e},this.itrunc=function(e,t){var r=o(e)>t?a.prevIndexOf(e," ",t):-1;return a.trunc(e,r<0?t:r)},this.removeAt=function(e,t,r){return t<0?e:e.substr(0,t)+e.substr(t+r)},this.insertAt=function(e,t,r){return e?e.substr(0,r)+t+e.substr(r):t},this.replaceAt=function(e,t,r,n){return r<0?e:e.substr(0,r)+t+e.substr(r+n)},this.replaceLast=function(e,t,r){return e?e.replaceAt(e.lastIndexOf(t),t.length,r):r},this.wrapAt=function(e,t,r,n,i){return t<0?e:a.insertAt(a.insertAt(e,n,t),i,t+n.length+r)},this.iwrap=function(e,t,r,n){return t&&a.wrapAt(e,a.iiOf(e,t),t.length,r||"<u><b>",n||"</b></u>")},this.rand=function(e){return Math.random().toString(36).substr(2,e||8)},this.lopd=function(e){return e&&"***"+e.substr(3,4)+"**"},this.split=function(e,t){return e?e.trim().split(t||","):[]},this.minify=function(e){return e&&e.trim().replace(/\s{2}/g,"")},this.lines=function(e){return a.split(e,/[\n\r]+/)},this.words=function(e){return a.split(e,/\s+/)},this.ilike=function(e,t){return-1<a.iiOf(e,t)},this.olike=function(t,e,r){return e.some(function(e){return a.ilike(t[e],r)})},this.alike=function(t,r,e){return a.words(e).some(function(e){return a.olike(t,r,e)})},this.between=function(e,t,r){return r=r??e,(t=t??e)<=e&&e<=r},this.ltr=function(e,t){for(var r=[],n=o(e);t<n;n-=t)r.unshift(e.substr(n-t,t));return 0<n&&r.unshift(e.substr(0,n)),r},this.rtl=function(e,t){for(var r=[],n=o(e),i=0;i<n;i+=t)r.push(e.substr(i,t));return r},this.slices=function(t,r){var n=0,i=[],a=o(t);for(let e=0;n<a&&e<r.length;e++){var s=r[e];i.push(t.substr(n,s)),n+=s}return n<a&&i.push(t.substr(n)),i}}function ValidatorBox(){const n=this,r={},i={},s="",a=new Date;let o={},u={},l={},c=0;const t=/^\d+$/,d=/^\d+(,\d+)*$/,f=/\w+[^\s@]+@[^\s@]+\.[^\s@]+/,h=/^[\w#@&°!§%;:=\^\/\(\)\?\*\+\~\.\,\-\$]{8,}$/;const m=/^(\d{8})([A-Z])$/,v=/^([ABCDEFGHJKLMNPQRSUVW])(\d{7})([0-9A-J])$/,g=/^[XYZ]\d{7,8}[A-Z]$/;function p(e){return e?e.length:0}function j(e){return e&&e.trim().replace(/\W+/g,s).toUpperCase()}function b(e,t,r){return t<=e&&e<=r}this.size=function(e,t,r){return b(p(e),t,r)},this.range=function(e,t,r){return b(parseFloat(e),t,r)},this.regex=function(e,t){try{return t&&e.test(t)}catch(e){}return!1},this.login=function(e){return n.regex(h,e)?e:null},this.digits=function(e){return n.regex(t,e)?e:null},this.idlist=function(e){return n.regex(d,e)?e:null},this.email=function(e){return n.regex(f,e)?e.toLowerCase():null},this.sysdate=function(){return a},this.toISODateString=function(e){return(e||a).toISOString().substring(0,10)},this.isset=function(e,t,r){return null!=t?t:n.addError(e,r)},this.close=function(e,t,r){return Math.min(Math.max(+e,t),r)},this.idES=function(e){if(e=j(e)){if(n.regex(m,e))return n.dni(e);if(n.regex(v,e))return n.cif(e);if(n.regex(g,e))return n.nie(e)}return null},this.dni=function(e){return"TRWAGMYFPDXBNJZSQVHLCKE".charAt(parseInt(e,10)%23)==e.charAt(8)?e:null},this.cif=function(e){for(var t=e.match(v),r=t[1],n=t[2],i=t[3],a=0,s=0;s<n.length;s++){var o=parseInt(n[s],10);a+=o=s%2==0?(o*=2)<10?o:parseInt(o/10)+o%10:o}var u=0!==(a%=10)?10-a:a,t="JABCDEFGHI".substr(u,1);return(r.match(/[ABEH]/)?i==u:!r.match(/[KPQS]/)&&i==u||i==t)?e:null},this.nie=function(e){var t=e.charAt(0),t="X"==t?0:"Y"==t?1:"Z"==t?2:t;return n.dni(t+e.substr(1))},this.iban=function(e){var t=(e=j(e))&&e.match(/^([A-Z]{2})(\d{2})([A-Z\d]+)$/);if(!t||p(e)!=={AD:24,AE:23,AT:20,AZ:28,BA:20,BE:16,BG:22,BH:22,BR:29,CH:21,CR:22,CY:28,CZ:24,DE:22,DK:18,DO:28,EE:20,ES:24,FI:18,FO:18,FR:27,GB:22,GI:23,GL:18,GR:27,GT:28,HR:21,HU:28,IE:22,IL:23,IS:26,IT:27,JO:30,KW:30,KZ:20,LB:28,LI:21,LT:20,LU:20,LV:21,MC:27,MD:24,ME:22,MK:19,MR:27,MT:31,MU:30,NL:18,NO:15,PK:24,PL:28,PS:29,PT:25,QA:29,RO:24,RS:22,SA:24,SE:24,SI:19,SK:24,SM:27,TN:24,TR:26,AL:28,BY:28,EG:29,GE:22,IQ:23,LC:32,SC:31,ST:25,SV:28,TL:23,UA:29,VA:22,VG:24,XK:20}[t[1]])return null;let r=(t[3]+t[1]+t[2]).replace(/[A-Z]/g,e=>e.charCodeAt(0)-55);var n;s;let i=r.toString(),a=i.slice(0,2);for(let e=2;e<i.length;e+=7)n=a+i.substring(e,e+7),a=parseInt(n,10)%97;return 1===a?e:null},this.creditCardNumber=function(r){if(16!=p(r=j(r)))return null;let n=0,i=!1;for(let t=15;0<=t;t--){let e=+r[t];i&&(e*=2,e-=9<e?9:0),n+=e,i=!i}return n%10==0?r:null},this.generatePassword=function(e,t){return t=t||"abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_#@&°!§%;:=^/()?*+~.,-$",Array.apply(null,Array(e||10)).map(function(){return t.charAt(Math.random()*t.length)}).join(s)},this.testPassword=function(e){var t=0;return t+=/[A-Z]+/.test(e)?1:0,t+=/[a-z]+/.test(e)?1:0,t+=/[0-9]+/.test(e)?1:0,t+=/[\W]+/.test(e)?1:0,t+=2<t&&8<p(e)},this.get=function(e){return n[e]},this.set=function(e,t){return n[e]=t,n},this.getI18n=function(){return o},this.setI18n=function(e){return o=e||o,n},this.clear=function(e){for(var t in e)delete e[t];return n},this.initMsgs=function(){return c=0,n.clear(r)},this.getMsgs=function(){return r},this.getMsg=function(e){return r[e]},this.setMsg=function(e,t){return r[e]=t,n},this.getMsgOk=function(){return r.msgOk},this.setMsgOk=function(e){return r.msgOk=e,n},this.getMsgInfo=function(){return r.msgInfo},this.setMsgInfo=function(e){return r.msgInfo=e,n},this.getMsgWarn=function(){return r.msgWarn},this.setMsgWarn=function(e){return r.msgWarn=e,n},this.getMsgError=function(){return r.msgError},this.setError=function(e,t){return c++,n.setMsg(e,t)},this.addError=function(e,t){return n.setError(e,t),null},this.setMsgError=function(e){return n.setError("msgError",e)},this.getForm=function(e){return i[e]},this.setForm=function(e,t){return i[e]=t,n},this.getFields=function(e){e=n.getForm(e);return e?Object.keys(e):[]},this.getData=function(e){return e?u[e]:u},this.setData=function(e,t){return u[e]=t,n},this.getInput=function(e){return l[e]},this.setInput=function(e,t){return l[e]=(t=t)&&t.trim(),n},this.getInputs=function(){return l},this.setInputs=function(e){return l=e,n},this.init=function(e,t){return n.setInputs(e).setI18n(t)},this.fails=function(){return 0<c},this.isValid=function(){return 0==c},this.validate=function(e){u={},a.setTime(Date.now());var t,r=n.initMsgs().getForm(e);for(t in r){let e=r[t];u[t]=e(t,l[t],o)}return r&&n.isValid()}}const js=new JsBox,sb=new StringBox,i18n=new I18nBox,valid=new ValidatorBox;valid.set("required",function(e,t,r){return valid.size(t,1,200)?t:valid.addError(e,r.errRequired)}).set("required50",function(e,t,r){return valid.size(t,1,50)?t:valid.addError(e,r.errRequired)}).set("required800",function(e,t,r){return valid.size(t,1,800)?t:valid.addError(e,r.errRequired)}).set("min8",function(e,t,r){return valid.size(t,8,200)?t:valid.addError(e,r.errMinlength8)}).set("max50",function(e,t,r){return valid.size(t,0,50)?t:valid.addError(e,r.errMaxlength)}).set("max200",function(e,t,r){return valid.size(t,0,200)?t:valid.addError(e,r.errMaxlength)}).set("max800",function(e,t,r){return valid.size(t,0,800)?t:valid.addError(e,r.errMaxlength)}).set("token",function(e,t,r){return valid.size(t,200,800)?t:valid.addError(e,r.errRegex)}).set("usuario",function(e,t,r){return valid.min8(e,t,r)&&(valid.idES(t)||valid.email(t)||valid.addError(e,r.errRegex))}).set("clave",function(e,t,r){return valid.min8(e,t,r)&&(valid.login(t)||valid.addError(e,r.errRegex))}).set("reclave",function(e,t,r){return valid.clave(e,t,r)&&(t==valid.getData("clave")?t:valid.addError(e,r.errReclave))}).set("nif",function(e,t,r){return valid.required(e,t,r)&&(valid.idES(t)||valid.addError(e,r.errNif))}).set("correo",function(e,t,r){return valid.required(e,t,r)&&(valid.email(t)||valid.addError(e,r.errCorreo))}).set("dateval",function(e,t,r){return r.toDate(t)||valid.addError(e,r.errDate)}).set("datenull",function(e,t,r){return r.toDate(t)}).set("ltNow",function(e,t,r){let n=valid.required(e,t,r)&&valid.dateval(e,t,r);return n&&n.getTime()<Date.now()?n:valid.addError(e,r.errDateLe)}).set("leToday",function(e,t,r){t=valid.required(e,t,r)&&valid.dateval(e,t,r);return t&&valid.toISODateString(t)<=valid.toISODateString()?t:valid.addError(e,r.errDateLe)}).set("gtNow",function(e,t,r){let n=valid.required(e,t,r)&&valid.dateval(e,t,r);return n&&n.getTime()>Date.now()?n:valid.addError(e,r.errDateGe)}).set("geToday",function(e,t,r){t=valid.required(e,t,r)&&valid.dateval(e,t,r);return t&&valid.toISODateString(t)>=valid.toISODateString()?t:valid.addError(e,r.errDateGe)}).set("intval",function(e,t,r){return valid.isset(e,r.toInt(t),r.errNumber)}).set("intnull",function(e,t,r){return r.toInt(t)}).set("floatval",function(e,t,r){return valid.isset(e,r.toFloat(t),r.errNumber)}).set("floatnull",function(e,t,r){return r.toFloat(t)}).set("key",function(e,t,r){t=r.toInt(t);return null===t||0<t?t:valid.addError(e,r.errGt0)}).set("gt0",function(e,t,r){t=valid.required(e,t,r)&&valid.floatval(e,t,r);return 0<t?t:valid.addError(e,r.errGt0)}),js.ready(function(){var e=js.getLang();const s=i18n.setI18n(e).getLang();valid.setI18n(s),$.datepicker.regional.es=i18n.getI18n("es"),$.datepicker.setDefaults(i18n.getLang());let t=js.getAll("div.alert"),r=js.getAll(".alert-text");e=js.getAll(".alert-close");function n(e){js.fadeIn(e.parentNode,"grid")}function i(e,t){e.innerHTML=t,n(e)}function o(e){e&&i(r[0],e)}function a(e){e&&i(r[3],e)}js.each(r,e=>{e.firstChild&&n(e)}),js.click(e,e=>{js.fadeOut(e.parentNode)});let u=document.querySelector(".loading");function l(){js.show(u).closeAlerts(),valid.initMsgs()}function c(){js.fadeOut(u)}const d="input-error",f=".msg-error";js.showOk=function(e){return o(e),js},js.showError=function(e){return a(e),js},js.showAlerts=function(e){var t;return(t=e.msgInfo)&&i(r[1],t),(t=e.msgWarn)&&i(r[2],t),js.showOk(e.msgOk).showError(e.msgError)},js.closeAlerts=function(){return js.hide(t)},js.clean=function(e){return js.closeAlerts().removeClass(e,d).text(js.siblings(e,f),"").focus(e)},js.showErrors=function(e,r){return js.showAlerts(r).reverse(e,e=>{var t=e.name&&r[e.name];t&&js.focus(e).addClass(e,d).html(js.siblings(e,f),t)})},js.ajax=function(e,t,r){return l(),js.fetch({action:e,resolve:t||o,reject:r||a}).catch(a).finally(c)},js.autocomplete=function(n){let r=!1;function e(){return!1}function i(e){return js.siblings(e,"[type=hidden]")}return(n=n||{}).action=n.action||"#",n.minLength=n.minLength||3,n.delay=n.delay||500,n.open=n.open||e,n.focus=n.focus||e,n.load=n.load||e,n.remove=n.remove||e,n.render=n.render||function(){return"-"},n.search=function(e,t){return r},n.select=function(e,t){return n.load(t.item,this,i(this)),!1},n.source=function(r,t){this.element.autocomplete("instance")._renderItem=function(e,t){t=sb.iwrap(n.render(t),r.term);return $("<li>").append("<div>"+t+"</div>").appendTo(e)},js.ajax(n.action+"?term="+r.term,e=>t(e.slice(0,10)))},n.change=function(e,t){t.item||(js.val(this,"").val(i(this),""),n.remove(this))},$(n.inputs).autocomplete(n),js.keydown(n.inputs,(e,t)=>{r=8==t.keyCode||sb.between(t.keyCode,46,111)||sb.between(t.keyCode,160,223)})},valid.validateForm=function(e){var t=e.elements;return js.clean(t).each(t,e=>{e.name&&valid.setInput(e.name,e.value)}),valid.validate(e.getAttribute("action"))||!js.showErrors(t,valid.setMsgError(s.errForm).getMsgs())},valid.submit=function(t,e,r,n){if(e.preventDefault(),valid.validateForm(t)){l();let e=new FormData(t);for(var i in valid.getInputs())e.has(i)||e.append(i,valid.getInput(i));js.fetch({method:t.method,action:r||t.action,body:"multipart/form-data"===t.enctype?e:new URLSearchParams(e),reject:function(e){js.showErrors(t.elements,e)},resolve:n||o}).catch(a).finally(c)}return valid},"undefined"!=typeof grecaptcha&&grecaptcha.ready(function(){js.click(js.getAll(".captcha"),(t,r)=>{grecaptcha.execute("6LeDFNMZAAAAAKssrm7yGbifVaQiy1jwfN8zECZZ",{action:"submit"}).then(e=>valid.setInput("token",e).submit(t.closest("form"),r)).catch(a),r.preventDefault()})}),js.reverse(js.getAll("form"),r=>{let n=r.elements;js.change(js.filter(n,".integer"),e=>{e.value=s.isoInt(e.value)}),js.change(js.filter(n,".float"),e=>{e.value=s.isoFloat(e.value)});var e=js.filter(n,".date");js.keyup(e,e=>{e.value=s.acDate(e.value)}).change(e,e=>{e.value=s.isoDate(e.value)});e=js.filter(n,".time");js.keyup(e,e=>{e.value=s.acTime(e.value)}).change(e,e=>{e.value=s.isoTime(e.value)}),$(n).filter(".datepicker").datepicker({dateFormat:i18n.get("dateFormat"),changeMonth:!1});let t=js.filter(n,"textarea[maxlength]");function i(e){var t=Math.abs(e.getAttribute("maxlength")-sb.size(e.value));js.text(r.querySelector("#counter-"+e.id),t)}function a(e,t){return!js.setClass(js.next(e,"i"),t)}js.keyup(t,i).each(t,i),js.autocomplete({inputs:js.filter(n,".ac-user"),action:"/user/find.html",render:function(e){return e.nif+" - "+(e.nombre+" "+e.ap1+" "+e.ap2).trim()},load:function(e,t,r){js.val(t,this.render(e)).val(r,e.nif)}}).autocomplete({inputs:js.filter(n,".ac-menu"),action:"/menu/find.html",focus:function(e,t){return a(this,"input-item input-icon "+(t.item&&t.item.icon||"fas fa-arrow-alt-circle-up"))},remove:function(e){a(e,"input-item input-icon fas fa-arrow-alt-circle-up")},render:function(e){return(e.icon?'<i class="'+e.icon+'"></i> - ':"")+s.get(e,"nombre")},load:function(e,t,r){js.val(t,s.get(e,"nombre")).val(r,e._id)}}),js.click(js.filter(n,"[type=reset]"),()=>{r.reset(),js.clean(n).each(t,i)}).click(js.filter(n,".clear-all"),()=>{js.val(n,"").clean(n).each(t,i)}).click(js.getAll("a.duplicate",r),(e,t)=>{valid.submit(r,t,e.href,e=>{js.val(js.filter(n,"[name='_id'],.dup-clear"),""),o(e)})}),js.focus(n),r.addEventListener("submit",e=>{r.classList.contains("ajax")?valid.submit(r,e,null,e=>{js.val(n,""),o(e)}):valid.validateForm(r)||e.preventDefault()})})}),js.ready(function(){const s=i18n.getLang();js.getAll("table").forEach(r=>{let n=js.getAll("a.sort",r.thead),i=r.tBodies[0];function a(e,t){confirm(s.remove)&&js.ajax(e.href,e=>{let t=js.get("#rows",r.tfoot);t&&(t.innerText=isNaN(t.innerText)?0:+t.innerText-1),i.innerHTML=e,js.showOk(s.msgOk)},js.showAlerts),t.preventDefault()}js.click(n,(e,t)=>{t.preventDefault();t=js.hasClass(e,"asc")?"desc":"asc";js.removeClass(n,"asc desc"),js.addClass(e,t),js.ajax(e.href+"&dir="+t,e=>{js.html(i,e).click(js.getAll("a.remove-row",i),a)},js.showAlerts)}),js.click(js.getAll("a.remove-row",i),a)}),js.click(js.getAll("a.remove"),(e,t)=>{confirm(s.remove)||t.preventDefault()}),js.getAll(".pagination").forEach(e=>{e=js.getAll("select",e);js.val(e).change(e,e=>{window.location.href="?page=0&size="+e.value})})}),js.ready(function(){js.getAll("ul.menu").forEach(function(t){let e=Array.from(t.children);e.sort((e,t)=>+e.dataset.orden-+t.dataset.orden),e.forEach(r=>{t.appendChild(r);var e=r.dataset.mask;8==(8&e)&&(r.innerHTML+='<ul class="sub-menu"></ul>',r.firstElementChild.innerHTML+='<b class="nav-tri">&rtrif;</b>',js.click(r.firstElementChild,(e,t)=>{js.toggle(r,"active"),t.preventDefault()})),0==(4&e)&&js.addClass(r.firstElementChild,"disabled")});for(let e=0;e<t.children.length;){var r=t.children[e],n=r.dataset.padre;if(n){let e=js.get("li[id='"+n+"']",t);e&&e.lastElementChild.appendChild(r)}else e++}js.fadeIn(t.children)}),js.click(js.getAll(".sidebar-toggle"),(e,t)=>{js.toggle(js.getAll(".sidebar-icon",e.parentNode),"hide"),js.toggle(js.get("#sidebar",e.parentNode),"active"),t.preventDefault()});let e=js.get("#back-to-top");js.click(e,()=>{js.scrollTop(400)}),window.onscroll=function(){80<window.pageYOffset?js.fadeIn(e):js.fadeOut(e)},window.addEventListener("unload",function(e){js.ajax("/session/destroy.html")})}),js.ready(function(){let e=document.querySelectorAll("ul#tab-nav li"),t=document.querySelectorAll(".tab-contents"),r=document.querySelectorAll("ul#progressbar li"),n=0;function i(){return js.removeClass(e,"active").addClass(e[n],"active"),!js.removeClass(t,"active").addClass(t[n],"active")}js.click(js.getAll(".next-tab"),()=>(n<r.length-1&&js.addClass(r[++n],"active"),i())),js.click(js.getAll(".prev-tab"),()=>(n&&js.removeClass(r[n--],"active"),i()));var a=js.getAll("a[href^='#']");js.click(js.filter(a,"[href^='#tab-']"),e=>(n=+e.href.substr(e.href.lastIndexOf("-")+1)-1,r.forEach((e,t)=>{js.toggle(e,"active",t<=n)}),i())),js.click(js.filter(a,":not([href^='#tab-'])"),function(t,e){try{let e=document.querySelector(t.getAttribute("href"));e&&e.scrollIntoView({behavior:"smooth"})}catch(e){}e.preventDefault()})}),valid.setForm("/login.html",{usuario:valid.usuario,clave:valid.clave}).setForm("/contact.html",{nombre:valid.required,correo:valid.correo,asunto:valid.required,info:valid.required}).setForm("/signup.html",{token:valid.token,nombre:valid.required,ap1:valid.required,nif:valid.nif,correo:valid.correo}).setForm("/reactive.html",{token:valid.token,correo:valid.correo}),valid.setForm("/user/pass.html",{oldPass:valid.min8,clave:valid.min8,reclave:valid.reclave}).setForm("/user/profile.html",{nombre:valid.required,ap1:valid.required,ap2:valid.max200,nif:valid.nif,correo:valid.correo});const MENU_SAVE={_id:valid.key,icon:valid.max50,nombre:valid.required,nombre_en:valid.max200,padre:valid.key,orden:valid.intval,mask:valid.intval,alta:valid.ltNow},MENU_FILTER={fn:valid.max200,o1:valid.integer,o2:valid.integer,f1:valid.date,f2:valid.date};valid.setForm("/menu/save.html",MENU_SAVE).setForm("/menu/duplicate.html",MENU_SAVE),valid.setForm("/menu/filter.html",MENU_FILTER).setForm("/menu/search.html",MENU_FILTER),js.ready(function(){const e=i18n.getLang(),t=$("#f1").on("change",function(){r.datepicker("option","minDate",e.toDate(this.value))}),r=$("#f2").on("change",function(){t.datepicker("option","maxDate",e.toDate(this.value))})}),valid.setForm("/tests/email.html",{nombre:valid.required,correo:valid.correo,date:valid.datenull,number:valid.gt0,asunto:valid.required,info:valid.required800});