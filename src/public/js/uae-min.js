function ArrayBox(){const r=this;function o(t){return t?t.length:0}function l(t,e){return t==e?0:t<e?-1:1}this.size=o,this.empty=function(t){return o(t)<1},this.find=function(t,e){return t?t.find(e):null},this.ifind=function(t,e){return t?t.findIndex(e):-1},this.indexOf=function(t,e){return t?t.indexOf(e):-1},this.intersect=function(t,e){return e?t.filter(function(t){return-1<e.indexOf(t)}):[]},this.shuffle=function(t){return t.sort(function(){return.5-Math.random()})},this.unique=function(e,t){return t?e.concat(t.filter(t=>e.indexOf(t)<0)):e},this.distinct=function(n,i){return i?n.filter((e,t)=>n.findIndex(t=>e[i]===t[i])==t):n},this.swap=function(t,e,n){var i=t[e];return t[e]=t[n],t[n]=i,r},this.eq=function(t,n){return t&&n&&t.every((t,e)=>n[e]==t)},this.push=function(t,e){return t&&t.push(e),r},this.pushAt=function(t,e,n){return t&&t.splice(n,0,e),r},this.pop=function(t){return t&&t.pop(),r},this.popAt=function(t,e){return t&&t.splice(e,1),r},this.remove=function(t,e,n){return t&&t.splice(e,n),r},this.reset=function(t){return t&&t.splice(0),r},this.get=function(t,e){return t?t[e]:null},this.last=function(t){return r.get(t,o(t)-1)},this.clone=function(t){return t?t.slice():[]},this.sort=function(t,e){return t&&t.sort(e||l)},this.sortBy=function(t,n,i,e){return i=i||l,t&&n?t.sort("desc"==e?function(t,e){return i(e[n],t[n])}:function(t,e){return i(t[n],e[n])}):t},this.multisort=function(t,a,o,u){return u=u||[],o=o||[],t.sort(function t(e,n,i){var r=a[i=i||0];let s=u[i]||l;r="desc"==o[i]?s(n[field],e[field]):s(e[r],n[r]);return 0==r&&++i<a.length?t(e,n,i):r}),r},this.each=function(e,n){var i=o(e);for(let t=0;t<i;t++)n(e[t],t);return r},this.reverse=function(e,n){for(let t=o(e)-1;-1<t;t--)n(e[t],t);return r},this.extract=function(e,n){var i=o(e);for(let t=0;t<i;t++)n(e[t],t)&&e.splice(t--,1);return r},this.flush=function(t,e){e=r.ifind(t,e);return-1<e&&t.splice(e,1),r},this.format=function(t,e,s){(s=s||{}).separator=s.separator||"",s.empty=s.empty||"";const a={size:o(t)};return t&&e&&t.map((i,r)=>(a.index=r,a.count=r+1,e.replace(/@(\w+);/g,function(t,e){let n=s[e];return(n?n(i[e],i,r):i[e]??a[e])??s.empty}))).join(s.separator)},this.parse=function(t){return t?JSON.parse(t):null},this.read=function(t){return r.parse(window.sessionStorage.getItem(t))},this.stringify=function(t){return"string"==typeof(e=t)||e instanceof String?t:JSON.stringify(t);var e},this.ss=function(t,e){return e&&window.sessionStorage.setItem(t,r.stringify(e)),r},this.ls=function(t,e){return e&&window.localStorage.setItem(t,r.stringify(e)),r}}function DateBox(){const u=this,e="",s=new Date,n=/^\d.+$/,i=/\D+/g,r=[31,28,31,30,31,30,31,31,30,31,30,31];function a(t){return t&&t[0]}function o(t){return t&&n.test(t)}function l(t){return t.split(i)}function c(t){return t<10?"0"+t:t}function h(t){var e=t[2];return t[2]=t[0],t[0]=e,t}function f(t,e,n){return Math.min(Math.max(t||0,e),n)}function d(t){return f(t,0,59)}function m(t){return t<100?+(e+parseInt(s.getFullYear()/100)+c(t)):t}function g(t){return 0==(3&t)&&(t%25!=0||0==(15&t))}function v(t,e){return r[e]+(1==e&&g(t))}function p(t){return t&&t.getTime&&!isNaN(t.getTime())}function b(t){return t[0]=m(+t[0]||0),t[1]=f(t[1],1,12),t[2]=f(t[2],1,v(t[0],t[1]-1)),t}function T(t,e,n,i,r){return t.setHours(f(e,0,23),d(n),d(i),r||0),isNaN(t.getTime())?null:t}function D(t){let e=new Date;return t=b(t),e.setFullYear(t[0],t[1]-1,t[2]),T(e,t[3],t[4],t[5],t[6])}function y(t){return a(t)?D(t):null}function M(t){return c(t.getHours())+":"+c(t.getMinutes())}function I(t){return M(t)+":"+c(t.getSeconds())}function x(t){return t.getFullYear()+"-"+c(t.getMonth()+1)+"-"+c(t.getDate())}function A(t){return c(t.getDate())+"/"+c(t.getMonth()+1)+"/"+t.getFullYear()}this.build=D,this.isValid=p,this.sysdate=()=>s,this.toDate=t=>t?new Date(t):null,this.isLeap=t=>t&&g(t.getFullYear()),this.getDays=(t,e)=>Math.round(Math.abs((t-e)/864e5)),this.daysInMonth=t=>t?v(t.getFullYear(),t.getMonth()):0,this.toArray=t=>t?[t.getFullYear(),t.getMonth()+1,t.getDate(),t.getHours(),t.getMinutes(),t.getSeconds(),t.getMilliseconds()]:[],this.addDate=function(t,e){return t&&t.setDate(t.getDate()+e),u},this.addHours=function(t,e){return t&&t.setHours(t.getHours()+e),u},this.addMs=function(t,e){return t&&t.setMilliseconds(t.getMilliseconds()+e),u},this.reset=function(t){return t&&t.setFullYear(s.getFullYear(),s.getMonth(),s.getDate()),u},this.toISODateString=t=>(t||s).toISOString().substring(0,10),this.trunc=function(t){return t&&t.setHours(0,0,0,0),u},this.clone=function(t){return new Date((t||s).getTime())},this.randTime=(t,e)=>Math.floor(Math.random()*(e.getTime()-t.getTime())+t.getTime()),this.randDate=(t,e)=>new Date(u.randTime(t,e)),this.getWeek=function(t){t=t||s;var e=new Date(t.getFullYear(),0,1);return Math.ceil((t.getDay()+1+u.getDays(t,e))/7)},this.week=function(t,e){e=e||1;const n=new Date(t,0,1);t=(n.getDay()+6)%7;return n.setDate(n.getDate()+7*e-t),n},this.toWeek=function(t){return t?u.week(+t.substr(0,4),+t.substr(6)):null},this.isoWeek=function(t){return t?t.getFullYear()+"-W"+c(u.getWeek(t)):null},this.toObject=function(t,e){var n=(t=t||s).getDay();let i=t.getFullYear().toString();const r={yyyy:+i,y:+i.substr(0,2),yy:+i.substr(2,2),m:t.getMonth(),d:t.getDate()};return r.mmm=e.monthNamesShort[r.m],r.mmmm=e.monthNames[r.m],r.mm=c(++r.m),r.ddd=e.dayNamesShort[n],r.dddd=e.dayNames[n],r.dd=c(r.d),r.h=t.getHours(),r.hh=c(r.h),r.M=t.getMinutes(),r.MM=c(r.M),r.s=t.getSeconds(),r.ss=c(r.s),r.ms=t.getMilliseconds(),r.t=r.h<12?"a":"p",r.tt=r.t+"m",r},this.diff=function(t,e){if((e=e||s)<t)return u.diff(e,t);const i=u.toArray(e);const r=[0,12,u.daysInMonth(e)-e.getDate()+t.getDate(),24,60,60,1e3];return u.toArray(t).forEach(function t(e,n){i[n]-=e,i[n]<0&&(i[n]+=r[n],t(1,n-1))}),i},this.interval=function(t,e,n,i,r){let s=u.clone(t);r=r||1e3;const a=new Date(s.getTime()+e),o=setInterval(function(){u.addMs(s,r),(!n(s,a)||a<=s)&&(clearInterval(o),i&&i())},r);return u},this.lt=(t,e)=>p(t)&&p(e)&&t.getTime()<e.getTime(),this.le=(t,e)=>p(t)&&p(e)&&t.getTime()<=e.getTime(),this.eq=(t,e)=>p(t)&&p(e)&&t.getTime()==e.getTime(),this.ge=(t,e)=>p(t)&&p(e)&&t.getTime()>=e.getTime(),this.gt=(t,e)=>p(t)&&p(e)&&t.getTime()>e.getTime(),this.cmp=function(t,e){return p(t)&&p(e)?t.getTime()-e.getTime():p(t)?-1:1},this.inYear=(t,e)=>p(t)&&p(e)&&t.getFullYear()==e.getFullYear(),this.inMonth=(t,e)=>u.inYear(t,e)&&t.getMonth()==e.getMonth(),this.inDay=(t,e)=>u.inMonth(t,e)&&t.getDate()==e.getDate(),this.inHour=(t,e)=>u.inDay(t,e)&&t.getHours()==e.getHours(),this.past=t=>u.lt(t,s),this.future=t=>u.gt(t,s),this.geToday=t=>u.inDay(t,s)||u.ge(t,s),this.between=function(t,e,n){return!!p(t)&&(e=(p(e)?e:t).getTime(),n=(p(n)?n:t).getTime(),e<=t.getTime()&&t.getTime()<=n)},this.minTime=t=>t?M(t):null,this.isoTime=t=>t?I(t):null,this.acTime=t=>t&&t.replace(/(\d\d)(\d+)$/g,"$1:$2").replace(/[^\d\:]/g,e),this.toTime=function(t){t=t&&l(t);return a(t)?T(new Date,t[0],t[1],t[2],t[3]):null},this.fmtTime=function(t){let e=t&&l(t);return a(e)?(e[0]=f(e[0],0,23),e[1]=d(e[1]),e[2]&&(e[2]=d(e[2])),e.map(c).join(":")):null},this.enDate=t=>t?y(l(t)):null,this.isoEnDate=t=>p(t)?x(t):null,this.isoEnDateTime=t=>p(t)?x(t)+" "+I(t):null,this.fmtEnDate=t=>o(t)?b(l(t)).map(c).join("-"):null,this.acEnDate=t=>t&&t.replace(/^(\d{4})(\d+)$/g,"$1-$2").replace(/^(\d{4}\-\d\d)(\d+)$/g,"$1-$2").replace(/[^\d\-]/g,e),this.esDate=t=>t?y(h(l(t))):null,this.isoEsDate=t=>p(t)?A(t):null,this.isoEsDateTime=t=>p(t)?A(t)+" "+I(t):null,this.fmtEsDate=t=>o(t)?h(b(h(l(t)))).map(c).join("/"):null,this.acEsDate=t=>t&&t.replace(/^(\d\d)(\d+)$/g,"$1/$2").replace(/^(\d\d\/\d\d)(\d+)$/g,"$1/$2").replace(/[^\d\/]/g,e)}function DomBox(){const s=this,i="hide",n=document.createElement("div"),e=document.createElement("textarea");let r;function t(t){console.log("Log:",t)}function a(t){return t?t.length:0}function o(t){return t&&1===t.nodeType}function u(t){return t?t.split(/\s+/):[]}function l(t,e,n){t.matches(e)&&n.push(t)}function c(t,e){return o(e)?e:a(e)?e[t]:null}this.get=function(t,e){return(e||document).querySelector(t)},this.getAll=function(t,e){return(e||document).querySelectorAll(t)},this.closest=function(t,e){return e&&e.closest(t)},this.toArray=function(){return r?Array.from(r):[]},this.set=function(t){return delete r,r=t,s},this.load=function(t,e){return t?"string"==typeof t||t instanceof String?s.set(s.getAll(t,e)):s.set(t):s},this.getNavLang=function(){return navigator.language||navigator.userLanguage},this.getLang=function(){return document.documentElement.getAttribute("lang")||s.getNavLang()},this.redir=function(t,e){return t&&window.open(t,e||"_blank"),s},this.unescape=function(t){return e.innerHTML=t,e.value},this.escape=function(t){return n.innerHTML=t,n.innerHTML},this.buildPath=function(t,e){e=e||window.location.pathname;let n=new URLSearchParams(t),i=new URLSearchParams(window.location.search);return n.forEach((t,e)=>i.set(e,t)),e+"?"+i.toString()},this.scroll=function(t,e){return e=e||window,(t=t||e.document.body).scrollIntoView({behavior:"smooth"}),s},this.fetch=function(i){return(i=i||{}).headers=i.headers||{},i.reject=i.reject||t,i.resolve=i.resolve||t,i.headers["x-requested-with"]="XMLHttpRequest",i.headers.Authorization="Bearer "+window.localStorage.getItem("jwt"),window.fetch(i.action,i).then(t=>{let e=t.headers.get("content-type")||"",n=-1<e.indexOf("application/json")?t.json():t.text();return n.then(t.ok?i.resolve:i.reject)})},this.each=function(e,n){if(o(n=n||r))e(n,0);else{var i=a(n);for(let t=0;t<i;t++)e(n[t],t,n)}return s},this.forEach=function(t,e){return s.each(e,s.getAll(t))},this.reverse=function(e,n){if(o(n=n||r))e(n,0);else for(let t=a(n)-1;-1<t;t--)e(n[t],t,n);return s},this.inverse=function(t,e){return s.reverse(e,s.getAll(t))},this.first=function(t){return c(0,t||r)},this.elem=function(t,e){return c(t,e||r)},this.last=function(t){return c(a(t=t||r)-1,t)},this.findIndex=function(e,n){if(o(n=n||r))return n.matches(e)?0:-1;var i=a(n);for(let t=0;t<i;t++)if(n[t].matches(e))return t;return-1},this.find=function(t,e){return o(e=e||r)?e.matches(t)?e:null:e[s.findIndex(t,e)]},this.filter=function(e,t){let n=[];return s.each(t=>l(t,e,n),t),n};function h(t){return t.offsetWidth||t.offsetHeight||t.getClientRects().length}function f(e,n,i){for(let t=e.previousElementSibling;t;t=t.previousElementSibling)l(t,n,i)}function d(e,n,i){for(let t=e.nextElementSibling;t;t=t.nextElementSibling)l(t,n,i)}function m(e,n){for(let t=e.previousElementSibling;t;t=t.previousElementSibling)n.push(t)}function g(e,n){for(let t=e.nextElementSibling;t;t=t.nextElementSibling)n.push(t)}function v(t,e){return"SELECT"===t.tagName?(e=e||t.getAttribute("value"),t.selectedIndex=e?s.findIndex("[value='"+e+"']",t.options):0):t.value=e,s}this.inputs=function(t){return s.getAll("input,textarea,select",t)},this.focus=function(t){return t&&t.focus(),s},this.setFocus=function(t){return s.reverse(t=>{h(t)&&t.matches(":not([type=hidden],[readonly],[disabled],[tabindex='-1'])")&&t.focus()},s.inputs(t))},this.prev=function(e,t){let n=[];return e?s.each(t=>f(t,e,n),t):s.each(t=>m(t,n),t),n},this.next=function(e,t){let n=[];return e?s.each(t=>d(t,e,n),t):s.each(t=>g(t,n),t),n},this.siblings=function(e,t){let n=[];return e?s.each(t=>function(t,e,n){f(t,e,n),d(t,e,n)}(t,e,n),t):s.each(t=>function(t,e){m(t,e),g(t,e)}(t,n),t),n},this.getValue=function(t){return t&&t.value},this.findValue=function(t,e){return s.getValue(s.get(t,e))},this.val=function(e,t){return s.each(t=>v(t,e),t)},this.setValue=function(t,e,n){return s.val(e,s.getAll(t,n))},this.getAttr=function(t,e){return t&&t.getAttribute(e)},this.attr=function(e,n,t){return s.each(t=>t.setAttribute(e,n),t)},this.setAttr=function(t,e,n,i){return s.attr(e,n,s.getAll(t,i))},this.getText=function(t){return t&&t.innerText},this.findText=function(t,e){return s.getText(s.get(t,e))},this.text=function(e,t){return e=e||"",s.each(t=>{t.innerText=e},t)},this.setText=function(t,e,n){return s.text(e,s.getAll(t,n))},this.getHtml=function(t){return t&&t.innerHTML},this.findHtml=function(t,e){return s.getHtml(s.get(t,e))},this.html=function(e,t){return e=e||"",s.each(t=>{t.innerHTML=e},t)},this.setHtml=function(t,e,n){return s.html(e,s.getAll(t,n))},this.replace=function(e,t){return s.each(t=>{t.outerHTML=e},t)},this.empty=function(t){return!t||!t.innerHTML||""===t.innerHTML.trim()},this.add=function(e,t){return s.each(t=>e.appendChild(t),t)},this.append=function(t,e){return n.innerHTML=t,s.each(t=>s.add(t,n.childNodes),e||document.body)},this.mask=function(n,i,t){return s.each((t,e)=>t.classList.toggle(n,i>>e&1),t)},this.optText=function(t){return t?s.getText(t.options[t.selectedIndex]):null},this.select=function(n,t){return s.each(t=>{var e=s.mask(i,~n,t.options).get("[value='"+t.value+"']",t);s.hasClass(i,e)&&(t.selectedIndex=s.findIndex(":not(.hide)",t.options))},t)},this.import=function(t,i,r){return r=r||{},i?s.each((t,e)=>{let n=r[t.name];n?t.value=n(i[t.name],i,e):v(t,i[t.name]??t.value)},t):s.val("",t)},this.export=function(t,i,r){return i=i||{},r=r||{},s.each((t,e)=>{let n=r[t.name];i[t.name]=n?n(t.value,i,e):t.value},t),delete i.undefined,i};const p={};function b(t,e,n,i){return e.addEventListener(t,t=>i(e,n,t)||t.preventDefault()),s}this.setTpl=function(t,e){return p[t]=e,s},this.loadTemplates=function(){return s.each(t=>s.setTpl(t.id,t.innerHTML),s.getAll("template"))},this.render=function(t,e){t.id=t.id||"_"+Math.random().toString(36).substr(2,9);var n=t.dataset.tpl||t.id;return p[n]=p[n]||t.innerHTML,t.innerHTML=e(p[n]),t.classList.toggle(i,!t.innerHTML),s},this.format=function(t,e){return s.each(s.render,e)},this.reformat=function(t,e){return s.format(e,s.getAll(t))},this.isVisible=function(t){return t&&h(t)},this.visible=function(t,e){return s.isVisible(dom.get(t,e))},this.show=function(t,e){return e=e||"block",s.each(t=>{t.style.display=e},t)},this.hide=function(t){return s.each(t=>{t.style.display="none"},t)},this.hasClass=function(t,e){const n=s.first(e);return n&&u(t).some(t=>n.classList.contains(t))},this.setClass=function(e,t){return s.each(t=>{t.className=e},t)},this.addClass=function(t,e){const n=u(t);return s.each(function(e){n.forEach(t=>e.classList.add(t))},e)},this.addStyle=function(t,e,n){return s.addClass(e,s.getAll(t,n))},this.removeClass=function(t,e){const n=u(t);return s.each(function(e){n.forEach(t=>e.classList.remove(t))},e)},this.removeStyle=function(t,e,n){return s.removeClass(e,s.getAll(t,n))},this.toggle=function(t,n,e){const i=u(t);return s.each(e=>i.forEach(t=>e.classList.toggle(t,n)),e)},this.toggleClass=function(t,e,n,i){return s.toggle(e,n,s.getAll(t,i))},this.toggleHide=function(t,e,n){return s.toggleClass(t,i,e,n)},this.swap=function(t,e){const n=u(t);return s.each(e=>n.forEach(t=>e.classList.toggle(t)),e)},this.swapClass=function(t,e,n){return s.swap(e,s.getAll(t,n))},this.swapHide=function(t,e){return s.swapClass(t,i,e)},this.css=function(t,e,n){const i=t.replace(/(-[a-z])/,t=>t.replace("-","").toUpperCase());return s.each(t=>{t.style[i]=e},n)},this.event=function(n,i,t){return s.each((t,e)=>b(n,t,e,i),t)},this.addEvent=function(t,e,n){return s.event(t,n,s.getAll(e))},this.ready=function(t){return b("DOMContentLoaded",document,0,t)},this.click=function(n,t){return s.each((t,e)=>b("click",t,e,n),t)},this.onclick=function(t,e){return s.click(e,s.getAll(t))},this.change=function(n,t){return s.each((t,e)=>b("change",t,e,n),t)},this.onchange=function(t,e){return s.change(e,s.getAll(t))},this.keyup=function(n,t){return s.each((t,e)=>b("keyup",t,e,n),t)},this.onkeyup=function(t,e){return s.keyup(e,s.getAll(t))},this.keydown=function(n,t){return s.each((t,e)=>b("keydown",t,e,n),t)},this.onkeydown=function(t,e){return s.keydown(e,s.getAll(t))},this.submit=function(n,t){return s.each((t,e)=>b("submit",t,e,n),t)},this.onsubmit=function(t,e){return s.submit(e,s.getAll(t))},this.trigger=function(e,t){return s.each(t=>t.dispatchEvent(new Event(e)),t)}}function I18nBox(){const r=this,s=new Map,n=new Map,e="msgError",a={},o={en:{lang:"en",errForm:"Form validation failed",errRequired:"Required field!",errMinlength8:"The minimum required length is 8 characters",errMaxlength:"Max length exceded",errNif:"Wrong ID format",errCorreo:"Wrong Mail format",errDate:"Wrong date format",errDateLe:"Date must be less or equals than current",errDateGe:"Date must be greater or equals than current",errNumber:"Wrong number format",errGt0:"Price must be great than 0.00 &euro;",errRegex:"Wrong format",errReclave:"Passwords typed do not match",errRange:"Value out of allowed range",errRefCircular:"Circular reference",remove:"Are you sure to delete element?",removeOk:"Element removed successfully!",cancel:"Are you sure to cancel element?",cancelOk:"Element canceled successfully!",unlink:"Are you sure to unlink those elements?",unlinkOk:"Elements unlinked successfully!",linkOk:"Elements linked successfully!",closeText:"close",prevText:"prev",nextText:"next",currentText:"current",monthNames:["January","February","March","April","May","June","July","August","September","October","November","December"],monthNamesShort:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],dayNames:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],dayNamesShort:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],dayNamesMin:["Su","Mo","Tu","We","Th","Fr","Sa"],dateFormat:"yy-mm-dd",firstDay:0,toDate:dt.enDate,isoDate:dt.isoEnDate,isoDateTime:dt.isoEnDateTime,fmtDate:dt.fmtEnDate,acDate:dt.acEnDate,toTime:dt.toTime,minTime:dt.minTime,isoTime:dt.isoTime,fmtTime:dt.fmtTime,acTime:dt.acTime,toInt:nb.toInt,isoInt:nb.enIsoInt,fmtInt:nb.enFmtInt,toFloat:nb.enFloat,isoFloat:nb.enIsoFloat,fmtFloat:nb.enFmtFloat,fmtBool:nb.enBool,val:sb.enVal},es:{lang:"es",errForm:"Error al validar los campos del formulario",errRequired:"¡Campo obligatorio!",errMinlength8:"La longitud mínima requerida es de 8 caracteres",errMaxlength:"Longitud máxima excedida",errNif:"Formato de NIF / CIF incorrecto",errCorreo:"Formato de E-Mail incorrecto",errDate:"Formato de fecha incorrecto",errDateLe:"La fecha debe ser menor o igual a la actual",errDateGe:"La fecha debe ser mayor o igual a la actual",errNumber:"Valor no numérico",errGt0:"El importe debe ser mayor de 0,00 &euro;",errRegex:"Formato incorrecto",errReclave:"Las claves introducidas no coinciden",errRange:"Valor fuera del rango permitido",errRefCircular:"Referencia circular",remove:"¿Confirma que desea eliminar este registro?",removeOk:"Registro eliminado correctamente.",cancel:"¿Confirma que desea cancelar este registro?",cancelOk:"Elemento cancelado correctamente.",unlink:"¿Confirma que desea desasociar estos registros?",unlinkOk:"Registros desasociados correctamente",linkOk:"Registros asociados correctamente.",closeText:"cerrar",prevText:"prev.",nextText:"sig.",currentText:"hoy",monthNames:["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"],monthNamesShort:["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"],dayNames:["Domingo","Lunes","Martes","Miércoles","Jueves","Viernes","Sábado"],dayNamesShort:["Dom","Lun","Mar","Mié","Juv","Vie","Sáb"],dayNamesMin:["Do","Lu","Ma","Mi","Ju","Vi","Sa"],dateFormat:"dd/mm/yy",firstDay:1,toDate:dt.esDate,isoDate:dt.isoEsDate,isoDateTime:dt.isoEsDateTime,fmtDate:dt.fmtEsDate,acDate:dt.acEsDate,toTime:dt.toTime,minTime:dt.minTime,isoTime:dt.isoTime,fmtTime:dt.fmtTime,acTime:dt.acTime,toInt:nb.toInt,isoInt:nb.esIsoInt,fmtInt:nb.esFmtInt,toFloat:nb.esFloat,isoFloat:nb.esIsoFloat,fmtFloat:nb.esFmtFloat,fmtBool:nb.esBool,val:sb.val}};let u=o.es;this.getLangs=function(t){return a[t]||o},this.getLang=function(t,e){return r.getLangs(e)[t]||u},this.getI18n=function(t,e){e=r.getLangs(e);return t&&(e[t]||e[t.substr(0,2)])||u},this.setI18n=function(t,e){return u=r.getI18n(t,e),r},this.get=t=>u[t],this.tr=t=>u[t]||t,this.set=function(t,e){return u[t]=e,r},this.format=(t,e)=>sb.format(u,t,e),this.addLang=function(e,n,i){if(i){let t=a[i]=a[i]||{};t[e]=Object.assign(t[e]||{},o[e],n)}else o[e]=Object.assign(o[e]||{},n);return r},this.addLangs=function(t,e){for(const n in t)r.addLang(n,t[n],e);return r},this.toInt=t=>u.toInt(t),this.isoInt=t=>u.isoInt(t),this.fmtInt=t=>u.fmtInt(t),this.toFloat=t=>u.toFloat(t),this.isoFloat1=t=>u.isoFloat(t,1),this.isoFloat=t=>u.isoFloat(t),this.isoFloat3=t=>u.isoFloat(t,3),this.fmtFloat1=t=>u.fmtFloat(t,1),this.fmtFloat=t=>u.fmtFloat(t),this.fmtFloat3=t=>u.fmtFloat(t,3),this.toDate=t=>u.toDate(t),this.isoDate=t=>u.isoDate(t),this.fmtDate=t=>u.fmtDate(t),this.acDate=t=>u.acDate(t),this.toTime=t=>u.toTime(t),this.minTime=t=>u.minTime(t),this.isoTime=t=>u.isoTime(t),this.fmtTime=t=>u.fmtTime(t),this.acTime=t=>u.acTime(t),this.fmtBool=t=>u.fmtBool(t),this.confirm=t=>confirm(u[t]),this.val=(t,e)=>u.val(t,e),this.arrval=function(t,e){t=u[t];return t&&t[e]||"-"},this.getMsgs=()=>n,this.getMsg=t=>n.get(t),this.setMsg=(t,e)=>(n.set(t,e),r),this.setOk=t=>r.setMsg("msgOk",r.tr(t)),this.setInfo=t=>r.setMsg("msgInfo",r.tr(t)),this.setWarn=t=>r.setMsg("msgWarn",r.tr(t)),this.getError=t=>n.get(t||e),this.setMsgError=t=>r.setMsg(e,r.tr(t)),this.setError=(t,e,n)=>r.setMsgError(e).setMsg(t,r.tr(n)),this.getNumErrors=()=>n.size,this.getData=t=>t?s.get(t):s,this.toData=()=>Object.fromEntries(s),this.toMsgs=()=>Object.fromEntries(n),this.reset=function(){return s.clear(),n.clear(),r},this.start=(t,e)=>r.reset().setI18n(t,e),this.valid=function(t,e,n,i){return sb.isset(e)?(s.set(t,e),!0):(r.setError(t,n,i),!1)},this.isOk=()=>!n.has(e),this.isError=t=>n.has(t||e),this.required=(t,e,n,i)=>r.valid(t,valid.required(e),n,i),this.size10=(t,e,n,i)=>r.valid(t,valid.size10(e),n,i),this.size50=(t,e,n,i)=>r.valid(t,valid.size50(e),n,i),this.size200=(t,e,n,i)=>r.valid(t,valid.size200(e),n,i),this.size300=(t,e,n,i)=>r.valid(t,valid.size300(e),n,i),this.text10=(t,e,n,i)=>r.valid(t,valid.text10(e),n,i),this.text50=(t,e,n,i)=>r.valid(t,valid.text50(e),n,i),this.text200=(t,e,n,i)=>r.valid(t,valid.text200(e),n,i),this.text300=(t,e,n,i)=>r.valid(t,valid.text300(e),n,i),this.text=(t,e,n,i)=>r.valid(t,valid.text(e),n,i),this.intval=(t,e,n,i)=>r.valid(t,valid.intval(e),n,i),this.intval3=(t,e,n,i)=>r.valid(t,valid.intval3(e),n,i),this.iGt0=(t,e,n,i)=>r.valid(t,valid.gt0(u.toInt(e)),n,i),this.gt0=(t,e,n,i)=>r.valid(t,valid.gt0(u.toFloat(e)),n,i),this.regex=(t,e,n,i)=>r.valid(t,valid.regex(e),n,i),this.login=(t,e,n,i)=>r.valid(t,valid.login(e),n,i),this.digits=(t,e,n,i)=>r.valid(t,valid.digits(e),n,i),this.idlist=(t,e,n,i)=>r.valid(t,valid.idlist(e),n,i),this.email=(t,e,n,i)=>r.valid(t,valid.email(e),n,i),this.isDate=(t,e,n,i)=>r.valid(t,valid.isDate(e),n,i),this.past=(t,e,n,i)=>r.valid(t,valid.past(e),n,i),this.future=(t,e,n,i)=>r.valid(t,valid.future(e),n,i),this.geToday=(t,e,n,i)=>r.valid(t,valid.geToday(e),n,i),this.dni=(t,e,n,i)=>r.valid(t,valid.dni(e),n,i),this.cif=(t,e,n,i)=>r.valid(t,valid.cif(e),n,i),this.nie=(t,e,n,i)=>r.valid(t,valid.nie(e),n,i),this.idES=(t,e,n,i)=>r.valid(t,valid.idES(e),n,i),this.user=(t,e,n,i)=>r.valid(t,valid.email(e)||valid.idES(e),n,i),this.iban=(t,e,n,i)=>r.valid(t,valid.iban(e),n,i),this.creditCardNumber=(t,e,n,i)=>r.valid(t,valid.creditCardNumber(e),n,i)}function NumberBox(){const r=this,s="",a=".";function o(t){return null!=t}function u(t){return t.replace(/\D+/g,s)}function l(t){return u(t).replace(/^0+(\d+)/,"$1")}function c(t){return"-"==t.charAt(0)?"-":s}function h(t,e){for(var n=[],i=t.length;e<i;i-=e)n.unshift(t.substr(i-e,e));return 0<i&&n.unshift(t.substr(0,i)),n}function n(t,e){var n=c(t),t=l(t);return t?n+h(t,3).join(e):null}function f(e,n,i,r,s){r=isNaN(r)?2:r;var a=c(e),s=e.lastIndexOf(s);let o=0<s?e.substr(0,s):e;if(o=0==s?"0":l(o),o){let t=s<0?"0":e.substr(s+1,r);return a+h(o,3).join(n)+i+(s<0?"0".repeat(r):t.padEnd(r,"0"))}return null}this.lt0=t=>o(t)&&t<0,this.le0=t=>o(t)&&t<=0,this.gt0=t=>o(t)&&0<t,this.range=(t,e,n)=>Math.min(Math.max(t,e),n),this.between=(t,e,n)=>e<=t&&t<=n,this.cmp=function(t,e){return isNaN(t)||isNaN(e)?isNaN(e)?-1:1:t-e},this.round=function(t,e){return e=o(e)?e:2,+(Math.round(t+"e"+e)+"e-"+e)},this.eq2=(t,e)=>o(t)&&r.round(t)==r.round(e),this.eq3=(t,e)=>o(t)&&r.round(t,3)==r.round(e,3),this.rand=(t,e)=>Math.random()*(e-t)+t,this.randInt=(t,e)=>Math.floor(r.rand(t,e)),this.toInt=function(t){if(t){t=parseInt(c(t)+u(t));return isNaN(t)?null:t}return null},this.isoInt=(t,e)=>o(t)?n(s+t,e):null,this.enIsoInt=t=>r.isoInt(t,","),this.esIsoInt=t=>r.isoInt(t,a),this.fmtInt=function(t,e){return t&&n(t,e)},this.enFmtInt=t=>r.fmtInt(t,","),this.esFmtInt=t=>r.fmtInt(t,a),this.intval=t=>parseInt(t)||0,this.toFloat=function(t,e){if(t){var n=c(t),i=t.lastIndexOf(e),e=i<0?t:t.substr(0,i),i=i<0?s:a+t.substr(i+1),i=parseFloat(n+u(e)+i);return isNaN(i)?null:i}return null},this.enFloat=t=>r.toFloat(t,a),this.esFloat=t=>r.toFloat(t,","),this.isoFloat=(t,e,n,i)=>o(t)?f(s+r.round(t,i),e,n,i,a):null,this.enIsoFloat=(t,e)=>r.isoFloat(t,",",a,e),this.esIsoFloat=(t,e)=>r.isoFloat(t,a,",",e),this.fmtFloat=function(t,e,n,i){return t&&f(t,e,n,i,n)},this.enFmtFloat=(t,e)=>r.fmtFloat(t,",",a,e),this.esFmtFloat=(t,e)=>r.fmtFloat(t,a,",",e),this.floatval=t=>parseFloat(t)||0,this.boolval=t=>t&&"false"!==t&&"0"!==t,this.enBool=t=>r.boolval(t)?"Yes":"No",this.esBool=t=>r.boolval(t)?"Sí":"No"}function StringBox(){const s=this,e=/"|'|&|<|>|\\/g,n={'"':"&#34;","'":"&#39;","&":"&#38;","<":"&#60;",">":"&#62;","\\":"&#92;"};function i(t){return"string"==typeof t||t instanceof String}function a(t){return i(t)?t.trim():t}function o(t){return t?t.length:0}function r(t){for(var e="",n=o(a(t)),i=0;i<n;i++){var r=t.charAt(i),s="àáâãäåāăąÀÁÂÃÄÅĀĂĄÆßèéêëēĕėęěÈÉĒĔĖĘĚìíîïìĩīĭÌÍÎÏÌĨĪĬòóôõöōŏőøÒÓÔÕÖŌŎŐØùúûüũūŭůÙÚÛÜŨŪŬŮçÇñÑþÐŔŕÿÝ".indexOf(r);e+=s<0?r:"aaaaaaaaaAAAAAAAAAABeeeeeeeeeEEEEEEEiiiiiiiiIIIIIIIIoooooooooOOOOOOOOOuuuuuuuuUUUUUUUUcCnNdDRryY".charAt(s)}return e.toLowerCase()}this.isset=function(t){return null!=t},this.isstr=i,this.trim=a,this.size=o,this.eq=function(t,e){return r(t)==r(e)},this.iiOf=function(t,e){return r(t).indexOf(r(e))},this.substr=function(t,e,n){return t&&t.substr(e,n)},this.indexOf=function(t,e){return t?t.indexOf(e):-1},this.lastIndexOf=function(t,e){return t?t.lastIndexOf(e):-1},this.prevIndexOf=function(t,e,n){return t?t.substr(0,n).lastIndexOf(e):-1},this.starts=function(t,e){return t&&t.startsWith(e)},this.ends=function(t,e){return t&&t.endsWith(e)},this.prefix=function(t,e){return s.starts(t,e)?t:e+t},this.suffix=function(t,e){return s.ends(t,e)?t:t+e},this.trunc=function(t,e){return o(t)>e?t.substr(0,e).trim()+"...":t},this.itrunc=function(t,e){var n=o(t)>e?s.prevIndexOf(t," ",e):-1;return s.trunc(t,n<0?e:n)},this.escape=function(t){return t&&t.replace(e,t=>n[t])},this.unescape=function(t){return t&&t.replace(/&#(\d+);/g,(t,e)=>String.fromCharCode(e))},this.removeAt=function(t,e,n){return e<0?t:t.substr(0,e)+t.substr(e+n)},this.insertAt=function(t,e,n){return t?t.substr(0,n)+e+t.substr(n):e},this.replaceAt=function(t,e,n,i){return n<0?t:t.substr(0,n)+e+t.substr(n+i)},this.replaceLast=function(t,e,n){return t?s.replaceAt(t,n,t.lastIndexOf(e),e.length):n},this.wrapAt=function(t,e,n,i,r){return e<0?t:s.insertAt(s.insertAt(t,i,e),r,e+i.length+n)},this.iwrap=function(t,e,n,i){return e&&s.wrapAt(t,s.iiOf(t,e),e.length,n||"<u><b>",i||"</b></u>")},this.rand=function(t){return Math.random().toString(36).substr(2,t||8)},this.lopd=function(t){return t&&"***"+t.substr(3,4)+"**"},this.toDate=function(t){return t?new Date(t):null},this.split=function(t,e){return t?t.trim().split(e||","):[]},this.minify=function(t){return t&&t.trim().replace(/\s{2}/g,"")},this.lines=function(t){return s.split(t,/[\n\r]+/)},this.words=function(t){return s.split(t,/\s+/)},this.ilike=function(t,e){return-1<s.iiOf(t,e)},this.olike=function(e,t,n){return t.some(function(t){return s.ilike(e[t],n)})},this.alike=function(e,n,t){return s.words(t).some(function(t){return s.olike(e,n,t)})},this.between=function(t,e,n){return n=n??t,(e=e??t)<=t&&t<=n},this.ltr=function(t,e){const n=[];for(var i=o(t);e<i;i-=e)n.unshift(t.substr(i-e,e));return 0<i&&n.unshift(t.substr(0,i)),n},this.rtl=function(t,e){const n=[];for(var i=o(t),r=0;r<i;r+=e)n.push(t.substr(r,e));return n},this.slices=function(e,n){const i=[];var r=0,s=o(e);for(let t=0;r<s&&t<n.length;t++){var a=n[t];i.push(e.substr(r,a)),r+=a}return r<s&&i.push(e.substr(r)),i},this.val=(t,e)=>t[e],this.enVal=(t,e)=>t[e+"_en"]||t[e],this.format=function(i,t,r){return(r=r||{}).empty=r.empty||"",i&&t&&t.replace(/@(\w+);/g,function(t,e){let n=r[e];return(n?n(i[e],i):i[e])??r.empty})}}function ValidatorBox(){const i=this,e=/"|'|&|<|>|\\/g,n={'"':"&#34;","'":"&#39;","&":"&#38;","<":"&#60;",">":"&#62;","\\":"&#92;"},r=/^\d+$/,s=/^\d+(,\d+)*$/,a=/\w+[^\s@]+@[^\s@]+\.[^\s@]+/,o=/^[\w#@&°!§%;:=\^\/\(\)\?\*\+\~\.\,\-\$]{8,}$/;const u=/^(\d{8})([A-Z])$/,l=/^([ABCDEFGHJKLMNPQRSUVW])(\d{7})([0-9A-J])$/,c=/^[XYZ]\d{7,8}[A-Z]$/;function h(t){return t?t.length:0}function f(t){return t&&t.trim()}function d(t){return t&&t.trim().replace(/\W+/g,"").toUpperCase()}function m(t,e){try{return e&&t.test(e)?e:null}catch(t){}return null}function g(t,e,n){return t=i.escape(t),nb.between(h(t),e,n)?t:null}function v(t){return"TRWAGMYFPDXBNJZSQVHLCKE".charAt(parseInt(t,10)%23)==t.charAt(8)?t:null}this.range=function(t,e,n){return null!=t&&nb.between(t,e,n)?t:null},this.gt0=t=>i.range(t,.001,1e9),this.intval=t=>i.range(nb.intval(t),1,9),this.intval3=t=>i.range(nb.intval(t),1,3),this.intval5=t=>i.range(nb.intval(t),1,5),this.size=function(t,e,n){return t=f(t),nb.between(h(t),e,n)?t:null},this.required=t=>i.size(t,1,1e3),this.size10=t=>i.size(t,0,10),this.size50=t=>i.size(t,0,50),this.size200=t=>i.size(t,0,200),this.size300=t=>i.size(t,0,300),this.unescape=t=>t?t.replace(/&#(\d+);/g,(t,e)=>String.fromCharCode(e)):null,this.escape=t=>t?t.trim().replace(e,t=>n[t]):null,this.text10=t=>g(t,0,10),this.text50=t=>g(t,0,50),this.text200=t=>g(t,0,200),this.text300=t=>g(t,0,300),this.text=t=>g(t,0,1e3),this.regex=(t,e)=>m(t,f(e)),this.login=t=>i.regex(o,t),this.digits=t=>i.regex(r,t),this.idlist=t=>i.regex(s,t),this.email=function(t){return(t=i.regex(a,t))&&t.toLowerCase()},this.isDate=function(t){t=dt.toDate(t);return isDate(t)?t:null},this.past=function(t){t=dt.toDate(t);return dt.past(t)?t:null},this.future=function(t){t=dt.toDate(t);return dt.future(t)?t:null},this.geToday=function(t){t=dt.toDate(t);return dt.geToday(t)?t:null},this.dni=function(t){return(t=m(u,d(t)))&&v(t)},this.cif=function(t){if(!(t=m(l,d(t))))return null;for(var e=t.match(l),n=e[1],i=e[2],r=e[3],s=0,a=0;a<i.length;a++){var o=parseInt(i[a],10);s+=o=a%2==0?(o*=2)<10?o:parseInt(o/10)+o%10:o}var u=0!==(s%=10)?10-s:s,e="JABCDEFGHI".substr(u,1);return(n.match(/[ABEH]/)?r==u:!n.match(/[KPQS]/)&&r==u||r==e)?t:null},this.nie=function(t){if(!(t=m(c,d(t))))return null;var e=t.charAt(0);return v(("X"==e?0:"Y"==e?1:"Z"==e?2:e)+t.substr(1))},this.idES=function(t){return i.dni(t)||i.cif(t)||i.nie(t)},this.iban=function(t){var e=(t=d(t))&&t.match(/^([A-Z]{2})(\d{2})([A-Z\d]+)$/);if(!e||h(t)!=={AD:24,AE:23,AT:20,AZ:28,BA:20,BE:16,BG:22,BH:22,BR:29,CH:21,CR:22,CY:28,CZ:24,DE:22,DK:18,DO:28,EE:20,ES:24,FI:18,FO:18,FR:27,GB:22,GI:23,GL:18,GR:27,GT:28,HR:21,HU:28,IE:22,IL:23,IS:26,IT:27,JO:30,KW:30,KZ:20,LB:28,LI:21,LT:20,LU:20,LV:21,MC:27,MD:24,ME:22,MK:19,MR:27,MT:31,MU:30,NL:18,NO:15,PK:24,PL:28,PS:29,PT:25,QA:29,RO:24,RS:22,SA:24,SE:24,SI:19,SK:24,SM:27,TN:24,TR:26,AL:28,BY:28,EG:29,GE:22,IQ:23,LC:32,SC:31,ST:25,SV:28,TL:23,UA:29,VA:22,VG:24,XK:20}[e[1]])return null;let n=(e[3]+e[1]+e[2]).replace(/[A-Z]/g,t=>t.charCodeAt(0)-55);var i;let r=n.toString(),s=r.slice(0,2);for(let t=2;t<r.length;t+=7)i=s+r.substring(t,t+7),s=parseInt(i,10)%97;return 1===s?t:null},this.getEntidad=function(t){return(t=d(t))?{2080:"Abanca",1544:"Andbank España","0182":"BBVA",9e3:"Banco de España","0186":"Banco Mediolanum","0081":"Banco Sabadell","0049":"Banco Santander","0128":"Bankinter","0065":"Barclays Bank","0058":"BNP Paribas España",2100:"Caixabank","0122":"Citibank España","0154":"Credit Agricole","0019":"Deutsche Bank","0239":"Evo Banco","0162":"HSBC Bank",2085:"Ibercaja Banco",1465:"ING",1e3:"Instituto de crédito oficial",2095:"Kutxabank","0073":"Openbank",2103:"Unicaja Banco",3058:"Cajamar",3085:"Caja Rural",3146:"Novanca","0238":"Banco Pastor"}[t.substr(4,4)]:null},this.creditCardNumber=function(n){if(16!=h(n=d(n)))return null;let i=0,r=!1;for(let e=15;0<=e;e--){let t=+n[e];r&&(t*=2,t-=9<t?9:0),i+=t,r=!r}return i%10==0?n:null},this.generatePassword=function(t,e){return e=e||"abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_#@&°!§%;:=^/()?*+~.,-$",Array.apply(null,Array(t||10)).map(function(){return e.charAt(Math.random()*e.length)}).join("")},this.testPassword=function(t){var e=0;return e+=/[A-Z]+/.test(t)?1:0,e+=/[a-z]+/.test(t)?1:0,e+=/[0-9]+/.test(t)?1:0,e+=/[\W]+/.test(t)?1:0,e+=2<e&&8<h(t)}}