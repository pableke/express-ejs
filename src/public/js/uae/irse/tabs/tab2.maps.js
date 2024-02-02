
//initialize google maps
function initMap() {
	const CT = ir.getCT(); // CT location
	const CARTAGENA = [ "Cartagena", "30200", "30201", "30202", "30203", "30204", "30205", "30280", "30290", "30300", "30310", "30319", "30330", "30350", "30351", "30353", "30365", "30366", "30367", "30368", "30369", "30370", "30380", "30381", "30382", "30383", "30384", "30385", "30386", "30387", "30390", "30391", "30392", "30393", "30394", "30395", "30396", "30397", "30398", "30399", "30593", "30594", "30835", "30868" ];
	const OPTIONS = { //autocomplete config
		fields: [ "address_component", "geometry" ],
		types: [ "geocode", "establishment" ],
		strictBounds: false
	};

	function fnGetComponent(place, type) { //get short name from type address component
		const component = place.address_components.find(address => address.types.includes(type));
		return component && component.short_name;
	}
	//get postal code / locality short name from place (30XXX, Cartagena, Madrid,...)
	const fnLocality = place => fnGetComponent(place, "postal_code") || fnGetComponent(place, "locality");
	const fnCartagena = place => CARTAGENA.includes(fnLocality(place)); // Localidad de cartagena
    const fnMadrid = place => ("MD" == fnGetComponent(place, "administrative_area_level_1")); // CCAA de Madrid
    const fnBarcelona = place => ("B" == fnGetComponent(place, "administrative_area_level_2")); // Provincia de barcelona
	//get country short name from place (ES, EN, GB, IT,...)
	const fnCountry = place => {
		const pais = fnGetComponent(place, "country");
		if ((pais == CT.pais) && fnMadrid(place))
			return "ES-MD"; // Dieta para madrid comunidad
		if ((pais == CT.pais) && fnBarcelona(place))
			return "ES-BA"; // dieta para barcelona provincia
		return pais;
	}

	const origen = new google.maps.places.Autocomplete(document.getElementById("origen"), OPTIONS); //Get the autocomplete input
	const destino = new google.maps.places.Autocomplete(document.getElementById("destino"), OPTIONS); //Get the autocomplete input
	const distance = new google.maps.DistanceMatrixService(); //Instantiate a distance matrix

	var p1, p2; // from..to
	origen.addListener("place_changed", function() { p1 = origen.getPlace(); }); //Get the place details from autocomplete
	destino.addListener("place_changed", function() { p2 = destino.getPlace(); }); //Get the place details from autocomplete

	//*************** rutas / trayectos - maps ***************//
	dom.addClick("#add-ruta", el => {
		let loc1 = null; //source location

		if (!p1 && ir.empty()) { //primera ruta
			loc1 = new google.maps.LatLng(CT.lat, CT.lng);
			loc1.pais = CT.pais;
			loc1.mask = CT.mask;
		}
		else if (p1) { //ha seleccionado un origen?
			loc1 = p1.geometry.location;
			loc1.pais = fnCountry(p1);
			loc1.mask = fnCartagena(p1) ? 4 : 0;
		}
		else if (ir.size() > 0) { //origen=destino anterior?
			let last = ir.last();
			loc1 = new google.maps.LatLng(last.lat2, last.lng2);
			loc1.pais = last.pais2;
			loc1.mask = last.mask;
		}

		dom.closeAlerts().intval("#desp", "errTransporte", "errRequired")
			.required("#f2", "errDate", "errRequired").required("#h2", "errDate")
			.required("#f1", "errDate", "errRequired").required("#h1", "errDate")
			.required("#destino", "errDestino", "errRequired")
			.required("#origen", "errOrigen", "errRequired");
		p2 || dom.addError("#destino", "errDestino", "errRequired"); //ha seleccionado un destino
		loc1 || dom.addError("#origen", "errOrigen", "errRequired"); //ha seleccionado un origen
		if (dom.isError())
			return false;

		//new place data and read location from loc1 and loc2
		const ruta = i18n.toData();
		ruta.dt1 = sb.toIsoDate(ruta.f1, ruta.h1);
		ruta.dt2 = sb.toIsoDate(ruta.f2, ruta.h2);
		ruta.lat1 = loc1.lat();
		ruta.lng1 = loc1.lng();
		ruta.pais1 = loc1.pais;
		ruta.lat2 = p2.geometry.location.lat();
		ruta.lng2 = p2.geometry.location.lng();
		ruta.pais2 = fnCountry(p2);
        ruta.mask = ((loc1.mask & 4) && fnCartagena(p2)) ? 4 : 0;

		//validate data
		if (ruta.origen == ruta.destino)
			return !dom.addError("#origen", "errItinerarioCiudad", "errRequired");
		if (!ir.valid(ruta))
			return false;

		if (ruta.desp == "1") //calculate distance
			distance.getDistanceMatrix({
				origins: [loc1],
				destinations: [p2.geometry.location],
				travelMode: "DRIVING"
			}, function(res, status) {
				if (status !== "OK")
					return !dom.addError("#origen", "The calculated distance fails due to " + status);
				var origins = res.originAddresses;
				//var destinations = res.destinationAddresses;
				for (var i = 0; i < origins.length; i++) {
					var results = res.rows[i].elements;
					for (var j = 0; j < results.length; j++) {
						var element = results[j];
						ruta.km2 = element.distance.value/1000; //to km
					}
				}
				ir.add(ruta, ruta.km2);
			});
		else
			ir.add(ruta, null);
		p1 = p2 = null;
	});
	//*************** rutas / trayectos - maps ***************//
}

// Create the script tag, set the appropriate attributes
const script = document.createElement("script");
script.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyBIlqxZkVg9GyjzyNzC0rrZiuY6iPLzTZI&libraries=places&callback=initMap";
script.async = true; // Solicita al navegador que descargue y ejecute la secuencia de comandos de manera asíncrona, despues llamará a initMap
script.defer = true; // Will execute the script after the document has been parsed
document.head.appendChild(script); // Append the "script" element to "head"
