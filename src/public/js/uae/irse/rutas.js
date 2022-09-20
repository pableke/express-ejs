
function IrseRutas() {
	const self = this; //self instance
	const GASOLINA = .19; //euros/km
	const CT_LAT = 37.62568269999999;
	const CT_LNG = -0.9965839000000187;

	const MUN = { //default ruta MUN
		desp: 1, mask: 1, // VP y principal 
		lat1: CT_LAT, lng1: CT_LNG, pais1: "ES",
		lat2: CT_LAT, lng2: CT_LNG, pais2: "ES"
	};
	const LOC = { //default ruta AUT/A7J
		desp: 10, mask: 1, // VP y principal 
		lat1: CT_LAT, lng1: CT_LNG, pais1: "ES",
		lat2: CT_LAT, lng2: CT_LNG, pais2: "ES"
	};
	const CT = { //default CT coords
		desp: 0, mask: 0, lat: CT_LAT, lng: CT_LNG, pais: "ES",
		origen: "Cartagena, España", lat1: CT_LAT, lng1: CT_LNG, pais1: "ES",
		destino: "Cartagena, España", lat2: CT_LAT, lng2: CT_LNG, pais2: "ES"
	};

	const resume = {};
	const STYLES = {
		remove: "msgDelRuta",
		f1: (val, ruta) => i18n.fmtDate(ruta.dt1), h1: (val, ruta) => sb.minTime(ruta.dt1), 
		f2: (val, ruta) => i18n.fmtDate(ruta.dt2), h2: (val, ruta) => sb.minTime(ruta.dt2),
		principal: (val, ruta) => (ruta.mask & 1) ? '<span class="act-warn"> <i class="fal fa-flag-checkered"></i></span>' : "",
		km1: i18n.isoFloat, km2: i18n.isoFloat, totKm: i18n.isoFloat,
		impKm: (val, ruta) => fmtImpKm(ruta),
		totKm: i18n.isoFloat, totKmCalc: i18n.isoFloat, 
		desp: val => {
			let output = i18n.arrval("tiposDesp", val);
			if (val == 1)
				output += " (" + IRSE.matricula + ")";
			return output;
		}
	};

	let rutas;

	function fmtImpKm(ruta) {
		return i18n.isoFloat(ruta.km1 * GASOLINA)
	}
	function fnSetMain(ruta) {
		rutas.forEach(ruta => { ruta.mask &= ~1; });
		ruta.mask |= 1;
	}

	//necesario para recalculo de dietas
	this.getImpKm = () => resume.impKm;
	this.getTotKm = () => resume.totKm;
	this.getTotKmCalc = () => resume.totKmCalc;

	this.getLoc = () => ip.isMun() ? MUN : LOC;
	this.getCT = () => CT;

	this.getAll = () => rutas;
	this.size = () => ab.size(rutas);
	this.empty = () => ab.empty(rutas);
	this.first = () => rutas[0];
	this.last = () => ab.last(rutas);
	this.start = () => sb.toDate(rutas[0]?.dt1);
	this.end = () => sb.toDate(ab.last(rutas)?.dt2);
	this.isSalidaTemprana = () => (self.size() && (sb.getHours(rutas[0].dt1) < 14));
	this.isSalidaTardia = () => (self.size() && (sb.getHours(rutas[0].dt1) > 21));
	this.isLlegadaTemprana = () => (self.size() && (sb.getHours(self.last().dt2) < 14));
	this.isLlegadaTardia = () => (self.size() && (sb.getHours(self.last().dt2) < 5));
	this.isLlegadaCena = () => (self.size() && (sb.getHours(self.last().dt2) > 21));
	this.getRuta = f1 => { // Ruta asociada a f1
		let aux = dt.clone(f1); // f1 = readonly
		dt.addHours(aux, 29); // 5h del dia siguiente
		let fMax = aux.toJSON(); // Stringify date
		let ruta = self.first(); // Ruta de salida
		rutas.forEach(aux => { // rutas ordenadas por fecha
			// Ultima fecha de llegada mas proxima a fMax
			ruta = (aux.dt2 < fMax) ? aux : ruta;
		});
		return ruta;
	}

	this.resume = function() {
		resume.totKm = resume.totKmCalc = 0;
		rutas.forEach(ruta => {
			resume.totKm += nb.round(ruta.km1 || 0);
			resume.totKmCalc += nb.round(ruta.km2 || 0);
		});
		resume.km1 = resume.totKm; //synonym
		resume.impKm = resume.totKm * GASOLINA;
		resume.justifi = (resume.totKmCalc + .01) < resume.totKm;
		return self;
	}
	this.save = function() {
		dom.setValue("#etapas", JSON.stringify(rutas));
		return self;
	}
	this.valid = function(ruta) {
		dom.closeAlerts();
		if (!ruta.origen)
			dom.addError("#origen", "errOrigen", "errRequired");
		if (ruta.desp == 1)
			dom.required("#matricula", "errMatricula", "errRequired");
		//if (!dt.isValid(ruta.dt1) || !dt.isValid(ruta.dt2))
			//return !dom.addError("#f1", "errFechasRuta");
		if (sb.future(ruta.dt1))
			return !dom.addError("#f1", "errFechaFutura");
		if (ruta.dt1 > ruta.dt2)
			return !dom.addError("#f1", "errFechasOrden");
		return dom.isOk();
	}
	this.validAll = function() {
		if (self.empty())
			return !dom.closeAlerts().addError("#origen", "errItinerario");
		let r1 = rutas[0];
		if (!self.valid(r1))
			return false;
		for (let i = 1; i < rutas.length; i++) {
			let r2 = rutas[i];
			if (!self.valid(r2))
				return false; //stop
			if (r1.pais2 != r2.pais1)
				return !dom.addError("#destino", "errItinerarioPaises");
			if (r1.dt2 > r2.dt1) //rutas ordenadas
				return !dom.addError("#destino", "errItinerarioFechas");
			if (rutas[0].origen == r2.origen)
				return !dom.addError("#destino", "errMulticomision");
			r1 = r2; //go next route
		}
		return dom.isOk();
	}
	this.validItinerario = function() {
		if (self.validAll()) {
			let numPrincipales = 0;
			rutas.forEach(ruta => { numPrincipales += ruta.mask & 1; });
			return (numPrincipales == 1) || !dom.addError("#destino", "errMainRuta");
		}
		return false;
	}

	this.add = function(ruta, dist) {
		ruta.temp = true;
		rutas.push(ruta);

		//reordeno rutas por fecha de salida
		rutas.sort((a, b) => sb.cmp(a.dt1, b.dt1));

		//calculo de la ruta principal
		let diff = 0;
		let principal = rutas[0];
		for (let i = 1; i < rutas.length; i++) {
			let aux = sb.diffDate(rutas[i].dt1, rutas[i - 1].dt2);
			if (diff < aux) {
				diff = aux;
				principal = rutas[i - 1];
			}
		}

		if (self.validAll()) {
			delete ruta.temp;
			fnSetMain(principal);
			ruta.km1 = ruta.km2 = dist;
			IRSE.matricula = dom.getValue("#matricula"); //update from input
			dom.table("#rutas", rutas, resume, STYLES);
		}
		else
			rutas.remove(r => r.temp);
		return self;
	}

	this.paso1 = () => dom.closeAlerts().required("#objeto", "errObjeto", "errRequired").isOk();
	this.paso1Col = () => self.paso1() && dom.past("#fAct", "errDateLe", "errRequired").gt0("#impAc", "errGt0", "errRequired").isOk();
	this.paso2 = () => self.validItinerario() && ((self.size() > 1) || !dom.addError("#destino", "errMinRutas"));
	this.paso6 = function() {
		dom.closeAlerts();
		if (resume.justifi)
			dom.required("#justifiKm", "errJustifiKm", "errRequired");
		return dom.isOk();
	}

	// DOM loaded
	dom.ready(function() {
		if (!ip.isLoaded()) // hay perfil?
			return; //no hay calculo de rutas

		rutas = ab.parse(dom.getText("#rutas-data")) || [];
		resume.out = rutas.filter(ruta => (ruta.desp != 1) && (ruta.desp != 3) && !ruta.g); //rutas no asociadas a factura
		resume.sizeOut = resume.out.length; // size table footer
		resume.vp = rutas.filter(ruta => (ruta.desp == 1)); //rutas en vp
		resume.sizeVp = resume.vp.length; // size table footer

		if (ip.isAutA7j() || ip.is1Dia()) {
			const ruta = Object.assign({}, self.getLoc(), rutas[0]);
			rutas[0] = ruta; // Save new data (routes.length = 1)

			self.resume(); // actualizo importes
			dom.onChangeForm("#xeco", form => { self.resume().save(); }) // Any input change => save all rutas
				.toggleHide(".grupo-matricula", ruta.desp!=1)
				.setInput("#origen", ruta.origen, el => { ruta.origen = ruta.destino = el.value; })
				.setInput("#desp", ruta.desp, el => { ruta.desp = +el.value; })
				.setInput("#dist", i18n.isoFloat(ruta.km1), el => { ruta.km1 = ruta.km2 = i18n.toFloat(el.value); })
				.setInput("#f2", sb.enDate(ruta.dt2), el => { ruta.dt2 = sb.endDay(el.value); })
				.setInput("#f1", sb.enDate(ruta.dt1), el => {
					ruta.dt1 = el.value;
					//si no hay f2 considero el dia completo de f1 => afecta a las validaciones
					ruta.dt2 = dom.getInput("#f2") ? ruta.dt2 : sb.endDay(ruta.dt1);
				});
		}
		else {
			// Table Events handlers paso 2 y 6
			dom.onFindRow("#rutas", (table, ev) => {
				fnSetMain(ev.detail.data);
				dom.table("#rutas", rutas, resume, STYLES);
			}).onRenderTable("#rutas", table => {
				let last = self.resume().last(rutas) || CT;
				dom.table("#rutas-read", rutas, resume, STYLES)
					.setValue("#origen", last.destino).setValue("#f1", sb.enDate(last.dt2)).setValue("#h1", sb.minTime(last.dt2))
					.setValue("#destino", "").copyVal("#f2", "#f1").setValue("#h2", "").setValue("#principal", "0").setValue("#desp", "")
					.delAttrInput("#f1", "max").delAttrInput("#f2", "min").hide(".grupo-matricula");
				if (!last.dt1)
					dom.setFocus("#f1");
				else if (last.mask & 1) // es ruta principal?
					dom.setValue("#h1", "").setFocus("#h1");
				else
					dom.setFocus("#destino");
			});

			// tabla resumen de vehiculo propio del paso 6
			dom.onChangeTable("#vp", table => {
				const tr = resume.row;
				const ruta = resume.data;
				resume.element.value = i18n.fmtFloat(resume.element.value);
				ruta.km1 = i18n.toFloat(resume.element.value);

				self.resume();
				dom.tfoot(table, resume, STYLES)
					.toggleHide(".justifi-km", !resume.justifi)
					.setText(tr.cells[9], fmtImpKm(ruta) + " €")
					.setHtml("#imp-km", i18n.isoFloat(resume.impKm) + " €")
					.setHtml("#imp-bruto", i18n.isoFloat(io.getImpTotal()) + " €");
				resume.justifi && dom.setFocus("#justifiKm");
				self.save();
			});
		}

		//load rutas vp/out and autoload fechas del itinerario (paso 5 y 6)
		dom.table("#rutas", rutas, resume, STYLES) // render rutas
			.onRenderTable("#rutas", self.save) // save after first render
			.table("#vp", resume.vp, resume, STYLES)
			.toggleHide(".justifi-km", !resume.justifi)
			.table("#rutas-out", resume.out, resume, STYLES)
			.onChangeInput("#f1", el => dom.setValue("#f2", el.value)).setRangeDate("#f1", "#f2")
			.onChangeInput("#desp", el => dom.toggleHide(".grupo-matricula", el.value!="1"))
			.onChangeInput("#matricula", el => { el.value = sb.upper(el.value); });

		/********** promotor, mesa, tribunal: autocomplete **********/
		$(".ac-personal-upct:not(.ui-state-disabled)").attr("type", "search").keydown(fnAcChange).autocomplete({
			delay: 500, //milliseconds between keystroke occurs and when a search is performed
			minLength: 5, //reduce matches
			focus: fnFalse, //no change focus on select
			search: fnAcSearch, //lunch source
			source: function(req, res) {
				fnAutocomplete(this.element, ["nombre", "nif"], res,
					item => { return item.nombre; }
				);
			},
			select: function(ev, ui) {
				return fnAcLoad(this, ui.item.nif, ui.item.nombre);
			}
		}).change(fnAcReset);
	});
}
