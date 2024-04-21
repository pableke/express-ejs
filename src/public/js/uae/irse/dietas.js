
function IrseDietas() {
	//const self = this; //self instance

	const resume = { dias: 0, impMax: 0, reducido: 0, percibir: 0 };
	const STYLES = {
		/*cod: val => i18n.val(self.getDieta(val), "name"),*/ f1: i18n.fmtDate, f2: i18n.fmtDate, // cod = codigo iso del pais + fechas
		imp1: i18n.isoFloat1, imp2: i18n.isoFloat, impMax: i18n.isoFloat, maxDietas: i18n.isoFloat1, reducido: i18n.isoFloat, percibir: i18n.isoFloat,
		dietas: (val, dieta, j) => { //calculado
			let output = "";
			for (let i = 0; i <= dieta.maxDietas; i += .5)
				output += '<option value="' + i + ((dieta.imp1 == i) ? '" selected>' : '">') + i18n.isoFloat1(i) + '</option>'
			return output;
		}
	}
	let dieta;

	//this.getDieta = pais => DIETAS[pais] || DIETAS.ZZ;
	//this.getPais = pais => i18n.val(self.getDieta(pais), "name");
	/*this.getImporte = function(pais, tipo) {
		const current = self.getDieta(pais); //dieta actual
		var key = ((tipo == "1") ? "a" : "m") + dieta; //prefix (dieta = "1"/"2")
		key += (IRSE.mask & 16) ? "" : "UPCT"; //mascara de la solicitud
		return current[key];
	}*/

	this.getImpMax = () => resume.impMax;
	this.getImpReducido = () => resume.reducido;
	this.getImpPercibir = () => resume.percibir;

	this.render = () => { // Build table step 7
		dieta = dom.getValue("#dieta") || "2"; //valor leido del select en paso 2
		const manutenciones = ab.parse(dom.getText("#dietas-data")) || [];

		// Table handlers
		dom.onChangeTable("#manutenciones", table => {
			const tr = resume.row;
			const dieta = resume.data;
			dieta.imp1 = +resume.element.value;

			dom.tfoot(table, resume, STYLES)
				.setText(tr.cells[9], i18n.isoFloat(dieta.reducido) + " €")
				.setText(tr.cells[10], i18n.isoFloat(dieta.percibir) + " €")
				.setHtml("#imp-dietas", i18n.isoFloat(resume.percibir) + " €")
				.setHtml("#imp-bruto", i18n.isoFloat(io.getImpTotal()) + " €")
				.setValue("#gastos-dietas", JSON.stringify(manutenciones));
		}).onRenderTable("#manutenciones", table => {
			let size = ab.size(manutenciones);
			if (size == 0) //hay dietas?
				return; // tabla vacia

			let first = manutenciones[0];
			first.maxDietas = first.estado / 2;
			first.impMax = first.imp2 * first.maxDietas;
			if (first.maxDietas == 1)
				first.reducido = (1-first.imp1) * first.imp2;
			else
				first.reducido = first.imp1 ? 0 : first.impMax;
			first.percibir = first.impMax - first.reducido;
			first.periodo = i18n.get("firstDay");

			//adjust last dieta
			resume.dias = 1;
			resume.impMax = first.impMax;
			resume.reducido = first.reducido;
			resume.percibir = first.percibir;
			if (size == 1)
				return;

			size--;
			for (let i = 1; i < size; i++) {
				let dieta = manutenciones[i];
				dieta.periodo = i18n.get("medDay");
				dieta.impMax = dieta.num * dieta.imp2;
				dieta.reducido = (dieta.num-dieta.imp1) * dieta.imp2;
				dieta.percibir = dieta.impMax - dieta.reducido;
				dieta.maxDietas = dieta.num;
				resume.dias += dieta.num;
				resume.impMax += dieta.impMax;
				resume.reducido += dieta.reducido;
				resume.percibir += dieta.percibir;
			}

			if (size > 0) {
				let last = ab.last(manutenciones); //extract last dieta
				last.maxDietas = last.estado / 2;
				last.impMax = last.imp2 * last.maxDietas;
				last.reducido = last.imp1 ? 0 : last.impMax;
				last.percibir = last.impMax - last.reducido;
				last.periodo = i18n.get("lastDay");

				//adjust last dieta
				resume.dias++;
				resume.impMax += last.impMax;
				resume.reducido += last.reducido;
				resume.percibir += last.percibir;
			}
		});

		dom.table("#manutenciones", manutenciones, resume, STYLES)
			.setHtml("#imp-dietas", i18n.isoFloat(resume.percibir) + " €")
			.setHtml("#imp-bruto", i18n.isoFloat(io.getImpTotal()) + " €");
	}
}
