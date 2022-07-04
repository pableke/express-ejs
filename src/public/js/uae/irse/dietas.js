
function IrseDietas() {
	const self = this; //self instance
	const DIETAS = { //DB de dietas
		"ES": {a1:102.56, a2:65.97,  m1:53.34,  m2:37.4, max:53.34, name:"España",       name_en: "Spain"},
		"DE": {a1:155.66, a2:132.82, m1:68.52,  m2:59.5,  name:"Alemania",               name_en: "Germany"},
		"AD": {a1:54.69,  a2:46.88,  m1:44.47,  m2:37.86, name:"Andorra",                name_en: "Andorra"},
		"AO": {a1:158.67, a2:135.23, m1:66.71,  m2:59.5,  name:"Angola",                 name_en: "Angola"},
		"SA": {a1:86.55,  a2:73.92,  m1:60.7,   m2:54.09, name:"Arabia Saudita",         name_en: "Saudi Arabia"},
		"DZ": {a1:119,    a2:101.57, m1:51.09,  m2:44.47, name:"Argelia",                name_en: "Argelia"},
		"AR": {a1:130.42, a2:111.19, m1:64.91,  m2:55.29, name:"Argentina",              name_en: "Argentina"},
		"AU": {a1:94.96,  a2:81.14,  m1:657.1,  m2:51.09, name:"Australia",              name_en: "Australia"},
		"AT": {a1:112.39, a2:95.56,  m1:66.11,  m2:58.9,  name:"Austria",                name_en: "Austria"},
		"BE": {a1:174.29, a2:148.45, m1:91.35,  m2:82.94, name:"Bélgica",                name_en: "Belgium"},
		"BO": {a1:60.1,   a2:51.09,  m1:42.67,  m2:36.66, name:"Bolivia",                name_en: "Bolivia"},
		"BA": {a1:85.34,  a2:72.72,  m1:57.7,   m2:49.88, name:"Bosnia-Herzegovina",     name_en: "Bosnia-Herzegovina"},
		"BR": {a1:150.25, a2:128.02, m1:91.35,  m2:79.33, name:"Brasil",                 name_en: "Brazil"},
		"BG": {a1:62.51,  a2:53.49,  m1:44.47,  m2:37.86, name:"Bulgaria",               name_en: "Bulgaria"},
		"CM": {a1:103.37, a2:88.35,  m1:91.35,  m2:48.68, name:"Camerún",                name_en: "Cameroon"},
		"CA": {a1:110.59, a2:94.36,  m1:58.3,   m2:51.69, name:"Canadá",                 name_en: "Canada"},
		"CL": {a1:120.2,  a2:102.17, m1:57.7,   m2:50.49, name:"Chile",                  name_en: "Chile"},
		"CN": {a1:184.14, a2:71.52,  m1:51.69,  m2:46.28, name:"China",                  name_en: "China"},
		"CO": {a1:145.44, a2:123.81, m1:90.15,  m2:78.13, name:"Colombia",               name_en: "Colombia"},
		"KR": {a1:120.2,  a2:102.17, m1:62.51,  m2:55.29, name:"Corea del Sur",          name_en: "South Korea"},
		"CI": {a1:72.12,  a2:61.3,   m1:55.89,  m2:49.28, name:"Costa de Marfil",        name_en: "Ivory Coast"},
		"CR": {a1:76.93,  a2:65.51,  m1:52.29,  m2:44.47, name:"Costa Rica",             name_en: "Costa Rica"},
		"HR": {a1:85.34,  a2:72.72,  m1:57.7,   m2:49.88, name:"Croacia",                name_en: "Croatia"},
		"CU": {a1:66.11,  a2:56.5,   m1:38.46,  m2:33.06, name:"Cuba",                   name_en: "Cuba"},
		"DK": {a1:144.24, a2:122.61, m1:72.12,  m2:64.91, name:"Dinamarca",              name_en: "Denmark"},
		"DO": {a1:75.13,  a2:64.31,  m1:42.07,  m2:36.66, name:"República Dominicana",   name_en: "Dominican Republic"},
		"EC": {a1:75.73,  a2:64.91,  m1:50.49,  m2:43.27, name:"Ecuador",                name_en: "Ecuador"},
		"EG": {a1:106.98, a2:91.35,  m1:44.47,  m2:39.07, name:"Egipto",                 name_en: "Egypt"},
		"SV": {a1:77.53,  a2:66.11,  m1:50.49,  m2:43.27, name:"El Salvador",            name_en: "El Salvador"},
		"AE": {a1:119,    a2:101.57, m1:63.71,  m2:56.5,  name:"Emiratos Árabes Unidos", name_en: "United Arab Emirates"},
		"SK": {a1:88.95,  a2:75.73,  m1:49.88,  m2:43.27, name:"Eslovaquia",             name_en: "Slovakia"},
		"US": {a1:168.28, a2:143.04, m1:77.53,  m2:69.72, name:"Estados Unidos",         name_en: "United States"},
		"ET": {a1:140.04, a2:119.6,  m1:43.87,  m2:37.86, name:"Etiopía",                name_en: "Ethiopia"},
		"PH": {a1:84.14,  a2:71.52,  m1:45.08,  m2:39.67, name:"Filipinas",              name_en: "Philippines"},
		"FI": {a1:134.63, a2:114.79, m1:72.72,  m2:65.51, name:"Finlandia",              name_en: "Finland"},
		"FR": {a1:144.24, a2:122.61, m1:72.72,  m2:65.51, name:"Francia",                name_en: "France"},
		"GA": {a1:117.8,  a2:100.37, m1:59.5,   m2:52.89, name:"Gabón",                  name_en: "Gabon"},
		"GH": {a1:78.13,  a2:66.71,  m1:42.67,  m2:37.26, name:"Ghana",                  name_en: "Ghana"},
		"GR": {a1:81.14,  a2:69.12,  m1:45.08,  m2:39.07, name:"Grecia",                 name_en: "Greece"},
		"GT": {a1:105.18, a2:89.55,  m1:49.28,  m2:42.67, name:"Guatemala",              name_en: "Guatemala"},
		"GQ": {a1:102.77, a2:87.75,  m1:56.5,   m2:50.49, name:"Guinea Ecuatorial",      name_en: "Equatorial Guinea"},
		"HT": {a1:52.89,  a2:45.08,  m1:43.87,  m2:37.86, name:"Haití",                  name_en: "Haití"},
		"HN": {a1:81.74,  a2:69.72,  m1:49.28,  m2:42.07, name:"Honduras",               name_en: "Honduras"},
		"HK": {a1:142.44, a2:121.4,  m1:57.7,   m2:51.69, name:"Hong-Kong",              name_en: "Hong-Kong"},
		"HU": {a1:135.23, a2:115.39, m1:52.89,  m2:46.28, name:"Hungría",                name_en: "Hungary"},
		"IN": {a1:117.2,  a2:99.77,  m1:44.47,  m2:38.46, name:"India",                  name_en: "India"},
		"ID": {a1:120.2,  a2:102.17, m1:48.68,  m2:42.67, name:"Indonesia",              name_en: "Indonesia"},
		"IQ": {a1:77.53,  a2:66.11,  m1:44.47,  m2:39.07, name:"Irak",                   name_en: "Irak"},
		"IR": {a1:94.36,  a2:80.54,  m1:51.69,  m2:44.47, name:"Irán",                   name_en: "Iran"},
		"IE": {a1:109.38, a2:93.16,  m1:54.09,  m2:48.08, name:"Irlanda",                name_en: "Ireland"},
		"IL": {a1:108.78, a2:92.56,  m1:63.71,  m2:56.5,  name:"Israel",                 name_en: "Israel"},
		"IT": {a1:153.86, a2:131.02, m1:69.72,  m2:63.11, name:"Italia",                 name_en: "Italy"},
		"JM": {a1:90.15,  a2:76.93,  m1:51.69,  m2:46.28, name:"Jamaica",                name_en: "Jamaica"},
		"JP": {a1:187.52, a2:159.87, m1:108.18, m2:96.76, name:"Japón",                  name_en: "Japan"},
		"JO": {a1:109.38, a2:93.16,  m1:48.68,  m2:42.67, name:"Jordania",               name_en: "Jordan"},
		"KE": {a1:96.76,  a2:82.34,  m1:45.08,  m2:39.67, name:"Kenia",                  name_en: "Kenya"},
		"KW": {a1:144.24, a2:122.61, m1:50.49,  m2:44.47, name:"Kuwait",                 name_en: "Kuwait"},
		"LB": {a1:135.23, a2:115.39, m1:40.87,  m2:34.86, name:"Líbano",                 name_en: "Lebanon"},
		"LY": {a1:119.6,  a2:102.17, m1:62.51,  m2:54.69, name:"Libia",                  name_en: "Libya"},
		"LU": {a1:159.27, a2:135.83, m1:63.11,  m2:55.89, name:"Luxemburgo",             name_en: "Luxemburgo"},
		"MY": {a1:108.18, a2:91.95,  m1:39.67,  m2:34.26, name:"Malasia",                name_en: "Malaysia"},
		"MT": {a1:54.09,  a2:46.28,  m1:37.26,  m2:31.85, name:"Malta",                  name_en: "Malt"},
		"MA": {a1:116.6,  a2:99.17,  m1:45.68,  m2:39.67, name:"Marruecos",              name_en: "Morocco"},
		"MR": {a1:57.7,   a2:49.28,  m1:45.08,  m2:39.07, name:"Mauritania",             name_en: "Mauritania"},
		"MX": {a1:96.16,  a2:81.74,  m1:49.88,  m2:43.27, name:"Mexico",                 name_en: "Mexico"},
		"MZ": {a1:78.73,  a2:67.31,  m1:48.08,  m2:42.67, name:"Mozambique",             name_en: "Mozambique"},
		"NI": {a1:110.59, a2:94.36,  m1:61.9,   m2:52.89, name:"Nicaragua",              name_en: "Nicaragua"},
		"NG": {a1:138.23, a2:117.8,  m1:51.69,  m2:46.88, name:"Nigeria",                name_en: "Nigeria"},
		"NO": {a1:156.26, a2:132.82, m1:89.55,  m2:80.54, name:"Noruega",                name_en: "Norway"},
		"NZ": {a1:76.93,  a2:65.51,  m1:46.28,  m2:40.27, name:"Nueva Zelanda",          name_en: "New Zealand"},
		"NL": {a1:149.05, a2:126.81, m1:71.52,  m2:64.31, name:"Países Bajos",           name_en: "Netherlands"},
		"PK": {a1:68.52,  a2:58.3,   m1:43.27,  m2:37.26, name:"Pakistán",               name_en: "Pakistán"},
		"PA": {a1:75.73,  a2:64.91,  m1:42.07,  m2:36.66, name:"Panamá",                 name_en: "Panama"},
		"PY": {a1:53.49,  a2:45.68,  m1:38.46,  m2:33.06, name:"Paraguay",               name_en: "Paraguay"},
		"PE": {a1:93.76,  a2:79.93,  m1:50.49,  m2:43.27, name:"Perú",                   name_en: "Peru"},
		"PL": {a1:117.2,  a2:99.77,  m1:48.68,  m2:42.67, name:"Polonia",                name_en: "Poland"},
		"PT": {a1:114.19, a2:97.36,  m1:51.09,  m2:43.87, name:"Portugal",               name_en: "Portugal"},
		"UK": {a1:183.91, a2:156.86, m1:91.35,  m2:82.94, name:"Reino Unido",            name_en: "United Kingdom"},
		"GB": {a1:183.91, a2:156.86, m1:91.35,  m2:82.94, name:"Reino Unido",            name_en: "United Kingdom"},
		"CZ": {a1:119,    a2:101.57, m1:49.88,  m2:43.27, name:"República Checa",        name_en: "Czech Republic"},
		"RO": {a1:149.05, a2:126.81, m1:44.47,  m2:38.46, name:"Rumanía",                name_en: "Romania"},
		"RU": {a1:267.45, a2:227.78, m1:83.54,  m2:73.32, name:"Rusia",                  name_en: "Russia"},
		"SN": {a1:79.33,  a2:67.91,  m1:51.09,  m2:45.08, name:"Senegal",                name_en: "Senegal"},
		"CS": {a1:115.39, a2:98.57,  m1:57.7,   m2:49.88, name:"Serbia y Montenegro",    name_en: "Serbia and montenegro"},
		"SG": {a1:99.77,  a2:85.34,  m1:54.09,  m2:48.08, name:"Singapur",               name_en: "Singapore"},
		"SY": {a1:97.96,  a2:83.54,  m1:52.29,  m2:46.28, name:"Siria",                  name_en: "Syria"},
		"ZA": {a1:75.13,  a2:64.31,  m1:55.89,  m2:48.08, name:"Sudáfrica",              name_en: "South Africa"},
		"SE": {a1:173.09, a2:147.25, m1:82.34,  m2:75.13, name:"Suecia",                 name_en: "Sweden"},
		"CH": {a1:174.29, a2:148.45, m1:69.12,  m2:61.3,  name:"Suiza",                  name_en: "Swiss"},
		"TH": {a1:81.14,  a2:69.12,  m1:45.08,  m2:39.07, name:"Tailandia",              name_en: "Tailandia"},
		"TW": {a1:96.16,  a2:81.74,  m1:54.09,  m2:48.68, name:"Taiwan",                 name_en: "Taiwan"},
		"TZ": {a1:90.15,  a2:76.93,  m1:34.86,  m2:30.05, name:"Tanzania",               name_en: "Tanzania"},
		"TN": {a1:60.7,   a2:51.69,  m1:54.09,  m2:46.28, name:"Túnez",                  name_en: "Tunisia"},
		"TR": {a1:72.12,  a2:61.3,   m1:45.08,  m2:39.07, name:"Turquía",                name_en: "Turkey"},
		"UY": {a1:67.31,  a2:57.7,   m1:48.68,  m2:41.47, name:"Uruguay",                name_en: "Uruguay"},
		"VE": {a1:91.35,  a2:78.13,  m1:42.07,  m2:36.06, name:"Venezuela",              name_en: "Venezuela"},
		"YE": {a1:156.26, a2:132.82, m1:49.28,  m2:43.27, name:"Yemen",                  name_en: "Yemen"},
		"ZR": {a1:119,    a2:101.57, m1:60.7,   m2:54.09, name:"Zaire / Congo",          name_en: "Zaire / Congo"},
		"ZW": {a1:90.15,  a2:76.93,  m1:45.08,  m2:39.07, name:"Zimbabwe",               name_en: "Zimbabwe"},
		"ZZ": {a1:127.41, a2:108.78, m1:46.88,  m2:40.87, max:91.35, name:"Resto del Mundo", name_en: "Rest of the world"}
	};

	const resume = { dias: 0, impMax: 0, reducido: 0, percibir: 0 };
	const STYLES = {
		cod: val => i18n.val(self.getDieta(val), "name"), f1: i18n.fmtDate, f2: i18n.fmtDate,
		imp1: i18n.isoFloat1, imp2: i18n.isoFloat, impMax: i18n.isoFloat, maxDietas: i18n.isoFloat1, reducido: i18n.isoFloat, percibir: i18n.isoFloat,
		dietas: (val, dieta, j) => { //calculado
			let output = "";
			for (let i = 0; i <= dieta.maxDietas; i += .5)
				output += '<option value="' + i + ((dieta.imp1 == i) ? '" selected>' : '">') + i18n.isoFloat1(i) + '</option>'
			return output;
		}
	}
	let dieta;

	this.getDieta = pais => DIETAS[pais] || DIETAS.ZZ;
	this.getPais = pais => i18n.val(self.getDieta(pais), "name");

	this.getA1 = pais => self.getDieta(pais).a1;
	this.getA2 = pais => self.getDieta(pais).a2;
	this.getImpAlojamiento = pais => (dieta == "1") ? self.getA1(pais) : self.getA2(pais);

	this.getM1 = pais => self.getDieta(pais).m1;
	this.getM2 = pais => self.getDieta(pais).m2;
	this.getImpDieta = pais => (dieta == "1") ? self.getM1(pais) : self.getM2(pais);
	this.getImpDietaMax = pais => self.getDieta(pais).max || DIETAS.ZZ.max;

	this.getImporte = function(pais, tipo) {
		let max = /*ip.isMov() &&*/ (IRSE.mask & 16); //mascara de la solicitud
		if (tipo == "1") //tipo = gastos de manutencion/dietas
			return max ? Math.max(self.getImpDietaMax(pais), self.getImpDieta(pais)) : self.getImpDieta(pais);
		if (tipo == "2") //tipo = gastos de alojamiento/pernoctas
			return max ? Math.max(self.getImpDietaMax(pais), self.getImpAlojamiento(pais)) : self.getImpAlojamiento(pais);
		return null; //sin importe
	}

	this.getImpMax = () => resume.impMax;
	this.getImpReducido = () => resume.reducido;
	this.getImpPercibir = () => resume.percibir;

	// Build table step 7
	dom.ready(function() {
		//valor leido del select en paso 2
		dieta = dom.getValue("#dieta") || "2";
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
	});
}
