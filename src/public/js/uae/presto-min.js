function TcPartidas(e,i){const t=this,a=ab.read("eco3d")||[],n=ab.read("ant")||[];let o,r,c,d;function s(e,t){var a=sb.cmp(e.o,t.o);return 0==a?sb.cmp(e.e,t.e):a}this.getAnticipo=function(t,a){return 2<i&&n.find(e=>e.id!=t&&e.o==a)},this.getPdec=function(t,a){return o.find(e=>e.idOrg==t&&e.idEco==a)||{}},this.getAnt2021=()=>a.filter(e=>"643"==e.e||-1<["300568","300868","300906"].indexOf(sb.substr(e.o,0,6))),this.getAip2021=t=>a.find(e=>e.idOrg==t&&"640"==e.e),this.getGcr2021=()=>a.filter(e=>1&e.mask||"3008688665"==e.o||e.o.startsWith("300518A")||e.o.startsWith("300518GR")),this.getGco2021=()=>a.filter(e=>32&e.mask),this.load=function(){return"2021"<=e&&(o=5==i?t.getAnt2021():ab.parse($("#cv-data").text())||[],r=ab.sort(o,"asc",s).distinct(o,"idOrg"),c=4==i?t.getGcr2021():7==i?t.getGco2021():a,d=ab.sort(c,"asc",s).distinct(c,"idOrg"),t.getAip=t.getAip2021),t},this.isValidableCd=function(){return 1==i||8==i},this.isPartidaDec=function(){return t.isValidableCd()||3==i||5==i},this.getPartidasDec=()=>r,this.getEconomicasDec=t=>o.filter(e=>e.idOrg==t),this.getPartidasInc=()=>d,this.getEconomicasInc=t=>c.filter(e=>e.idOrg==t)}dom.ready(function(){const i=$("form#xeco"),n=$("input#op",i),o=$("input#op2",i),r=$("input#id",i);function t(e,t,a){return n.val((e=e)&&e.split("/").pop()),t&&o.val(t),r.val(a),!i.submit()}function a(e){return e?t(e.href,$(e).attr("op2"),e.id):!i.submit()}window.navto=t,window.linkto=a,ab.ss("eco3d",$("#eco3d-data").text()).ss("ant",$("#ant-data").text());let c=ab.parse($("#eco030-data").text())||[],d=($(".eco-ing",i).attr("type","search").keydown(fnAcChange).autocomplete({minLength:3,focus:fnFalse,search:fnAcSearch,source:function(e,t){fnAcRender(this.element,e=>e.eco+" - "+e.desc+"<br>"+e.desc),t(fnAcFilter(c,["eco","desc"],e.term))},select:function(e,t){return fnAcLoad(this,t.item.id,t.item.eco+" - "+t.item.desc)}}).change(fnAcReset).on("search",fnAcReset),ab.ss("uxxi",$("#uxxi-data").text()).read("uxxi"));$("#uxxi",i).attr("type","search").keydown(fnAcChange).autocomplete({minLength:3,focus:fnFalse,search:fnAcSearch,source:function(e,t){fnAcRender(this.element,e=>e.num+" - "+e.uxxi+"<br>"+e.desc),t(fnAcFilter(d,["num","desc"],e.term))},select:function(e,t){return fnAcLoad(this,t.item.ec+","+t.item.tipo,t.item.num)}}).change(fnAcReset).on("search",fnAcReset),$("a[href=unlink]").click(function(){return confirm("¿Desea desasociar esta operaci&oacute;n de UXXI-EC?'")&&a(this)}),$("a[href=publish]").click(function(){return confirm("¿Desea notificar a los responsables de la solicitud, que esta ya esta mecanizada en UXXI-EC?'")&&a(this)}),$("a[href=toggle]",i).click(function(){return $("#ejCache",i).val(this.title),a(this)}),$("a[href=accept]",i).click(function(){return confirm("¿Confirma que desea firmar esta solicitud?")&&a(this)}),$("a[href=delete]",i).click(function(){return confirm("¿Confirma que desea eliminar esta solicitud?")&&a(this)}),$("a[name=nav],a[name=send]",i).click(function(){return a(this)}),$(".key-nav,.key-send",i).keydown(function(e){13==e.keyCode&&(e.preventDefault(),a())})}),dom.ready(function(){i18n.setCurrent("es");const a=$("form#xeco"),e=$("input#op2",a),t=$("input#id",a);var i=$("#ejCache",a).val();const n=+e.val()||1,o=$("#partidas",a),r=new TcPartidas(i,n).load();function c(e){p.cd=0,Object.assign(p,e),dom.getInput("input#cd").value=nfLatin(p.cd)}function d(e){m(e),e.importe=p.importe,g.splice(0,1,e),dom.table("#partidas-inc",g,h,f)}function s(e){dom.closeAlerts(),1&e.mask&&-1<[1,2,6].indexOf(n)&&dom.showInfo("La org&aacute;nica "+e.o+" es afectada, por lo que su solicitud solo se aceptar&aacute; para determinado tipo de operaciones.")}function m(e){r.getAnticipo(t.val(),e.o)?(dom.closeAlerts().showWarn("Atenci&oacute;n: la org&aacute;nica "+e.o+" ha dispuesto de cr&eacute;dito anticipado al cobro de la factura."),e.mask|=4):e.mask&=-5}$("#cv",a).keydown(fnAcChange).autocomplete({minLength:3,focus:fnFalse,search:fnAcSearch,source:function(e,t){fnAcRender(this.element,e=>e.o+" - "+e.dOrg),t(fnAcFilter(r.getPartidasDec(),["o","dOrg"],e.term))},select:function(e,t){s(t.item),c(t.item),$("#org-desc",a).text(p.dOrg),$("#fa",a).val(i18n.fmtBool(1&p.mask));t=r.getEconomicasDec(p.idOrg);return u.html(ab.format(t,'<option value="@idEco;">@e; - @dEco;</option>')).val(p.idEco),l.change(),fnAcLoad(this,p.idOrg,p.o)}}).change(fnAcReset);const u=$("#idEco",a).change(function(){c(r.getPdec(p.idOrg,this.value))}),l=$("#importe",a).change(function(){if(p.importe=npLatin(l.val())||0,3==n){let e=r.getAip(p.idAip);if(!e)return!dom.addError("#cv","AIP no encontrado para la partida seleccionada.");m(p),e.importe=p.importe,e.ej=p.ej,d(e)}else 5==n?d(p):8==n&&d(g[0])}),f={remove:"¿Confirma que desea desasociar esta partida?",empty:"N/A",gg:nfLatin,ing:nfLatin,ch:nfLatin,mh:nfLatin,ih:nfLatin,importe:nfLatin,imp:nfLatin,impTotal:nfLatin,impPartida:nfLatin,fCreacion:dfLatin,fMax:dfLatin,ff:dfLatin,fa:(e,t)=>i18n.fmtBool(1&t.omask),info:(e,t)=>{let a="";return 4&t.mask&&(a='<span class="textbig" title="Este contrato ha gozado de anticipo en alg&uacute;n momento">&#65;</span>'),(5==n||"642"==t.e)&&sb.isset(t.ih)&&t.ih+.01<t.importe&&(a+='<span class="textwarn textbig" title="La cantidad solicitada excede el margen registrado por el Buz&oacute;n de Ingresos">&#9888;</span>',t.mask|=2),a}},p={ej:i,importe:npLatin(l.val())||0,cd:npLatin($("input#cd",a).val())},h={},g=ab.parse(o.val())||[];let A;function b(e){h.temp=e,h.temp.omask=e.mask,$("#fainc",a).val(i18n.fmtBool(1&e.mask))}var v=$("#eco3d",a).keydown(fnAcChange).autocomplete({minLength:3,focus:fnFalse,search:fnAcSearch,source:function(e,t){fnAcRender(this.element,e=>e.o+" - "+e.dOrg),t(fnAcFilter(r.getPartidasInc(),["o","dOrg"],e.term))},select:function(e,t){return s(t.item),b(t.item),A=r.getEconomicasInc(t.item.idOrg),k.val(1==A.length?t.item.e:null),fnAcLoad(this,"",t.item.o)}}).change(fnAcReset),k=$("#ecoinc",a).keydown(fnAcChange).autocomplete({minLength:1,focus:fnFalse,search:fnAcSearch,source:function(e,t){fnAcRender(this.element,e=>e.e+" - "+e.dEco),t(fnAcFilter(A,["e","dEco"],e.term))},select:function(e,t){return b(t.item),fnAcLoad(this,"",t.item.e)}}).change(fnAcReset);function x(e){g.push(h.temp),m(h.temp),h.temp.importe=e,h.temp.ej=p.ej,h.temp=null,dom.table("#partidas-inc",g,h,f)}dom.onRenderTable("#partidas-inc",(e,t)=>{h.importe=g.reduce((e,t)=>e+t.importe,0),p.importe=(1==n?p:h).importe,dom.setValues(".grp-inc","").setFocus("#eco3d")}),dom.table("#partidas-inc",g,h,f).autofocus(),dom.onclick("a#add-partida",e=>{var t=i18n.get("errRequired");if(dom.closeAlerts().gt0("#impinc","El importe de la partida a incrementar debe ser mayor de 0,00 &euro;"),!h.temp||v.val()!=h.temp.o)return dom.addError("#eco3d","No ha seleccionado correctamente la partida a aumentar",t);if(k.val()!=h.temp.e&&dom.addError("#ecoinc","La partida seleccionada no existe en UXXI-EC, debe solicitarse a través de Extraeco.",t),g.find(e=>e.id==h.temp.id)&&dom.addError("#eco3d","¡Partida ya asociada a la solicitud!"),dom.isOk()){var a,i,t=i18n.getData("impinc");if(1==n)return a=sb.substr(h.temp.e,0,1),i=sb.substr(u.find("option:selected").text(),0,1),-1<["6","7","8","9"].indexOf(i)&&i!=a?!dom.addError("#cv","No puede realizarse la transferencia solicitada porque es competencia del Consejo Social. Debe ponerse en contacto con la UAE."):p.o==h.temp.o&&p.e==a?!dom.showWarn("La partida que aumenta est&aacute; dentro del mismo cr&eacute;dito vinculante que la que disminuye, con lo que esta operaci&oacute;n no es necesaria."):p.importe<h.importe+t?!dom.addError("#cv","El importe de las partidas que se incrementan supera al de la partida que se decrementa!"):void x(t);x(t),p.importe=h.importe,l.val(nfLatin(p.importe))}}),dom.onclick("a[href=insert]",e=>{var t=i18n.get("errRequired");return"2"==dom.closeAlerts().getInput("#urgente").value&&dom.required("#extra","Debe asociar un motivo para la urgencia de esta solicitud",t).geToday("#fMax","Debe indicar una fecha maxima de resolución para esta solicitud"),dom.required("#memoria","Debe asociar una memoria justificativa a la solicitud.",t).required("#cv","Debe indicar la partida que disminuye.",t),(!l.val()||p.importe<.01)&&dom.addError("#importe","Debe indicar un importe mayor de 0,00 &euro; para la partida que disminuye"),g.length||dom.addError("#eco3d","Debe seleccionar al menos una partida a aumentar!",t),nb.eq01(p.importe,h.importe)||dom.addError("#eco3d","El importe de la partida que disminuye no coincide con el de la/las que aumentan!"),r.isValidableCd()&&(p.cd||0)<h.importe&&dom.addError("#eco3d","Cr&eacute;dito m&aacute;ximo disponible excedido!"),o.val(JSON.stringify(g)),dom.isOk()&&confirm("¿Confirma que desea firmar y enviar esta solicitud?")&&linkto(e)})});