
function IrseImputacion() {
	const self = this; //self instance
	//TIPO = dietas=1, alojamiento=2, transporte=3
	const CONCEPTOS_CAP2 = { "1": "230", "2": "230", "3": "231" };
	const SUBCONCEPTOS_CAP6 = { "1": "30", "2": "31", "3": "32" };
	//FINALIDAD = Ejecución=1, Formación=2, Difusión=3
	const FINALIDAD_AA = { "1": "30", "2": "32", "3": "31" };
	const FINALIDAD_BB = { "1": "33", "2": "35", "3": "34" };
	const FINALIDAD_CC = { "1": "36", "2": "38", "3": "37" };
	//COLECTIVOS = { "PDI-FU", "PAS", "PDI-LA", "PIN", "BPE", "ALU", "EXT" };
	const COLECTIVOS = { "PDI-FU": "00", "PDI-LA": "01", "PAS": "02", "PIN": "03", "BPE": "04", "ALU": "05", "EXT": "06" };
	const NONE = "-"; // Sin Imputacion

	//calculo de la imputacion por orden de prelacion
	this.get = function(tipo, org) {
		if (tipo == 4) { //Asistencias/colaboraciones = 4
			//organica de investigacion 642
			if (ip.isIsu()) {
				if (ip.isColaboracion())
					return "642.29";
				if (ip.isTribunal() || ip.isFormacion())
					return "642.39.06";
				return NONE;
			}
			//organica de investigacion 64X
			if (ip.isInve3005(org)) {
				if (ip.isColaboracion())
					return "64X.29";
				if (ip.isTribunal() || ip.isFormacion())
					return "64X.39.06";
				return NONE;
			}
			//capitulo 2
			if (ip.isColaboracion())
				return "227.15";
			if (ip.isTribunal())
				return "233.00.06";
			return ip.isFormacion() ? "233.01" : "233.02";
		}

		let finalidad = dom.getValue("#finalidad") || "1"; //default = Ejecución
		if (tipo == 1) // dietas
			finalidad = FINALIDAD_AA[finalidad];
		else if (tipo == 2) // alojamiento
			finalidad = FINALIDAD_BB[finalidad];
		else // transporte
			finalidad = FINALIDAD_CC[finalidad];
		finalidad = finalidad || "XX";
		let colectivo = COLECTIVOS[ip.getColectivo()] || "XX";

		if (ip.isIsu()) //642
			return "642." + finalidad + "." + colectivo;
		if (ip.isInve3005(org)) //64X
			return (ip.is643() ? "643." : "64X.") + SUBCONCEPTOS_CAP6[tipo] + "." + colectivo;
		//capitulo 2
		let cap2 = CONCEPTOS_CAP2[tipo] + ".xx."  + colectivo;
		if (tipo == 1) // dietas
			return cap2.replace("xx", ip.isMes() ? "02" : "00");
		return cap2.replace("xx", (tipo == 2) ? "01" : "00");
	}
}
