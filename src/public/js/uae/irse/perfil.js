
function IrsePerfil() {
	const self = this; //self instance
	const ACTIVIDAD = 0b0000000000011; //default = COM/MUN 
	const ACTIVIDADES = { //BD actividades
		//por cuenta ajena - PAS
		"A,PAS,OTR": 0b1100000000111,
		"A,PAS,xOT": 0b1000000000011, 
		"A,PAS,ISU": 0b1100000000011,
		"A,PAS,xSU": 0b1000000000011, 

		//por cuenta ajena - PDI-FU
		"A,PDI-FU,OTR": 0b1100000000111,
		"A,PDI-FU,xOT": 0b1000000000011, 
		"A,PDI-FU,ISU": 0b1100000000011,
		"A,PDI-FU,xSU": 0b1000000000011, 

		//por cuenta ajena - PDI-LA
		"A,PDI-LA,OTR": 0b1100000000111,
		"A,PDI-LA,xOT": 0b1000000000011, 
		"A,PDI-LA,ISU": 0b1100000000011,
		"A,PDI-LA,xSU": 0b1000000000011, 

		//por cuenta ajena - BPE
		"A,BPE,OTR": 0b1100000000111,
		"A,BPE,xOT": 0b1000000000011, 
		"A,BPE,ISU": 0b1100000000011,
		"A,BPE,xSU": 0b1000000000011, 

		//por cuenta ajena - PIN
		"A,PIN,OTR": 0b1100000000111,
		"A,PIN,xOT": 0b1000000000011, 
		"A,PIN,ISU": 0b1100000000011,
		"A,PIN,xSU": 0b1000000000011, 

		//por cuenta ajena - EXT
		"A,EXT,OTR": 0b0011111111010,
		"A,EXT,xOT": 0b0011011111010, 
		"A,EXT,ISU": 0b0011000001010,
		"A,EXT,xSU": 0b0011000001010, 
		"A,EXT,A83": 0b0011000001010,
		"A,EXT,x83": 0b0011000001010, 
		"A,EXT,ACA": 0b0011000001010,
		"A,EXT,xAC": 0b0011000001010, 

		//por cuenta ajena - ALU
		"A,ALU,OTR": 0b0011000001110,
		"A,ALU,xOT": 0b0011000001010, 
		"A,ALU,ISU": 0b0011000001010,
		"A,ALU,xSU": 0b0011000001010, 
		"A,ALU,A83": 0b0011000001010,
		"A,ALU,x83": 0b0011000001010, 
		"A,ALU,ACA": 0b0011000001010,
		"A,ALU,xAC": 0b0011000001010
	};

	const TRIBUNALES = { //BD tribunales
		at11: 45.89, at12: 42.83, at13: 39.78,
		at21: 45.89, at22: 42.83, at23: 39.78,
		at31: 42.83, at32: 39.78, at33: 36.72
	};

	const resume = {};
	const STYLES_CD = { imp: i18n.isoFloat, fCache: i18n.isoDate, onFinish: (matches, output) => ((matches == 3) ? output : "") };
	const STYLES = { remove: "msgDelOrg", imp: i18n.isoFloat, resp: sb.lopd, fCache: i18n.isoDate };

	let eRol, eCol, eFin, eAct, eTramit;
	let organicas, current;

	const fCache = new Date();
	dt.addDate(fCache, -1); //fecha de ayer
	i18n.set("fCache", fCache);

	this.isLoaded = () => eRol && eCol && eFin && eAct;
	this.getRol = () => eRol.value;
	this.isColaboracion = () => (eAct.value == "OCE") || (eAct.value == "IAE+OCE");
	this.isTribunal = () => (eAct.value == "ATR") || (eAct.value == "IAE+ATR");
	this.isFormacion = () => (eAct.value == "AFO") || (eAct.value == "IAE+AFO");
	this.isCom = () => (eAct.value == "COM");
	this.isMun = () => (eAct.value == "MUN");
	this.isMes = () => (eAct.value == "MES");
	this.isIae = () => (eAct.value == "IAE");
	this.isAtr = () => (eAct.value == "ATR");
	this.isAfo = () => (eAct.value == "AFO");
	this.isAcs = () => (eAct.value == "ACS");
	this.isCtp = () => (eAct.value == "CTP");
	this.isOce = () => (eAct.value == "OCE");
	this.isA7j = () => (eAct.value == "A7J");
	this.isMov = () => (eAct.value == "MOV");
	this.is1Dia = () => (self.isMun() || self.isMes() || self.isAcs() || self.isAfo() || self.isAtr() || self.isCtp() || self.isOce())

	this.isAut = () => (eTramit.value == "AUT");
	this.isAutA7j = () => (self.isAut() || self.isA7j());

	this.getTribunales = () => TRIBUNALES;
	this.getTribunal = (name) => TRIBUNALES["at" + name] || 0;

	function fnCalcFinanciacion() {
		let result = "OTR"; //default fin.
		if (ab.size(organicas) > 0) {
			const ORG_300518 = "300518";
			organicas.forEach(org => {
				result = (sb.starts(org.o, ORG_300518) && ((org.mask & 8) == 8)) ? "ISU" : result; //apli=642
				result = (sb.starts(org.o, ORG_300518) && ((org.mask & 16) == 16) && (result != "ISU")) ? "A83" : result; //apli=643
				result = ((sb.starts(org.o, "300906") || sb.starts(org.o, "300920")) && (result == "OTR")) ? "ACA" : result; //TTPP o Master
			});
			if (organicas.length > 1) {
				if (result == "ISU") return "xSU"; 
				if (result == "A83") return "x83"; 
				if (result == "ACA") return "xAC"; 
				return "xOT";
			}
		}
		return result;
	}
	this.getFinanciacion = () => eFin.value;
	this.isIsu = () => (eFin.value == "ISU") || (eFin.value == "xSU");
	this.isA83 = () => (eFin.value == "A83") || (eFin.value == "x83");
	this.isACA = () => (eFin.value == "ACA") || (eFin.value == "xAC");
	this.isOTR = () => (eFin.value == "OTR") || (eFin.value == "xOT");

	function fnUpdatePerfil() {
		eFin.value = fnCalcFinanciacion(); //recalculo la financiacion
		dom.select(eAct, ACTIVIDADES[eRol.value + "," + eCol.innerText + "," + eFin.value] || ACTIVIDAD)
			.select(eTramit, (self.isCom() || self.isMov()) ? 7 : 1) //default = AyL
			.hide(".fin-info").show(".fin-" + eFin.value);
		return self;
	}
	function fnSave() {
		current = null; //remove selected
		fnUpdatePerfil(); //set new perfil
		dom.setValue("#presupuesto", JSON.stringify(organicas));
	}

	//auto-start => update perfil
	this.update = fnUpdatePerfil;
	this.getColectivo = () => dom.getText(eCol);
	this.setColectivo = val => { eCol.innerText = val; return self; }

	this.getOrganicas = () => organicas;
	this.empty = () => ab.empty(organicas);
	this.getNumOrganicas = () => ab.size(organicas);
	this.isMultiorganica = () => ab.size(organicas) > 1;
	this.getOrganica = (id) => organicas.find(org => org.id == id); //get organica by id
	this.isInve3005 = (org) => org && sb.starts(org.o, "3005") && ((org.mask & 64) == 64); //es de investigacion de la 3005XX
	this.is643 = (org) => org && ((org.mask & 16) == 16); //contiene alguna aplicacion 643?
	this.addOrganica = function() {
		if (current && !organicas.find(org => org.id==current.id))
			organicas.push(current);
		dom.table("#organicas", organicas, resume, STYLES);
	}

	this.valid = function() {
		dom.closeAlerts().required("#perfil-financiacion", "errPerfil");
		self.empty(organicas) && dom.required("#organica", "errOrganicas");
		return dom.required("#tramitador", "errPerfil").required("#interesado", "errPerfil").isOk();
	}

	dom.ready(function() {
		eRol = dom.getInput("#rol");
		eCol = dom.get("#colectivo");
		eFin = dom.getInput("#financiacion");
		eAct = dom.getInput("#actividad");
		eTramit = dom.getInput("#tramite");
		if (!self.isLoaded())
			return; //no hay calculo del perfil

		/********** interesqado autocomplete **********/
		$(".ac-persona:not(.ui-state-disabled)").attr("type", "search").keydown(fnAcChange).autocomplete({
			delay: 500, //milliseconds between keystroke occurs and when a search is performed
			minLength: 5, //reduce matches
			focus: fnFalse, //no change focus on select
			search: fnAcSearch, //lunch source
			source: function(req, res) {
				fnAutocomplete(this.element, ["nombre", "nif"], res,
					item => { return item.nif + " - " + item.nombre; }
				);
			},
			select: function(ev, ui) {
				const email = ui.item.email;
				const mailto = dom.children(ev.target, "a");
				dom.toggleHide(mailto, !email).attr(mailto, "href", "mailto:" + email);
				self.setColectivo(ui.item.ci).update(); //actualizo colectivo + tramite
				return fnAcLoad(this, ui.item.nif, ui.item.nif + " - " + ui.item.nombre);
			}
		}).change(fnAcReset);
		/********** interesqado autocomplete **********/

		/********** tramitador / organicas autocompletes **********/
		$("#tramitador:not(.ui-state-disabled)").attr("type", "search").keydown(fnAcChange).autocomplete({
			minLength: 4,
			focus: fnFalse, //no change focus on select
			search: fnAcSearch, //lunch source
			source: function(req, res) {
				fnAutocomplete(this.element, ["nombre", "utCod", "utDesc"], res,
					item => { return item.nombre + "<br>" + item.utCod + " - " + item.utDesc; }
				);
			},
			select: function(ev, ui) {
				dom.clearTable("#organicas", organicas, resume, STYLES)
					.setValue("#organica", "").setValue("#presupuesto", "");
				let text = ui.item.utCod + " - " + ui.item.utDesc;
				return fnAcLoad(this, ui.item.id, text);
			}
		}).change(fnAcReset);
		$("#organica").attr("type", "search").keydown(fnAcChange).autocomplete({
			delay: 500, //milliseconds between keystroke occurs and when a search is performed
			focus: fnFalse, //no change focus on select
			search: fnAcSearch, //lunch source
			source: function(req, res) {
				fnAutocomplete(this.element, ["o", "dOrg"], res, item => (item.o + " - " + item.dOrg));
			},
			select: function(ev, ui) {
				current = ui.item;
				i18n.set("imp", current.imp); //credito disponible
				fnAcLoad(this, current.id, current.o + " - " + current.dOrg);
				if (!IRSE.uxxiec) {
					ab.reset(organicas).push(organicas, current);
					fnSave();
				}
				return !dom.tr(".msg-cd", STYLES_CD);
			}
		}).change(function() { i18n.set("imp", null); dom.toggleHide(".msg-cd", !this.value); fnAcReset(); });
		/********** tramitador / organicas autocompletes **********/

		organicas = ab.parse(dom.getText("#org-data")) || [];
		i18n.set("imp", organicas[0]?.imp); //importe precargado

		// Register events after render table => avoid first render
		dom.table("#organicas", organicas, resume, STYLES);
		dom.onRenderTable("#organicas", table => {
			fnSave(); //set new perfil
			dom.closeAlerts().toggleHide("div#add-org", organicas.length).clearInput("#organica");
		});

		fnUpdatePerfil(); // show first perfil for update
		dom.getValue("#interesado") && dom.show(eCol.parentNode); //muestro el colectivo
		dom.change(eRol, fnUpdatePerfil).change(eAct, fnUpdatePerfil).tr(".msg-cd", STYLES_CD)
			.onChangeInput("#interesado", el => dom.toggleHide(eCol.parentNode, !el.value));
	});
}
