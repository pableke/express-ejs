dom.ready(function(){const t={imp:0},n={empty:"N/A",imp:i18n.isoFloat,gg:i18n.isoFloat,ing:i18n.isoFloat,ch:i18n.isoFloat,mh:i18n.isoFloat,ih:i18n.isoFloat,fUxxi:i18n.fmtDate,fa:(e,a)=>i18n.fmtBool(1&a.omask),info:(e,a)=>{let o="";return(5==PRESTO.tipo||"642"==a.e)&&sb.isset(a.ih)&&a.ih+.01<a.imp&&(o='<span class="textwarn textbig" title="La cantidad solicitada excede el margen registrado por el Buzón de Ingresos">&#9888;</span>',a.mask|=2),4&a.mask&&(o+='<span class="textbig" title="Este contrato ha gozado de anticipo en algún momento">&#65;</span>'),o}},i={msgError:"errForm",presto:{"org-dec":i18n.required,"org-dec-id":i18n.required,"eco-dec":i18n.required},partidas:{"org-inc":i18n.required,"org-inc-id":i18n.required,"eco-inc":i18n.required,"imp-inc":i18n.gt0}},e="Seleccione una económica",a='<option value="">'+e+"</option>",d='<option value="@value;">@label;</option>';let c,r,l,s=ab.parse(dom.getText("#partidas-json"))||[];const o=e=>e.label,m=(e,a,o)=>dom.setValue("#org-dec",o).setValue("#org-dec-id",e).setValue("#fa-dec",i18n.fmtBool(1&a)),u=(e,a,o)=>dom.setValue("#eco-value",e).setValue("#eco-label",a).setValue("#imp-cd",i18n.isoFloat(o)),p=e=>{1&e&&-1<[1,6].indexOf(PRESTO.tipo)&&dom.showInfo("La orgánica seleccionada es afectada, por lo que su solicitud solo se aceptará para determinado tipo de operaciones.")},g=e=>{s[0].imp=i18n.toFloat(e)||0,dom.table("#partidas-tb",s,t,n)},f=(e,a)=>{e=ab.parse(e);e?(s=[e],g()):dom.showError(a),unloading()};function h(){8!=PRESTO.tipo&&PRESTO.autoloadInc&&dom.clearTable("#partidas-tb",s,t,n),u("",e).setHtml("#eco-dec",a),m()}function b(){this.value||h()}window.loadEconomicasDec=(e,a,o)=>{unloading(),c=ab.parse(o.data),(l=c&&c[0])?(u(l.value,l.label,l.imp).setHtml("#eco-dec",c.format(d)),3==PRESTO.tipo?dom.loading().trigger("#find-aip","click"):5==PRESTO.tipo&&dom.loading().trigger("#find-ant","click")):dom.showError("Aplicación no encontrada en el sistema.")},window.loadAip=(e,a,o)=>f(o.data,"Aplicación AIP no encontrada en el sistema."),window.loadAnt=(e,a,o)=>f(o.data,"No se ha encontrado el anticipo en el sistema."),$("#org-dec").attr("type","search").keydown(fnAcChange).autocomplete({delay:500,minLength:4,focus:fnFalse,search:fnAcSearch,source:fnSourceItems,select:function(e,a){return loading(),p(a.item.int),m(a.item.value,a.item.int,o(a.item)),!dom.trigger("#find-economicas-dec","click")}}).change(b).on("search",b),dom.onChangeInput("#imp-dec",e=>{PRESTO.autoloadInc&&s.length&&g(e.value)});const x=(e,a,o)=>dom.setValue("#org-inc",o).setValue("#org-inc-id",e).setValue("#fa-inc",i18n.fmtBool(1&a)),v=(e,a)=>dom.setValue("#eco-inc-value",e).setValue("#eco-inc-label",a);function I(){x(),v("",e).setHtml("#eco-inc",a).setValue("#imp-inc")}function w(){this.value||I()}window.loadEconomicasInc=(e,a,o)=>{o=(r=ab.parse(o.data))&&r[0];o&&v(o.value,o.label).setHtml("#eco-inc",r.format(d)),unloading()},$("#org-inc").attr("type","search").keydown(fnAcChange).autocomplete({delay:500,minLength:4,focus:fnFalse,search:fnAcSearch,source:fnSourceItems,select:function(e,a){return loading(),p(a.item.int),x(a.item.value,a.item.int,o(a.item)),!dom.trigger("#find-economicas-inc","click")}}).change(w).on("search",w),dom.onChangeInput("#ej-dec",e=>{dom.setValue("#ej-inc",e.value),h()}).onChangeInput("#ej-inc",I).eachInput(".ui-float",e=>{e.value=i18n.fmtFloat(e.value)}),dom.onChangeInput("#eco-dec",e=>{l=c[e.selectedIndex],u(e.value,dom.getOptText(e),l.imp)}),dom.onChangeInput("#eco-inc",e=>{inc=r[e.selectedIndex],v(e.value,dom.getOptText(e))}),window.fnAddPartidaInc=(e,a,o)=>dom.validate("#xeco-presto",i.partidas),window.loadPartidaInc=(e,a,o)=>{const i=ab.parse(o.data);i.imp=i18n.toFloat(dom.getValue("#imp-inc")),s.push(i),dom.table("#partidas-tb",s,t,n).setFocus("#org-inc"),I()},dom.onRenderTable("#partidas-tb",e=>{t.imp=0,s.forEach(e=>{t.imp+=e.imp}),dom.eachInput("#ej-dec",e=>dom.toggle(e,"ui-state-disabled",s.length)),dom.eachInput("#ej-inc",e=>dom.toggle(e,"ui-state-disabled",PRESTO.disableEjInc||s.length))}),dom.table("#partidas-tb",s,t,n),window.fnSend=()=>{var e=i18n.get("errRequired");if(dom.validate("#xeco-presto",i.presto),"2"==dom.getValue("#urgente")&&dom.required("#extra","Debe asociar un motivo para la urgencia de esta solicitud",e).geToday("#fMax","Debe indicar una fecha maxima de resolución para esta solicitud"),dom.required("#memoria","Debe asociar una memoria justificativa a la solicitud.",e).required("#org-dec","Debe indicar la partida que disminuye.",e),s.length||dom.addError("#org-inc","Debe seleccionar al menos una partida a aumentar!",e),l&&(dom.required("#imp-dec","Debe indicar el importe de la partida que disminuye.",e),l.imp<t.imp&&dom.addError("#imp-dec","¡Importe máximo de la partida a disminuir excedido!",e)),dom.isOk())return s.sort((e,a)=>a.imp-e.imp),s[0].mask=1|s[0].mask,dom.setValue("#partidas",JSON.stringify(s)),confirm("¿Confirma que desea firmar y enviar esta solicitud?")};let E,V;$("#uxxi").attr("type","search").keydown(fnAcChange).autocomplete({delay:500,minLength:3,focus:fnFalse,search:fnAcSearch,source:function(e,a){fnAutocomplete(this.element,["num","desc"],a,e=>e.num+" - "+e.uxxi+"<br>"+e.desc)},select:function(e,a){return E=a.item,fnAcLoad(this,null,E.num+" - "+E.desc)}}).change(fnAcReset).on("search",fnAcReset),V=ab.parse(dom.getText("#op-json"))||[],dom.click("a#add-uxxi",e=>{E&&(delete E.id,V.push(E),dom.table("#op-table",V,t,n)),dom.setValue("#uxxi","").setFocus("#uxxi")}),dom.table("#op-table",V,t,n),dom.onRenderTable("#op-table",e=>{dom.setValue("#operaciones",JSON.stringify(V)),E=null})});