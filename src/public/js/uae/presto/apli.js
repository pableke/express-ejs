
function TcPartidas(ej, tipo) {
	const self = this; //self instance

	const e3d = ab.read("eco3d") || []; //todas las economicas a 3d
	const anticipos = ab.read("ant") || []; //solicitudes de anticipos previas
	let apliDec, dec, apliInc, inc; //contenedores de las partidas

	//busca los anticipos para solicitudes que no sean TCR o FCB
	this.getAnticipo = function(id, org) {
		return (tipo > 2) && anticipos.find(p => ((p.id != id) && (p.o == org)));
	}

	/********** partida que se decrementa **********/
	this.getPdec = function(org, eco) { return apliDec.find(p => ((p.idOrg == org) && (p.idEco == eco))) || {}; }
	this.getAnt2021 = () => e3d.filter(p => ((p.e == "643") || (["300568", "300868", "300906"].indexOf(sb.substr(p.o, 0, 6)) > -1))); //ant=5
	/********** partida que se decrementa **********/

	/********** partida que se incrementa **********/
	this.getAip2021 = (id) => e3d.find(p => ((p.idOrg == id) && (p.e == "640")));
	this.getGcr2021 = () => e3d.filter(p => ((p.mask&1) || (p.o=="3008688665") || p.o.startsWith("300518A") || p.o.startsWith("300518GR"))); //organicas afectadas solo para gcr=4
	this.getGco2021 = () => e3d.filter(p => (p.mask&32)); //organicas gencom solo para gco=7
	/********** partida que se incrementa **********/

	// sort by organica and economica
	function fnSort(a, b) {
		let aux = sb.cmp(a.o, b.o);
		return (aux == 0) ? sb.cmp(a.e, b.e) : aux;
	}
	//registro para el calculo de las partidas segun el ejercicio
	this.load = function() {
		//if ("2020" <= ej) {...} //calculo para el ejercicio 2020 y anteriores
		if ("2021" <= ej) { //calculo para el ejercicio 2021
			apliDec = (tipo == 5) ? self.getAnt2021() : (ab.parse($("#cv-data").text()) || []);
			dec = ab.sort(apliDec, "asc", fnSort).distinct(apliDec, "idOrg");
			apliInc = (tipo == 4) ? self.getGcr2021() : ((tipo == 7) ? self.getGco2021() : e3d);
			inc = ab.sort(apliInc, "asc", fnSort).distinct(apliInc, "idOrg");
			self.getAip = self.getAip2021;
			return self;
		}
		//current year (2022...)
		return self;
	}

	this.isValidableCd = function() { return (tipo == 1) || (tipo == 8); } //TCR y AFC
	this.isPartidaDec = function() { return self.isValidableCd() || (tipo == 3) || (tipo == 5); } //TCR, L83, ANT o AFC

	this.getPartidasDec = () => dec;
	this.getEconomicasDec = (org) => apliDec.filter(p => (p.idOrg == org));
	this.getPartidasInc = () => inc;
	this.getEconomicasInc = (org) => apliInc.filter(p => (p.idOrg == org));
}
