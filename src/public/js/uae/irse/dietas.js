
function IrseDietas() {
	const self = this; //self instance
	const DIETAS = { //DB de dietas
		"ES": {a1:102.560, a2:65.9700, m1:53.340, m2:37.400, max:53.340, name:"España",         name_en: "Spain"},
		"DE": {a1:155.660, a2:132.820, m1:68.520, m2:59.500, name:"Alemania",                   name_en: "Germany"},
		"AD": {a1:54.6900, a2:46.8800, m1:44.470, m2:37.860, name:"Andorra",                    name_en: "Andorra"},
		"AO": {a1:158.670, a2:135.230, m1:66.710, m2:59.500, name:"Angola",                     name_en: "Angola"},
		"SA": {a1:86.5500, a2:73.9200, m1:60.700, m2:54.090, name:"Arabia Saudita",             name_en: "Saudi Arabia"},
		"DZ": {a1:119.000, a2:101.570, m1:51.090, m2:44.470, name:"Argelia",                    name_en: "Argelia"},
		"AR": {a1:130.420, a2:111.190, m1:64.910, m2:55.290, name:"Argentina",                  name_en: "Argentina"},
		"AU": {a1:94.9600, a2:81.1400, m1:657.10, m2:51.090, name:"Australia",                  name_en: "Australia"},
		"AT": {a1:112.390, a2:95.5600, m1:66.110, m2:58.900, name:"Austria",                    name_en: "Austria"},
		"BE": {a1:174.290, a2:148.450, m1:91.350, m2:82.940, name:"Bélgica",                    name_en: "Belgium"},
		"BO": {a1:60.1000, a2:51.0900, m1:42.670, m2:36.660, name:"Bolivia",                    name_en: "Bolivia"},
		"BA": {a1:85.3400, a2:72.7200, m1:57.700, m2:49.880, name:"Bosnia-Herzegovina",         name_en: "Bosnia-Herzegovina"},
		"BR": {a1:150.250, a2:128.020, m1:91.350, m2:79.330, name:"Brasil",                     name_en: "Brazil"},
		"BG": {a1:62.5100, a2:53.4900, m1:44.470, m2:37.860, name:"Bulgaria",                   name_en: "Bulgaria"},
		"CM": {a1:103.370, a2:88.3500, m1:91.350, m2:48.680, name:"Camerún",                    name_en: "Cameroon"},
		"CA": {a1:110.590, a2:94.3600, m1:58.300, m2:51.690, name:"Canadá",                     name_en: "Canada"},
		"CL": {a1:120.200, a2:102.170, m1:57.700, m2:50.490, name:"Chile",                      name_en: "Chile"},
		"CN": {a1:184.140, a2:71.5200, m1:51.690, m2:46.280, name:"China",                      name_en: "China"},
		"CO": {a1:145.440, a2:123.810, m1:90.150, m2:78.130, name:"Colombia",                   name_en: "Colombia"},
		"KR": {a1:120.200, a2:102.170, m1:62.510, m2:55.290, name:"Corea del Sur",              name_en: "South Korea"},
		"CI": {a1:72.1200, a2:61.3000, m1:55.890, m2:49.280, name:"Costa de Marfil",            name_en: "Ivory Coast"},
		"CR": {a1:76.9300, a2:65.5100, m1:52.290, m2:44.470, name:"Costa Rica",                 name_en: "Costa Rica"},
		"HR": {a1:85.3400, a2:72.7200, m1:57.700, m2:49.880, name:"Croacia",                    name_en: "Croatia"},
		"CU": {a1:66.1100, a2:56.5000, m1:38.460, m2:33.060, name:"Cuba",                       name_en: "Cuba"},
		"DK": {a1:144.240, a2:122.610, m1:72.120, m2:64.910, name:"Dinamarca",                  name_en: "Denmark"},
		"DO": {a1:75.1300, a2:64.3100, m1:42.070, m2:36.660, name:"República Dominicana",       name_en: "Dominican Republic"},
		"EC": {a1:75.7300, a2:64.9100, m1:50.490, m2:43.270, name:"Ecuador",                    name_en: "Ecuador"},
		"EG": {a1:106.980, a2:91.3500, m1:44.470, m2:39.070, name:"Egipto",                     name_en: "Egypt"},
		"SV": {a1:77.5300, a2:66.1100, m1:50.490, m2:43.270, name:"El Salvador",                name_en: "El Salvador"},
		"AE": {a1:119.000, a2:101.570, m1:63.710, m2:56.500, name:"Emiratos Árabes Unidos",     name_en: "United Arab Emirates"},
		"SK": {a1:88.9500, a2:75.7300, m1:49.880, m2:43.270, name:"Eslovaquia",                 name_en: "Slovakia"},
		"US": {a1:168.280, a2:143.040, m1:77.530, m2:69.720, name:"Estados Unidos",             name_en: "United States"},
		"ET": {a1:140.040, a2:119.600, m1:43.870, m2:37.860, name:"Etiopía",                    name_en: "Ethiopia"},
		"PH": {a1:84.1400, a2:71.5200, m1:45.080, m2:39.670, name:"Filipinas",                  name_en: "Philippines"},
		"FI": {a1:134.630, a2:114.790, m1:72.720, m2:65.510, name:"Finlandia",                  name_en: "Finland"},
		"FR": {a1:144.240, a2:122.610, m1:72.720, m2:65.510, name:"Francia",                    name_en: "France"},
		"GA": {a1:117.800, a2:100.370, m1:59.500, m2:52.890, name:"Gabón",                      name_en: "Gabon"},
		"GH": {a1:78.1300, a2:66.7100, m1:42.670, m2:37.260, name:"Ghana",                      name_en: "Ghana"},
		"GR": {a1:81.1400, a2:69.1200, m1:45.080, m2:39.070, name:"Grecia",                     name_en: "Greece"},
		"GT": {a1:105.180, a2:89.5500, m1:49.280, m2:42.670, name:"Guatemala",                  name_en: "Guatemala"},
		"GQ": {a1:102.770, a2:87.7500, m1:56.500, m2:50.490, name:"Guinea Ecuatorial",          name_en: "Equatorial Guinea"},
		"HT": {a1:52.8900, a2:45.0800, m1:43.870, m2:37.860, name:"Haití",                      name_en: "Haití"},
		"HN": {a1:81.7400, a2:69.7200, m1:49.280, m2:42.070, name:"Honduras",                   name_en: "Honduras"},
		"HK": {a1:142.440, a2:121.400, m1:57.700, m2:51.690, name:"Hong-Kong",                  name_en: "Hong-Kong"},
		"HU": {a1:135.230, a2:115.390, m1:52.890, m2:46.280, name:"Hungría",                    name_en: "Hungary"},
		"IN": {a1:117.200, a2:99.7700, m1:44.470, m2:38.460, name:"India",                      name_en: "India"},
		"ID": {a1:120.200, a2:102.170, m1:48.680, m2:42.670, name:"Indonesia",                  name_en: "Indonesia"},
		"IQ": {a1:77.5300, a2:66.1100, m1:44.470, m2:39.070, name:"Irak",                       name_en: "Irak"},
		"IR": {a1:94.3600, a2:80.5400, m1:51.690, m2:44.470, name:"Irán",                       name_en: "Iran"},
		"IE": {a1:109.380, a2:93.1600, m1:54.090, m2:48.080, name:"Irlanda",                    name_en: "Ireland"},
		"IL": {a1:108.780, a2:92.5600, m1:63.710, m2:56.500, name:"Israel",                     name_en: "Israel"},
		"IT": {a1:153.860, a2:131.020, m1:69.720, m2:63.110, name:"Italia",                     name_en: "Italy"},
		"JM": {a1:90.1500, a2:76.9300, m1:51.690, m2:46.280, name:"Jamaica",                    name_en: "Jamaica"},
		"JP": {a1:187.520, a2:159.870, m1:108.18, m2:96.760, name:"Japón",                      name_en: "Japan"},
		"JO": {a1:109.380, a2:93.1600, m1:48.680, m2:42.670, name:"Jordania",                   name_en: "Jordan"},
		"KE": {a1:96.7600, a2:82.3400, m1:45.080, m2:39.670, name:"Kenia",                      name_en: "Kenya"},
		"KW": {a1:144.240, a2:122.610, m1:50.490, m2:44.470, name:"Kuwait",                     name_en: "Kuwait"},
		"LB": {a1:135.230, a2:115.390, m1:40.870, m2:34.860, name:"Líbano",                     name_en: "Lebanon"},
		"LY": {a1:119.600, a2:102.170, m1:62.510, m2:54.690, name:"Libia",                      name_en: "Libya"},
		"LU": {a1:159.270, a2:135.830, m1:63.110, m2:55.890, name:"Luxemburgo",                 name_en: "Luxemburgo"},
		"MY": {a1:108.180, a2:91.9500, m1:39.670, m2:34.260, name:"Malasia",                    name_en: "Malaysia"},
		"MT": {a1:54.0900, a2:46.2800, m1:37.260, m2:31.850, name:"Malta",                      name_en: "Malt"},
		"MA": {a1:116.600, a2:99.1700, m1:45.680, m2:39.670, name:"Marruecos",                  name_en: "Morocco"},
		"MR": {a1:57.7000, a2:49.2800, m1:45.080, m2:39.070, name:"Mauritania",                 name_en: "Mauritania"},
		"MX": {a1:96.1600, a2:81.7400, m1:49.880, m2:43.270, name:"Mexico",                     name_en: "Mexico"},
		"MZ": {a1:78.7300, a2:67.3100, m1:48.080, m2:42.670, name:"Mozambique",                 name_en: "Mozambique"},
		"NI": {a1:110.590, a2:94.3600, m1:61.900, m2:52.890, name:"Nicaragua",                  name_en: "Nicaragua"},
		"NG": {a1:138.230, a2:117.800, m1:51.690, m2:46.880, name:"Nigeria",                    name_en: "Nigeria"},
		"NO": {a1:156.260, a2:132.820, m1:89.550, m2:80.540, name:"Noruega",                    name_en: "Norway"},
		"NZ": {a1:76.9300, a2:65.5100, m1:46.280, m2:40.270, name:"Nueva Zelanda",              name_en: "New Zealand"},
		"NL": {a1:149.050, a2:126.810, m1:71.520, m2:64.310, name:"Países Bajos",               name_en: "Netherlands"},
		"PK": {a1:68.5200, a2:58.3000, m1:43.270, m2:37.260, name:"Pakistán",                   name_en: "Pakistán"},
		"PA": {a1:75.7300, a2:64.9100, m1:42.070, m2:36.660, name:"Panamá",                     name_en: "Panama"},
		"PY": {a1:53.4900, a2:45.6800, m1:38.460, m2:33.060, name:"Paraguay",                   name_en: "Paraguay"},
		"PE": {a1:93.7600, a2:79.9300, m1:50.490, m2:43.270, name:"Perú",                       name_en: "Peru"},
		"PL": {a1:117.200, a2:99.7700, m1:48.680, m2:42.670, name:"Polonia",                    name_en: "Poland"},
		"PT": {a1:114.190, a2:97.3600, m1:51.090, m2:43.870, name:"Portugal",                   name_en: "Portugal"},
		"UK": {a1:183.910, a2:156.860, m1:91.350, m2:82.940, name:"Reino Unido",                name_en: "United Kingdom"},
		"GB": {a1:183.910, a2:156.860, m1:91.350, m2:82.940, name:"Reino Unido",                name_en: "United Kingdom"},
		"CZ": {a1:119.000, a2:101.570, m1:49.880, m2:43.270, name:"República Checa",            name_en: "Czech Republic"},
		"RO": {a1:149.050, a2:126.810, m1:44.470, m2:38.460, name:"Rumanía",                    name_en: "Romania"},
		"RU": {a1:267.450, a2:227.780, m1:83.540, m2:73.320, name:"Rusia",                      name_en: "Russia"},
		"SN": {a1:79.3300, a2:67.9100, m1:51.090, m2:45.080, name:"Senegal",                    name_en: "Senegal"},
		"CS": {a1:115.390, a2:98.5700, m1:57.700, m2:49.880, name:"Serbia y Montenegro",        name_en: "Serbia and montenegro"},
		"SG": {a1:99.7700, a2:85.3400, m1:54.090, m2:48.080, name:"Singapur",                   name_en: "Singapore"},
		"SY": {a1:97.9600, a2:83.5400, m1:52.290, m2:46.280, name:"Siria",                      name_en: "Syria"},
		"ZA": {a1:75.1300, a2:64.3100, m1:55.890, m2:48.080, name:"Sudáfrica",                  name_en: "South Africa"},
		"SE": {a1:173.090, a2:147.250, m1:82.340, m2:75.130, name:"Suecia",                     name_en: "Sweden"},
		"CH": {a1:174.290, a2:148.450, m1:69.120, m2:61.300, name:"Suiza",                      name_en: "Swiss"},
		"TH": {a1:81.1400, a2:69.1200, m1:45.080, m2:39.070, name:"Tailandia",                  name_en: "Tailandia"},
		"TW": {a1:96.1600, a2:81.7400, m1:54.090, m2:48.680, name:"Taiwan",                     name_en: "Taiwan"},
		"TZ": {a1:90.1500, a2:76.9300, m1:34.860, m2:30.050, name:"Tanzania",                   name_en: "Tanzania"},
		"TN": {a1:60.7000, a2:51.6900, m1:54.090, m2:46.280, name:"Túnez",                      name_en: "Tunisia"},
		"TR": {a1:72.1200, a2:61.3000, m1:45.080, m2:39.070, name:"Turquía",                    name_en: "Turkey"},
		"UY": {a1:67.3100, a2:57.7000, m1:48.680, m2:41.470, name:"Uruguay",                    name_en: "Uruguay"},
		"VE": {a1:91.3500, a2:78.1300, m1:42.070, m2:36.060, name:"Venezuela",                  name_en: "Venezuela"},
		"YE": {a1:156.260, a2:132.820, m1:49.280, m2:43.270, name:"Yemen",                      name_en: "Yemen"},
		"ZR": {a1:119.000, a2:101.570, m1:60.700, m2:54.090, name:"Zaire / Congo",              name_en: "Zaire / Congo"},
		"ZW": {a1:90.1500, a2:76.9300, m1:45.080, m2:39.070, name:"Zimbabwe",                   name_en: "Zimbabwe"},
		"ZZ": {a1:127.410, a2:108.780, m1:46.880, m2:40.87, max:91.350, name:"Resto del Mundo", name_en: "Rest of the world"}
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

	/*this.build = () => {
		const manutenciones = [];
		// mejora futura ......
		return self;
	}*/

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
