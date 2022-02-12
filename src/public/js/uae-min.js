function ArrayBox(){const s=this;function l(t){return t?t.length:0}function u(t,e){return t==e?0:t<e?-1:1}this.size=l,this.empty=t=>l(t)<1,this.find=(t,e)=>t?t.find(e):null,this.indexOf=(t,e)=>t?t.indexOf(e):-1,this.findIndex=(t,e)=>t?t.findIndex(e):-1,this.intersect=(t,e)=>e?t.filter(t=>-1<e.indexOf(t)):[],this.shuffle=t=>t.sort(()=>.5-Math.random()),this.unique=(e,t)=>t?e.concat(t.filter(t=>e.indexOf(t)<0)):e,this.distinct=(n,i)=>i?n.filter((e,t)=>n.findIndex(t=>e[i]===t[i])==t):n,this.swap=(t,e,n)=>{var i=t[e];return t[e]=t[n],t[n]=i,s},this.eq=(t,n)=>t&&n&&t.every((t,e)=>n[e]==t),this.push=(t,e)=>(t&&t.push(e),s),this.pushAt=(t,e,n)=>(t&&t.splice(n,0,e),s),this.pop=t=>(t&&t.pop(),s),this.popAt=(t,e)=>(t&&t.splice(e,1),s),this.remove=(t,e,n)=>(t&&t.splice(e,n),s),this.reset=t=>(t&&t.splice(0),s),this.get=(t,e)=>t?t[e]:null,this.last=t=>s.get(t,l(t)-1),this.clone=t=>t?t.slice():[],this.sort=(t,e)=>t&&t.sort(e||u),this.sortBy=function(t,n,i,e){return i=i||u,t&&n?t.sort("desc"==e?function(t,e){return i(e[n],t[n])}:function(t,e){return i(t[n],e[n])}):t},this.multisort=function(t,a,o,l){return l=l||[],o=o||[],t.sort(function t(e,n,i){var s=a[i=i||0];let r=l[i]||u;s="desc"==o[i]?r(n[field],e[field]):r(e[s],n[s]);return 0==s&&++i<a.length?t(e,n,i):s}),s},this.each=function(e,n){var i=l(e);for(let t=0;t<i;t++)n(e[t],t,e);return s},this.reverse=function(e,n){for(let t=l(e)-1;-1<t;t--)n(e[t],t,e);return s},this.extract=function(e,n){var i=l(e);for(let t=0;t<i;t++)n(e[t],t)&&e.splice(t--,1);return s},this.flush=function(t,e){e=s.findIndex(t,e);return-1<e&&t.splice(e,1),s},this.toObject=function(t,n){const i={};return t.forEach((t,e)=>{i[t]=n[e]}),i},this.format=function(t,e,r){(r=r||{}).separator=r.separator||"",r.empty=r.empty||"";let a=r.getValue||function(t,e){return t[e]};const o={size:l(t)};return t&&e&&t.map((i,s)=>(o.index=s,o.count=s+1,e.replace(/@(\w+);/g,function(t,e){let n=r[e];return(n?n(i[e],i,s):a(i,e)??o[e])??r.empty}))).join(r.separator)},this.parse=t=>t?JSON.parse(t):null,this.read=t=>s.parse(window.sessionStorage.getItem(t)),this.stringify=t=>function(t){return"string"==typeof t||t instanceof String}(t)?t:JSON.stringify(t),this.ss=function(t,e){return e&&window.sessionStorage.setItem(t,s.stringify(e)),s},this.ls=function(t,e){return e&&window.localStorage.setItem(t,s.stringify(e)),s}}function DateBox(){const l=this,e="",r=new Date,n=/^\d.+$/,i=/\D+/g,s=[31,28,31,30,31,30,31,31,30,31,30,31];function a(t){return t&&t[0]}function o(t){return t&&n.test(t)}function u(t){return t.split(i)}function h(t){return t<10?"0"+t:t}function c(t){var e=t[2];return t[2]=t[0],t[0]=e,t}function d(t,e,n){return Math.min(Math.max(t||0,e),n)}function g(t){return d(t,0,59)}function f(t){return t<100?+(e+parseInt(r.getFullYear()/100)+h(t)):t}function m(t){return 0==(3&t)&&(t%25!=0||0==(15&t))}function p(t,e){return s[e]+(1==e&&m(t))}function v(t){return t&&t.getTime&&!isNaN(t.getTime())}function b(t){return t[0]=f(+t[0]||0),t[1]=d(t[1],1,12),t[2]=d(t[2],1,p(t[0],t[1]-1)),t}function T(t,e,n,i,s){return t.setHours(d(e,0,23),g(n),g(i),s||0),isNaN(t.getTime())?null:t}function I(t){let e=new Date;return t=b(t),e.setFullYear(t[0],t[1]-1,t[2]),T(e,t[3],t[4],t[5],t[6])}function D(t){return a(t)?I(t):null}function y(t){return h(t.getHours())+":"+h(t.getMinutes())}function M(t){return y(t)+":"+h(t.getSeconds())}function x(t){return t.getFullYear()+"-"+h(t.getMonth()+1)+"-"+h(t.getDate())}function A(t){return h(t.getDate())+"/"+h(t.getMonth()+1)+"/"+t.getFullYear()}this.build=I,this.isValid=v,this.sysdate=()=>r,this.toDate=t=>t?new Date(t):null,this.isLeap=t=>t&&m(t.getFullYear()),this.getDays=(t,e)=>Math.round(Math.abs((t-e)/864e5)),this.daysInMonth=t=>t?p(t.getFullYear(),t.getMonth()):0,this.toArray=t=>t?[t.getFullYear(),t.getMonth()+1,t.getDate(),t.getHours(),t.getMinutes(),t.getSeconds(),t.getMilliseconds()]:[],this.addDate=function(t,e){return t&&t.setDate(t.getDate()+e),l},this.addHours=function(t,e){return t&&t.setHours(t.getHours()+e),l},this.addMs=function(t,e){return t&&t.setMilliseconds(t.getMilliseconds()+e),l},this.reset=function(t){return t&&t.setFullYear(r.getFullYear(),r.getMonth(),r.getDate()),l},this.toISODateString=t=>(t||r).toISOString().substring(0,10),this.trunc=function(t){return t&&t.setHours(0,0,0,0),l},this.clone=function(t){return new Date((t||r).getTime())},this.randTime=(t,e)=>Math.floor(Math.random()*(e.getTime()-t.getTime())+t.getTime()),this.randDate=(t,e)=>new Date(l.randTime(t,e)),this.getWeek=function(t){t=t||r;var e=new Date(t.getFullYear(),0,1);return Math.ceil((t.getDay()+1+l.getDays(t,e))/7)},this.week=function(t,e){e=e||1;const n=new Date(t,0,1);t=(n.getDay()+6)%7;return n.setDate(n.getDate()+7*e-t),n},this.toWeek=function(t){return t?l.week(+t.substr(0,4),+t.substr(6)):null},this.isoWeek=function(t){return t?t.getFullYear()+"-W"+h(l.getWeek(t)):null},this.toObject=function(t,e){var n=(t=t||r).getDay();let i=t.getFullYear().toString();const s={yyyy:+i,y:+i.substr(0,2),yy:+i.substr(2,2),m:t.getMonth(),d:t.getDate()};return s.mmm=e.monthNamesShort[s.m],s.mmmm=e.monthNames[s.m],s.mm=h(++s.m),s.ddd=e.dayNamesShort[n],s.dddd=e.dayNames[n],s.dd=h(s.d),s.h=t.getHours(),s.hh=h(s.h),s.M=t.getMinutes(),s.MM=h(s.M),s.s=t.getSeconds(),s.ss=h(s.s),s.ms=t.getMilliseconds(),s.t=s.h<12?"a":"p",s.tt=s.t+"m",s},this.diff=function(t,e){if((e=e||r)<t)return l.diff(e,t);const i=l.toArray(e);const s=[0,12,l.daysInMonth(e)-e.getDate()+t.getDate(),24,60,60,1e3];return l.toArray(t).forEach(function t(e,n){i[n]-=e,i[n]<0&&(i[n]+=s[n],t(1,n-1))}),i},this.interval=function(t,e,n,i,s){let r=l.clone(t);s=s||1e3;const a=new Date(r.getTime()+e),o=setInterval(function(){l.addMs(r,s),(!n(r,a)||a<=r)&&(clearInterval(o),i&&i())},s);return l},this.lt=(t,e)=>v(t)&&v(e)&&t.getTime()<e.getTime(),this.le=(t,e)=>v(t)&&v(e)&&t.getTime()<=e.getTime(),this.eq=(t,e)=>v(t)&&v(e)&&t.getTime()==e.getTime(),this.ge=(t,e)=>v(t)&&v(e)&&t.getTime()>=e.getTime(),this.gt=(t,e)=>v(t)&&v(e)&&t.getTime()>e.getTime(),this.cmp=function(t,e){return v(t)&&v(e)?t.getTime()-e.getTime():v(t)?-1:1},this.inYear=(t,e)=>v(t)&&v(e)&&t.getFullYear()==e.getFullYear(),this.inMonth=(t,e)=>l.inYear(t,e)&&t.getMonth()==e.getMonth(),this.inDay=(t,e)=>l.inMonth(t,e)&&t.getDate()==e.getDate(),this.inHour=(t,e)=>l.inDay(t,e)&&t.getHours()==e.getHours(),this.past=t=>l.lt(t,r),this.future=t=>l.gt(t,r),this.geToday=t=>l.inDay(t,r)||l.ge(t,r),this.between=function(t,e,n){return!!v(t)&&(e=(v(e)?e:t).getTime(),n=(v(n)?n:t).getTime(),e<=t.getTime()&&t.getTime()<=n)},this.minTime=t=>t?y(t):null,this.isoTime=t=>t?M(t):null,this.acTime=t=>t&&t.replace(/(\d\d)(\d+)$/g,"$1:$2").replace(/[^\d\:]/g,e),this.toTime=function(t){t=t&&u(t);return a(t)?T(new Date,t[0],t[1],t[2],t[3]):null},this.fmtTime=function(t){let e=t&&u(t);return a(e)?(e[0]=d(e[0],0,23),e[1]=g(e[1]),e[2]&&(e[2]=g(e[2])),e.map(h).join(":")):null},this.enDate=t=>t?D(u(t)):null,this.isoEnDate=t=>v(t)?x(t):null,this.isoEnDateTime=t=>v(t)?x(t)+" "+M(t):null,this.fmtEnDate=t=>o(t)?b(u(t)).map(h).join("-"):null,this.acEnDate=t=>t&&t.replace(/^(\d{4})(\d+)$/g,"$1-$2").replace(/^(\d{4}\-\d\d)(\d+)$/g,"$1-$2").replace(/[^\d\-]/g,e),this.esDate=t=>t?D(c(u(t))):null,this.isoEsDate=t=>v(t)?A(t):null,this.isoEsDateTime=t=>v(t)?A(t)+" "+M(t):null,this.fmtEsDate=t=>o(t)?c(b(c(u(t)))).map(h).join("/"):null,this.acEsDate=t=>t&&t.replace(/^(\d\d)(\d+)$/g,"$1/$2").replace(/^(\d\d\/\d\d)(\d+)$/g,"$1/$2").replace(/[^\d\/]/g,e),Date.prototype.toJSON=function(){return x(this)+"T"+M(this)}}function DomBox(){const c=this,s="",i="hide",n=document.createElement("div"),u=document.createElement("textarea");function t(t){console.log("Log:",t)}function r(t){return t?t.split(/\s+/):[]}function a(t){return"string"==typeof t?document.querySelectorAll(t):t}this.get=(t,e)=>(e||document).querySelector(t),this.getAll=(t,e)=>(e||document).querySelectorAll(t),this.closest=(t,e)=>e&&e.closest(t),this.matches=(t,e)=>e&&e.matches(t),this.sibling=(t,e)=>e&&c.get(t,e.parentNode),this.siblings=(t,e)=>e&&c.getAll(t,e.parentNode),this.getNavLang=()=>navigator.language||navigator.userLanguage,this.getLang=()=>document.documentElement.getAttribute("lang")||c.getNavLang(),this.redir=(t,e)=>(t&&window.open(t,e||"_blank"),c),this.unescape=t=>(u.innerHTML=t,u.value),this.escape=t=>(n.innerHTML=t,n.innerHTML),this.scroll=function(t,e){return e=e||window,(t=t||e.document.body).scrollIntoView({behavior:"smooth"}),c},this.fetch=function(i){return(i=i||{}).headers=i.headers||{},i.reject=i.reject||t,i.resolve=i.resolve||t,i.headers["x-requested-with"]="XMLHttpRequest",i.headers.Authorization="Bearer "+window.localStorage.getItem("jwt"),window.fetch(i.action,i).then(t=>{let e=t.headers.get("content-type")||s,n=-1<e.indexOf("application/json")?t.json():t.text();return n.then(t.ok?i.resolve:i.reject)})},this.copyToClipboard=function(t){return u.value=t,u.select(),document.execCommand("copy"),c},this.each=function(t,e){return t&&(1===t.nodeType?e(t,0):ab.each(a(t),e)),c},this.reverse=function(t,e){return ab.reverse(t,e),c},this.findIndex=(e,t)=>[...t].findIndex(t=>t.matches(e)),this.find=(e,t)=>[...t].find(t=>t.matches(e)),this.filter=(e,t)=>[...t].filter(t=>t.matches(e)),this.map=(t,e)=>[...a(t)].map(e);const h="input,textarea,select";function e(t){return t.offsetWidth||t.offsetHeight||t.getClientRects().length}function d(t,e){return"SELECT"===t.tagName?(e=e||t.getAttribute("value"),t.selectedIndex=e?c.findIndex("[value='"+e+"']",t.options):0):t.value=e??s,c}this.inputs=t=>c.getAll(h,t),this.focus=t=>(t&&t.focus(),c),this.setFocus=t=>c.refocus(c.inputs(t)),this.refocus=function(t){return c.reverse(t,t=>{e(t)&&t.matches(":not([type=hidden],[readonly],[disabled],[tabindex='-1'])")&&t.focus()})},this.getValue=t=>t&&t.value,this.setValue=(t,e)=>t?d(t,e):c,this.val=(t,e)=>c.each(t,t=>d(t,e)),this.getAttr=(t,e)=>t&&t.getAttribute(e),this.setAttr=(t,e,n)=>(t&&t.setAttribute(e,n),c),this.delAttr=(t,e,n)=>(t&&t.removeAttribute(e,n),c),this.attr=(t,e,n)=>c.each(t,t=>t.setAttribute(e,n)),this.removeAttr=(t,e)=>c.each(t,t=>t.removeAttribute(e)),this.getText=t=>t&&t.innerText,this.findText=(t,e)=>c.getText(c.get(t,e)),this.text=function(t,e){return e=e||s,c.each(t,t=>{t.innerText=e})},this.setText=(t,e,n)=>c.text(c.getAll(t,n),e),this.getHtml=t=>t&&t.innerHTML,this.findHtml=(t,e)=>c.getHtml(c.get(t,e)),this.html=function(t,e){return e=e||s,c.each(t,t=>{t.innerHTML=e})},this.setHtml=(t,e,n)=>c.html(c.getAll(t,n),e),this.mask=(t,n,i)=>c.each(t,(t,e)=>t.classList.toggle(i,n>>e&1)),this.optText=t=>t?c.getText(t.options[t.selectedIndex]):null,this.select=function(t,n){return c.each(t,t=>{var e=c.mask(t.options,~n,i).get("[value='"+t.value+"']",t);c.hasClass(e,i)&&(t.selectedIndex=c.findIndex(":not(.hide)",t.options))})},this.empty=t=>!t||!t.innerHTML||t.innerHTML.trim()===s,this.add=(e,t)=>c.each(t,t=>e.appendChild(t)),this.append=function(e,t){return t=t||document.body,c.each(t,t=>{n.innerHTML=e,c.add(t,n.childNodes)})};const o={};this.setTpl=(t,e)=>(o[t]=e,c),this.loadTemplates=()=>c.each("template[id]",t=>c.setTpl(t.id,t.innerHTML)),this.render=function(t,e){t.id=t.id||"_"+Math.random().toString(36).substr(2,9);var n=t.dataset.tpl||t.id;return o[n]=o[n]||t.innerHTML,t.innerHTML=e(o[n]),t.classList.toggle(i,!t.innerHTML),c},this.format=(t,e)=>c.each(t,c.render),this.replace=(t,e)=>c.each(t,t=>{t.outerHTML=e}),this.parse=(t,e)=>c.each(t,t=>{t.outerHTML=e(t.outerHTML)}),this.isVisible=t=>t&&e(t),this.visible=(t,e)=>c.isVisible(c.get(t,e)),this.show=t=>c.each(t,t=>t.classList.remove(i)),this.hide=t=>c.each(t,t=>t.classList.add(i)),this.hasClass=(e,t)=>e&&r(t).some(t=>e.classList.contains(t)),this.addClass=function(t,e){const n=r(e);return c.each(t,e=>{n.forEach(t=>e.classList.add(t))})},this.removeClass=function(t,e){const n=r(e);return c.each(t,e=>{n.forEach(t=>e.classList.remove(t))})},this.toggle=function(t,e,n){const i=r(e);return c.each(t,e=>i.forEach(t=>e.classList.toggle(t,n)))},this.toggleHide=function(t,e){return c.toggle(t,i,e)},this.css=function(t,e,n){const i=e.replace(/(-[a-z])/,t=>t.replace("-",s).toUpperCase());return c.each(t,t=>{t.style[i]=n})};const g="change";function f(e,t,n,i){return e.addEventListener(t,t=>i(e,t,n)||t.preventDefault()),c}function m(t,e,n){return t?f(t,e,0,n):c}this.event=(t,n,i)=>c.each(t,(t,e)=>f(t,n,e,i)),this.trigger=(t,e)=>(t&&t.dispatchEvent(new Event(e)),c),this.ready=t=>f(document,"DOMContentLoaded",0,t),this.click=(t,n)=>c.each(t,(t,e)=>f(t,"click",e,n)),this.onClickElem=(t,e)=>m(c.get(t),"click",e),this.onclick=this.onClick=c.click,this.change=(t,n)=>c.each(t,(t,e)=>f(t,g,e,n)),this.onchange=this.onChange=c.change,this.keyup=(t,n)=>c.each(t,(t,e)=>f(t,"keyup",e,n)),this.onkeyup=this.onKeyup=c.keyup,this.keydown=(t,n)=>c.each(t,(t,e)=>f(t,"keydown",e,n)),this.onkeydown=this.onKeydown=c.keydown,this.submit=(t,n)=>c.each(t,(t,e)=>f(t,"submit",e,n)),this.onsubmit=this.onSubmit=c.submit,this.ready(function(){var t=c.getAll("table,form,"+h);const e=c.filter("table",t),n=c.filter("form",t),i=c.filter(h,t);function l(t){var e=c.get("tr.tb-data",t);return c.toggle(t.tBodies[0],"hide",!e).toggle(t.tBodies[1],"hide",e)}function s(t,e,n){c.removeClass(t,"sort-asc sort-desc").addClass(t,"sort-none").toggle(e,"sort-none sort-"+n)}function r(l){const u=nb.intval(l.dataset.pageSize),h=c.get(".pagination",l.parentNode);if(h&&0<u){l.dataset.page=nb.intval(l.dataset.page);let o=Math.ceil(l.dataset.total/u);!function n(e){let i="";function t(t,e){t=nb.range(t,0,o-1),i+='<a href="#" data-page="'+t+'">'+e+"</a>"}function s(t){t=nb.range(t,0,o-1),i+='<a href="#" data-page="'+t+'"',i+=t==e?' class="active">':">",i+=t+1+"</a>"}let r=0;t(e-1,"&laquo;"),1<o&&s(0),r=Math.max(e-3,1),2<r&&t(r-1,"...");for(var a=Math.min(e+3,o-1);r<=a;)s(r++);r<o-1&&t(r,"..."),r<o&&s(o-1),t(e+1,"&raquo;"),h.innerHTML=i,c.click(c.getAll("a",h),t=>{var e=+t.dataset.page,t={index:e*u,length:u};n(e),l.dataset.page=e,l.dispatchEvent(new CustomEvent("pagination",{detail:t}))})}(l.dataset.page)}return c}function a(s,r,a,o){return(o=o||{}).getValue=o.getValue||i18n.val,a.size=r.length,a.total=a.total??(+s.dataset.total||r.length),c.render(s.tFoot,t=>sb.format(a,t,o)).render(s.tBodies[0],t=>ab.format(r,t,o)),c.click(c.getAll("a[href='#find']",s),(t,e,n)=>{s.dispatchEvent(new CustomEvent("find",{detail:r[n]}))}),c.click(c.getAll("a[href='#select']",s),(t,e,n)=>{s.dispatchEvent(new CustomEvent("select",{detail:n}))}),c.click(c.getAll("a[href='#remove']",s),(t,e,n)=>{var i=o.remove||"remove";i18n.confirm(i)&&(a.total--,n=r.splice(n,1)[0],s.dispatchEvent(new CustomEvent("remove",{detail:n})))}),s.dispatchEvent(new Event("render")),l(s)}function o(t,e,n,i){return c.renderRows(t,e,n,i),r(t)}c.getTable=t=>c.find(t,e),c.getTables=t=>c.filter(t,e),c.getForm=t=>c.find(t,n),c.getForms=t=>c.filter(t,n),c.getInput=t=>c.find(t,i),c.getInputs=t=>t?c.filter(t,i):i,c.moveFocus=t=>c.focus(c.getInput(t)),c.getVal=t=>c.getValue(c.getInput(t)),c.values=t=>c.getInputs(t).map(t=>t.value),c.setVal=(t,e)=>c.val(c.getInputs(t),e),c.setInputValue=(t,e)=>c.setValue(c.getInput(t),e),c.getOptText=t=>c.optText(c.getInput(t)),c.copyVal=(t,e)=>c.setInputValue(t,c.getVal(e)),c.setAttrInput=(t,e,n)=>c.setAttr(c.getInput(t),e,n),c.setAttrInputs=(t,e,n)=>c.attr(c.getInputs(t),e,n),c.delAttrInput=(t,e)=>c.delAttr(c.getInput(t),e),c.delAttrInputs=(t,e)=>c.removeAttr(c.getInputs(t),e),c.setInput=(t,e,n)=>{t=c.getInput(t);return t&&(f(t,g,0,n),d(t,e)),c},c.onChangeForm=(t,e)=>m(c.getForm(t),g,e),c.onSubmitForm=(t,e)=>m(c.getForm(t),"submit",e),c.onChangeForms=(t,e)=>c.change(c.getForms(t),e),c.onSubmitForms=(t,e)=>c.submit(e,c.getForms(t)),c.onChangeInput=(t,e)=>m(c.getInput(t),g,e),c.onChangeInputs=(t,e)=>c.change(c.getInputs(t),e),c.refocus(i),c.tr=function(t,n){t=c.getAll(t);return i18n.set("size",t.length),c.each(t,(t,e)=>{i18n.set("index",e).set("count",e+1),c.render(t,t=>i18n.format(t,n))})},c.onFindRow=(t,e)=>c.event(c.getTables(t),"find",e),c.onSelectRow=(t,e)=>c.event(c.getTables(t),"select",e),c.onRemoveRow=(t,e)=>c.event(c.getTables(t),"remove",e),c.onChangeTable=(t,e)=>m(c.getTable(t),g,e),c.onChangeTables=(t,e)=>c.change(c.getTables(t),e),c.onRenderTable=(t,e)=>m(c.getTable(t),"render",e),c.onRenderTables=(t,e)=>c.event(c.getTables(t),"render",e),c.onPaginationTable=(t,e)=>c.event(c.getTables(t),"pagination",e),c.renderRows=function(t,e,n,i){return t?a(t,e,n,i):c},c.list=function(t,e,n,i){return c.each(c.getTables(t),t=>a(t,e,n,i))},c.renderTable=function(t,e,n,i){return t?o(t,e,n,i):c},c.renderTables=function(t,e,n,i){return c.each(c.getTables(t),t=>o(t,e,n,i))},c.each(e,t=>{const n=c.getAll(".sort",t.tHead);t.dataset.sortDir&&s(n,c.find(".sort-"+t.dataset.sortBy,n),t.dataset.sortDir),c.click(n,t=>{var e=c.hasClass(t,"sort-asc")?"desc":"asc";s(n,t,e)}),l(t),r(t)}),u.style.position="absolute",u.style.left="-9999px",document.body.prepend(u)})}function I18nBox(){const s=this,r=new Map,n=new Map,e="msgError",a={},o={en:{lang:"en",errForm:"Form validation failed",errRequired:"Required field!",errMinlength8:"The minimum required length is 8 characters",errMaxlength:"Max length exceded",errNif:"Wrong ID format",errCorreo:"Wrong Mail format",errDate:"Wrong date format",errDateLe:"Date must be less or equals than current",errDateGe:"Date must be greater or equals than current",errNumber:"Wrong number format",errGt0:"Price must be great than 0.00 &euro;",errRegex:"Wrong format",errReclave:"Passwords typed do not match",errRange:"Value out of allowed range",errRefCircular:"Circular reference",remove:"Are you sure to delete this element?",removeOk:"Element removed successfully!",cancel:"Are you sure to cancel element?",cancelOk:"Element canceled successfully!",unlink:"Are you sure to unlink those elements?",unlinkOk:"Elements unlinked successfully!",linkOk:"Elements linked successfully!",closeText:"close",prevText:"prev",nextText:"next",currentText:"current",monthNames:["January","February","March","April","May","June","July","August","September","October","November","December"],monthNamesShort:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],dayNames:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],dayNamesShort:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],dayNamesMin:["Su","Mo","Tu","We","Th","Fr","Sa"],dateFormat:"yy-mm-dd",firstDay:0,toDate:dt.enDate,isoDate:dt.isoEnDate,isoDateTime:dt.isoEnDateTime,fmtDate:dt.fmtEnDate,acDate:dt.acEnDate,toTime:dt.toTime,minTime:dt.minTime,isoTime:dt.isoTime,fmtTime:dt.fmtTime,acTime:dt.acTime,toInt:nb.toInt,isoInt:nb.enIsoInt,fmtInt:nb.enFmtInt,toFloat:nb.enFloat,isoFloat:nb.enIsoFloat,fmtFloat:nb.enFmtFloat,fmtBool:nb.enBool,val:sb.enVal},es:{lang:"es",errForm:"Error al validar los campos del formulario",errRequired:"¡Campo obligatorio!",errMinlength8:"La longitud mínima requerida es de 8 caracteres",errMaxlength:"Longitud máxima excedida",errNif:"Formato de NIF / CIF incorrecto",errCorreo:"Formato de E-Mail incorrecto",errDate:"Formato de fecha incorrecto",errDateLe:"La fecha debe ser menor o igual a la actual",errDateGe:"La fecha debe ser mayor o igual a la actual",errNumber:"Valor no numérico",errGt0:"El importe debe ser mayor de 0,00 &euro;",errRegex:"Formato incorrecto",errReclave:"Las claves introducidas no coinciden",errRange:"Valor fuera del rango permitido",errRefCircular:"Referencia circular",remove:"¿Confirma que desea eliminar este registro?",removeOk:"Registro eliminado correctamente.",cancel:"¿Confirma que desea cancelar este registro?",cancelOk:"Elemento cancelado correctamente.",unlink:"¿Confirma que desea desasociar estos registros?",unlinkOk:"Registros desasociados correctamente",linkOk:"Registros asociados correctamente.",closeText:"cerrar",prevText:"prev.",nextText:"sig.",currentText:"hoy",monthNames:["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"],monthNamesShort:["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"],dayNames:["Domingo","Lunes","Martes","Miércoles","Jueves","Viernes","Sábado"],dayNamesShort:["Dom","Lun","Mar","Mié","Juv","Vie","Sáb"],dayNamesMin:["Do","Lu","Ma","Mi","Ju","Vi","Sa"],dateFormat:"dd/mm/yy",firstDay:1,toDate:dt.esDate,isoDate:dt.isoEsDate,isoDateTime:dt.isoEsDateTime,fmtDate:dt.fmtEsDate,acDate:dt.acEsDate,toTime:dt.toTime,minTime:dt.minTime,isoTime:dt.isoTime,fmtTime:dt.fmtTime,acTime:dt.acTime,toInt:nb.toInt,isoInt:nb.esIsoInt,fmtInt:nb.esFmtInt,toFloat:nb.esFloat,isoFloat:nb.esIsoFloat,fmtFloat:nb.esFmtFloat,fmtBool:nb.esBool,val:sb.val}};let l=o.es;this.getLangs=function(t){return a[t]||o},this.getLang=function(t,e){return s.getLangs(e)[t]||l},this.getI18n=function(t,e){e=s.getLangs(e);return t&&(e[t]||e[t.substr(0,2)])||l},this.setI18n=function(t,e){return l=s.getI18n(t,e),s},this.get=t=>l[t],this.tr=t=>l[t]||t,this.set=(t,e)=>(l[t]=e,s),this.format=(t,e)=>sb.format(l,t,e),this.addLang=function(e,n,i){if(i){let t=a[i]=a[i]||{};t[e]=Object.assign(t[e]||{},o[e],n)}else o[e]=Object.assign(o[e]||{},n);return s},this.addLangs=function(t,e){for(const n in t)s.addLang(n,t[n],e);return s},this.toInt=t=>l.toInt(t),this.isoInt=t=>l.isoInt(t),this.fmtInt=t=>l.fmtInt(t),this.toFloat=t=>l.toFloat(t),this.isoFloat1=t=>l.isoFloat(t,1),this.isoFloat=t=>l.isoFloat(t),this.isoFloat3=t=>l.isoFloat(t,3),this.fmtFloat1=t=>l.fmtFloat(t,1),this.fmtFloat=t=>l.fmtFloat(t),this.fmtFloat3=t=>l.fmtFloat(t,3),this.toDate=t=>l.toDate(t),this.isoDate=t=>l.isoDate(t),this.fmtDate=t=>l.fmtDate(t),this.acDate=t=>l.acDate(t),this.toTime=t=>l.toTime(t),this.minTime=t=>l.minTime(t),this.isoTime=t=>l.isoTime(t),this.fmtTime=t=>l.fmtTime(t),this.acTime=t=>l.acTime(t),this.fmtBool=t=>l.fmtBool(t),this.confirm=t=>confirm(s.tr(t)),this.val=(t,e)=>l.val(t,e),this.arrval=function(t,e){t=l[t];return t&&t[e]||"-"},this.getMsgs=()=>n,this.getMsg=t=>n.get(t),this.setMsg=(t,e)=>(n.set(t,e),s),this.setOk=t=>s.setMsg("msgOk",s.tr(t)),this.setInfo=t=>s.setMsg("msgInfo",s.tr(t)),this.setWarn=t=>s.setMsg("msgWarn",s.tr(t)),this.getError=t=>n.get(t||e),this.setMsgError=t=>s.setMsg(e,s.tr(t)),this.setError=(t,e,n)=>s.setMsgError(e).setMsg(t,s.tr(n)),this.getNumMsgs=()=>n.size,this.getData=t=>t?r.get(t):r,this.toData=()=>Object.fromEntries(r),this.toMsgs=()=>Object.fromEntries(n),this.reset=()=>(r.clear(),n.clear(),s),this.start=(t,e)=>s.reset().setI18n(t,e),this.valid=function(t,e,n,i){return sb.isset(e)?(r.set(t,e),!0):(s.setError(t,n,i),!1)},this.isOk=()=>!n.has(e),this.isError=t=>n.has(t||e),this.required=(t,e,n,i)=>s.valid(t,valid.required(e),n,i),this.size10=(t,e,n,i)=>s.valid(t,valid.size10(e),n,i),this.size50=(t,e,n,i)=>s.valid(t,valid.size50(e),n,i),this.size200=(t,e,n,i)=>s.valid(t,valid.size200(e),n,i),this.size300=(t,e,n,i)=>s.valid(t,valid.size300(e),n,i),this.text10=(t,e,n,i)=>s.valid(t,valid.text10(e),n,i),this.text50=(t,e,n,i)=>s.valid(t,valid.text50(e),n,i),this.text200=(t,e,n,i)=>s.valid(t,valid.text200(e),n,i),this.text300=(t,e,n,i)=>s.valid(t,valid.text300(e),n,i),this.text=(t,e,n,i)=>s.valid(t,valid.text(e),n,i),this.fk=(t,e,n,i)=>s.valid(t,valid.fk(e),n,i),this.intval=(t,e,n,i)=>s.valid(t,valid.intval(e),n,i),this.intval3=(t,e,n,i)=>s.valid(t,valid.intval3(e),n,i),this.iGt0=(t,e,n,i)=>s.valid(t,valid.gt0(l.toInt(e)),n,i),this.gt0=(t,e,n,i)=>s.valid(t,valid.gt0(l.toFloat(e)),n,i),this.regex=(t,e,n,i)=>s.valid(t,valid.regex(e),n,i),this.login=(t,e,n,i)=>s.valid(t,valid.login(e),n,i),this.digits=(t,e,n,i)=>s.valid(t,valid.digits(e),n,i),this.idlist=(t,e,n,i)=>s.valid(t,valid.idlist(e),n,i),this.email=(t,e,n,i)=>s.valid(t,valid.email(e),n,i),this.isDate=(t,e,n,i)=>s.valid(t,valid.isDate(e),n,i),this.past=(t,e,n,i)=>s.valid(t,valid.past(e),n,i),this.future=(t,e,n,i)=>s.valid(t,valid.future(e),n,i),this.geToday=(t,e,n,i)=>s.valid(t,valid.geToday(e),n,i),this.dni=(t,e,n,i)=>s.valid(t,valid.dni(e),n,i),this.cif=(t,e,n,i)=>s.valid(t,valid.cif(e),n,i),this.nie=(t,e,n,i)=>s.valid(t,valid.nie(e),n,i),this.idES=(t,e,n,i)=>s.valid(t,valid.idES(e),n,i),this.user=(t,e,n,i)=>s.valid(t,valid.email(e)||valid.idES(e),n,i),this.iban=(t,e,n,i)=>s.valid(t,valid.iban(e),n,i),this.swift=(t,e,n,i)=>s.valid(t,valid.swift(e),n,i),this.creditCardNumber=(t,e,n,i)=>s.valid(t,valid.creditCardNumber(e),n,i)}function NumberBox(){const s=this,r="",a=".";function o(t){return null!=t}function l(t){return t.replace(/\D+/g,r)}function u(t){return l(t).replace(/^0+(\d+)/,"$1")}function h(t){return"-"==t.charAt(0)?"-":r}function c(t,e){for(var n=[],i=t.length;e<i;i-=e)n.unshift(t.substr(i-e,e));return 0<i&&n.unshift(t.substr(0,i)),n}function n(t,e){var n=h(t),t=u(t);return t?n+c(t,3).join(e):null}function d(e,n,i,s,r){s=isNaN(s)?2:s;var a=h(e),r=e.lastIndexOf(r);let o=0<r?e.substr(0,r):e;if(o=0==r?"0":u(o),o){let t=r<0?"0":e.substr(r+1,s);return a+c(o,3).join(n)+i+(r<0?"0".repeat(s):t.padEnd(s,"0"))}return null}this.lt0=t=>o(t)&&t<0,this.le0=t=>o(t)&&t<=0,this.gt0=t=>o(t)&&0<t,this.range=(t,e,n)=>Math.min(Math.max(t,e),n),this.maxval=(t,e)=>s.range(t,0,e),this.between=(t,e,n)=>e<=t&&t<=n,this.cmp=function(t,e){return isNaN(t)||isNaN(e)?isNaN(e)?-1:1:t-e},this.round=function(t,e){return e=o(e)?e:2,+(Math.round(t+"e"+e)+"e-"+e)},this.eq2=(t,e)=>o(t)&&s.round(t)==s.round(e),this.eq3=(t,e)=>o(t)&&s.round(t,3)==s.round(e,3),this.rand=(t,e)=>Math.random()*(e-t)+t,this.randInt=(t,e)=>Math.floor(s.rand(t,e)),this.toInt=function(t){if(t){t=parseInt(h(t)+l(t));return isNaN(t)?null:t}return null},this.isoInt=(t,e)=>o(t)?n(r+t,e):null,this.enIsoInt=t=>s.isoInt(t,","),this.esIsoInt=t=>s.isoInt(t,a),this.fmtInt=function(t,e){return t&&n(t,e)},this.enFmtInt=t=>s.fmtInt(t,","),this.esFmtInt=t=>s.fmtInt(t,a),this.intval=t=>parseInt(t)||0,this.toFloat=function(t,e){if(t){var n=h(t),i=t.lastIndexOf(e),e=i<0?t:t.substr(0,i),i=i<0?r:a+t.substr(i+1),i=parseFloat(n+l(e)+i);return isNaN(i)?null:i}return null},this.enFloat=t=>s.toFloat(t,a),this.esFloat=t=>s.toFloat(t,","),this.isoFloat=(t,e,n,i)=>o(t)?d(r+s.round(t,i),e,n,i,a):null,this.enIsoFloat=(t,e)=>s.isoFloat(t,",",a,e),this.esIsoFloat=(t,e)=>s.isoFloat(t,a,",",e),this.fmtFloat=function(t,e,n,i){return t&&d(t,e,n,i,n)},this.enFmtFloat=(t,e)=>s.fmtFloat(t,",",a,e),this.esFmtFloat=(t,e)=>s.fmtFloat(t,a,",",e),this.floatval=t=>parseFloat(t)||0,this.boolval=t=>t&&"false"!==t&&"0"!==t,this.enBool=t=>s.boolval(t)?"Yes":"No",this.esBool=t=>s.boolval(t)?"Sí":"No"}function StringBox(){const a=this,e=/"|'|&|<|>|\\/g,n={'"':"&#34;","'":"&#39;","&":"&#38;","<":"&#60;",">":"&#62;","\\":"&#92;"};function i(t){return"string"==typeof t||t instanceof String}function o(t){return i(t)?t.trim():t}function l(t){return t?t.length:0}function s(t){for(var e="",n=l(o(t)),i=0;i<n;i++){var s=t.charAt(i),r="àáâãäåāăąÀÁÂÃÄÅĀĂĄÆßèéêëēĕėęěÈÉĒĔĖĘĚìíîïìĩīĭÌÍÎÏÌĨĪĬòóôõöōŏőøÒÓÔÕÖŌŎŐØùúûüũūŭůÙÚÛÜŨŪŬŮçÇñÑþÐŔŕÿÝ".indexOf(s);e+=r<0?s:"aaaaaaaaaAAAAAAAAAABeeeeeeeeeEEEEEEEiiiiiiiiIIIIIIIIoooooooooOOOOOOOOOuuuuuuuuUUUUUUUUcCnNdDRryY".charAt(r)}return e.toLowerCase()}this.isset=function(t){return null!=t},this.isstr=i,this.trim=o,this.size=l,this.eq=(t,e)=>s(t)==s(e),this.iiOf=(t,e)=>s(t).indexOf(s(e)),this.upper=t=>t&&t.toUpperCase(t),this.lower=t=>t&&t.toLowerCase(t),this.substr=(t,e,n)=>t&&t.substr(e,n),this.indexOf=(t,e)=>t?t.indexOf(e):-1,this.lastIndexOf=(t,e)=>t?t.lastIndexOf(e):-1,this.prevIndexOf=(t,e,n)=>t?t.substr(0,n).lastIndexOf(e):-1,this.starts=(t,e)=>t&&t.startsWith(e),this.ends=(t,e)=>t&&t.endsWith(e),this.prefix=(t,e)=>a.starts(t,e)?t:e+t,this.suffix=(t,e)=>a.ends(t,e)?t:t+e,this.trunc=(t,e)=>l(t)>e?t.substr(0,e).trim()+"...":t,this.itrunc=function(t,e){var n=l(t)>e?a.prevIndexOf(t," ",e):-1;return a.trunc(t,n<0?e:n)},this.escape=function(t){return t&&t.replace(e,t=>n[t])},this.unescape=function(t){return t&&t.replace(/&#(\d+);/g,(t,e)=>String.fromCharCode(e))},this.removeAt=(t,e,n)=>e<0?t:t.substr(0,e)+t.substr(e+n),this.insertAt=(t,e,n)=>t?t.substr(0,n)+e+t.substr(n):e,this.replaceAt=(t,e,n,i)=>n<0?t:t.substr(0,n)+e+t.substr(n+i),this.replaceLast=(t,e,n)=>t?a.replaceAt(t,n,t.lastIndexOf(e),e.length):n,this.wrapAt=(t,e,n,i,s)=>e<0?t:a.insertAt(a.insertAt(t,i,e),s,e+i.length+n),this.iwrap=(t,e,n,i)=>e&&a.wrapAt(t,a.iiOf(t,e),e.length,n||"<u><b>",i||"</b></u>"),this.rand=t=>Math.random().toString(36).substr(2,t||8),this.lopd=t=>t&&"***"+t.substr(3,4)+"**",this.toDate=t=>t?new Date(t):null,this.split=(t,e)=>t?t.trim().split(e||","):[],this.minify=t=>t&&t.trim().replace(/\s{2}/g,""),this.toWord=t=>t&&t.trim().replace(/\W+/g,""),this.lines=t=>a.split(t,/[\n\r]+/),this.words=t=>a.split(t,/\s+/),this.ilike=(t,e)=>-1<a.iiOf(t,e),this.olike=(e,t,n)=>t.some(t=>a.ilike(e[t],n)),this.alike=(e,n,t)=>a.words(t).some(t=>a.olike(e,n,t)),this.between=function(t,e,n){return n=n??t,(e=e??t)<=t&&t<=n},this.ltr=function(t,e){const n=[];for(var i=l(t);e<i;i-=e)n.unshift(t.substr(i-e,e));return 0<i&&n.unshift(t.substr(0,i)),n},this.rtl=function(t,e){const n=[];for(var i=l(t),s=0;s<i;s+=e)n.push(t.substr(s,e));return n},this.slices=function(e,n){const i=[];var s=0,r=l(e);for(let t=0;s<r&&t<n.length;t++){var a=n[t];i.push(e.substr(s,a)),s+=a}return s<r&&i.push(e.substr(s)),i},this.val=(t,e)=>t[e],this.enVal=(t,e)=>t[e+"_en"]||t[e],this.format=function(i,t,s){(s=s||{}).empty=s.empty||"";let r=s.getValue||a.val;return i&&t&&t.replace(/@(\w+);/g,(t,e)=>{let n=s[e];return(n?n(i[e],i):r(i,e))??s.empty})},this.entries=function(e,n,i){i=i||{};let s="";for(const a in e){let t=i[a];var r=t?t(e[a],e):e[a];s+=n.replace("@key;",a).replace("@value;",r)}return s}}function ValidatorBox(){const i=this,e=/"|'|&|<|>|\\/g,n={'"':"&#34;","'":"&#39;","&":"&#38;","<":"&#60;",">":"&#62;","\\":"&#92;"},s=/^\d+$/,r=/^\d+(,\d+)*$/,a=/\w+[^\s@]+@[^\s@]+\.[^\s@]+/,o=/^[\w#@&°!§%;:=\^\/\(\)\?\*\+\~\.\,\-\$]{8,}$/;const l=/^[A-Z]{6,6}[A-Z2-9][A-NP-Z0-9]([A-Z0-9]{3,3}){0,1}$/;const u=/^(\d{8})([A-Z])$/,h=/^([ABCDEFGHJKLMNPQRSUVW])(\d{7})([0-9A-J])$/,c=/^[XYZ]\d{7,8}[A-Z]$/;function d(t){return t?t.length:0}function g(t){return t&&t.trim()}function f(t){return t&&t.trim().replace(/\W+/g,"").toUpperCase()}function m(t,e){try{return e&&t.test(e)?e:null}catch(t){}return null}function p(t,e,n){return t=i.escape(t),nb.between(d(t),e,n)?t:null}function v(t){return"TRWAGMYFPDXBNJZSQVHLCKE".charAt(parseInt(t,10)%23)==t.charAt(8)?t:null}this.range=function(t,e,n){return null!=t&&nb.between(t,e,n)?t:null},this.gt0=t=>i.range(t,.001,1e9),this.intval=t=>i.range(nb.intval(t),1,9),this.intval3=t=>i.range(nb.intval(t),1,3),this.intval5=t=>i.range(nb.intval(t),1,5),this.fk=t=>i.range(nb.intval(t),1,1/0),this.size=function(t,e,n){return t=g(t),nb.between(d(t),e,n)?t:null},this.required=t=>i.size(t,1,1e3),this.size10=t=>i.size(t,0,10),this.size50=t=>i.size(t,0,50),this.size200=t=>i.size(t,0,200),this.size300=t=>i.size(t,0,300),this.unescape=t=>t?t.replace(/&#(\d+);/g,(t,e)=>String.fromCharCode(e)):null,this.escape=t=>t?t.trim().replace(e,t=>n[t]):null,this.text10=t=>p(t,0,10),this.text50=t=>p(t,0,50),this.text200=t=>p(t,0,200),this.text300=t=>p(t,0,300),this.text=t=>p(t,0,1e3),this.regex=(t,e)=>m(t,g(e)),this.login=t=>i.regex(o,t),this.digits=t=>i.regex(s,t),this.idlist=t=>i.regex(r,t),this.swift=t=>i.regex(l,t),this.email=function(t){return(t=i.regex(a,t))&&t.toLowerCase()},this.isDate=function(t){t=dt.toDate(t);return isDate(t)?t:null},this.past=function(t){t=dt.toDate(t);return dt.past(t)?t:null},this.future=function(t){t=dt.toDate(t);return dt.future(t)?t:null},this.geToday=function(t){t=dt.toDate(t);return dt.geToday(t)?t:null},this.dni=function(t){return(t=m(u,f(t)))&&v(t)},this.cif=function(t){if(!(t=m(h,f(t))))return null;for(var e=t.match(h),n=e[1],i=e[2],s=e[3],r=0,a=0;a<i.length;a++){var o=parseInt(i[a],10);r+=o=a%2==0?(o*=2)<10?o:parseInt(o/10)+o%10:o}var l=0!==(r%=10)?10-r:r,e="JABCDEFGHI".substr(l,1);return(n.match(/[ABEH]/)?s==l:!n.match(/[KPQS]/)&&s==l||s==e)?t:null},this.nie=function(t){if(!(t=m(c,f(t))))return null;var e=t.charAt(0);return v(("X"==e?0:"Y"==e?1:"Z"==e?2:e)+t.substr(1))},this.idES=function(t){return i.dni(t)||i.cif(t)||i.nie(t)},this.iban=function(t){var e=(t=f(t))&&t.match(/^([A-Z]{2})(\d{2})([A-Z\d]+)$/);if(!e||d(t)!=={AD:24,AE:23,AT:20,AZ:28,BA:20,BE:16,BG:22,BH:22,BR:29,CH:21,CR:22,CY:28,CZ:24,DE:22,DK:18,DO:28,EE:20,ES:24,FI:18,FO:18,FR:27,GB:22,GI:23,GL:18,GR:27,GT:28,HR:21,HU:28,IE:22,IL:23,IS:26,IT:27,JO:30,KW:30,KZ:20,LB:28,LI:21,LT:20,LU:20,LV:21,MC:27,MD:24,ME:22,MK:19,MR:27,MT:31,MU:30,NL:18,NO:15,PK:24,PL:28,PS:29,PT:25,QA:29,RO:24,RS:22,SA:24,SE:24,SI:19,SK:24,SM:27,TN:24,TR:26,AL:28,BY:28,EG:29,GE:22,IQ:23,LC:32,SC:31,ST:25,SV:28,TL:23,UA:29,VA:22,VG:24,XK:20}[e[1]])return null;let n=(e[3]+e[1]+e[2]).replace(/[A-Z]/g,t=>t.charCodeAt(0)-55),i=n.toString(),s=i.slice(0,2);for(let t=2;t<i.length;t+=7){var r=s+i.substring(t,t+7);s=parseInt(r,10)%97}return 1===s?t:null};const b={2080:"Abanca",1544:"Andbank España","0182":"BBVA",9e3:"Banco de España","0186":"Banco Mediolanum","0081":"Banco Sabadell","0049":"Banco Santander","0128":"Bankinter","0065":"Barclays Bank","0058":"BNP Paribas España",2100:"Caixabank","0122":"Citibank España","0154":"Credit Agricole","0019":"Deutsche Bank","0239":"Evo Banco","0162":"HSBC Bank",2085:"Ibercaja Banco",1465:"ING",1e3:"Instituto de crédito oficial",2095:"Kutxabank","0073":"Openbank",2103:"Unicaja Banco",3058:"Cajamar",3085:"Caja Rural",3146:"Novanca","0238":"Banco Pastor","0487":"Banco Mare Nostrum",2090:"Caja de Ahorros Mediterraneo","0030":"Banco Español de Crédito","0146":"Citibank"};this.getEntidades=()=>b,this.getIban1=t=>sb.substr(t,0,4),this.getIban2=t=>sb.substr(t,4,4),this.getEntidad=t=>b[i.getIban2(t)],this.getIban3=t=>sb.substr(t,8,4),this.getOficina=t=>sb.substr(t,8,4),this.getDC=t=>sb.substr(t,12,2),this.getIban4=t=>sb.substr(t,12,4),this.getIban5=t=>sb.substr(t,16,4),this.getIban6=t=>sb.substr(t,20,4),this.getIban7=t=>sb.substr(t,24,4),this.getIban8=t=>sb.substr(t,28,4),this.creditCardNumber=function(n){if(16!=d(n=f(n)))return null;let i=0,s=!1;for(let e=15;0<=e;e--){let t=+n[e];s&&(t*=2,t-=9<t?9:0),i+=t,s=!s}return i%10==0?n:null},this.generatePassword=function(t,e){return e=e||"abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_#@&°!§%;:=^/()?*+~.,-$",Array.apply(null,Array(t||10)).map(function(){return e.charAt(Math.random()*e.length)}).join("")},this.testPassword=function(t){var e=0;return e+=/[A-Z]+/.test(t)?1:0,e+=/[a-z]+/.test(t)?1:0,e+=/[0-9]+/.test(t)?1:0,e+=/[\W]+/.test(t)?1:0,e+=2<e&&8<d(t)}}