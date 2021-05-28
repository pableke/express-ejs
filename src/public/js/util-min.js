function I18nBox(){const n=this,u="",l="0",i=".",r=",",t=new Date,a=/^\d.+$/,c=/\D+/g,o=[31,28,31,30,31,30,31,31,30,31,30,31];function s(e){return e&&e[0]}function d(e){return e&&a.test(e)}function f(e){return e.split(c)}function h(e){return e<10?l+e:e}function m(e){var t=e[2];return e[2]=e[0],e[0]=t,e}function g(e,t,n){return Math.min(Math.max(e||0,t),n)}function v(e){return g(e,0,59)}function p(e){return e<100?+(u+parseInt(t.getFullYear()/100)+h(e)):e}function j(e){return null!=e}function b(e){return e&&e.getTime&&!isNaN(e.getTime())}function y(e){var t,n;return e[0]=p(e[0]||0),e[1]=g(e[1],1,12),e[2]=g(e[2],1,(t=e[0],n=e[1]-1,o[n]+(1==n&&(0==(3&(t=t))&&(t%25!=0||0==(15&t)))))),e}function A(e,t,n,r,i){return e.setHours(g(t,0,23),v(n),v(r),i||0),isNaN(e.getTime())?null:e}function E(t){if(s(t)){y(t);let e=new Date;return e.setFullYear(t[0],t[1]-1,t[2]),A(e,t[3],t[4],t[5],t[6])}return null}function e(e){e=e&&f(e);return s(e)?A(new Date,e[0],e[1],e[2],e[3]):null}function x(e){let t=e&&f(e);return s(t)?(t[0]=g(t[0],0,23),t[1]=v(t[1]),t[2]&&(t[2]=v(t[2])),t.map(h).join(":")):null}function I(e){return e.getFullYear()+"-"+h(e.getMonth()+1)+"-"+h(e.getDate())}function D(e){return h(e.getDate())+"/"+h(e.getMonth()+1)+"/"+e.getFullYear()}function k(e){return h(e.getHours())+":"+h(e.getMinutes())}function w(e){return k(e)+":"+h(e.getSeconds())}function M(e,t){for(var n=[],r=e.length;t<r;r-=t)n.unshift(e.substr(r-t,t));return 0<r&&n.unshift(e.substr(0,r)),n}function S(e){if(!e)return null;var t="-"==e.charAt(0)?"-":u,e=parseInt(t+e.replace(c,u));return isNaN(e)?null:e}function F(e,t){var n="-"==e.charAt(0)?"-":u,e=e.replace(c,u).replace(/^0+(\d+)/,"$1");return e?n+M(e,3).join(t):null}function L(e,t){return j(e)?F(u+e,t):null}function O(e,t){return e&&F(e,t)}function T(e,t){if(!e)return null;var n=e.lastIndexOf(t),t="-"==e.charAt(0)?"-":u;let r=n<0?e:e.substr(0,n);n=n<0?u:i+e.substr(n+1),n=parseFloat(t+r.replace(c,u)+n);return isNaN(n)?null:n}function C(t,n,r,i,a){i=isNaN(i)?2:i;var o=t.lastIndexOf(a),a="-"==t.charAt(0)?"-":u;let s=0<o?t.substr(0,o):t;if(s=0==o?l:s.replace(c,u).replace(/^0+(\d+)/,"$1"),s){let e=o<0?l:t.substr(o+1,i);return a+M(s,3).join(n)+r+(o<0?l.repeat(i):e.padEnd(i,l))}return null}function N(e,t,n,r){return j(e)?C(u+e,t,n,r,i):null}function q(e,t,n,r){return e&&C(e,t,n,r,n)}const R={en:{errForm:"Form validation failed",errRequired:"Required field!",errMinlength8:"The minimum required length is 8 characters",errMaxlength:"Max length exceded",errNif:"Wrong ID format",errCorreo:"Wrong Mail format",errDate:"Wrong date format",errDateLe:"Date must be less or equals than current",errDateGe:"Date must be greater or equals than current",errNumber:"Wrong number format",errGt0:"Price must be great than 0.00 &euro;",errRegex:"Wrong format",errReclave:"Passwords typed do not match",errRange:"Value out of allowed range",remove:"Are you sure to delete element?",removeOk:"Element removed successfully!",cancel:"Are you sure to cancel element?",cancelOk:"Element canceled successfully!",unlink:"Are you sure to unlink those elements?",unlinkOk:"Elements unlinked successfully!",linkOk:"Elements linked successfully!",closeText:"close",prevText:"prev",nextText:"next",currentText:"current",monthNames:["January","February","March","April","May","June","July","August","September","October","November","December"],monthNamesShort:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],dayNames:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],dayNamesShort:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],dayNamesMin:["Su","Mo","Tu","We","Th","Fr","Sa"],dateFormat:"yy-mm-dd",firstDay:0,toInt:S,isoInt:function(e){return L(e,r)},fmtInt:function(e){return O(e,r)},toFloat:function(e){return T(e,i)},isoFloat:function(e,t){return N(e,r,i,t)},fmtFloat:function(e,t){return q(e,r,i,t)},toDate:function(e){return e?E(f(e)):null},acDate:function(e){return e&&e.replace(/^(\d{4})(\d+)$/g,"$1-$2").replace(/^(\d{4}\-\d\d)(\d+)$/g,"$1-$2").replace(/[^\d\-]/g,u)},isoDate:function(e){return b(e)?I(e):null},fmtDate:function(e){return d(e)?y(f(e)).map(h).join("-"):null},toTime:e,acTime:function(e){return e&&e.replace(/(\d\d)(\d+)$/g,"$1:$2").replace(/[^\d\:]/g,u)},minTime:function(e){return b(e)?k(e):null},isoTime:function(e){return b(e)?w(e):null},fmtTime:x,isoDateTime:function(e){return b(e)?I(e)+" "+w(e):null},get:function(e,t){return e[t+"_en"]||e[t]}},es:{errForm:"Error al validar los campos del formulario",errRequired:"Campo obligatorio!",errMinlength8:"La longitud mínima requerida es de 8 caracteres",errMaxlength:"Longitud máxima excedida",errNif:"Formato de NIF / CIF incorrecto",errCorreo:"Formato de E-Mail incorrecto",errDate:"Formato de fecha incorrecto",errDateLe:"La fecha debe ser menor o igual a la actual",errDateGe:"La fecha debe ser mayor o igual a la actual",errNumber:"Valor no numérico",errGt0:"El importe debe ser mayor de 0,00 &euro;",errRegex:"Formato incorrecto",errReclave:"Las claves introducidas no coinciden",errRange:"Valor fuera del rango permitido",remove:"¿Confirma que desea eliminar este registro?",removeOk:"Registro eliminado correctamente.",cancel:"¿Confirma que desea cancelar este registro?",cancelOk:"Elemento cancelado correctamente.",unlink:"¿Confirma que desea desasociar estos registros?",unlinkOk:"Registros desasociados correctamente",linkOk:"Registros asociados correctamente.",closeText:"close",prevText:"prev.",nextText:"sig.",currentText:"current",monthNames:["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"],monthNamesShort:["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"],dayNames:["Domingo","Lunes","Martes","Miércoles","Jueves","Viernes","Sábado"],dayNamesShort:["Dom","Lun","Mar","Mié","Juv","Vie","Sáb"],dayNamesMin:["Do","Lu","Ma","Mi","Ju","Vi","Sa"],dateFormat:"dd/mm/yy",firstDay:1,toInt:S,isoInt:function(e){return L(e,i)},fmtInt:function(e){return O(e,i)},toFloat:function(e){return T(e,r)},isoFloat:function(e,t){return N(e,i,r,t)},fmtFloat:function(e,t){return q(e,i,r,t)},toDate:function(e){return e?E(m(f(e))):null},acDate:function(e){return e&&e.replace(/^(\d\d)(\d+)$/g,"$1/$2").replace(/^(\d\d\/\d\d)(\d+)$/g,"$1/$2").replace(/[^\d\/]/g,u)},isoDate:function(e){return b(e)?D(e):null},fmtDate:function(e){return d(e)?m(y(m(f(e)))).map(h).join("/"):null},toTime:e,acTime:function(e){return e&&e.replace(/(\d\d)(\d+)$/g,"$1:$2").replace(/[^\d\:]/g,u)},minTime:function(e){return b(e)?k(e):null},isoTime:function(e){return b(e)?w(e):null},fmtTime:x,isoDateTime:function(e){return b(e)?D(e)+" "+w(e):null},get:function(e,t){return e[t]}}};let $=R.es;this.getLang=function(e){return e?R[e]:$},this.setLang=function(e,t){return R[e]=t,n},this.addLang=function(e,t){return Object.assign(R[e],t),n},this.getI18n=function(e){return e&&(R[e]||R[e.substr(0,2)])||R.es},this.setI18n=function(e){return $=n.getI18n(e),n},this.get=function(e){return $[e]},this.set=function(e,t){return $[e]=t,n},this.sysdate=function(){return t}}function JsBox(){const a=this;function e(e){console.log("Log:",e)}function o(e){return e?e.length:0}function s(e){return e&&1===e.nodeType}function u(e){return e?e.split(" "):[]}function l(e,t){return s(e)&&e.matches(t)}function i(e,t,n){e.matches(t)&&n.push(e)}function r(t,n,r){for(let e=t.previousElementSibling;e;e=e.previousElementSibling)i(e,n,r)}function c(t,n,r){for(let e=t.nextElementSibling;e;e=e.nextElementSibling)i(e,n,r)}function d(e,t,n){r(e,t,n),c(e,t,n)}function f(t,n){for(let e=t.previousElementSibling;e;e=e.previousElementSibling)n.push(e)}function h(t,n){for(let e=t.nextElementSibling;e;e=e.nextElementSibling)n.push(e)}function m(e,t){f(e,t),h(e,t)}function n(e,t){return"SELECT"===e.tagName?(t=t||e.getAttribute("value"),e.selectedIndex=Array.from(e.options).findIndex(e=>e.value==t)):e.value=t,a}this.getLang=function(){return document.querySelector("html").getAttribute("lang")||navigator.language||navigator.userLanguage},this.buildPath=function(e,t){t=t||window.location.pathname;let n=new URLSearchParams(e),r=new URLSearchParams(window.location.search);return n.forEach((e,t)=>r.set(t,e)),t+"?"+r.toString()},this.scrollTop=function(e){e=e||600;let t=-window.scrollY/(e/15),n=setInterval(()=>{0<window.scrollY?window.scrollBy(0,t):clearInterval(n)},15);return a},this.fetch=function(r){return(r=r||{}).headers=r.headers||{},r.reject=r.reject||e,r.resolve=r.resolve||e,r.headers["x-requested-with"]="XMLHttpRequest",fetch(r.action,r).then(e=>{let t=e.headers.get("content-type")||"",n=-1<t.indexOf("application/json")?e.json():e.text();return n.then(e.ok?r.resolve:r.reject)})},this.mask=function(e,n){return a.each(e,(e,t)=>{0==(n>>t&1)?a.addClass(e,"hide"):a.removeClass(e,"hide")})},this.select=function(e,t){a.mask(e.querySelectorAll("option"),t);t=e.querySelector("option[value='"+e.value+"']");return a.hasClass(t,"hide")&&(t=a.find(e.children,"option:not(.hide)"),e.value=t?t.value:null),a},this.each=function(t,n){var r=o(t);for(let e=0;e<r;e++)n(t[e],e);return a},this.reverse=function(t,n){for(let e=o(t)-1;-1<e;e--)n(t[e],e);return a},this.matches=function(e,t){return t&&l(e,t)},this.find=function(t,n){if(n){if(l(t,n))return t;var r=o(t);for(let e=0;e<r;e++){var i=t[e];if(l(i,n))return i}}return null},this.filter=function(e,t){let n=[];return t&&a.each(e,e=>i(e,t,n)),n},this.get=function(e,t){return t=t||document,(e=e)&&t.querySelector(e)},this.getAll=function(e,t){return t=t||document,(e=e)&&t.querySelectorAll(e)},this.prev=function(e,t){let n=[];return s(e)?t?r(e,t,n):f(e,n):t?a.each(e,e=>r(e,t,n)):a.each(e,e=>f(e,n)),n},this.next=function(e,t){let n=[];return s(e)?t?c(e,t,n):h(e,n):t?a.each(e,e=>c(e,t,n)):a.each(e,e=>h(e,n)),n},this.siblings=function(e,t){let n=[];return s(e)?t?d(e,t,n):m(e,n):t?a.each(e,e=>d(e,t,n)):a.each(e,e=>m(e,n)),n},this.focus=function(e){const t=a.find(e,"[tabindex]:not([type=hidden][readonly][disabled]):not([tabindex='-1'][tabindex=''])");return t&&t.focus(),a},this.val=function(e,t){return s(e)?n(e,t):a.each(e,e=>n(e,t)),a},this.text=function(e,t){return s(e)?e.innerText=t:a.each(e,e=>{e.innerText=t}),a},this.html=function(e,t){return s(e)?e.innerHTML=t:a.each(e,e=>{e.innerHTML=t}),a},this.import=function(e,t){return t?a.each(e,e=>n(e,t[e.name]??"")):a.val(e,"")},this.export=function(e,t){return t=t||{},a.each(e,e=>{t[e.name]=e.value}),t},this.isVisible=function(e){return!!(e.offsetWidth||e.offsetHeight||e.getClientRects().length)},this.show=function(e,t){return t=t||"block",s(e)?e.style.display=t:a.each(e,e=>{e.style.display=t}),a},this.hide=function(e){return s(e)?e.style.display="none":a.each(e,e=>{e.style.display="none"}),a},this.hasClass=function(e,t){let n=o(e)?e[0]:e;return n&&u(t).some(e=>n.classList.contains(e))},this.setClass=function(e,t){function n(e){e.className=t}return s(e)?n(e):a.each(e,n),a},this.addClass=function(e,t){let n=u(t);function r(t){n.forEach(e=>t.classList.add(e))}return s(e)?r(e):a.each(e,r),a},this.removeClass=function(e,t){let n=u(t);function r(t){n.forEach(e=>t.classList.remove(e))}return s(e)?r(e):a.each(e,r),a},this.toggle=function(e,t,n){let r=u(t);function i(t){r.forEach(e=>t.classList.toggle(e))}return s(e)?i(e):a.each(e,i),a};function g(t,e,n){return t.addEventListener(e,e=>n(t,e)),a}this.fadeOut=function(e){function t(t){let n=parseFloat(t.style.opacity)||0;!function e(){(n-=.03)<0?t.style.display="none":requestAnimationFrame(e),t.style.opacity=n}()}return s(e)?t(e):a.each(e,t),a},this.fadeIn=function(e,r){function t(t){t.style.display=r||"block";let n=parseFloat(t.style.opacity)||0;!function e(){(n+=.03)<1&&requestAnimationFrame(e),t.style.opacity=n}()}return s(e)?t(e):a.each(e,t),a},this.fadeToggle=function(e,t){var n=o(e)?e[0]:e;return(parseFloat(n&&n.style.opacity)||0)<.03?a.fadeIn(e,t):a.fadeOut(e)},this.ready=function(e){return g(document,"DOMContentLoaded",e)},this.click=function(e,t){return s(e)?g(e,"click",t):a.each(e,e=>g(e,"click",t))},this.change=function(e,t){return s(e)?g(e,"change",t):a.each(e,e=>g(e,"change",t))},this.keyup=function(e,t){return s(e)?g(e,"keyup",t):a.each(e,e=>g(e,"keyup",t))},this.keydown=function(e,t){return s(e)?g(e,"keydown",t):a.each(e,e=>g(e,"keydown",t))}}function StringBox(){const a=this;function t(e){return"string"==typeof e||e instanceof String}function o(e){return t(e)?e.trim():e}function s(e){return e?e.length:0}function n(e){for(var t="",n=s(o(e)),r=0;r<n;r++){var i=e.charAt(r),a="àáâãäåāăąÀÁÂÃÄÅĀĂĄÆßèéêëēĕėęěÈÉĒĔĖĘĚìíîïìĩīĭÌÍÎÏÌĨĪĬòóôõöōŏőøÒÓÔÕÖŌŎŐØùúûüũūŭůÙÚÛÜŨŪŬŮçÇñÑþÐŔŕÿÝ".indexOf(i);t+=a<0?i:"aaaaaaaaaAAAAAAAAAABeeeeeeeeeEEEEEEEiiiiiiiiIIIIIIIIoooooooooOOOOOOOOOuuuuuuuuUUUUUUUUcCnNdDRryY".charAt(a)}return t.toLowerCase()}this.isstr=t,this.trim=o,this.size=s,this.eq=function(e,t){return n(e)==n(t)},this.iiOf=function(e,t){return n(e).indexOf(n(t))},this.substr=function(e,t,n){return e&&e.substr(t,n)},this.indexOf=function(e,t){return e?e.indexOf(t):-1},this.lastIndexOf=function(e,t){return e?e.lastIndexOf(t):-1},this.prevIndexOf=function(e,t,n){return e?e.substr(0,n).lastIndexOf(t):-1},this.starts=function(e,t){return e&&e.startsWith(t)},this.ends=function(e,t){return e&&e.endsWith(t)},this.prefix=function(e,t){return a.starts(e,t)?e:t+e},this.suffix=function(e,t){return a.ends(e,t)?e:e+t},this.trunc=function(e,t){return s(e)>t?e.substr(0,t).trim()+"...":e},this.itrunc=function(e,t){var n=s(e)>t?a.prevIndexOf(e," ",t):-1;return a.trunc(e,n<0?t:n)},this.removeAt=function(e,t,n){return t<0?e:e.substr(0,t)+e.substr(t+n)},this.insertAt=function(e,t,n){return e?e.substr(0,n)+t+e.substr(n):t},this.replaceAt=function(e,t,n,r){return n<0?e:e.substr(0,n)+t+e.substr(n+r)},this.replaceLast=function(e,t,n){return e?a.replaceAt(e,n,e.lastIndexOf(t),t.length):n},this.wrapAt=function(e,t,n,r,i){return t<0?e:a.insertAt(a.insertAt(e,r,t),i,t+r.length+n)},this.iwrap=function(e,t,n,r){return t&&a.wrapAt(e,a.iiOf(e,t),t.length,n||"<u><b>",r||"</b></u>")},this.rand=function(e){return Math.random().toString(36).substr(2,e||8)},this.lopd=function(e){return e&&"***"+e.substr(3,4)+"**"},this.toDate=function(e){return e?new Date(e):null},this.split=function(e,t){return e?e.trim().split(t||","):[]},this.minify=function(e){return e&&e.trim().replace(/\s{2}/g,"")},this.lines=function(e){return a.split(e,/[\n\r]+/)},this.words=function(e){return a.split(e,/\s+/)},this.ilike=function(e,t){return-1<a.iiOf(e,t)},this.olike=function(t,e,n){return e.some(function(e){return a.ilike(t[e],n)})},this.alike=function(t,n,e){return a.words(e).some(function(e){return a.olike(t,n,e)})},this.between=function(e,t,n){return n=n??e,(t=t??e)<=e&&e<=n},this.ltr=function(e,t){for(var n=[],r=s(e);t<r;r-=t)n.unshift(e.substr(r-t,t));return 0<r&&n.unshift(e.substr(0,r)),n},this.rtl=function(e,t){for(var n=[],r=s(e),i=0;i<r;i+=t)n.push(e.substr(i,t));return n},this.slices=function(t,n){var r=0,i=[],a=s(t);for(let e=0;r<a&&e<n.length;e++){var o=n[e];i.push(t.substr(r,o)),r+=o}return r<a&&i.push(t.substr(r)),i}}function ValidatorBox(){const r=this,i={},n={},o="",a=new Date;let s,u,l={},c=0;const t=/^\d+$/,d=/^\d+(,\d+)*$/,f=/\w+[^\s@]+@[^\s@]+\.[^\s@]+/,h=/^[\w#@&°!§%;:=\^\/\(\)\?\*\+\~\.\,\-\$]{8,}$/;const m=/^(\d{8})([A-Z])$/,g=/^([ABCDEFGHJKLMNPQRSUVW])(\d{7})([0-9A-J])$/,v=/^[XYZ]\d{7,8}[A-Z]$/;function p(e){return e?e.length:0}function j(e){return e&&e.trim().replace(/\W+/g,o).toUpperCase()}function b(e){return null!=e}function y(e,t,n){return t<=e&&e<=n}this.size=function(e,t,n){return y(p(e),t,n)},this.range=function(e,t,n){return y(parseFloat(e),t,n)},this.regex=function(e,t){try{return t&&e.test(t)}catch(e){}return!1},this.login=function(e){return r.regex(h,e)?e:null},this.digits=function(e){return r.regex(t,e)?e:null},this.idlist=function(e){return r.regex(d,e)?e:null},this.email=function(e){return r.regex(f,e)?e.toLowerCase():null},this.sysdate=function(){return a},this.toISODateString=function(e){return(e||a).toISOString().substring(0,10)},this.isset=function(e,t,n){return b(t)?t:r.addError(e,n)},this.close=function(e,t,n){return Math.min(Math.max(+e,t),n)},this.idES=function(e){if(e=j(e)){if(r.regex(m,e))return r.dni(e);if(r.regex(g,e))return r.cif(e);if(r.regex(v,e))return r.nie(e)}return null},this.dni=function(e){return"TRWAGMYFPDXBNJZSQVHLCKE".charAt(parseInt(e,10)%23)==e.charAt(8)?e:null},this.cif=function(e){for(var t=e.match(g),n=t[1],r=t[2],i=t[3],a=0,o=0;o<r.length;o++){var s=parseInt(r[o],10);a+=s=o%2==0?(s*=2)<10?s:parseInt(s/10)+s%10:s}var u=0!==(a%=10)?10-a:a,t="JABCDEFGHI".substr(u,1);return(n.match(/[ABEH]/)?i==u:!n.match(/[KPQS]/)&&i==u||i==t)?e:null},this.nie=function(e){var t=e.charAt(0),t="X"==t?0:"Y"==t?1:"Z"==t?2:t;return r.dni(t+e.substr(1))},this.iban=function(e){var t=(e=j(e))&&e.match(/^([A-Z]{2})(\d{2})([A-Z\d]+)$/);if(!t||p(e)!=={AD:24,AE:23,AT:20,AZ:28,BA:20,BE:16,BG:22,BH:22,BR:29,CH:21,CR:22,CY:28,CZ:24,DE:22,DK:18,DO:28,EE:20,ES:24,FI:18,FO:18,FR:27,GB:22,GI:23,GL:18,GR:27,GT:28,HR:21,HU:28,IE:22,IL:23,IS:26,IT:27,JO:30,KW:30,KZ:20,LB:28,LI:21,LT:20,LU:20,LV:21,MC:27,MD:24,ME:22,MK:19,MR:27,MT:31,MU:30,NL:18,NO:15,PK:24,PL:28,PS:29,PT:25,QA:29,RO:24,RS:22,SA:24,SE:24,SI:19,SK:24,SM:27,TN:24,TR:26,AL:28,BY:28,EG:29,GE:22,IQ:23,LC:32,SC:31,ST:25,SV:28,TL:23,UA:29,VA:22,VG:24,XK:20}[t[1]])return null;let n=(t[3]+t[1]+t[2]).replace(/[A-Z]/g,e=>e.charCodeAt(0)-55);var r;o;let i=n.toString(),a=i.slice(0,2);for(let e=2;e<i.length;e+=7)r=a+i.substring(e,e+7),a=parseInt(r,10)%97;return 1===a?e:null},this.creditCardNumber=function(n){if(16!=p(n=j(n)))return null;let r=0,i=!1;for(let t=15;0<=t;t--){let e=+n[t];i&&(e*=2,e-=9<e?9:0),r+=e,i=!i}return r%10==0?n:null},this.generatePassword=function(e,t){return t=t||"abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_#@&°!§%;:=^/()?*+~.,-$",Array.apply(null,Array(e||10)).map(function(){return t.charAt(Math.random()*t.length)}).join(o)},this.testPassword=function(e){var t=0;return t+=/[A-Z]+/.test(e)?1:0,t+=/[a-z]+/.test(e)?1:0,t+=/[0-9]+/.test(e)?1:0,t+=/[\W]+/.test(e)?1:0,t+=2<t&&8<p(e)},this.get=function(e){return r[e]},this.set=function(e,t){return r[e]=t,r},this.getI18n=function(){return u},this.setI18n=function(e){return u=e,r},this.isObject=function(e){return e&&"object"==typeof e},this.isEmpty=function(e){for(var t in e)if(b(e[t]))return!1;return!0},this.clear=function(e){for(var t in e)delete e[t];return r},this.getMsgs=function(){return i},this.getMsg=function(e){return i[e]},this.setMsg=function(e,t){return i[e]=t,r},this.getMsgOk=function(){return i.msgOk},this.setMsgOk=function(e){return i.msgOk=e,r},this.getMsgInfo=function(){return i.msgInfo},this.setMsgInfo=function(e){return i.msgInfo=e,r},this.getMsgWarn=function(){return i.msgWarn},this.setMsgWarn=function(e){return i.msgWarn=e,r},this.getMsgError=function(){return i.msgError},this.setError=function(e,t){return c++,r.setMsg(e,t)},this.addError=function(e,t){return r.setError(e,t),null},this.setMsgError=function(e){return r.setError("msgError",e)},this.getForm=function(e){return n[e]},this.setForm=function(e,t){return n[e]=t,r},this.getFields=function(e){e=r.getForm(e);return e?Object.keys(e):[]},this.getData=function(e){return e?s[e]:s},this.setData=function(e,t){return s[e]=t,r},this.getInput=function(e){return l[e]},this.setInput=function(e,t){return l[e]=(t=t)&&t.trim(),r},this.getInputs=function(){return l},this.setInputs=function(e){return l=e,r},this.init=function(e,t){return r.setInputs(e).setI18n(t)},this.validate=function(e){s={},c=0,a.setTime(Date.now());var t,n=r.clear(i).getForm(e);for(t in n){let e=n[t];s[t]=e(t,l[t],u)}return n&&0==c}}const js=new JsBox,sb=new StringBox,i18n=new I18nBox,valid=new ValidatorBox;valid.set("required",function(e,t,n){return valid.size(t,1,200)?t:valid.addError(e,n.errRequired)}).set("required50",function(e,t,n){return valid.size(t,1,50)?t:valid.addError(e,n.errRequired)}).set("required800",function(e,t,n){return valid.size(t,1,800)?t:valid.addError(e,n.errRequired)}).set("min8",function(e,t,n){return valid.size(t,8,200)?t:valid.addError(e,n.errMinlength8)}).set("max50",function(e,t,n){return valid.size(t,0,50)?t:valid.addError(e,n.errMaxlength)}).set("max200",function(e,t,n){return valid.size(t,0,200)?t:valid.addError(e,n.errMaxlength)}).set("max800",function(e,t,n){return valid.size(t,0,800)?t:valid.addError(e,n.errMaxlength)}).set("token",function(e,t,n){return valid.size(t,200,800)?t:valid.addError(e,n.errRegex)}).set("usuario",function(e,t,n){return valid.min8(e,t,n)&&(valid.idES(t)||valid.email(t)||valid.addError(e,n.errRegex))}).set("clave",function(e,t,n){return valid.min8(e,t,n)&&(valid.login(t)||valid.addError(e,n.errRegex))}).set("reclave",function(e,t,n){return valid.clave(e,t,n)&&(t==valid.getData("clave")?t:valid.addError(e,n.errReclave))}).set("nif",function(e,t,n){return valid.required(e,t,n)&&(valid.idES(t)||valid.addError(e,n.errNif))}).set("correo",function(e,t,n){return valid.required(e,t,n)&&(valid.email(t)||valid.addError(e,n.errCorreo))}).set("dateval",function(e,t,n){return n.toDate(t)||valid.addError(e,n.errDate)}).set("datenull",function(e,t,n){return n.toDate(t)}).set("ltNow",function(e,t,n){let r=valid.required(e,t,n)&&valid.dateval(e,t,n);return r&&r.getTime()<Date.now()?r:valid.addError(e,n.errDateLe)}).set("leToday",function(e,t,n){t=valid.required(e,t,n)&&valid.dateval(e,t,n);return t&&valid.toISODateString(t)<=valid.toISODateString()?t:valid.addError(e,n.errDateLe)}).set("gtNow",function(e,t,n){let r=valid.required(e,t,n)&&valid.dateval(e,t,n);return r&&r.getTime()>Date.now()?r:valid.addError(e,n.errDateGe)}).set("geToday",function(e,t,n){t=valid.required(e,t,n)&&valid.dateval(e,t,n);return t&&valid.toISODateString(t)>=valid.toISODateString()?t:valid.addError(e,n.errDateGe)}).set("intval",function(e,t,n){return valid.isset(e,n.toInt(t),n.errNumber)}).set("intnull",function(e,t,n){return n.toInt(t)}).set("floatval",function(e,t,n){return valid.isset(e,n.toFloat(t),n.errNumber)}).set("floatnull",function(e,t,n){return n.toFloat(t)}).set("key",function(e,t,n){t=n.toInt(t);return null===t||0<t?t:valid.addError(e,n.errGt0)}).set("gt0",function(e,t,n){t=valid.required(e,t,n)&&valid.floatval(e,t,n);return 0<t?t:valid.addError(e,n.errGt0)}),js.ready(function(){var e=js.getLang();const o=i18n.setI18n(e).getLang();valid.setI18n(o),$.datepicker.regional.es=i18n.getI18n("es"),$.datepicker.setDefaults(i18n.getLang());let t=js.getAll("div.alert"),n=js.getAll(".alert-text");e=js.getAll(".alert-close");function r(e){js.fadeIn(e.parentNode,"grid")}function i(e,t){e.innerHTML=t,r(e)}function a(e){e&&i(n[0],e)}function s(e){e&&i(n[3],e)}js.each(n,e=>{e.firstChild&&r(e)}),js.click(e,e=>{js.fadeOut(e.parentNode)});let u=document.querySelector(".loading");function l(){js.show(u).closeAlerts()}function c(){js.fadeOut(u)}const d="input-error",f=".msg-error";js.showOk=function(e){return a(e),js},js.showInfo=function(e){return(e=e)&&i(n[1],e),js},js.showWarn=function(e){return(e=e)&&i(n[2],e),js},js.showError=function(e){return s(e),js},js.showAlerts=function(e){return e?js.showOk(e.msgOk).showInfo(e.msgInfo).showWarn(e.msgWarn).showError(e.msgError):js},js.closeAlerts=function(){return js.hide(t)},js.clean=function(e){return js.closeAlerts().removeClass(e,d).text(js.siblings(e,f),"").focus(e)},js.showErrors=function(e,n){return js.showAlerts(n).reverse(e,e=>{var t=e.name&&n[e.name];t&&js.focus(e).addClass(e,d).html(js.siblings(e,f),t)})},js.load=function(e,t){return js.import(e,t),js.each(js.filter(e,".integer"),e=>{e.value=o.isoInt(t[e.name])}).each(js.filter(e,".float"),e=>{e.value=o.isoFloat(t[e.name])}).each(js.filter(e,".date"),e=>{e.value=o.isoDate(sb.toDate(t[e.name]))}).each(js.filter(e,".time"),e=>{e.value=o.minTime(sb.toDate(t[e.name]))}),js.showAlerts(t)},js.ajax=function(e,t,n){return l(),js.fetch({action:e,resolve:t||a,reject:n||s}).catch(s).finally(c)},js.autocomplete=function(r){let n=!1;function e(){return!1}function i(e){return js.siblings(e,"[type=hidden]")}return(r=r||{}).action=r.action||"#",r.minLength=r.minLength||3,r.delay=r.delay||500,r.open=r.open||e,r.focus=r.focus||e,r.load=r.load||e,r.remove=r.remove||e,r.render=r.render||function(){return"-"},r.search=function(e,t){return n},r.select=function(e,t){return r.load(t.item,this,i(this)),!1},r.source=function(n,t){this.element.autocomplete("instance")._renderItem=function(e,t){t=sb.iwrap(r.render(t),n.term);return $("<li>").append("<div>"+t+"</div>").appendTo(e)},js.ajax(r.action+"?term="+n.term,e=>t(e.slice(0,10)))},r.change=function(e,t){t.item||(js.val(this,"").val(i(this),""),r.remove(this))},$(r.inputs).autocomplete(r),js.keydown(r.inputs,(e,t)=>{n=8==t.keyCode||sb.between(t.keyCode,46,111)||sb.between(t.keyCode,160,223)})},valid.validateForm=function(e){var t=e.elements;return js.clean(t).each(t,e=>{e.name&&valid.setInput(e.name,e.value)}),valid.validate(e.getAttribute("action"))||!js.showErrors(t,valid.setMsgError(o.errForm).getMsgs())},valid.submit=function(t,e,n,r){if(e.preventDefault(),valid.validateForm(t)){l();let e=new FormData(t);for(var i in valid.getInputs())e.has(i)||e.append(i,valid.getInput(i));js.fetch({method:t.method,action:n||t.action,body:"multipart/form-data"===t.enctype?e:new URLSearchParams(e),reject:function(e){js.showErrors(t.elements,e)},resolve:r||a}).catch(s).finally(c)}return valid},"undefined"!=typeof grecaptcha&&grecaptcha.ready(function(){js.click(js.getAll(".captcha"),(t,n)=>{grecaptcha.execute("6LeDFNMZAAAAAKssrm7yGbifVaQiy1jwfN8zECZZ",{action:"submit"}).then(e=>valid.setInput("token",e).submit(t.closest("form"),n)).catch(s),n.preventDefault()})}),js.reverse(js.getAll("form"),n=>{let r=n.elements;js.change(js.filter(r,".integer"),e=>{e.value=o.fmtInt(e.value)}),js.change(js.filter(r,".float"),e=>{e.value=o.fmtFloat(e.value)});var e=js.filter(r,".date");js.keyup(e,e=>{e.value=o.acDate(e.value)}).change(e,e=>{e.value=o.fmtDate(e.value)});e=js.filter(r,".time");js.keyup(e,e=>{e.value=o.acTime(e.value)}).change(e,e=>{e.value=o.fmtTime(e.value)}),$(r).filter(".datepicker").datepicker({dateFormat:i18n.get("dateFormat"),changeMonth:!1});let t=js.filter(r,"textarea[maxlength]");function i(e){var t=Math.abs(e.getAttribute("maxlength")-sb.size(e.value));js.text(n.querySelector("#counter-"+e.id),t)}function a(e,t){return!js.setClass(js.next(e,"i"),t)}js.keyup(t,i).each(t,i),js.autocomplete({inputs:js.filter(r,".ac-user"),action:"/user/find.html",render:function(e){return e.nif+" - "+(e.nombre+" "+e.ap1+" "+e.ap2).trim()},load:function(e,t,n){js.val(t,this.render(e)).val(n,e.nif)}}).autocomplete({inputs:js.filter(r,".ac-menu"),action:"/menu/find.html",focus:function(e,t){return a(this,"input-item input-icon "+(t.item&&t.item.icon||"fas fa-arrow-alt-circle-up"))},remove:function(e){a(e,"input-item input-icon fas fa-arrow-alt-circle-up")},render:function(e){return(e.icon?'<i class="'+e.icon+'"></i> - ':"")+o.get(e,"nombre")},load:function(e,t,n){js.val(t,o.get(e,"nombre")).val(n,e._id)}}),js.click(js.filter(r,"[type=reset]"),()=>{n.reset(),js.clean(r).each(t,i)}).click(js.filter(r,".clear-all"),()=>{js.val(r,"").clean(r).each(t,i)}).click(js.getAll("a.nav-to",n),(e,t)=>{js.ajax(e.href,e=>{js.load(r,e)}),t.preventDefault()}).click(js.getAll("a.duplicate",n),(e,t)=>{valid.submit(n,t,e.href,e=>{js.load(r,e).toggle(js.getAll("a.nav-to",n),"btn hide")})}),js.focus(r),n.addEventListener("submit",e=>{n.classList.contains("ajax")?valid.submit(n,e,null,e=>{js.load(r,e)}):valid.validateForm(n)||e.preventDefault()})})}),js.ready(function(){const o=i18n.getLang();js.getAll("table").forEach(n=>{let r=js.getAll("a.sort",n.thead),i=n.tBodies[0];function a(e,t){confirm(o.remove)&&js.ajax(e.href,e=>{i.innerHTML=e.html,js.text(js.get("#rows",n.tfoot),i.children.length),js.showAlerts(e)}),t.preventDefault()}js.click(r,(e,t)=>{t.preventDefault();t=js.hasClass(e,"asc")?"desc":"asc";js.removeClass(r,"asc desc"),js.addClass(e,t),js.ajax(e.href+"&dir="+t,e=>{js.html(i,e.html).click(js.getAll("a.remove-row",i),a)})}),js.click(js.getAll("a.remove-row",i),a)}),js.click(js.getAll("a.remove"),(e,t)=>{confirm(o.remove)||t.preventDefault()}),js.getAll(".pagination").forEach(e=>{e=js.getAll("select",e);js.val(e).change(e,e=>{window.location.href="?page=0&size="+e.value})})}),js.ready(function(){js.getAll("ul.menu").forEach(function(t){let e=Array.from(t.children);e.sort((e,t)=>+e.dataset.orden-+t.dataset.orden),e.forEach(n=>{t.appendChild(n);var e=n.dataset.mask;8==(8&e)&&(n.innerHTML+='<ul class="sub-menu"></ul>',n.firstElementChild.innerHTML+='<b class="nav-tri">&rtrif;</b>',js.click(n.firstElementChild,(e,t)=>{js.toggle(n,"active"),t.preventDefault()})),0==(4&e)&&js.addClass(n.firstElementChild,"disabled")});for(let e=0;e<t.children.length;){var n=t.children[e],r=n.dataset.padre;if(r){let e=js.get("li[id='"+r+"']",t);e&&e.lastElementChild.appendChild(n)}else e++}js.fadeIn(t.children)}),js.click(js.getAll(".sidebar-toggle"),(e,t)=>{js.toggle(js.getAll(".sidebar-icon",e.parentNode),"hide"),js.toggle(js.get("#sidebar",e.parentNode),"active"),t.preventDefault()});let e=js.get("#back-to-top");js.click(e,()=>{js.scrollTop(400)}),window.onscroll=function(){80<window.pageYOffset?js.fadeIn(e):js.fadeOut(e)},window.addEventListener("unload",function(e){js.ajax("/session/destroy.html")})}),js.ready(function(){let e=document.querySelectorAll("ul#tab-nav li"),t=document.querySelectorAll(".tab-contents"),n=document.querySelectorAll("ul#progressbar li"),r=n.length||t.length,i=0;function a(e){return e<0?0:e<r?e:r-1}function o(){js.removeClass(e,"active").addClass(e[i],"active"),js.removeClass(t,"active").addClass(t[i],"active"),n.forEach((e,t)=>{js.toggle(e,"active",t<=i)})}js.click(js.getAll(".prev-tab"),()=>(i=a(i-1),o())),js.click(js.getAll(".next-tab"),()=>(i=a(i+1),o()));var s=js.getAll("a[href^='#']");js.click(js.filter(s,"[href^='#tab-']"),e=>(i=a(+e.href.substr(e.href.lastIndexOf("-")+1)-1),o())),js.click(js.getAll("a.show-info"),(e,t)=>{js.toggle(e.lastElementChild,"fa-angle-double-up fa-angle-double-down").toggle(js.next(e,".extra-info"),"hide"),t.preventDefault()}),js.click(js.filter(s,":not([href^='#tab-'])"),function(t,e){try{let e=document.querySelector(t.getAttribute("href"));e&&e.scrollIntoView({behavior:"smooth"})}catch(e){}e.preventDefault()})}),valid.setForm("/login.html",{usuario:valid.usuario,clave:valid.clave}).setForm("/contact.html",{nombre:valid.required,correo:valid.correo,asunto:valid.required,info:valid.required}).setForm("/signup.html",{token:valid.token,nombre:valid.required,ap1:valid.required,nif:valid.nif,correo:valid.correo}).setForm("/reactive.html",{token:valid.token,correo:valid.correo}),valid.setForm("/user/pass.html",{oldPass:valid.min8,clave:valid.min8,reclave:valid.reclave}).setForm("/user/profile.html",{nombre:valid.required,ap1:valid.required,ap2:valid.max200,nif:valid.nif,correo:valid.correo});const MENU_SAVE={_id:valid.key,icon:valid.max50,nombre:valid.required,nombre_en:valid.max200,pn:valid.max200,padre:valid.key,orden:valid.intval,mask:valid.intval,alta:valid.ltNow},MENU_FILTER={fn:valid.max200,o1:valid.integer,o2:valid.integer,f1:valid.date,f2:valid.date};valid.setForm("/menu/save.html",MENU_SAVE).setForm("/menu/duplicate.html",MENU_SAVE),valid.setForm("/menu/filter.html",MENU_FILTER).setForm("/menu/search.html",MENU_FILTER),js.ready(function(){const e=i18n.getLang(),t=$("#f1").on("change",function(){n.datepicker("option","minDate",e.toDate(this.value))}),n=$("#f2").on("change",function(){t.datepicker("option","maxDate",e.toDate(this.value))})}),valid.setForm("/tests/email.html",{nombre:valid.required,correo:valid.correo,date:valid.datenull,number:valid.gt0,asunto:valid.required,info:valid.required800});