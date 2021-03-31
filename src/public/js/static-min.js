function MessageBox(t){const e=this,n={en:{errForm:"Form validation failed",errRequired:"Required field!",errCorreo:"Wrong Mail format",errNif:"Wrong id format",remove:"Are you sure to delete element?",cancel:"Are you sure to cancel element?"},es:{errForm:"Error al validar los campos del formulario",errRequired:"Campo obligatorio!",errCorreo:"Formato de E-Mail incorrecto",errNif:"Formato de NIF incorrecto",remove:"¿Confirma que desea eliminar este registro?",cancel:"¿Confirma que desea cancelar este registro?"}};let r=n.es;this.getLang=function(t){return t?n[t]:r},this.setLang=function(t,r){return n[t]=r,e},this.getI18n=function(t){return t&&(n[t]||n[t.substr(0,2)])||n.es},this.setI18n=function(t){return r=e.getI18n(t),e},this.get=function(t){return r[t]},this.set=function(t,n){return r[t]=n,e},this.format=function(t){return t.replace(/@(\w+);/g,(t,e)=>nvl(r[e],t))},e.setI18n(t)}function StringBox(){const t=this,e="àáâãäåāăąÀÁÂÃÄÅĀĂĄÆßèéêëēĕėęěÈÉĒĔĖĘĚìíîïìĩīĭÌÍÎÏÌĨĪĬòóôõöōŏőøÒÓÔÕÖŌŎŐØùúûüũūŭůÙÚÛÜŨŪŬŮçÇñÑþÐŔŕÿÝ",n="aaaaaaaaaAAAAAAAAAABeeeeeeeeeEEEEEEEiiiiiiiiIIIIIIIIoooooooooOOOOOOOOOuuuuuuuuUUUUUUUUcCnNdDRryY";function r(t){return"string"==typeof t||t instanceof String}function i(t){return r(t)?t.trim():t}function s(t){return t?t.length:0}function o(t){for(var r="",o=s(i(t)),u=0;u<o;u++){var a=t.charAt(u),c=e.indexOf(a);r+=c<0?a:n.charAt(c)}return r.toLowerCase()}this.isstr=r,this.trim=i,this.size=s,this.eq=function(t,e){return o(t)==o(e)},this.indexOf=function(t,e){return t?t.indexOf(e):-1},this.iIndexOf=function(t,e){return o(t).indexOf(o(e))},this.prevIndexOf=function(t,e,n){return t?t.substr(0,n).lastIndexOf(e):-1},this.prefix=function(t,e){return t.startsWith(e)?t:e+t},this.suffix=function(t,e){return t.endsWith(e)?t:t+e},this.trunc=function(t,e){return s(t)>e?t.substr(0,e).trim()+"...":t},this.itrunc=function(e,n){var r=s(e)>n?t.prevIndexOf(e," ",n):-1;return t.trunc(e,r<0?n:r)},this.removeAt=function(t,e,n){return e<0?t:t.substr(0,e)+t.substr(e+n)},this.insertAt=function(t,e,n){return t?t.substr(0,n)+e+t.substr(n):e},this.replaceAt=function(t,e,n,r){return n<0?t:t.substr(0,n)+e+t.substr(n+r)},this.replaceLast=function(t,e,n){return t?t.replaceAt(t.lastIndexOf(e),e.length,n):n},this.wrapAt=function(e,n,r,i,s){return n<0?e:t.insertAt(t.insertAt(e,i,n),s,n+i.length+r)},this.iwrap=function(e,n,r,i){return e&&n&&t.wrapAt(e,t.iIndexOf(e,n),n.length,r||"<u><b>",i||"</b></u>")},this.rand=function(t){return Math.random().toString(36).substr(2,t||8)},this.lopd=function(t){return t?"***"+t.substr(3,4)+"**":t},this.split=function(t,e){return t?t.trim().split(e||","):[]},this.minify=function(t){return t?t.trim().replace(/\s{2}/g,""):t},this.lines=function(e){return t.split(e,/[\n\r]+/)},this.words=function(e){return t.split(e,/\s+/)},this.ilike=function(e,n){return t.iIndexOf(""+e,n)>-1},this.olike=function(e,n,r){return n.some(function(n){return t.ilike(e[n],r)})},this.alike=function(e,n,r){return t.words(r).some(function(r){return t.olike(e,n,r)})},this.ltr=function(t,e){for(var n=[],r=s(t);r>e;r-=e)n.unshift(t.substr(r-e,e));return r>0&&n.unshift(t.substr(0,r)),n},this.rtl=function(t,e){for(var n=[],r=s(t),i=0;i<r;i+=e)n.push(t.substr(i,e));return n},this.slices=function(t,e){var n=0,r=[],i=s(t);for(let s=0;n<i&&s<e.length;s++){let i=e[s];r.push(t.substr(n,i)),n+=i}return n<i&&r.push(t.substr(n)),r}}function ValidatorBox(){const t=this,e=/^\d+$/,n=/^\d+(,\d+)*$/,r=/\w+[^\s@]+@[^\s@]+\.[^\s@]+/,i=/^[\w#@&°!§%;:=\^\/\(\)\?\*\+\~\.\,\-\$]{6,}$/,s=/^(\d{8})([A-Z])$/,o=/^([ABCDEFGHJKLMNPQRSUVW])(\d{7})([0-9A-J])$/,u=/^[XYZ]\d{7,8}[A-Z]$/;function a(t){return t?t.length:0}function c(t){return t?t.trim().replace(/\W+/g,"").toUpperCase():t}function l(t,e){try{return t.test(e)}catch(t){}return!1}this.size=function(t,e,n){let r=a(t);return e<=r&&r<=n},this.regex=function(t,e){return l(t,e)},this.login=function(t){return l(i,t)},this.email=function(t){return l(r,t)},this.digits=function(t){return l(e,t)},this.idlist=function(t){return l(n,t)},this.esId=function(e){return!!(e=c(e))&&(l(s,e)?t.dni(e):l(o,e)?t.cif(e):!!l(u,e)&&t.nie(e))},this.dni=function(t){return"TRWAGMYFPDXBNJZSQVHLCKE".charAt(parseInt(t,10)%23)==t.charAt(8)},this.cif=function(t){for(var e=t.match(o),n=e[1],r=e[2],i=e[3],s=0,u=0;u<r.length;u++){var a=parseInt(r[u],10);u%2==0&&(a=(a*=2)<10?a:parseInt(a/10)+a%10),s+=a}var c=0!==(s%=10)?10-s:s,l="JABCDEFGHI".substr(c,1);return n.match(/[ABEH]/)?i==c:n.match(/[KPQS]/)?i==l:i==c||i==l},this.nie=function(e){var n=e.charAt(0),r="X"==n?0:"Y"==n?1:"Z"==n?2:n;return t.dni(r+e.substr(1))},this.iban=function(t){if(24!=a(t=c(t)))return!1;const e="ABCDEFGHIJKLMNOPQRSTUVWXYZ";let n=e.search(t.substring(0,1))+10,r=e.search(t.substring(1,2))+10,i=String(n)+String(r)+t.substring(2);i=i.substring(6)+i.substring(0,6);let s="",o=Math.ceil(i.length/7);for(let t=1;t<=o;t++)s=String(parseFloat(s+i.substr(7*(t-1),7))%97);return 1==s},this.creditCardNumber=function(t){if(16!=a(t=c(t)))return!1;let e=0,n=!1;t=t.trim().replace(/\s+/g,"");for(let r=15;r>=0;r--){let i=+t[r];n&&(i*=2,i-=i>9?9:0),e+=i,n=!n}return e%10==0},this.generatePassword=function(t,e){return e=e||"abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_#@&°!§%;:=^/()?*+~.,-$",Array.apply(null,Array(t||10)).map(function(){return e.charAt(Math.random()*e.length)}).join("")},this.testPassword=function(t){let e=0;return e+=/[A-Z]+/.test(t)?1:0,e+=/[a-z]+/.test(t)?1:0,e+=/[0-9]+/.test(t)?1:0,e+=/[\W]+/.test(t)?1:0,e+=e>2&&a(t)>8},this.get=function(e){return t[e]},this.set=function(e,n){return t[e]=n,t}}$(document).ready(function(){let t=new MessageBox($("html").attr("lang")||navigator.language||navigator.userLanguage),e=new ValidatorService,n=new StringBox;function r(t){t.parentNode.classList.add("d-none")}function i(t){t.parentNode.classList.remove("d-none")}function s(t,e){t.innerHTML=e,i(t)}let o=document.querySelectorAll(".alert-text");o.forEach(t=>{t.firstChild?i(t):r(t)});let u=document.querySelectorAll(".alert-close");function a(t){t&&s(o[0],t)}function c(t){t&&s(o[3],t)}function l(){u.forEach(t=>{t.click()})}u.forEach(t=>{t.addEventListener("click",function(){r(t)})});let f=document.querySelector(".loading");function h(){$(f).show(),l()}function d(){$(f).fadeOut()}function g(t){return t?"addClass":"removeClass"}function m(t,e){let n=t.dataset.dest;n?($(n).html(e),a(t.dataset.msg)):a(e)}$(document).on("input",".clearable",function(){$(this)[g(this.value)]("x")}).on("mousemove",".x",function(t){$(this)[g(this.offsetWidth-28<t.clientX-this.getBoundingClientRect().left)]("onX")}).on("touchstart click",".onX",function(t){t.preventDefault(),$(this).removeClass("x onX").val("").change()}),$("a.ajax").click(function(t){h();let e=this;function n(t){return m(e,t)}fetch(e.href).then(t=>t.text().then(t.ok?n:c)).catch(c).finally(d),t.preventDefault()});const p="is-invalid",v=".invalid-feedback",b=":not([type=hidden])[tabindex]:not([readonly])";$("form").each(function(t,e){let r=e.elements;function i(){$("#counter-"+this.id,e).text(Math.abs(this.getAttribute("maxlength")-n.size(this.value)))}function s(t){return t.nif+" - "+t.nombre}function o(t,e,n){return!$(t).val(n).siblings("[type=hidden]").val(e)}$(r).filter("textarea[maxlength]").keyup(i).each(i),$(r).filter(".ac-user").autocomplete({minLength:3,source:function(t,e){h(),this.element.autocomplete("instance")._renderItem=function(e,r){let i=n.iwrap(s(r),t.term);return $("<li></li>").append("<div>"+i+"</div>").appendTo(e)},fetch("/usuarios.html?term="+t.term).then(t=>t.json()).then(t=>{e(t.slice(0,10))}).catch(c).finally(d)},focus:function(){return!1},select:function(t,e){return o(this,e.item.nif,s(e.item))}}).change(function(t){this.value||o(this,"","")}),$(r).filter("[type=reset]").click(t=>{l(),e.reset(),$(r).removeClass(p).siblings(v).text(""),$(r).filter("textarea[maxlength]").each(i),$(r).filter(b).first().focus()})}).submit(function(r){let i=this,s=i.elements,o=n.size(s)-1;function u(t){m(i,t);for(let t=o;t>-1;t--){let e=s[t];e.matches(b)&&e.focus(),e.value=""}}function l(t){for(let e=o;e>-1;e--){let n=s[e],r=n.name&&t[n.name];r?$(n).focus().addClass(p).siblings(v).html(r):$(n).removeClass(p).siblings(v).html("")}a(t.msgok),c(t.msgerr)}let f=e.values(s);if(!e.validate(f,t.getLang()))return e.setError("msgerr",t.get("errForm")),l(e.getErrors()),r.preventDefault();if(!i.classList.contains("ajax"))return!0;h();let g=new FormData(this);fetch(this.action,{method:this.method,body:"multipart/form-data"===this.enctype?g:new URLSearchParams(g),headers:{"Content-Type":this.enctype||"application/x-www-form-urlencoded","x-requested-with":"XMLHttpRequest"}}).then(t=>t.ok?t.text().then(u):t.json().then(l)).catch(c).finally(d),r.preventDefault()})}),$(document).ready(function(){$("ul.menu").each(function(t,e){$(e.children).filter("[parent][parent!='']").each((t,n)=>{let r=$("#"+$(n).attr("parent"),e);r.children().last().is(e.tagName)||r.append('<ul class="sub-menu"></ul>').children("a").append('<b class="nav-tri">&rtrif;</b>'),r.children().last().append(n)}),$(e.children).remove("[parent][parent!='']"),e.querySelectorAll("i").forEach(t=>{t.classList.length<=1&&t.parentNode.removeChild(t)});let n=$("b.nav-tri",e);n.parent().click(function(t){$(this.parentNode).toggleClass("active"),t.preventDefault()}),$("li",e).hover(function(){n.html("&rtrif;"),$(this).children("a").find("b.nav-tri").html("&dtrif;"),$(this).parents("ul.sub-menu").prev().find("b.nav-tri").html("&dtrif;")}),$("[disabled]",e).each(function(){let t=parseInt(this.getAttribute("disabled"))||0;$(this).toggleClass("disabled",3!=(3&t))}).removeAttr("disabled")}).children().fadeIn(200),$(".sidebar-toggle").click(t=>{$("#sidebar").toggleClass("active"),$(".sidebar-icon",this.parentNode).toggleClass("d-none"),t.preventDefault()});let t=$(".menu-toggle").click(e=>{e.preventDefault(),t.toggleClass("d-none"),$("#wrapper").toggleClass("toggled")}),e=$("#back-to-top").click(function(){return!$("body,html").animate({scrollTop:0},400)});$(window).scroll(function(){$(this).scrollTop()>50?e.fadeIn():e.fadeOut()}),document.querySelectorAll('a[href^="#"]').forEach(t=>{t.addEventListener("click",function(t){t.preventDefault();try{document.querySelector(this.href).scrollIntoView({behavior:"smooth"})}catch(t){}})})}),document.addEventListener("DOMContentLoaded",function(){let t=document.querySelectorAll("#progressbar li"),e=0;document.querySelectorAll(".next-tab").forEach(n=>{n.addEventListener("click",n=>(e<t.length-1&&t[++e].classList.add("active"),!1))}),$(".prev-tab").click(function(){return e&&t[e--].classList.remove("active"),!1}),$("a[href^='#tab-']").click(function(){let n=+this.href.substr(this.href.lastIndexOf("-")+1);return 0<=n&&n!=e&&n<t.length&&(t.forEach((t,e)=>{t.classList.toggle("active",e<=n)}),e=n),!1})});const valid=new ValidatorBox;function ValidatorService(){const t=this,e={};let n,r,i=void 0!==VALIDATORS&&VALIDATORS?VALIDATORS:{};function s(t){return t?t.trim():t}this.getData=function(t){return t?n[t]:n},this.setData=function(e){return n=e||{},t},this.getMsg=function(t){return r[t]},this.setMsg=function(e,n){return r[e]=n,t},this.getMsgs=function(){return r},this.setMsgs=function(e){return r=e||{},t},this.getValidator=function(){return valid},this.getValidators=function(){return i},this.values=function(t,e){e=e||{};let n=(r=t)?r.length:0;var r;for(let r=0;r<n;r++){let n=t[r];n.name&&(e[n.name]=s(n.value))}return e},this.init=function(n,r,s){i=s||i,t.setData(n).setMsgs(r);for(let t in e)delete e[t];return e.num=0,t},this.getErrors=function(){return e},this.getError=function(t){return e[t]},this.setError=function(n,r){return e[n]=r,e.num++,t},this.setMsgError=function(e,n){return t.setError(e,t.getMsg(n))},this.fails=function(){return e.num>0},this.isValid=function(){return 0==e.num},this.validate=function(e,o,u){t.init(e,o,u);for(let e in n){let o=i[e];o&&o(t,e,s(n[e]),r)}return t.isValid()}}const VALIDATORS={nombre:function(t,e,n,r){return t.getValidator().size(n,1,200)||!t.setError(e,r.errRequired)},ap1:function(t,e,n,r){t.getValidator().size(n,1,200)||t.setError(e,r.errNombre)},ap2:function(t,e,n,r){t.getValidator().size(n,0,200)||t.setError(e,r.errNombre)},nif:function(t,e,n,r){let i=t.getValidator();return i.size(n,1,50)&&i.esId(fields.nif)||!t.setError(e,r.errNif)},correo:function(t,e,n,r){return t.getValidator().size(n,1,200)?t.getValidator().email(n)||!t.setError(e,r.errCorreo):!t.setError(e,r.errRequired)}};