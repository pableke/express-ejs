
// Settings
const IRSE = {
	lang: "es"
};

// Meessages
const IRSE_I18N = {
	en: { //english
		msgRechazar: "Do you really want to reject this request?",
		msgDelcomunicación: "Do you really want to remove this request?",
		msgDelOrg: "Are you sure, you want remove this item from request?",

		errPerfil: "No ha seleccionado un perfil válido.",
		errOrganicas: "No se han encontrado orgánicas asociadas a la comunicación.",
		errOrigen: "¡No ha seleccionado correctamente la ciudad de origen!",
		errDestino: "¡No ha seleccionado correctamente la ciudad de destino!",
		errMinRutas: "El mínimo de trayectos a introducir es: 1 de ida y 1 de vuelta.",
		errItinerario: "Error al cumplimentar los datos del itinerario.",
		errMulticomision: "No puede solicitar multicomisiones para esta comunicación.",
		errMainRuta: "Es necesario marcar en el itinerario un destino principal.",
		errJustifiKm: "Debe indicar una justificación para la diferencia de kilometraje de la comunicación.",
		errCongreso: "Debe justificar la fecha de inicio/fin del congreso respoecto a la del viaje.",
		errEstimaciones: "Debe asociar al menos una estimación a la comunicación.",

		errImputacion: "Error al generar la imputación asocuada a la comunicación.",
		errMaxDietas: "Importe máximo para dietas excedido.",
		errMaxAloja: "Importe máximo por alojamiento excedido.",
		errMaxTrans: "Importe máximo por transporte excedido.",
		errMaxAsist: "Importe máximo por asistencios excedido.",
		errImpBruto: "El importe a imputar no coincide con el bruto de la comunicación.",

		tiposDesp: ["", "Vehículo Propio", "Vehiculo de Alquiler", "Vehiculo Ajeno", "Taxi Interurbano", "Autobús Interurbano", "Tren", "Barco", "Avión", "Otros", "Transportes Públicos"],
		tiposEstimaciones: ["-", "Estimación gastos por dietas", "Estimación gastos de alojamiento", "Estimación gastos de transporte"],
		tiposMultiorganica: ["-", "Dietas", "Alojamiento", "Transporte", "Asistencias"],

		lblPaso: "Step", lblDe: "of",
		firstDay: "Primer día", medDay: "Días Intermedios", lastDay: "Último día"
	},

	es: { //spanish
		msgRechazar: "\277Confirma que desea rechazar esta comunicación?",
		msgUnlink: "\277Confirma que desea desasociar esta operación de la comunicación?",
		msgReactivar: "\277Confirma que desea reactivar esta comunicación?",
		msgFirmar: "\277Confirma que desea firmar esta comunicación?",
		msgFirmarEnviar: "\277Confirma que desea firmar y enviar esta comunicación?",
		msgDelSolicitud: "\277Confirma que desea eliminar esta comunicación?",
		msgDelOrg: "\277Confirma que desea eliminar esta orgánica de la comunicación?",
		msgDelRuta: "\277Confirma que desea eliminar esta etapa de la comunicación?",

		errPerfil: "No ha seleccionado un perfil válido.",
		errOrganicas: "No se han encontrado orgánicas asociadas a la comunicación.",
		errObjeto: "Debe indicar un objeto de la actividad.",
		errOrigen: "¡No ha seleccionado correctamente la ciudad de origen!",
		errDestino: "¡No ha seleccionado correctamente la ciudad de destino!",
		errMinRutas: "El mínimo de trayectos a introducir es: 1 de ida y 1 de vuelta.",
		errFechasRuta: "¡La fecha de salida o de llegada, no es válida!",
		errFechaFutura: "¡Las fechas del itinerario deben ser anteriores a la fecha actual!",
		errFechasOrden: "¡La fecha de llegada debe ser posterior a la de salida!",
		errItinerario: "Error al cumplimentar los datos del itinerario.",
		errItinerarioCiudad: "La ciudad de origen y de destino deben de ser distintas.",
		errItinerarioPaises: "Los paises de origen y de destino de las etapas no son consecutivos.",
		errItinerarioFechas: "Las fechas de salida y de llegada de las etapas no son consecutivas.",
		errMulticomision: "No puede solicitar multicomisiones para esta comunicación.",
		errTransporte: "Medio de Transporte incorrecto.",
		errMatricula: "Debe indicar la matricual del vehiculo privado.",
		errMainRuta: "Es necesario marcar un destino del itinerario como principal.",
		errLinkRuta: "Debe seleccionar al menos 1 etapa.",
		errJustifiSubv: "Debe indicar la relación entre la actividad y el proyecto subvencionado.",
		errJustifiVp: "Debe justificar la razón por la que usó de su vehiculo propio.",
		errJustifiKm: "Debe indicar una justificación para la diferencia de kilometraje de la comunicación.",
		errJustifiExtra: "Debe indicar una justificación para la indemnización extraordinaria.",
		errEntidadOrigen: "Debe indicar una entidad de origen para la subvención.",
		errCongreso: "Debe justificar la fecha de inicio/fin del congreso respoecto a la del viaje.",
		errEstimaciones: "Debe asociar al menos una estimación a la comunicación.",
		errFechasAloja: "No ha seleccionadas correctamente el periodo de fechas del alojamiento.",
		errRangoAloja: "El periodo de fechas del gasto de alojamiento, esta fuera del rango de la solicitud.",
		errDoc: "Debe asociar la documentación obligatoria",

		errImputacion: "Error al generar la imputación asocuada a la comunicación.",
		errMaxDietas: "Importe máximo para dietas excedido.",
		errMaxAloja: "Importe máximo por alojamiento excedido.",
		errMaxTrans: "Importe máximo por transporte excedido.",
		errMaxAsist: "Importe máximo por asistencios excedido.",
		errImpBruto: "El importe a imputar no coincide con el bruto de la comunicación.",
		errTipo: "No ha seleccionado correctamente el tipo de operación.",
		errTipoGasto: "Debe seleccionar un tipo de gasto.",
		errIban: "Debe indicar un IBAN válido.",
		errSwift: "Debe indicar un swift válido.",

		errExtra: "Debe indicar un motivo para la urgencia de esta comunicación",
		errFechaMax: "Debe indicar una fecha maxima de resolución para esta comunicación.",

		tiposDesp: ["", "Vehículo Propio", "Vehiculo de Alquiler", "Vehiculo Ajeno", "Taxi Interurbano", "Autobús Interurbano", "Tren", "Barco", "Avión", "Otros", "Transportes Públicos"],
		tiposEstimaciones: ["-", "Estimación gastos por dietas", "Estimación gastos de alojamiento", "Estimación gastos de transporte"],
		tiposMultiorganica: ["-", "Dietas", "Alojamiento", "Transporte", "Asistencias"],

		lblPorAqui: "¡Por Aquí!",
		lblPaso: "Paso", lblDe: "de",
		firstDay: "Primer día", medDay: "Días Intermedios", lastDay: "Último día"
	}
};
