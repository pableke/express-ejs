const XECO_I18N={en:{msgRechazar:"Do you really want to reject this request?"},es:{msgRechazar:"¿Confirma que desea rechazar esta comunicación?"}};dom.ready(()=>{$(".ac-tercero").attr("type","search").keydown(fnAcChange).autocomplete({delay:500,minLength:5,focus:fnFalse,search:fnAcSearch,source:function(e,t){fnAutocomplete(this.element,["nombre","nif"],t,e=>e.nif+" - "+e.nombre)},select:function(e,t){return fnAcLoad(this,t.item.nif,t.item.nif+" - "+t.item.nombre)}}).change(fnAcReset),$(".ac-pago").attr("type","search").keydown(fnAcChange).autocomplete({delay:500,minLength:3,focus:fnFalse,search:fnAcSearch,source:function(e,t){fnAutocomplete(this.element,["numJg","numDc"],t,e=>e.numJg+": "+e.desc)},select:function(e,t){return fnAcLoad(this,t.item.numJg,t.item.numJg+": "+t.item.desc)}}).change(fnAcReset),$(".ac-tramitador").attr("type","search").keydown(fnAcChange).autocomplete({delay:500,minLength:3,focus:fnFalse,search:fnAcSearch,source:function(e,t){fnAutocomplete(this.element,["nombre","utCod","utDesc"],t,e=>e.nombre+"<br>"+e.utCod+" - "+e.utDesc)},select:function(e,t){var n=t.item.utCod+" - "+t.item.utDesc;return fnAcLoad(this,t.item.id,n)}}).change(fnAcReset),$(".ac-organica").attr("type","search").keydown(fnAcChange).autocomplete({delay:500,focus:fnFalse,search:fnAcSearch,source:function(e,t){fnAutocomplete(this.element,["o","dOrg"],t,e=>e.o+" - "+e.dOrg)},select:function(e,t){return fnAcLoad(this,t.item.id,t.item.o+" - "+t.item.dOrg)}}).change(fnAcReset)});