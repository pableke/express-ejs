function ArrayBox(){const r=this;function o(t){return t?t.length:0}function l(t,e){return t==e?0:t<e?-1:1}this.size=o,this.empty=function(t){return o(t)<1},this.find=function(t,e){return t?t.find(e):null},this.ifind=function(t,e){return t?t.findIndex(e):-1},this.indexOf=function(t,e){return t?t.indexOf(e):-1},this.intersect=function(t,e){return e?t.filter(function(t){return-1<e.indexOf(t)}):[]},this.shuffle=function(t){return t.sort(function(){return.5-Math.random()})},this.unique=function(e,t){return t?e.concat(t.filter(t=>e.indexOf(t)<0)):e},this.distinct=function(n,i){return i?n.filter((e,t)=>n.findIndex(t=>e[i]===t[i])==t):n},this.swap=function(t,e,n){var i=t[e];return t[e]=t[n],t[n]=i,r},this.eq=function(t,n){return t&&n&&t.every((t,e)=>n[e]==t)},this.push=function(t,e){return t&&t.push(e),r},this.pushAt=function(t,e,n){return t&&t.splice(n,0,e),r},this.pop=function(t){return t&&t.pop(),r},this.popAt=function(t,e){return t&&t.splice(e,1),r},this.remove=function(t,e,n){return t&&t.splice(e,n),r},this.reset=function(t){return t&&t.splice(0),r},this.get=function(t,e){return t?t[e]:null},this.last=function(t){return r.get(t,o(t)-1)},this.clone=function(t){return t?t.slice():[]},this.sort=function(t,e){return t&&t.sort(e||l)},this.sortBy=function(t,n,i,e){return i=i||l,t&&n?t.sort("desc"==e?function(t,e){return i(e[n],t[n])}:function(t,e){return i(t[n],e[n])}):t},this.multisort=function(t,a,o,u){return u=u||[],o=o||[],t.sort(function t(e,n,i){var r=a[i=i||0];let s=u[i]||l;r="desc"==o[i]?s(n[field],e[field]):s(e[r],n[r]);return 0==r&&++i<a.length?t(e,n,i):r}),r},this.each=function(e,n){var i=o(e);for(let t=0;t<i;t++)n(e[t],t);return r},this.reverse=function(e,n){for(let t=o(e)-1;-1<t;t--)n(e[t],t);return r},this.extract=function(e,n){var i=o(e);for(let t=0;t<i;t++)n(e[t],t)&&e.splice(t--,1);return r},this.flush=function(t,e){e=r.ifind(t,e);return-1<e&&t.splice(e,1),r},this.format=function(t,e,s){(s=s||{}).separator=s.separator||"",s.empty=s.empty||"";const a={size:o(t)};return t&&e&&t.map((i,r)=>(a.index=r,a.count=r+1,e.replace(/@(\w+);/g,function(t,e){let n=s[e];return(n?n(i[e],i,r):i[e]??a[e])??s.empty}))).join(s.separator)},this.parse=function(t){return t?JSON.parse(t):null},this.read=function(t){return r.parse(window.sessionStorage.getItem(t))},this.stringify=function(t){return"string"==typeof(e=t)||e instanceof String?t:JSON.stringify(t);var e},this.ss=function(t,e){return e&&window.sessionStorage.setItem(t,r.stringify(e)),r},this.ls=function(t,e){return e&&window.localStorage.setItem(t,r.stringify(e)),r}}function DateBox(){const u=this,e="",s=new Date,n=/^\d.+$/,i=/\D+/g,r=[31,28,31,30,31,30,31,31,30,31,30,31];function a(t){return t&&t[0]}function o(t){return t&&n.test(t)}function l(t){return t.split(i)}function c(t){return t<10?"0"+t:t}function h(t){var e=t[2];return t[2]=t[0],t[0]=e,t}function d(t,e,n){return Math.min(Math.max(t||0,e),n)}function f(t){return d(t,0,59)}function g(t){return t<100?+(e+parseInt(s.getFullYear()/100)+c(t)):t}function m(t){return 0==(3&t)&&(t%25!=0||0==(15&t))}function p(t,e){return r[e]+(1==e&&m(t))}function v(t){return t&&t.getTime&&!isNaN(t.getTime())}function b(t){return t[0]=g(+t[0]||0),t[1]=d(t[1],1,12),t[2]=d(t[2],1,p(t[0],t[1]-1)),t}function T(t,e,n,i,r){return t.setHours(d(e,0,23),f(n),f(i),r||0),isNaN(t.getTime())?null:t}function D(t){let e=new Date;return t=b(t),e.setFullYear(t[0],t[1]-1,t[2]),T(e,t[3],t[4],t[5],t[6])}function I(t){return a(t)?D(t):null}function y(t){return c(t.getHours())+":"+c(t.getMinutes())}function M(t){return y(t)+":"+c(t.getSeconds())}function F(t){return t.getFullYear()+"-"+c(t.getMonth()+1)+"-"+c(t.getDate())}function x(t){return c(t.getDate())+"/"+c(t.getMonth()+1)+"/"+t.getFullYear()}this.build=D,this.isValid=v,this.sysdate=()=>s,this.toDate=t=>t?new Date(t):null,this.isLeap=t=>t&&m(t.getFullYear()),this.getDays=(t,e)=>Math.round(Math.abs((t-e)/864e5)),this.daysInMonth=t=>t?p(t.getFullYear(),t.getMonth()):0,this.toArray=t=>t?[t.getFullYear(),t.getMonth()+1,t.getDate(),t.getHours(),t.getMinutes(),t.getSeconds(),t.getMilliseconds()]:[],this.addDate=function(t,e){return t&&t.setDate(t.getDate()+e),u},this.addHours=function(t,e){return t&&t.setHours(t.getHours()+e),u},this.addMs=function(t,e){return t&&t.setMilliseconds(t.getMilliseconds()+e),u},this.reset=function(t){return t&&t.setFullYear(s.getFullYear(),s.getMonth(),s.getDate()),u},this.toISODateString=t=>(t||s).toISOString().substring(0,10),this.trunc=function(t){return t&&t.setHours(0,0,0,0),u},this.clone=function(t){return new Date((t||s).getTime())},this.randTime=(t,e)=>Math.floor(Math.random()*(e.getTime()-t.getTime())+t.getTime()),this.randDate=(t,e)=>new Date(u.randTime(t,e)),this.toUTC=function(t){return t&&t.setTime(Date.UTC(t.getFullYear(),t.getMonth(),t.getDate(),t.getHours(),t.getMinutes(),t.getSeconds())),u},this.utcToDate=function(t){return t&&(t.setFullYear(t.getUTCFullYear(),t.getUTCMonth(),t.getUTCDate()),t.setHours(t.getUTCHours(),t.getUTCMinutes(),t.getUTCSeconds(),t.getUTCMilliseconds())),u},this.getWeek=function(t){t=t||s;var e=new Date(t.getFullYear(),0,1);return Math.ceil((t.getDay()+1+u.getDays(t,e))/7)},this.week=function(t,e){e=e||1;const n=new Date(t,0,1);t=(n.getDay()+6)%7;return n.setDate(n.getDate()+7*e-t),n},this.toWeek=function(t){return t?u.week(+t.substr(0,4),+t.substr(6)):null},this.isoWeek=function(t){return t?t.getFullYear()+"-W"+c(u.getWeek(t)):null},this.toObject=function(t,e){var n=(t=t||s).getDay();let i=t.getFullYear().toString();const r={yyyy:+i,y:+i.substr(0,2),yy:+i.substr(2,2),m:t.getMonth(),d:t.getDate()};return r.mmm=e.monthNamesShort[r.m],r.mmmm=e.monthNames[r.m],r.mm=c(++r.m),r.ddd=e.dayNamesShort[n],r.dddd=e.dayNames[n],r.dd=c(r.d),r.h=t.getHours(),r.hh=c(r.h),r.M=t.getMinutes(),r.MM=c(r.M),r.s=t.getSeconds(),r.ss=c(r.s),r.ms=t.getMilliseconds(),r.t=r.h<12?"a":"p",r.tt=r.t+"m",r},this.diff=function(t,e){if((e=e||s)<t)return u.diff(e,t);const i=u.toArray(e);const r=[0,12,u.daysInMonth(e)-e.getDate()+t.getDate(),24,60,60,1e3];return u.toArray(t).forEach(function t(e,n){i[n]-=e,i[n]<0&&(i[n]+=r[n],t(1,n-1))}),i},this.interval=function(t,e,n,i,r){let s=u.clone(t);r=r||1e3;const a=new Date(s.getTime()+e),o=setInterval(function(){u.addMs(s,r),(!n(s,a)||a<=s)&&(clearInterval(o),i&&i())},r);return u},this.lt=(t,e)=>v(t)&&v(e)&&t.getTime()<e.getTime(),this.le=(t,e)=>v(t)&&v(e)&&t.getTime()<=e.getTime(),this.eq=(t,e)=>v(t)&&v(e)&&t.getTime()==e.getTime(),this.ge=(t,e)=>v(t)&&v(e)&&t.getTime()>=e.getTime(),this.gt=(t,e)=>v(t)&&v(e)&&t.getTime()>e.getTime(),this.cmp=function(t,e){return v(t)&&v(e)?t.getTime()-e.getTime():v(t)?-1:1},this.inYear=(t,e)=>v(t)&&v(e)&&t.getFullYear()==e.getFullYear(),this.inMonth=(t,e)=>u.inYear(t,e)&&t.getMonth()==e.getMonth(),this.inDay=(t,e)=>u.inMonth(t,e)&&t.getDate()==e.getDate(),this.inHour=(t,e)=>u.inDay(t,e)&&t.getHours()==e.getHours(),this.past=t=>u.lt(t,s),this.future=t=>u.gt(t,s),this.geToday=t=>u.inDay(t,s)||u.ge(t,s),this.between=function(t,e,n){return!!v(t)&&(e=(v(e)?e:t).getTime(),n=(v(n)?n:t).getTime(),e<=t.getTime()&&t.getTime()<=n)},this.minTime=t=>t?y(t):null,this.isoTime=t=>t?M(t):null,this.acTime=t=>t&&t.replace(/(\d\d)(\d+)$/g,"$1:$2").replace(/[^\d\:]/g,e),this.toTime=function(t){t=t&&l(t);return a(t)?T(new Date,t[0],t[1],t[2],t[3]):null},this.fmtTime=function(t){let e=t&&l(t);return a(e)?(e[0]=d(e[0],0,23),e[1]=f(e[1]),e[2]&&(e[2]=f(e[2])),e.map(c).join(":")):null},this.enDate=t=>t?I(l(t)):null,this.isoEnDate=t=>v(t)?F(t):null,this.isoEnDateTime=t=>v(t)?F(t)+" "+M(t):null,this.fmtEnDate=t=>o(t)?b(l(t)).map(c).join("-"):null,this.acEnDate=t=>t&&t.replace(/^(\d{4})(\d+)$/g,"$1-$2").replace(/^(\d{4}\-\d\d)(\d+)$/g,"$1-$2").replace(/[^\d\-]/g,e),this.esDate=t=>t?I(h(l(t))):null,this.isoEsDate=t=>v(t)?x(t):null,this.isoEsDateTime=t=>v(t)?x(t)+" "+M(t):null,this.fmtEsDate=t=>o(t)?h(b(h(l(t)))).map(c).join("/"):null,this.acEsDate=t=>t&&t.replace(/^(\d\d)(\d+)$/g,"$1/$2").replace(/^(\d\d\/\d\d)(\d+)$/g,"$1/$2").replace(/[^\d\/]/g,e)}function DomBox(){const h=this,r="",i="hide",n=document.createElement("div"),l=document.createElement("textarea");function t(t){console.log("Log:",t)}function s(t){return t?t.length:0}function a(t){return t?t.split(/\s+/):[]}this.get=(t,e)=>(e||document).querySelector(t),this.getAll=(t,e)=>(e||document).querySelectorAll(t),this.closest=(t,e)=>e&&e.closest(t),this.matches=(t,e)=>e&&e.matches(t),this.sibling=(t,e)=>e&&h.get(t,e.parentNode),this.siblings=(t,e)=>e&&h.getAll(t,e.parentNode),this.getNavLang=()=>navigator.language||navigator.userLanguage,this.getLang=()=>document.documentElement.getAttribute("lang")||h.getNavLang(),this.redir=function(t,e){return t&&window.open(t,e||"_blank"),h},this.unescape=function(t){return l.innerHTML=t,l.value},this.escape=function(t){return n.innerHTML=t,n.innerHTML},this.scroll=function(t,e){return e=e||window,(t=t||e.document.body).scrollIntoView({behavior:"smooth"}),h},this.fetch=function(i){return(i=i||{}).headers=i.headers||{},i.reject=i.reject||t,i.resolve=i.resolve||t,i.headers["x-requested-with"]="XMLHttpRequest",i.headers.Authorization="Bearer "+window.localStorage.getItem("jwt"),window.fetch(i.action,i).then(t=>{let e=t.headers.get("content-type")||r,n=-1<e.indexOf("application/json")?t.json():t.text();return n.then(t.ok?i.resolve:i.reject)})},this.copyToClipboard=function(t){return l.value=t,l.select(),document.execCommand("copy"),h},this.each=function(e,n){if(!e)return h;if(1===e.nodeType)return n(e,0),h;var i=s(e="string"==typeof e?document.querySelectorAll(e):e);for(let t=0;t<i;t++)n(e[t],t,e);return h},this.reverse=function(e,n){for(let t=s(e)-1;-1<t;t--)n(e[t],t,e);return h},this.findIndex=function(e,n){var i=s(n);for(let t=0;t<i;t++)if(n[t].matches(e))return t;return-1},this.find=function(t,e){return e[h.findIndex(t,e)]},this.filter=function(e,t){let n=[];return h.each(t,t=>function(t,e,n){t.matches(e)&&n.push(t)}(t,e,n)),n};const c="input,textarea,select";function e(t){return t.offsetWidth||t.offsetHeight||t.getClientRects().length}function d(t,e){return"SELECT"===t.tagName?(e=e||t.getAttribute("value"),t.selectedIndex=e?h.findIndex("[value='"+e+"']",t.options):0):t.value=e??r,h}this.inputs=t=>h.getAll(c,t),this.focus=function(t){return t&&t.focus(),h},this.setFocus=t=>h.refocus(h.inputs(t)),this.refocus=function(t){return h.reverse(t,t=>{e(t)&&t.matches(":not([type=hidden],[readonly],[disabled],[tabindex='-1'])")&&t.focus()})},this.getValue=t=>t&&t.value,this.setValue=(t,e)=>t?d(t,e):h,this.val=(t,e)=>h.each(t,t=>d(t,e)),this.getAttr=(t,e)=>t&&t.getAttribute(e),this.attr=(t,e,n)=>h.each(t,t=>t.setAttribute(e,n)),this.removeAttr=(t,e)=>h.each(t,t=>t.removeAttribute(e)),this.getText=t=>t&&t.innerText,this.findText=(t,e)=>h.getText(h.get(t,e)),this.text=function(t,e){return e=e||r,h.each(t,t=>{t.innerText=e})},this.setText=(t,e,n)=>h.text(h.getAll(t,n),e),this.getHtml=t=>t&&t.innerHTML,this.findHtml=(t,e)=>h.getHtml(h.get(t,e)),this.html=function(t,e){return e=e||r,h.each(t,t=>{t.innerHTML=e})},this.setHtml=(t,e,n)=>h.html(h.getAll(t,n),e),this.mask=(t,n,i)=>h.each(t,(t,e)=>t.classList.toggle(i,n>>e&1)),this.optText=t=>t?h.getText(t.options[t.selectedIndex]):null,this.select=function(t,n){return h.each(t,t=>{var e=h.mask(t.options,~n,i).get("[value='"+t.value+"']",t);h.hasClass(e,i)&&(t.selectedIndex=h.findIndex(":not(.hide)",t.options))})},this.empty=t=>!t||!t.innerHTML||t.innerHTML.trim()===r,this.add=(e,t)=>h.each(t,t=>e.appendChild(t)),this.append=function(e,t){return t=t||document.body,h.each(t,t=>{n.innerHTML=e,h.add(t,n.childNodes)})};const o={};this.setTpl=function(t,e){return o[t]=e,h},this.loadTemplates=function(){return h.each("template[id]",t=>h.setTpl(t.id,t.innerHTML))},this.render=function(t,e){t.id=t.id||"_"+Math.random().toString(36).substr(2,9);var n=t.dataset.tpl||t.id;return o[n]=o[n]||t.innerHTML,t.innerHTML=e(o[n]),t.classList.toggle(i,!t.innerHTML),h},this.format=(t,e)=>h.each(t,h.render),this.replace=(t,e)=>h.each(t,t=>{t.outerHTML=e}),this.parse=(t,e)=>h.each(t,t=>{t.outerHTML=e(t.outerHTML)}),this.isVisible=t=>t&&e(t),this.visible=(t,e)=>h.isVisible(h.get(t,e)),this.show=t=>h.each(t,t=>t.classList.remove(i)),this.hide=t=>h.each(t,t=>t.classList.add(i)),this.hasClass=(e,t)=>e&&a(t).some(t=>e.classList.contains(t)),this.addClass=function(t,e){const n=a(e);return h.each(t,e=>{n.forEach(t=>e.classList.add(t))})},this.removeClass=function(t,e){const n=a(e);return h.each(t,e=>{n.forEach(t=>e.classList.remove(t))})},this.toggle=function(t,e,n){const i=a(e);return h.each(t,e=>i.forEach(t=>e.classList.toggle(t,n)))},this.toggleHide=function(t,e){return h.toggle(t,i,e)},this.css=function(t,e,n){const i=e.replace(/(-[a-z])/,t=>t.replace("-",r).toUpperCase());return h.each(t,t=>{t.style[i]=n})};const f="change";function g(e,t,n,i){return e.addEventListener(t,t=>i(e,t,n)||t.preventDefault()),h}function m(t,e,n){return t?g(t,e,0,n):h}this.event=(t,n,i)=>h.each(t,(t,e)=>g(t,n,e,i)),this.trigger=(t,e)=>(t&&t.dispatchEvent(new Event(e)),h),this.ready=t=>g(document,"DOMContentLoaded",0,t),this.click=(t,n)=>h.each(t,(t,e)=>g(t,"click",e,n)),this.onClickElem=(t,e)=>m(h.get(t),"click",e),this.onclick=this.onClick=h.click,this.change=(t,n)=>h.each(t,(t,e)=>g(t,f,e,n)),this.onchange=this.onChange=h.change,this.keyup=(t,n)=>h.each(t,(t,e)=>g(t,"keyup",e,n)),this.onkeyup=this.onKeyup=h.keyup,this.keydown=(t,n)=>h.each(t,(t,e)=>g(t,"keydown",e,n)),this.onkeydown=this.onKeydown=h.keydown,this.submit=(t,n)=>h.each(t,(t,e)=>g(t,"submit",e,n)),this.onsubmit=this.onSubmit=h.submit,this.ready(function(){var t=h.getAll("table,form,"+c);const e=h.filter("table",t),n=h.filter("form",t),i=h.filter(c,t);function o(t){var e=h.get("tr.tb-data",t);return h.toggle(t.tBodies[0],"hide",!e).toggle(t.tBodies[1],"hide",e)}function r(t,e,n){h.removeClass(t,"sort-asc sort-desc").addClass(t,"sort-none").toggle(e,"sort-none sort-"+n)}function s(u){const l=nb.intval(u.dataset.pageSize),c=h.get(".pagination",u.parentNode);if(c&&0<l){u.dataset.page=nb.intval(u.dataset.page);let o=Math.ceil(u.dataset.total/l);!function n(e){let i="";function t(t,e){t=nb.range(t,0,o-1),i+='<a href="#" data-page="'+t+'">'+e+"</a>"}function r(t){t=nb.range(t,0,o-1),i+='<a href="#" data-page="'+t+'"',i+=t==e?' class="active">':">",i+=t+1+"</a>"}let s=0;t(e-1,"&laquo;"),1<o&&r(0),s=Math.max(e-3,1),2<s&&t(s-1,"...");for(var a=Math.min(e+3,o-1);s<=a;)r(s++);s<o-1&&t(s,"..."),s<o&&r(o-1),t(e+1,"&raquo;"),c.innerHTML=i,h.click(h.getAll("a",c),t=>{var e=+t.dataset.page,t={index:e*l,length:l};n(e),u.dataset.page=e,u.dispatchEvent(new CustomEvent("pagination",{detail:t}))})}(u.dataset.page)}return dom}function a(i,r,s,a){return s.size=r.length,s.total=s.total??(+i.dataset.total||r.length),h.render(i.tFoot,t=>sb.format(s,t,a)).render(i.tBodies[0],t=>ab.format(r,t,a)),h.click(h.getAll("a[href='#find']",i),(t,e,n)=>{i.dispatchEvent(new CustomEvent("find",{detail:r[n]}))}),h.click(h.getAll("a[href='#remove']",i),(t,e,n)=>{confirm(a?.remove)&&(s.total--,n=r.splice(n,1)[0],i.dispatchEvent(new CustomEvent("remove",{detail:n})))}),i.dispatchEvent(new Event("render")),o(i)}function u(t,e,n,i){return h.renderRows(t,e,n,i),s(t)}h.getTable=t=>h.find(t,e),h.getTables=t=>h.filter(t,e),h.getForm=t=>h.find(t,n),h.getForms=t=>h.filter(t,n),h.getInput=t=>h.find(t,i),h.getInputs=t=>t?h.filter(t,i):i,h.moveFocus=t=>h.focus(h.getInput(t)),h.getVal=t=>h.getValue(h.getInput(t)),h.setVal=(t,e)=>h.val(h.getInputs(t),e),h.setInputValue=(t,e)=>h.setValue(h.getInput(t),e),h.getOptText=t=>h.optText(h.getInput(t)),h.copyVal=(t,e)=>h.setInputValue(t,h.getVal(e)),h.setAttr=(t,e,n)=>h.attr(h.getInputs(t),e,n),h.delAttr=(t,e)=>h.removeAttr(h.getInputs(t),e),h.setInput=(t,e,n)=>{t=h.getInput(t);return t&&(g(t,f,0,n),d(t,e)),h},h.onChangeForm=(t,e)=>m(h.getForm(t),f,e),h.onSubmitForm=(t,e)=>m(h.getForm(t),"submit",e),h.onChangeForms=(t,e)=>h.change(h.getForms(t),e),h.onSubmitForms=(t,e)=>h.submit(e,h.getForms(t)),h.onChangeInput=(t,e)=>m(h.getInput(t),f,e),h.onChangeInputs=(t,e)=>h.change(h.getInputs(t),e),h.refocus(i),h.onFindRow=(t,e)=>h.event(h.getTables(t),"find",e),h.onRemoveRow=(t,e)=>h.event(h.getTables(t),"remove",e),h.onChangeTable=(t,e)=>m(h.getTable(t),f,e),h.onChangeTables=(t,e)=>h.change(h.getTables(t),e),h.onRenderTable=(t,e)=>m(h.getTable(t),"render",e),h.onRenderTables=(t,e)=>h.event(h.getTables(t),"render",e),h.onPaginationTable=(t,e)=>h.event(h.getTables(t),"pagination",e),h.renderRows=function(t,e,n,i){return t?a(t,e,n,i):dom},h.list=function(t,e,n,i){return h.each(h.getTables(t),t=>a(t,e,n,i))},h.renderTable=function(t,e,n,i){return t?u(t,e,n,i):dom},h.renderTables=function(t,e,n,i){return h.each(h.getTables(t),t=>u(t,e,n,i))},h.each(e,t=>{const n=h.getAll(".sort",t.tHead);t.dataset.sortDir&&r(n,h.find(".sort-"+t.dataset.sortBy,n),t.dataset.sortDir),h.click(n,t=>{var e=h.hasClass(t,"sort-asc")?"desc":"asc";r(n,t,e)}),o(t),s(t)}),l.style.position="absolute",l.style.left="-9999px",document.body.prepend(l)})}function I18nBox(){const r=this,s=new Map,n=new Map,e="msgError",a={},o={en:{lang:"en",errForm:"Form validation failed",errRequired:"Required field!",errMinlength8:"The minimum required length is 8 characters",errMaxlength:"Max length exceded",errNif:"Wrong ID format",errCorreo:"Wrong Mail format",errDate:"Wrong date format",errDateLe:"Date must be less or equals than current",errDateGe:"Date must be greater or equals than current",errNumber:"Wrong number format",errGt0:"Price must be great than 0.00 &euro;",errRegex:"Wrong format",errReclave:"Passwords typed do not match",errRange:"Value out of allowed range",errRefCircular:"Circular reference",remove:"Are you sure to delete this element?",removeOk:"Element removed successfully!",cancel:"Are you sure to cancel element?",cancelOk:"Element canceled successfully!",unlink:"Are you sure to unlink those elements?",unlinkOk:"Elements unlinked successfully!",linkOk:"Elements linked successfully!",closeText:"close",prevText:"prev",nextText:"next",currentText:"current",monthNames:["January","February","March","April","May","June","July","August","September","October","November","December"],monthNamesShort:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],dayNames:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],dayNamesShort:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],dayNamesMin:["Su","Mo","Tu","We","Th","Fr","Sa"],dateFormat:"yy-mm-dd",firstDay:0,toDate:dt.enDate,isoDate:dt.isoEnDate,isoDateTime:dt.isoEnDateTime,fmtDate:dt.fmtEnDate,acDate:dt.acEnDate,toTime:dt.toTime,minTime:dt.minTime,isoTime:dt.isoTime,fmtTime:dt.fmtTime,acTime:dt.acTime,toInt:nb.toInt,isoInt:nb.enIsoInt,fmtInt:nb.enFmtInt,toFloat:nb.enFloat,isoFloat:nb.enIsoFloat,fmtFloat:nb.enFmtFloat,fmtBool:nb.enBool,val:sb.enVal},es:{lang:"es",errForm:"Error al validar los campos del formulario",errRequired:"¡Campo obligatorio!",errMinlength8:"La longitud mínima requerida es de 8 caracteres",errMaxlength:"Longitud máxima excedida",errNif:"Formato de NIF / CIF incorrecto",errCorreo:"Formato de E-Mail incorrecto",errDate:"Formato de fecha incorrecto",errDateLe:"La fecha debe ser menor o igual a la actual",errDateGe:"La fecha debe ser mayor o igual a la actual",errNumber:"Valor no numérico",errGt0:"El importe debe ser mayor de 0,00 &euro;",errRegex:"Formato incorrecto",errReclave:"Las claves introducidas no coinciden",errRange:"Valor fuera del rango permitido",errRefCircular:"Referencia circular",remove:"¿Confirma que desea eliminar este registro?",removeOk:"Registro eliminado correctamente.",cancel:"¿Confirma que desea cancelar este registro?",cancelOk:"Elemento cancelado correctamente.",unlink:"¿Confirma que desea desasociar estos registros?",unlinkOk:"Registros desasociados correctamente",linkOk:"Registros asociados correctamente.",closeText:"cerrar",prevText:"prev.",nextText:"sig.",currentText:"hoy",monthNames:["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"],monthNamesShort:["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"],dayNames:["Domingo","Lunes","Martes","Miércoles","Jueves","Viernes","Sábado"],dayNamesShort:["Dom","Lun","Mar","Mié","Juv","Vie","Sáb"],dayNamesMin:["Do","Lu","Ma","Mi","Ju","Vi","Sa"],dateFormat:"dd/mm/yy",firstDay:1,toDate:dt.esDate,isoDate:dt.isoEsDate,isoDateTime:dt.isoEsDateTime,fmtDate:dt.fmtEsDate,acDate:dt.acEsDate,toTime:dt.toTime,minTime:dt.minTime,isoTime:dt.isoTime,fmtTime:dt.fmtTime,acTime:dt.acTime,toInt:nb.toInt,isoInt:nb.esIsoInt,fmtInt:nb.esFmtInt,toFloat:nb.esFloat,isoFloat:nb.esIsoFloat,fmtFloat:nb.esFmtFloat,fmtBool:nb.esBool,val:sb.val}};let u=o.es;this.getLangs=function(t){return a[t]||o},this.getLang=function(t,e){return r.getLangs(e)[t]||u},this.getI18n=function(t,e){e=r.getLangs(e);return t&&(e[t]||e[t.substr(0,2)])||u},this.setI18n=function(t,e){return u=r.getI18n(t,e),r},this.get=t=>u[t],this.tr=t=>u[t]||t,this.set=function(t,e){return u[t]=e,r},this.format=(t,e)=>sb.format(u,t,e),this.addLang=function(e,n,i){if(i){let t=a[i]=a[i]||{};t[e]=Object.assign(t[e]||{},o[e],n)}else o[e]=Object.assign(o[e]||{},n);return r},this.addLangs=function(t,e){for(const n in t)r.addLang(n,t[n],e);return r},this.toInt=t=>u.toInt(t),this.isoInt=t=>u.isoInt(t),this.fmtInt=t=>u.fmtInt(t),this.toFloat=t=>u.toFloat(t),this.isoFloat1=t=>u.isoFloat(t,1),this.isoFloat=t=>u.isoFloat(t),this.isoFloat3=t=>u.isoFloat(t,3),this.fmtFloat1=t=>u.fmtFloat(t,1),this.fmtFloat=t=>u.fmtFloat(t),this.fmtFloat3=t=>u.fmtFloat(t,3),this.toDate=t=>u.toDate(t),this.isoDate=t=>u.isoDate(t),this.fmtDate=t=>u.fmtDate(t),this.acDate=t=>u.acDate(t),this.toTime=t=>u.toTime(t),this.minTime=t=>u.minTime(t),this.isoTime=t=>u.isoTime(t),this.fmtTime=t=>u.fmtTime(t),this.acTime=t=>u.acTime(t),this.fmtBool=t=>u.fmtBool(t),this.confirm=t=>confirm(r.tr(t)),this.val=(t,e)=>u.val(t,e),this.arrval=function(t,e){t=u[t];return t&&t[e]||"-"},this.getMsgs=()=>n,this.getMsg=t=>n.get(t),this.setMsg=(t,e)=>(n.set(t,e),r),this.setOk=t=>r.setMsg("msgOk",r.tr(t)),this.setInfo=t=>r.setMsg("msgInfo",r.tr(t)),this.setWarn=t=>r.setMsg("msgWarn",r.tr(t)),this.getError=t=>n.get(t||e),this.setMsgError=t=>r.setMsg(e,r.tr(t)),this.setError=(t,e,n)=>r.setMsgError(e).setMsg(t,r.tr(n)),this.getNumMsgs=()=>n.size,this.getData=t=>t?s.get(t):s,this.toData=()=>Object.fromEntries(s),this.toMsgs=()=>Object.fromEntries(n),this.reset=function(){return s.clear(),n.clear(),r},this.start=(t,e)=>r.reset().setI18n(t,e),this.valid=function(t,e,n,i){return sb.isset(e)?(s.set(t,e),!0):(r.setError(t,n,i),!1)},this.isOk=()=>!n.has(e),this.isError=t=>n.has(t||e),this.required=(t,e,n,i)=>r.valid(t,valid.required(e),n,i),this.size10=(t,e,n,i)=>r.valid(t,valid.size10(e),n,i),this.size50=(t,e,n,i)=>r.valid(t,valid.size50(e),n,i),this.size200=(t,e,n,i)=>r.valid(t,valid.size200(e),n,i),this.size300=(t,e,n,i)=>r.valid(t,valid.size300(e),n,i),this.text10=(t,e,n,i)=>r.valid(t,valid.text10(e),n,i),this.text50=(t,e,n,i)=>r.valid(t,valid.text50(e),n,i),this.text200=(t,e,n,i)=>r.valid(t,valid.text200(e),n,i),this.text300=(t,e,n,i)=>r.valid(t,valid.text300(e),n,i),this.text=(t,e,n,i)=>r.valid(t,valid.text(e),n,i),this.fk=(t,e,n,i)=>r.valid(t,valid.fk(e),n,i),this.intval=(t,e,n,i)=>r.valid(t,valid.intval(e),n,i),this.intval3=(t,e,n,i)=>r.valid(t,valid.intval3(e),n,i),this.iGt0=(t,e,n,i)=>r.valid(t,valid.gt0(u.toInt(e)),n,i),this.gt0=(t,e,n,i)=>r.valid(t,valid.gt0(u.toFloat(e)),n,i),this.regex=(t,e,n,i)=>r.valid(t,valid.regex(e),n,i),this.login=(t,e,n,i)=>r.valid(t,valid.login(e),n,i),this.digits=(t,e,n,i)=>r.valid(t,valid.digits(e),n,i),this.idlist=(t,e,n,i)=>r.valid(t,valid.idlist(e),n,i),this.email=(t,e,n,i)=>r.valid(t,valid.email(e),n,i),this.isDate=(t,e,n,i)=>r.valid(t,valid.isDate(e),n,i),this.past=(t,e,n,i)=>r.valid(t,valid.past(e),n,i),this.future=(t,e,n,i)=>r.valid(t,valid.future(e),n,i),this.geToday=(t,e,n,i)=>r.valid(t,valid.geToday(e),n,i),this.dni=(t,e,n,i)=>r.valid(t,valid.dni(e),n,i),this.cif=(t,e,n,i)=>r.valid(t,valid.cif(e),n,i),this.nie=(t,e,n,i)=>r.valid(t,valid.nie(e),n,i),this.idES=(t,e,n,i)=>r.valid(t,valid.idES(e),n,i),this.user=(t,e,n,i)=>r.valid(t,valid.email(e)||valid.idES(e),n,i),this.iban=(t,e,n,i)=>r.valid(t,valid.iban(e),n,i),this.creditCardNumber=(t,e,n,i)=>r.valid(t,valid.creditCardNumber(e),n,i)}function NumberBox(){const r=this,s="",a=".";function o(t){return null!=t}function u(t){return t.replace(/\D+/g,s)}function l(t){return u(t).replace(/^0+(\d+)/,"$1")}function c(t){return"-"==t.charAt(0)?"-":s}function h(t,e){for(var n=[],i=t.length;e<i;i-=e)n.unshift(t.substr(i-e,e));return 0<i&&n.unshift(t.substr(0,i)),n}function n(t,e){var n=c(t),t=l(t);return t?n+h(t,3).join(e):null}function d(e,n,i,r,s){r=isNaN(r)?2:r;var a=c(e),s=e.lastIndexOf(s);let o=0<s?e.substr(0,s):e;if(o=0==s?"0":l(o),o){let t=s<0?"0":e.substr(s+1,r);return a+h(o,3).join(n)+i+(s<0?"0".repeat(r):t.padEnd(r,"0"))}return null}this.lt0=t=>o(t)&&t<0,this.le0=t=>o(t)&&t<=0,this.gt0=t=>o(t)&&0<t,this.range=(t,e,n)=>Math.min(Math.max(t,e),n),this.between=(t,e,n)=>e<=t&&t<=n,this.cmp=function(t,e){return isNaN(t)||isNaN(e)?isNaN(e)?-1:1:t-e},this.round=function(t,e){return e=o(e)?e:2,+(Math.round(t+"e"+e)+"e-"+e)},this.eq2=(t,e)=>o(t)&&r.round(t)==r.round(e),this.eq3=(t,e)=>o(t)&&r.round(t,3)==r.round(e,3),this.rand=(t,e)=>Math.random()*(e-t)+t,this.randInt=(t,e)=>Math.floor(r.rand(t,e)),this.toInt=function(t){if(t){t=parseInt(c(t)+u(t));return isNaN(t)?null:t}return null},this.isoInt=(t,e)=>o(t)?n(s+t,e):null,this.enIsoInt=t=>r.isoInt(t,","),this.esIsoInt=t=>r.isoInt(t,a),this.fmtInt=function(t,e){return t&&n(t,e)},this.enFmtInt=t=>r.fmtInt(t,","),this.esFmtInt=t=>r.fmtInt(t,a),this.intval=t=>parseInt(t)||0,this.toFloat=function(t,e){if(t){var n=c(t),i=t.lastIndexOf(e),e=i<0?t:t.substr(0,i),i=i<0?s:a+t.substr(i+1),i=parseFloat(n+u(e)+i);return isNaN(i)?null:i}return null},this.enFloat=t=>r.toFloat(t,a),this.esFloat=t=>r.toFloat(t,","),this.isoFloat=(t,e,n,i)=>o(t)?d(s+r.round(t,i),e,n,i,a):null,this.enIsoFloat=(t,e)=>r.isoFloat(t,",",a,e),this.esIsoFloat=(t,e)=>r.isoFloat(t,a,",",e),this.fmtFloat=function(t,e,n,i){return t&&d(t,e,n,i,n)},this.enFmtFloat=(t,e)=>r.fmtFloat(t,",",a,e),this.esFmtFloat=(t,e)=>r.fmtFloat(t,a,",",e),this.floatval=t=>parseFloat(t)||0,this.boolval=t=>t&&"false"!==t&&"0"!==t,this.enBool=t=>r.boolval(t)?"Yes":"No",this.esBool=t=>r.boolval(t)?"Sí":"No"}function StringBox(){const s=this,e=/"|'|&|<|>|\\/g,n={'"':"&#34;","'":"&#39;","&":"&#38;","<":"&#60;",">":"&#62;","\\":"&#92;"};function i(t){return"string"==typeof t||t instanceof String}function a(t){return i(t)?t.trim():t}function o(t){return t?t.length:0}function r(t){for(var e="",n=o(a(t)),i=0;i<n;i++){var r=t.charAt(i),s="àáâãäåāăąÀÁÂÃÄÅĀĂĄÆßèéêëēĕėęěÈÉĒĔĖĘĚìíîïìĩīĭÌÍÎÏÌĨĪĬòóôõöōŏőøÒÓÔÕÖŌŎŐØùúûüũūŭůÙÚÛÜŨŪŬŮçÇñÑþÐŔŕÿÝ".indexOf(r);e+=s<0?r:"aaaaaaaaaAAAAAAAAAABeeeeeeeeeEEEEEEEiiiiiiiiIIIIIIIIoooooooooOOOOOOOOOuuuuuuuuUUUUUUUUcCnNdDRryY".charAt(s)}return e.toLowerCase()}this.isset=function(t){return null!=t},this.isstr=i,this.trim=a,this.size=o,this.eq=function(t,e){return r(t)==r(e)},this.iiOf=function(t,e){return r(t).indexOf(r(e))},this.substr=function(t,e,n){return t&&t.substr(e,n)},this.indexOf=function(t,e){return t?t.indexOf(e):-1},this.lastIndexOf=function(t,e){return t?t.lastIndexOf(e):-1},this.prevIndexOf=function(t,e,n){return t?t.substr(0,n).lastIndexOf(e):-1},this.starts=function(t,e){return t&&t.startsWith(e)},this.ends=function(t,e){return t&&t.endsWith(e)},this.prefix=function(t,e){return s.starts(t,e)?t:e+t},this.suffix=function(t,e){return s.ends(t,e)?t:t+e},this.trunc=(t,e)=>o(t)>e?t.substr(0,e).trim()+"...":t,this.itrunc=function(t,e){var n=o(t)>e?s.prevIndexOf(t," ",e):-1;return s.trunc(t,n<0?e:n)},this.escape=function(t){return t&&t.replace(e,t=>n[t])},this.unescape=function(t){return t&&t.replace(/&#(\d+);/g,(t,e)=>String.fromCharCode(e))},this.removeAt=(t,e,n)=>e<0?t:t.substr(0,e)+t.substr(e+n),this.insertAt=(t,e,n)=>t?t.substr(0,n)+e+t.substr(n):e,this.replaceAt=(t,e,n,i)=>n<0?t:t.substr(0,n)+e+t.substr(n+i),this.replaceLast=(t,e,n)=>t?s.replaceAt(t,n,t.lastIndexOf(e),e.length):n,this.wrapAt=(t,e,n,i,r)=>e<0?t:s.insertAt(s.insertAt(t,i,e),r,e+i.length+n),this.iwrap=(t,e,n,i)=>e&&s.wrapAt(t,s.iiOf(t,e),e.length,n||"<u><b>",i||"</b></u>"),this.rand=t=>Math.random().toString(36).substr(2,t||8),this.lopd=t=>t&&"***"+t.substr(3,4)+"**",this.toDate=t=>t?new Date(t):null,this.split=(t,e)=>t?t.trim().split(e||","):[],this.minify=t=>t&&t.trim().replace(/\s{2}/g,""),this.toWord=t=>t&&t.trim().replace(/\W+/g,""),this.lines=t=>s.split(t,/[\n\r]+/),this.words=t=>s.split(t,/\s+/),this.ilike=(t,e)=>-1<s.iiOf(t,e),this.olike=(e,t,n)=>t.some(t=>s.ilike(e[t],n)),this.alike=(e,n,t)=>s.words(t).some(t=>s.olike(e,n,t)),this.between=function(t,e,n){return n=n??t,(e=e??t)<=t&&t<=n},this.ltr=function(t,e){const n=[];for(var i=o(t);e<i;i-=e)n.unshift(t.substr(i-e,e));return 0<i&&n.unshift(t.substr(0,i)),n},this.rtl=function(t,e){const n=[];for(var i=o(t),r=0;r<i;r+=e)n.push(t.substr(r,e));return n},this.slices=function(e,n){const i=[];var r=0,s=o(e);for(let t=0;r<s&&t<n.length;t++){var a=n[t];i.push(e.substr(r,a)),r+=a}return r<s&&i.push(e.substr(r)),i},this.val=(t,e)=>t[e],this.enVal=(t,e)=>t[e+"_en"]||t[e],this.format=function(i,t,r){return(r=r||{}).empty=r.empty||"",i&&t&&t.replace(/@(\w+);/g,(t,e)=>{let n=r[e];return(n?n(i[e],i):i[e])??r.empty})},this.entries=function(e,n,i){i=i||{};let r="";for(const a in e){let t=i[a];var s=t?t(e[a],e):e[a];r+=n.replace("@key;",a).replace("@value;",s)}return r}}function ValidatorBox(){const i=this,e=/"|'|&|<|>|\\/g,n={'"':"&#34;","'":"&#39;","&":"&#38;","<":"&#60;",">":"&#62;","\\":"&#92;"},r=/^\d+$/,s=/^\d+(,\d+)*$/,a=/\w+[^\s@]+@[^\s@]+\.[^\s@]+/,o=/^[\w#@&°!§%;:=\^\/\(\)\?\*\+\~\.\,\-\$]{8,}$/;const u=/^(\d{8})([A-Z])$/,l=/^([ABCDEFGHJKLMNPQRSUVW])(\d{7})([0-9A-J])$/,c=/^[XYZ]\d{7,8}[A-Z]$/;function h(t){return t?t.length:0}function d(t){return t&&t.trim()}function f(t){return t&&t.trim().replace(/\W+/g,"").toUpperCase()}function g(t,e){try{return e&&t.test(e)?e:null}catch(t){}return null}function m(t,e,n){return t=i.escape(t),nb.between(h(t),e,n)?t:null}function p(t){return"TRWAGMYFPDXBNJZSQVHLCKE".charAt(parseInt(t,10)%23)==t.charAt(8)?t:null}this.range=function(t,e,n){return null!=t&&nb.between(t,e,n)?t:null},this.gt0=t=>i.range(t,.001,1e9),this.intval=t=>i.range(nb.intval(t),1,9),this.intval3=t=>i.range(nb.intval(t),1,3),this.intval5=t=>i.range(nb.intval(t),1,5),this.fk=t=>i.range(nb.intval(t),1,1/0),this.size=function(t,e,n){return t=d(t),nb.between(h(t),e,n)?t:null},this.required=t=>i.size(t,1,1e3),this.size10=t=>i.size(t,0,10),this.size50=t=>i.size(t,0,50),this.size200=t=>i.size(t,0,200),this.size300=t=>i.size(t,0,300),this.unescape=t=>t?t.replace(/&#(\d+);/g,(t,e)=>String.fromCharCode(e)):null,this.escape=t=>t?t.trim().replace(e,t=>n[t]):null,this.text10=t=>m(t,0,10),this.text50=t=>m(t,0,50),this.text200=t=>m(t,0,200),this.text300=t=>m(t,0,300),this.text=t=>m(t,0,1e3),this.regex=(t,e)=>g(t,d(e)),this.login=t=>i.regex(o,t),this.digits=t=>i.regex(r,t),this.idlist=t=>i.regex(s,t),this.email=function(t){return(t=i.regex(a,t))&&t.toLowerCase()},this.isDate=function(t){t=dt.toDate(t);return isDate(t)?t:null},this.past=function(t){t=dt.toDate(t);return dt.past(t)?t:null},this.future=function(t){t=dt.toDate(t);return dt.future(t)?t:null},this.geToday=function(t){t=dt.toDate(t);return dt.geToday(t)?t:null},this.dni=function(t){return(t=g(u,f(t)))&&p(t)},this.cif=function(t){if(!(t=g(l,f(t))))return null;for(var e=t.match(l),n=e[1],i=e[2],r=e[3],s=0,a=0;a<i.length;a++){var o=parseInt(i[a],10);s+=o=a%2==0?(o*=2)<10?o:parseInt(o/10)+o%10:o}var u=0!==(s%=10)?10-s:s,e="JABCDEFGHI".substr(u,1);return(n.match(/[ABEH]/)?r==u:!n.match(/[KPQS]/)&&r==u||r==e)?t:null},this.nie=function(t){if(!(t=g(c,f(t))))return null;var e=t.charAt(0);return p(("X"==e?0:"Y"==e?1:"Z"==e?2:e)+t.substr(1))},this.idES=function(t){return i.dni(t)||i.cif(t)||i.nie(t)},this.iban=function(t){var e=(t=f(t))&&t.match(/^([A-Z]{2})(\d{2})([A-Z\d]+)$/);if(!e||h(t)!=={AD:24,AE:23,AT:20,AZ:28,BA:20,BE:16,BG:22,BH:22,BR:29,CH:21,CR:22,CY:28,CZ:24,DE:22,DK:18,DO:28,EE:20,ES:24,FI:18,FO:18,FR:27,GB:22,GI:23,GL:18,GR:27,GT:28,HR:21,HU:28,IE:22,IL:23,IS:26,IT:27,JO:30,KW:30,KZ:20,LB:28,LI:21,LT:20,LU:20,LV:21,MC:27,MD:24,ME:22,MK:19,MR:27,MT:31,MU:30,NL:18,NO:15,PK:24,PL:28,PS:29,PT:25,QA:29,RO:24,RS:22,SA:24,SE:24,SI:19,SK:24,SM:27,TN:24,TR:26,AL:28,BY:28,EG:29,GE:22,IQ:23,LC:32,SC:31,ST:25,SV:28,TL:23,UA:29,VA:22,VG:24,XK:20}[e[1]])return null;let n=(e[3]+e[1]+e[2]).replace(/[A-Z]/g,t=>t.charCodeAt(0)-55);var i;let r=n.toString(),s=r.slice(0,2);for(let t=2;t<r.length;t+=7)i=s+r.substring(t,t+7),s=parseInt(i,10)%97;return 1===s?t:null};const v={"0000":"Tesoro Público",2080:"Abanca",1544:"Andbank España","0182":"BBVA",9e3:"Banco de España","0186":"Banco Mediolanum","0081":"Banco Sabadell","0049":"Banco Santander","0128":"Bankinter","0065":"Barclays Bank","0058":"BNP Paribas España",2100:"Caixabank","0122":"Citibank España","0154":"Credit Agricole","0019":"Deutsche Bank","0239":"Evo Banco","0162":"HSBC Bank",2085:"Ibercaja Banco",1465:"ING",1e3:"Instituto de crédito oficial",2095:"Kutxabank","0073":"Openbank",2103:"Unicaja Banco",3058:"Cajamar",3085:"Caja Rural",3146:"Novanca","0238":"Banco Pastor","0487":"Banco Mare Nostrum",2090:"Caja de Ahorros Mediterraneo","0030":"Banco Español de Crédito","0146":"Citibank"};this.getEntidades=()=>v,this.getEntidad=function(t){return(t=f(t))?v[t.substr(4,4)]:null},this.creditCardNumber=function(n){if(16!=h(n=f(n)))return null;let i=0,r=!1;for(let e=15;0<=e;e--){let t=+n[e];r&&(t*=2,t-=9<t?9:0),i+=t,r=!r}return i%10==0?n:null},this.generatePassword=function(t,e){return e=e||"abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_#@&°!§%;:=^/()?*+~.,-$",Array.apply(null,Array(t||10)).map(function(){return e.charAt(Math.random()*e.length)}).join("")},this.testPassword=function(t){var e=0;return e+=/[A-Z]+/.test(t)?1:0,e+=/[a-z]+/.test(t)?1:0,e+=/[0-9]+/.test(t)?1:0,e+=/[\W]+/.test(t)?1:0,e+=2<e&&8<h(t)}}