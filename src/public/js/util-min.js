function ArrayBox(){const i=this;function a(t){return t?t.length:0}function n(t,e){return t==e?0:t<e?-1:1}this.size=a,this.find=function(t,e){return t?t.find(e):null},this.ifind=function(t,e){return t?t.findIndex(e):-1},this.indexOf=function(t,e){return t?t.indexOf(e):-1},this.intersect=function(t,e){return e?t.filter(function(t){return-1<e.indexOf(t)}):[]},this.shuffle=function(t){return t.sort(function(){return.5-Math.random()})},this.unique=function(e,t){return t?e.concat(t.filter(t=>e.indexOf(t)<0)):e},this.swap=function(t,e,n){var r=t[e];return t[e]=t[n],t[n]=r,i},this.eq=function(t,n){return t&&n&&t.every((t,e)=>n[e]==t)},this.push=function(t,e){return t&&t.push(e),i},this.pushAt=function(t,e,n){return t&&t.splice(n,0,e),i},this.pop=function(t){return t&&t.pop(),i},this.popAt=function(t,e){return t&&t.splice(e,1),i},this.remove=function(t,e,n){return t&&t.splice(e,n),i},this.reset=function(t){return t&&t.splice(0),i},this.get=function(t,e){return t?t[e]:null},this.last=function(t){return i.get(t,a(t)-1)},this.sort=function(t,e){return t&&t.sort(e||n)},this.clone=function(t){return t?t.slice():[]},this.each=function(e,n){var r=a(e);for(let t=0;t<r;t++)n(e[t],t);return i},this.reverse=function(e,n){for(let t=a(e)-1;-1<t;t--)n(e[t],t);return i},this.extract=function(e,n){var r=a(e);for(let t=0;t<r;t++)n(e[t],t)&&e.splice(t--,1);return i}}function DateBox(){const e="",n=new Date,r=/^\d.+$/,i=/\D+/g,a=[31,28,31,30,31,30,31,31,30,31,30,31];function s(t){return t&&t[0]}function o(t){return t&&r.test(t)}function u(t){return t.split(i)}function l(t){return t<10?"0"+t:t}function c(t){var e=t[2];return t[2]=t[0],t[0]=e,t}function f(t,e,n){return Math.min(Math.max(t||0,e),n)}function d(t){return f(t,0,59)}function h(t){return t<100?+(e+parseInt(n.getFullYear()/100)+l(t)):t}function m(t){return 0==(3&t)&&(t%25!=0||0==(15&t))}function g(t,e){return a[e]+(1==e&&m(t))}function v(t){return t&&t.getTime&&!isNaN(t.getTime())}function p(t){return t[0]=h(t[0]||0),t[1]=f(t[1],1,12),t[2]=f(t[2],1,g(t[0],t[1]-1)),t}function j(t,e,n,r,i){return t.setHours(f(e,0,23),d(n),d(r),i||0),isNaN(t.getTime())?null:t}function b(e){if(s(e)){p(e);let t=new Date;return t.setFullYear(e[0],e[1]-1,e[2]),j(t,e[3],e[4],e[5],e[6])}return null}function y(t){return l(t.getHours())+":"+l(t.getMinutes())}function E(t){return y(t)+":"+l(t.getSeconds())}function x(t){return t.getFullYear()+"-"+l(t.getMonth()+1)+"-"+l(t.getDate())}function A(t){return l(t.getDate())+"/"+l(t.getMonth()+1)+"/"+t.getFullYear()}this.daysInMonth=g,this.isLeap=m,this.isValid=v,this.minTime=function(t){return t?y(t):null},this.isoTime=function(t){return t?E(t):null},this.acTime=function(t){return t&&t.replace(/(\d\d)(\d+)$/g,"$1:$2").replace(/[^\d\:]/g,e)},this.toTime=function(t){t=t&&u(t);return s(t)?j(new Date,t[0],t[1],t[2],t[3]):null},this.fmtTime=function(t){let e=t&&u(t);return s(e)?(e[0]=f(e[0],0,23),e[1]=d(e[1]),e[2]&&(e[2]=d(e[2])),e.map(l).join(":")):null},this.enDate=function(t){return t?b(u(t)):null},this.isoEnDate=function(t){return v(t)?x(t):null},this.isoEnDateTime=function(t){return v(t)?x(t)+" "+E(t):null},this.fmtEnDate=function(t){return o(t)?p(u(t)).map(l).join("-"):null},this.acEnDate=function(t){return t&&t.replace(/^(\d{4})(\d+)$/g,"$1-$2").replace(/^(\d{4}\-\d\d)(\d+)$/g,"$1-$2").replace(/[^\d\-]/g,e)},this.esDate=function(t){return t?b(c(u(t))):null},this.isoEsDate=function(t){return v(t)?A(t):null},this.isoEsDateTime=function(t){return v(t)?A(t)+" "+E(t):null},this.fmtEsDate=function(t){return o(t)?c(p(c(u(t)))).map(l).join("/"):null},this.acEsDate=function(t){return t&&t.replace(/^(\d\d)(\d+)$/g,"$1/$2").replace(/^(\d\d\/\d\d)(\d+)$/g,"$1/$2").replace(/[^\d\/]/g,e)}}function I18nBox(){const n=this,r={en:{errForm:"Form validation failed",errRequired:"Required field!",errMinlength8:"The minimum required length is 8 characters",errMaxlength:"Max length exceded",errNif:"Wrong ID format",errCorreo:"Wrong Mail format",errDate:"Wrong date format",errDateLe:"Date must be less or equals than current",errDateGe:"Date must be greater or equals than current",errNumber:"Wrong number format",errGt0:"Price must be great than 0.00 &euro;",errRegex:"Wrong format",errReclave:"Passwords typed do not match",errRange:"Value out of allowed range",errRefCircular:"Circular reference",remove:"Are you sure to delete element?",removeOk:"Element removed successfully!",cancel:"Are you sure to cancel element?",cancelOk:"Element canceled successfully!",unlink:"Are you sure to unlink those elements?",unlinkOk:"Elements unlinked successfully!",linkOk:"Elements linked successfully!",closeText:"close",prevText:"prev",nextText:"next",currentText:"current",monthNames:["January","February","March","April","May","June","July","August","September","October","November","December"],monthNamesShort:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],dayNames:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],dayNamesShort:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],dayNamesMin:["Su","Mo","Tu","We","Th","Fr","Sa"],dateFormat:"yy-mm-dd",firstDay:0,toInt:nb.toInt,isoInt:function(t){return nb.isoInt(t,",")},fmtInt:function(t){return nb.fmtInt(t,",")},toFloat:function(t){return nb.toFloat(t,".")},isoFloat:function(t,e){return nb.isoFloat(t,",",".",e)},fmtFloat:function(t,e){return nb.fmtFloat(t,",",".",e)},toDate:dt.enDate,isoDate:dt.isoEnDate,isoDateTime:dt.isoEnDateTime,fmtDate:dt.fmtEnDate,acDate:dt.acEnDate,toTime:dt.toTime,minTime:dt.minTime,isoTime:dt.isoTime,fmtTime:dt.fmtTime,acTime:dt.acTime,get:function(t,e){return t[e+"_en"]||t[e]}},es:{errForm:"Error al validar los campos del formulario",errRequired:"Campo obligatorio!",errMinlength8:"La longitud mínima requerida es de 8 caracteres",errMaxlength:"Longitud máxima excedida",errNif:"Formato de NIF / CIF incorrecto",errCorreo:"Formato de E-Mail incorrecto",errDate:"Formato de fecha incorrecto",errDateLe:"La fecha debe ser menor o igual a la actual",errDateGe:"La fecha debe ser mayor o igual a la actual",errNumber:"Valor no numérico",errGt0:"El importe debe ser mayor de 0,00 &euro;",errRegex:"Formato incorrecto",errReclave:"Las claves introducidas no coinciden",errRange:"Valor fuera del rango permitido",errRefCircular:"Referencia circular",remove:"¿Confirma que desea eliminar este registro?",removeOk:"Registro eliminado correctamente.",cancel:"¿Confirma que desea cancelar este registro?",cancelOk:"Elemento cancelado correctamente.",unlink:"¿Confirma que desea desasociar estos registros?",unlinkOk:"Registros desasociados correctamente",linkOk:"Registros asociados correctamente.",closeText:"close",prevText:"prev.",nextText:"sig.",currentText:"current",monthNames:["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"],monthNamesShort:["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"],dayNames:["Domingo","Lunes","Martes","Miércoles","Jueves","Viernes","Sábado"],dayNamesShort:["Dom","Lun","Mar","Mié","Juv","Vie","Sáb"],dayNamesMin:["Do","Lu","Ma","Mi","Ju","Vi","Sa"],dateFormat:"dd/mm/yy",firstDay:1,toInt:nb.toInt,isoInt:function(t){return nb.isoInt(t,".")},fmtInt:function(t){return nb.fmtInt(t,".")},toFloat:function(t){return nb.toFloat(t,",")},isoFloat:function(t,e){return nb.isoFloat(t,".",",",e)},fmtFloat:function(t,e){return nb.fmtFloat(t,".",",",e)},toDate:dt.esDate,isoDate:dt.isoEsDate,isoDateTime:dt.isoEsDateTime,fmtDate:dt.fmtEsDate,acDate:dt.acEsDate,toTime:dt.toTime,minTime:dt.minTime,isoTime:dt.isoTime,fmtTime:dt.fmtTime,acTime:dt.acTime,get:function(t,e){return t[e]}}};let i=r.es;this.getLang=function(t){return t?r[t]:i},this.setLang=function(t,e){return r[t]=e,n},this.addLang=function(t,e){return Object.assign(r[t],e),n},this.getI18n=function(t){return t&&(r[t]||r[t.substr(0,2)])||r.es},this.setI18n=function(t){return i=n.getI18n(t),n},this.get=function(t){return i[t]},this.set=function(t,e){return i[t]=e,n}}function JsBox(){const a=this;function t(t){console.log("Log:",t)}function s(t){return t?t.length:0}function o(t){return t&&1===t.nodeType}function u(t){return t?t.split(" "):[]}function l(t,e){return o(t)&&t.matches(e)}function i(t,e,n){t.matches(e)&&n.push(t)}function r(e,n,r){for(let t=e.previousElementSibling;t;t=t.previousElementSibling)i(t,n,r)}function c(e,n,r){for(let t=e.nextElementSibling;t;t=t.nextElementSibling)i(t,n,r)}function f(t,e,n){r(t,e,n),c(t,e,n)}function d(e,n){for(let t=e.previousElementSibling;t;t=t.previousElementSibling)n.push(t)}function h(e,n){for(let t=e.nextElementSibling;t;t=t.nextElementSibling)n.push(t)}function m(t,e){d(t,e),h(t,e)}function n(t,e){return"SELECT"===t.tagName?(e=e||t.getAttribute("value"),t.selectedIndex=Array.from(t.options).findIndex(t=>t.value==e)):t.value=e,a}this.getLang=function(){return document.querySelector("html").getAttribute("lang")||navigator.language||navigator.userLanguage},this.buildPath=function(t,e){e=e||window.location.pathname;let n=new URLSearchParams(t),r=new URLSearchParams(window.location.search);return n.forEach((t,e)=>r.set(e,t)),e+"?"+r.toString()},this.scrollTop=function(t){t=t||600;let e=-window.scrollY/(t/15),n=setInterval(()=>{0<window.scrollY?window.scrollBy(0,e):clearInterval(n)},15);return a},this.fetch=function(r){return(r=r||{}).headers=r.headers||{},r.reject=r.reject||t,r.resolve=r.resolve||t,r.headers["x-requested-with"]="XMLHttpRequest",r.headers.Authorization="Bearer "+window.localStorage.getItem("jwt"),window.fetch(r.action,r).then(t=>{let e=t.headers.get("content-type")||"",n=-1<e.indexOf("application/json")?t.json():t.text();return n.then(t.ok?r.resolve:r.reject)})},this.mask=function(t,n){return a.each(t,(t,e)=>{0==(n>>e&1)?a.addClass(t,"hide"):a.removeClass(t,"hide")})},this.select=function(t,e){a.mask(t.querySelectorAll("option"),e);e=t.querySelector("option[value='"+t.value+"']");return a.hasClass(e,"hide")&&(e=a.find(t.children,"option:not(.hide)"),t.value=e?e.value:null),a},this.each=function(e,n){var r=s(e);for(let t=0;t<r;t++)n(e[t],t);return a},this.reverse=function(e,n){for(let t=s(e)-1;-1<t;t--)n(e[t],t);return a},this.matches=function(t,e){return e&&l(t,e)},this.find=function(e,n){if(n){if(l(e,n))return e;var r=s(e);for(let t=0;t<r;t++){var i=e[t];if(l(i,n))return i}}return null},this.filter=function(t,e){let n=[];return e&&a.each(t,t=>i(t,e,n)),n},this.get=function(t,e){return e=e||document,(t=t)&&e.querySelector(t)},this.getAll=function(t,e){return e=e||document,(t=t)&&e.querySelectorAll(t)},this.prev=function(t,e){let n=[];return o(t)?e?r(t,e,n):d(t,n):e?a.each(t,t=>r(t,e,n)):a.each(t,t=>d(t,n)),n},this.next=function(t,e){let n=[];return o(t)?e?c(t,e,n):h(t,n):e?a.each(t,t=>c(t,e,n)):a.each(t,t=>h(t,n)),n},this.siblings=function(t,e){let n=[];return o(t)?e?f(t,e,n):m(t,n):e?a.each(t,t=>f(t,e,n)):a.each(t,t=>m(t,n)),n},this.focus=function(t){const e=a.find(t,"[tabindex]:not([type=hidden][readonly][disabled]):not([tabindex='-1'][tabindex=''])");return e&&e.focus(),a},this.val=function(t,e){return o(t)?n(t,e):a.each(t,t=>n(t,e)),a},this.text=function(t,e){return o(t)?t.innerText=e:a.each(t,t=>{t.innerText=e}),a},this.html=function(t,e){return o(t)?t.innerHTML=e:a.each(t,t=>{t.innerHTML=e}),a},this.import=function(t,e){return e?a.each(t,t=>n(t,e[t.name]??"")):a.val(t,"")},this.export=function(t,e){return e=e||{},a.each(t,t=>{e[t.name]=t.value}),delete e.undefined,e},this.isVisible=function(t){return!!(t.offsetWidth||t.offsetHeight||t.getClientRects().length)},this.show=function(t,e){return e=e||"block",o(t)?t.style.display=e:a.each(t,t=>{t.style.display=e}),a},this.hide=function(t){return o(t)?t.style.display="none":a.each(t,t=>{t.style.display="none"}),a},this.hasClass=function(t,e){let n=s(t)?t[0]:t;return n&&u(e).some(t=>n.classList.contains(t))},this.setClass=function(t,e){function n(t){t.className=e}return o(t)?n(t):a.each(t,n),a},this.addClass=function(t,e){let n=u(e);function r(e){n.forEach(t=>e.classList.add(t))}return o(t)?r(t):a.each(t,r),a},this.removeClass=function(t,e){let n=u(e);function r(e){n.forEach(t=>e.classList.remove(t))}return o(t)?r(t):a.each(t,r),a},this.toggle=function(t,e,n){let r=u(e);function i(e){r.forEach(t=>e.classList.toggle(t))}return o(t)?i(t):a.each(t,i),a};function g(e,t,n){return e.addEventListener(t,t=>n(e,t)),a}this.fadeOut=function(t){function e(e){let n=parseFloat(e.style.opacity)||0;!function t(){(n-=.03)<0?e.style.display="none":requestAnimationFrame(t),e.style.opacity=n}()}return o(t)?e(t):a.each(t,e),a},this.fadeIn=function(t,r){function e(e){e.style.display=r||"block";let n=parseFloat(e.style.opacity)||0;!function t(){(n+=.03)<1&&requestAnimationFrame(t),e.style.opacity=n}()}return o(t)?e(t):a.each(t,e),a},this.fadeToggle=function(t,e){var n=s(t)?t[0]:t;return(parseFloat(n&&n.style.opacity)||0)<.03?a.fadeIn(t,e):a.fadeOut(t)},this.ready=function(t){return g(document,"DOMContentLoaded",t)},this.click=function(t,e){return o(t)?g(t,"click",e):a.each(t,t=>g(t,"click",e))},this.change=function(t,e){return o(t)?g(t,"change",e):a.each(t,t=>g(t,"change",e))},this.keyup=function(t,e){return o(t)?g(t,"keyup",e):a.each(t,t=>g(t,"keyup",e))},this.keydown=function(t,e){return o(t)?g(t,"keydown",e):a.each(t,t=>g(t,"keydown",e))},this.trigger=function(t,e){let n=new Event(e);return o(t)?el.dispatchEvent(n):a.each(t,t=>t.dispatchEvent(n))}}function NumberBox(){const u=/\D+/g;function i(t){return null!=t}function l(t,e){for(var n=[],r=t.length;e<r;r-=e)n.unshift(t.substr(r-e,e));return 0<r&&n.unshift(t.substr(0,r)),n}function n(t,e){var n="-"==t.charAt(0)?"-":"",t=t.replace(u,"").replace(/^0+(\d+)/,"$1");return t?n+l(t,3).join(e):null}function a(e,n,r,i,a){i=isNaN(i)?2:i;var s=e.lastIndexOf(a),a="-"==e.charAt(0)?"-":"";let o=0<s?e.substr(0,s):e;if(o=0==s?"0":o.replace(u,"").replace(/^0+(\d+)/,"$1"),o){let t=s<0?"0":e.substr(s+1,i);return a+l(o,3).join(n)+r+(s<0?"0".repeat(i):t.padEnd(i,"0"))}return null}this.toInt=function(t){if(!t)return null;var e="-"==t.charAt(0)?"-":"",t=parseInt(e+t.replace(u,""));return isNaN(t)?null:t},this.isoInt=function(t,e){return i(t)?n(""+t,e):null},this.fmtInt=function(t,e){return t&&n(t,e)},this.intval=function(t){return parseInt(t)||0},this.toFloat=function(t,e){if(!t)return null;var n=t.lastIndexOf(e),e="-"==t.charAt(0)?"-":"";let r=n<0?t:t.substr(0,n);n=n<0?"":"."+t.substr(n+1),n=parseFloat(e+r.replace(u,"")+n);return isNaN(n)?null:n},this.isoFloat=function(t,e,n,r){return i(t)?a(""+t,e,n,r,"."):null},this.fmtFloat=function(t,e,n,r){return t&&a(t,e,n,r,n)},this.floatval=function(t){return parseFloat(t)||0}}function ObjectBox(){const i=this;function n(t){return t&&"object"==typeof t}this.isobj=n,this.set=function(t,e,n){return t[e]=n,i},this.add=function(t,e,n){return t[e]=n,t},this.del=function(t,e){return delete t[e],i},this.eq=function(e,n,t){return(t=t||Object.keys(n)).every(t=>e[t]==n[t])},this.merge=function(t,r){return r?t.reduce((t,e,n)=>i.add(t,e,r[n]),{}):{}},this.empty=function(t){for(var e in t)if(null!=t[e])return!1;return!0},this.falsy=function(t){for(var e in t)if(t[e])return!1;return!0},this.clear=function(t){for(var e in t)delete t[e];return i},this.deepClear=function(t){for(var e in t)n(t[e])?i.deepClear(t[e]):Array.isArray(t[e])&&t[e].splice(0),delete t[e];return i}}function StringBox(){const a=this,e=/"|'|&|<|>|\\/g,n={'"':"&#34;","'":"&#39;","&":"&#38;","<":"&#60;",">":"&#62;","\\":"&#92;"};function r(t){return"string"==typeof t||t instanceof String}function s(t){return r(t)?t.trim():t}function o(t){return t?t.length:0}function i(t){for(var e="",n=o(s(t)),r=0;r<n;r++){var i=t.charAt(r),a="àáâãäåāăąÀÁÂÃÄÅĀĂĄÆßèéêëēĕėęěÈÉĒĔĖĘĚìíîïìĩīĭÌÍÎÏÌĨĪĬòóôõöōŏőøÒÓÔÕÖŌŎŐØùúûüũūŭůÙÚÛÜŨŪŬŮçÇñÑþÐŔŕÿÝ".indexOf(i);e+=a<0?i:"aaaaaaaaaAAAAAAAAAABeeeeeeeeeEEEEEEEiiiiiiiiIIIIIIIIoooooooooOOOOOOOOOuuuuuuuuUUUUUUUUcCnNdDRryY".charAt(a)}return e.toLowerCase()}this.isset=function(t){return null!=t},this.isstr=r,this.trim=s,this.size=o,this.eq=function(t,e){return i(t)==i(e)},this.iiOf=function(t,e){return i(t).indexOf(i(e))},this.substr=function(t,e,n){return t&&t.substr(e,n)},this.indexOf=function(t,e){return t?t.indexOf(e):-1},this.lastIndexOf=function(t,e){return t?t.lastIndexOf(e):-1},this.prevIndexOf=function(t,e,n){return t?t.substr(0,n).lastIndexOf(e):-1},this.starts=function(t,e){return t&&t.startsWith(e)},this.ends=function(t,e){return t&&t.endsWith(e)},this.prefix=function(t,e){return a.starts(t,e)?t:e+t},this.suffix=function(t,e){return a.ends(t,e)?t:t+e},this.trunc=function(t,e){return o(t)>e?t.substr(0,e).trim()+"...":t},this.itrunc=function(t,e){var n=o(t)>e?a.prevIndexOf(t," ",e):-1;return a.trunc(t,n<0?e:n)},this.escape=function(t){return t&&t.replace(e,t=>n[t])},this.unescape=function(t){return t&&t.replace(/&#(\d+);/g,(t,e)=>String.fromCharCode(e))},this.removeAt=function(t,e,n){return e<0?t:t.substr(0,e)+t.substr(e+n)},this.insertAt=function(t,e,n){return t?t.substr(0,n)+e+t.substr(n):e},this.replaceAt=function(t,e,n,r){return n<0?t:t.substr(0,n)+e+t.substr(n+r)},this.replaceLast=function(t,e,n){return t?a.replaceAt(t,n,t.lastIndexOf(e),e.length):n},this.wrapAt=function(t,e,n,r,i){return e<0?t:a.insertAt(a.insertAt(t,r,e),i,e+r.length+n)},this.iwrap=function(t,e,n,r){return e&&a.wrapAt(t,a.iiOf(t,e),e.length,n||"<u><b>",r||"</b></u>")},this.rand=function(t){return Math.random().toString(36).substr(2,t||8)},this.lopd=function(t){return t&&"***"+t.substr(3,4)+"**"},this.toDate=function(t){return t?new Date(t):null},this.split=function(t,e){return t?t.trim().split(e||","):[]},this.minify=function(t){return t&&t.trim().replace(/\s{2}/g,"")},this.lines=function(t){return a.split(t,/[\n\r]+/)},this.words=function(t){return a.split(t,/\s+/)},this.ilike=function(t,e){return-1<a.iiOf(t,e)},this.olike=function(e,t,n){return t.some(function(t){return a.ilike(e[t],n)})},this.alike=function(e,n,t){return a.words(t).some(function(t){return a.olike(e,n,t)})},this.between=function(t,e,n){return n=n??t,(e=e??t)<=t&&t<=n},this.ltr=function(t,e){for(var n=[],r=o(t);e<r;r-=e)n.unshift(t.substr(r-e,e));return 0<r&&n.unshift(t.substr(0,r)),n},this.rtl=function(t,e){for(var n=[],r=o(t),i=0;i<r;i+=e)n.push(t.substr(i,e));return n},this.slices=function(e,n){var r=0,i=[],a=o(e);for(let t=0;r<a&&t<n.length;t++){var s=n[t];i.push(e.substr(r,s)),r+=s}return r<a&&i.push(e.substr(r)),i}}const ab=new ArrayBox,dt=new DateBox,nb=new NumberBox,ob=new ObjectBox,sb=new StringBox,i18n=new I18nBox,js=new JsBox;function ValidatorBox(){const r=this,i={},n={},s="",a=new Date;let o,u,l={},c=0;const e=/"|'|&|<|>|\\/g,f={'"':"&#34;","'":"&#39;","&":"&#38;","<":"&#60;",">":"&#62;","\\":"&#92;"},d=/^\d+$/,h=/^\d+(,\d+)*$/,m=/\w+[^\s@]+@[^\s@]+\.[^\s@]+/,g=/^[\w#@&°!§%;:=\^\/\(\)\?\*\+\~\.\,\-\$]{8,}$/;const v=/^(\d{8})([A-Z])$/,p=/^([ABCDEFGHJKLMNPQRSUVW])(\d{7})([0-9A-J])$/,j=/^[XYZ]\d{7,8}[A-Z]$/;function b(t){return t?t.length:0}function y(t){return t&&t.trim().replace(/\W+/g,s).toUpperCase()}function E(t,e,n){return e<=t&&t<=n}function x(t){return t&&t.replace(e,t=>f[t])}this.unescape=function(t){return t&&t.replace(/&#(\d+);/g,(t,e)=>String.fromCharCode(e))},this.escape=x,this.size=function(t,e,n){return E(b(t),e,n)},this.range=function(t,e,n){return E(parseFloat(t),e,n)},this.regex=function(t,e){try{return e&&t.test(e)}catch(t){}return!1},this.login=function(t){return r.regex(g,t)?t:null},this.digits=function(t){return r.regex(d,t)?t:null},this.idlist=function(t){return r.regex(h,t)?t:null},this.email=function(t){return r.regex(m,t)?t.toLowerCase():null},this.sysdate=function(){return a},this.toISODateString=function(t){return(t||a).toISOString().substring(0,10)},this.isset=function(t,e,n){return null!=e?e:r.addError(t,n)},this.close=function(t,e,n){return Math.min(Math.max(+t,e),n)},this.idES=function(t){if(t=y(t)){if(r.regex(v,t))return r.dni(t);if(r.regex(p,t))return r.cif(t);if(r.regex(j,t))return r.nie(t)}return null},this.dni=function(t){return"TRWAGMYFPDXBNJZSQVHLCKE".charAt(parseInt(t,10)%23)==t.charAt(8)?t:null},this.cif=function(t){for(var e=t.match(p),n=e[1],r=e[2],i=e[3],a=0,s=0;s<r.length;s++){var o=parseInt(r[s],10);a+=o=s%2==0?(o*=2)<10?o:parseInt(o/10)+o%10:o}var u=0!==(a%=10)?10-a:a,e="JABCDEFGHI".substr(u,1);return(n.match(/[ABEH]/)?i==u:!n.match(/[KPQS]/)&&i==u||i==e)?t:null},this.nie=function(t){var e=t.charAt(0),e="X"==e?0:"Y"==e?1:"Z"==e?2:e;return r.dni(e+t.substr(1))},this.iban=function(t){var e=(t=y(t))&&t.match(/^([A-Z]{2})(\d{2})([A-Z\d]+)$/);if(!e||b(t)!=={AD:24,AE:23,AT:20,AZ:28,BA:20,BE:16,BG:22,BH:22,BR:29,CH:21,CR:22,CY:28,CZ:24,DE:22,DK:18,DO:28,EE:20,ES:24,FI:18,FO:18,FR:27,GB:22,GI:23,GL:18,GR:27,GT:28,HR:21,HU:28,IE:22,IL:23,IS:26,IT:27,JO:30,KW:30,KZ:20,LB:28,LI:21,LT:20,LU:20,LV:21,MC:27,MD:24,ME:22,MK:19,MR:27,MT:31,MU:30,NL:18,NO:15,PK:24,PL:28,PS:29,PT:25,QA:29,RO:24,RS:22,SA:24,SE:24,SI:19,SK:24,SM:27,TN:24,TR:26,AL:28,BY:28,EG:29,GE:22,IQ:23,LC:32,SC:31,ST:25,SV:28,TL:23,UA:29,VA:22,VG:24,XK:20}[e[1]])return null;let n=(e[3]+e[1]+e[2]).replace(/[A-Z]/g,t=>t.charCodeAt(0)-55);var r;s;let i=n.toString(),a=i.slice(0,2);for(let t=2;t<i.length;t+=7)r=a+i.substring(t,t+7),a=parseInt(r,10)%97;return 1===a?t:null},this.creditCardNumber=function(n){if(16!=b(n=y(n)))return null;let r=0,i=!1;for(let e=15;0<=e;e--){let t=+n[e];i&&(t*=2,t-=9<t?9:0),r+=t,i=!i}return r%10==0?n:null},this.generatePassword=function(t,e){return e=e||"abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_#@&°!§%;:=^/()?*+~.,-$",Array.apply(null,Array(t||10)).map(function(){return e.charAt(Math.random()*e.length)}).join(s)},this.testPassword=function(t){var e=0;return e+=/[A-Z]+/.test(t)?1:0,e+=/[a-z]+/.test(t)?1:0,e+=/[0-9]+/.test(t)?1:0,e+=/[\W]+/.test(t)?1:0,e+=2<e&&8<b(t)},this.get=function(t){return r[t]},this.set=function(t,e){return r[t]=e,r},this.getI18n=function(){return u},this.setI18n=function(t){return u=t,r},this.clear=function(t){for(var e in t)delete t[e];return r},this.getMsgs=function(){return i},this.getMsg=function(t){return i[t]},this.setMsg=function(t,e){return i[t]=e,r},this.getMsgOk=function(){return i.msgOk},this.setMsgOk=function(t){return i.msgOk=t,r},this.getMsgInfo=function(){return i.msgInfo},this.setMsgInfo=function(t){return i.msgInfo=t,r},this.getMsgWarn=function(){return i.msgWarn},this.setMsgWarn=function(t){return i.msgWarn=t,r},this.getMsgError=function(){return i.msgError},this.setError=function(t,e){return c++,r.setMsg(t,e)},this.addError=function(t,e){return r.setError(t,e),null},this.setMsgError=function(t){return r.setError("msgError",t)},this.closeMsgs=function(t){return r.setMsgError(t).getMsgs()},this.getForm=function(t){return n[t]},this.setForm=function(t,e){return n[t]=e,r},this.getFields=function(t){t=r.getForm(t);return t?Object.keys(t):[]},this.getData=function(t){return t?o[t]:o},this.getInput=function(t){return l[t]},this.setInput=function(t,e){return l[t]=(e=e)&&e.trim(),r},this.getInputs=function(){return l},this.setInputs=function(t){return l=t,r},this.init=function(t,e){return r.setInputs(t).setI18n(e)},this.validate=function(t){o={},c=0,a.setTime(Date.now());var e,n=r.clear(i).getForm(t);for(e in n){let t=n[e];o[e]=t(e,x(l[e]),u)}return n&&0==c}}js.ready(function(){var t=js.getLang();const n=i18n.setI18n(t).getLang();valid.setI18n(n);let e=js.getAll("div.alert"),r=js.getAll(".alert-text");t=js.getAll(".alert-close");function i(t){js.fadeIn(t.parentNode,"grid")}function a(t,e){t.innerHTML=e,i(t)}function s(t){t&&a(r[0],t)}function o(t){t&&a(r[3],t)}js.each(r,t=>{t.firstChild&&i(t)}),js.click(t,t=>{js.fadeOut(t.parentNode)});let u=document.querySelector(".loading");function l(){js.show(u).closeAlerts()}function c(){js.fadeOut(u)}const f="input-error",d=".msg-error";js.showOk=function(t){return s(t),js},js.showInfo=function(t){return(t=t)&&a(r[1],t),js},js.showWarn=function(t){return(t=t)&&a(r[2],t),js},js.showError=function(t){return o(t),js},js.closeAlerts=function(){return js.hide(e)},js.showAlerts=function(t){return t?js.showOk(t.msgOk).showInfo(t.msgInfo).showWarn(t.msgWarn).showError(t.msgError):js},js.clean=function(t){return js.closeAlerts().removeClass(t,f).text(js.siblings(t,d),"").focus(t)},js.showErrors=function(t,n){return js.showAlerts(n).reverse(t,t=>{var e=t.name&&n[t.name];e&&js.focus(t).addClass(t,f).html(js.siblings(t,d),e)})},js.load=function(t,e){return js.import(t,e),js.each(js.filter(t,".integer"),t=>{t.value=n.isoInt(e[t.name])}).each(js.filter(t,".float"),t=>{t.value=n.isoFloat(e[t.name])}).each(js.filter(t,".date"),t=>{t.value=n.isoDate(sb.toDate(e[t.name]))}).each(js.filter(t,".time"),t=>{t.value=n.minTime(sb.toDate(e[t.name]))}),js.showAlerts(e)},js.parse=function(t,e){return e=js.export(t,e),js.each(js.filter(t,".integer"),t=>{e[t.name]=n.toInt(e[t.name])}).each(js.filter(t,".float"),t=>{e[t.name]=n.toFloat(e[t.name])}).each(js.filter(t,".date"),t=>{e[t.name]=n.toDate(e[t.name])}).each(js.filter(t,".time"),t=>{e[t.name]=n.toTime(e[t.name])}),e},js.ajax=function(t,e,n){return l(),js.fetch({action:t,resolve:e||s,reject:n||o}).catch(o).finally(c)},js.autocomplete=function(r){let n=!1;function t(){return!1}function i(t){return js.siblings(t,"[type=hidden]")}return(r=r||{}).action=r.action||"#",r.minLength=r.minLength||3,r.delay=r.delay||500,r.open=r.open||t,r.focus=r.focus||t,r.load=r.load||t,r.remove=r.remove||t,r.render=r.render||function(){return"-"},r.search=function(t,e){return n},r.select=function(t,e){return r.load(e.item,this,i(this)),!1},r.source=function(n,e){this.element.autocomplete("instance")._renderItem=function(t,e){e=sb.iwrap(r.render(e),n.term);return $("<li>").append("<div>"+e+"</div>").appendTo(t)},js.ajax(r.action+"?term="+n.term,t=>e(t.slice(0,10)))},r.change=function(t,e){e.item||(js.val(this,"").val(i(this),""),r.remove(this))},$(r.inputs).autocomplete(r),js.keydown(r.inputs,(t,e)=>{n=8==e.keyCode||sb.between(e.keyCode,46,111)||sb.between(e.keyCode,160,223)})},valid.validateForm=function(t){var e=t.elements;return js.clean(e).export(e,valid.getInputs()),valid.validate(t.getAttribute("action"))||!js.showErrors(e,valid.closeMsgs(n.errForm))},valid.submit=function(e,t,n,r){if(t.preventDefault(),valid.validateForm(e)){l();let t=new FormData(e);for(var i in valid.getInputs())t.has(i)||t.append(i,valid.getInput(i));js.fetch({method:e.method,action:n||e.action,body:"multipart/form-data"===e.enctype?t:new URLSearchParams(t),reject:function(t){js.showErrors(e.elements,t)},resolve:r||s}).catch(o).finally(c)}return valid}});const valid=new ValidatorBox;valid.set("required",function(t,e,n){return valid.size(e,1,200)?e:valid.addError(t,n.errRequired)}).set("required50",function(t,e,n){return valid.size(e,1,50)?e:valid.addError(t,n.errRequired)}).set("required800",function(t,e,n){return valid.size(e,1,800)?e:valid.addError(t,n.errRequired)}).set("min8",function(t,e,n){return valid.size(e,8,200)?e:valid.addError(t,n.errMinlength8)}).set("max50",function(t,e,n){return valid.size(e,0,50)?e:valid.addError(t,n.errMaxlength)}).set("max200",function(t,e,n){return valid.size(e,0,200)?e:valid.addError(t,n.errMaxlength)}).set("max800",function(t,e,n){return valid.size(e,0,800)?e:valid.addError(t,n.errMaxlength)}).set("token",function(t,e,n){return valid.size(e,200,800)?e:valid.addError(t,n.errRegex)}).set("usuario",function(t,e,n){return valid.min8(t,e,n)&&(valid.idES(e)||valid.email(e)||valid.addError(t,n.errRegex))}).set("clave",function(t,e,n){return valid.min8(t,e,n)&&(valid.login(e)||valid.addError(t,n.errRegex))}).set("reclave",function(t,e,n){return valid.clave(t,e,n)&&(e==valid.getData("clave")?e:valid.addError(t,n.errReclave))}).set("nif",function(t,e,n){return valid.required(t,e,n)&&(valid.idES(e)||valid.addError(t,n.errNif))}).set("correo",function(t,e,n){return valid.required(t,e,n)&&(valid.email(e)||valid.addError(t,n.errCorreo))}).set("dateval",function(t,e,n){return n.toDate(e)||valid.addError(t,n.errDate)}).set("datenull",function(t,e,n){return n.toDate(e)}).set("ltNow",function(t,e,n){let r=valid.required(t,e,n)&&valid.dateval(t,e,n);return r&&r.getTime()<Date.now()?r:valid.addError(t,n.errDateLe)}).set("leToday",function(t,e,n){e=valid.required(t,e,n)&&valid.dateval(t,e,n);return e&&valid.toISODateString(e)<=valid.toISODateString()?e:valid.addError(t,n.errDateLe)}).set("gtNow",function(t,e,n){let r=valid.required(t,e,n)&&valid.dateval(t,e,n);return r&&r.getTime()>Date.now()?r:valid.addError(t,n.errDateGe)}).set("geToday",function(t,e,n){e=valid.required(t,e,n)&&valid.dateval(t,e,n);return e&&valid.toISODateString(e)>=valid.toISODateString()?e:valid.addError(t,n.errDateGe)}).set("intval",function(t,e,n){return valid.isset(t,n.toInt(e),n.errNumber)}).set("intnull",function(t,e,n){return n.toInt(e)}).set("floatval",function(t,e,n){return valid.isset(t,n.toFloat(e),n.errNumber)}).set("floatnull",function(t,e,n){return n.toFloat(e)}).set("key",function(t,e,n){e=n.toInt(e);return null===e||0<e?e:valid.addError(t,n.errGt0)}).set("gt0",function(t,e,n){e=valid.required(t,e,n)&&valid.floatval(t,e,n);return 0<e?e:valid.addError(t,n.errGt0)}),js.ready(function(){const s=i18n.getLang();$.datepicker.regional.es=i18n.getI18n("es"),$.datepicker.setDefaults(i18n.getLang()),"undefined"!=typeof grecaptcha&&grecaptcha.ready(function(){js.click(js.getAll(".captcha"),(e,n)=>{grecaptcha.execute("6LeDFNMZAAAAAKssrm7yGbifVaQiy1jwfN8zECZZ",{action:"submit"}).then(t=>valid.setInput("token",t).submit(e.closest("form"),n)).catch(js.showError),n.preventDefault()})}),js.val(js.getAll("select")),js.reverse(js.getAll("form"),n=>{let r=n.elements;js.change(js.filter(r,".integer"),t=>{t.value=s.fmtInt(t.value)}),js.change(js.filter(r,".float"),t=>{t.value=s.fmtFloat(t.value)});var t=js.filter(r,".date");js.keyup(t,t=>{t.value=s.acDate(t.value)}).change(t,t=>{t.value=s.fmtDate(t.value)});t=js.filter(r,".time");js.keyup(t,t=>{t.value=s.acTime(t.value)}).change(t,t=>{t.value=s.fmtTime(t.value)}),$(r).filter(".datepicker").datepicker({dateFormat:i18n.get("dateFormat"),changeMonth:!1});let e=js.filter(r,"textarea[maxlength]");function i(t){var e=Math.abs(t.getAttribute("maxlength")-sb.size(t.value));js.text(n.querySelector("#counter-"+t.id),e)}function a(t,e){return!js.setClass(js.next(t,"i"),e)}js.keyup(e,i).each(e,i),js.autocomplete({inputs:js.filter(r,".ac-user"),action:"/user/find.html",render:function(t){return t.nif+" - "+(t.nm+" "+t.ap1+" "+t.ap2).trim()},load:function(t,e,n){js.val(e,this.render(t)).val(n,t.nif)}}).autocomplete({inputs:js.filter(r,".ac-menu"),action:"/menu/find.html",focus:function(t,e){return a(this,"input-item input-icon "+(e.item&&e.item.icon||"fas fa-arrow-alt-circle-up"))},remove:function(t){a(t,"input-item input-icon fas fa-arrow-alt-circle-up")},render:function(t){return(t.icon?'<i class="'+t.icon+'"></i> - ':"")+s.get(t,"nm")},load:function(t,e,n){js.val(e,s.get(t,"nm")).val(n,t.id)}}),js.change(js.filter(r,".update-icon"),t=>{js.setClass(t.nextElementSibling,"input-item input-icon "+(t.value||"far fa-window-close"))}),js.click(js.filter(r,"[type=reset]"),()=>{n.reset(),js.clean(r).each(e,i)}).click(js.filter(r,".clear-all"),()=>{js.val(r,"").clean(r).each(e,i)}).click(js.getAll("a.nav-to",n),(t,e)=>{js.ajax(t.href,t=>{js.load(r,t).trigger(r,"change")}),e.preventDefault()}).click(js.getAll("a.duplicate",n),(t,e)=>{valid.submit(n,e,t.href,t=>{js.load(r,t).toggle(js.getAll("a.nav-to",n),"btn hide")})}),js.focus(r),n.addEventListener("submit",t=>{n.classList.contains("ajax")?valid.submit(n,t,null,t=>{js.load(r,t)}):valid.validateForm(n)||t.preventDefault()})})}),js.ready(function(){const s=i18n.getLang();js.getAll("table").forEach(n=>{let r=js.getAll("a.sort",n.thead),i=n.tBodies[0];function a(t,e){confirm(s.remove)&&js.ajax(t.href,t=>{i.innerHTML=t.html,js.text(js.get("#rows",n.tfoot),i.children.length).text(js.get("#size",n.tfoot),t.size),js.showAlerts(t)}),e.preventDefault()}js.click(r,(t,e)=>{e.preventDefault();e=js.hasClass(t,"asc")?"desc":"asc";js.removeClass(r,"asc desc").addClass(t,e),js.ajax(t.href+"&dir="+e,t=>{js.html(i,t.html).click(js.getAll("a.remove-row",i),a)})}),js.click(js.getAll("a.remove-row",i),a)}),js.click(js.getAll("a.remove"),(t,e)=>{confirm(s.remove)||e.preventDefault()})}),js.ready(function(){js.getAll("ul.menu").forEach(function(e){let t=Array.from(e.children);t.sort((t,e)=>+t.dataset.orden-+e.dataset.orden),t.forEach(n=>{e.appendChild(n);var t=n.dataset.mask;8==(8&t)&&(n.innerHTML+='<ul class="sub-menu"></ul>',n.firstElementChild.innerHTML+='<b class="nav-tri">&rtrif;</b>',js.click(n.firstElementChild,(t,e)=>{js.toggle(n,"active"),e.preventDefault()})),0==(4&t)&&js.addClass(n.firstElementChild,"disabled")});for(let t=0;t<e.children.length;){var n=e.children[t],r=n.dataset.padre;if(r){let t=js.get("li[id='"+r+"']",e);t&&t.lastElementChild.appendChild(n)}else t++}js.fadeIn(e.children)}),js.click(js.getAll(".sidebar-toggle"),(t,e)=>{js.toggle(js.getAll(".sidebar-icon",t.parentNode),"hide"),js.toggle(js.get("#sidebar",t.parentNode),"active"),e.preventDefault()});let t=js.get("#back-to-top");js.click(t,()=>{js.scrollTop(400)}),window.onscroll=function(){80<window.pageYOffset?js.fadeIn(t):js.fadeOut(t)},window.addEventListener("unload",function(t){js.ajax("/session/destroy.html")})}),js.ready(function(){let t=document.querySelectorAll("ul#tab-nav li"),e=document.querySelectorAll(".tab-contents"),n=document.querySelectorAll("ul#progressbar li"),r=n.length||e.length,i=0;function a(t){return t<0?0:t<r?t:r-1}function s(){js.removeClass(t,"active").addClass(t[i],"active"),js.removeClass(e,"active").addClass(e[i],"active"),n.forEach((t,e)=>{js.toggle(t,"active",e<=i)})}js.click(js.getAll(".prev-tab"),()=>(i=a(i-1),s())),js.click(js.getAll(".next-tab"),()=>(i=a(i+1),s()));var o=js.getAll("a[href^='#']");js.click(js.filter(o,"[href^='#tab-']"),t=>(i=a(+t.href.substr(t.href.lastIndexOf("-")+1)-1),s())),js.click(js.getAll("a.show-info"),(t,e)=>{js.toggle(t.lastElementChild,"fa-angle-double-up fa-angle-double-down").toggle(js.next(t,".extra-info"),"hide"),e.preventDefault()}),js.click(js.filter(o,":not([href^='#tab-'])"),function(e,t){try{let t=document.querySelector(e.getAttribute("href"));t&&t.scrollIntoView({behavior:"smooth"})}catch(t){}t.preventDefault()})}),valid.setForm("/login.html",{usuario:valid.usuario,clave:valid.clave}).setForm("/contact.html",{nm:valid.required,correo:valid.correo,asunto:valid.required,info:valid.required}).setForm("/signup.html",{token:valid.token,nm:valid.required,ap1:valid.required,nif:valid.nif,correo:valid.correo}).setForm("/reactive.html",{token:valid.token,correo:valid.correo}),valid.setForm("/user/pass.html",{oldPass:valid.min8,clave:valid.min8,reclave:valid.reclave}).setForm("/user/profile.html",{nm:valid.required,ap1:valid.required,ap2:valid.max200,nif:valid.nif,correo:valid.correo});const MENU_SAVE={id:valid.key,ico:valid.max50,nm:valid.required,nm_en:valid.max200,pn:valid.max200,padre:function(t,e,n){var r=valid.getData("id"),e=n.toInt(e);return sb.isset(r)&&sb.isset(e)&&r==e&&valid.setError("pn",n.errRefCircular),e},orden:valid.intval,mask:valid.intval,alta:valid.ltNow},MENU_FILTER={fn:valid.max200,o1:valid.intnull,o2:valid.intnull,f1:valid.datenull,f2:valid.datenull};valid.setForm("/menu/save.html",MENU_SAVE).setForm("/menu/duplicate.html",MENU_SAVE),valid.setForm("/menu/filter.html",MENU_FILTER).setForm("/menu/search.html",MENU_FILTER),js.ready(function(){const t=i18n.getLang(),e=$("#f1").on("change",function(){n.datepicker("option","minDate",t.toDate(this.value))}),n=$("#f2").on("change",function(){e.datepicker("option","maxDate",t.toDate(this.value))})}),valid.setForm("/tests/email.html",{nombre:valid.required,correo:valid.correo,date:valid.datenull,number:valid.gt0,asunto:valid.required,info:valid.required800});