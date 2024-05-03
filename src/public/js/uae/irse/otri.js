
import excel from "../components/Excel.js";

window.xlsx = (xhr, status, args) => {
    if (!showAlerts(xhr, status, args))
        return false; // Server error
    const data = JSON.parse(args.data);
    excel.json(data, {
        keys: [ // column order
            "jg", "fact", "nif", "ter", "impJg", "fJg", "descJg", 
            "nifInt", "int", "vinc", "gasto", "act", "proy",
            "dest", "pais", "itinerario", "start", "end", "loc", "vp", "km", "impKm",
            "fCong1", "fCong2", "impTrans", "noches", "impPern", "dias", "impDietas", "impTotal", "taxis"
        ],
        titles: [ // column names
            "Nº JG", "Nº Factura", "NIF Tercero", "Nombre del Tercero", "Imp. Total", "F. Emisión", "Descripción", 
            "NIF Interesado", "Nombre del Interesado", "Vinculación", "Tipo de Gasto", "Actividad", "Relación con el Proyecto",
            "Destino Principal", "Pais", "Itinerario", "F. Inicio", "F. Fin", "Locomoción", "Vehiculo Propio", "Km.", "Imp./Km.",
            "F. Inicio Congreso", "F. Fin Congreso", "Tot. Locomoción", "Nº Noches", "Tot. Alojamiento", "Nº Días", "Tot. Manutención", "Total", "Taxi"
        ],
        columns: {
            km: cell => { cell.z = "#,##0.00"; }, // currency format
            impKm: cell => { cell.z = "#,##0.00"; }, // currency format
            impTrans: cell => { cell.z = "#,##0.00"; }, // currency format
            impPern: cell => { cell.z = "#,##0.00"; }, // currency format
            impDietas: cell => { cell.z = "#,##0.00"; }, // currency format
            impTotal: cell => { cell.z = "#,##0.00"; } // currency format
        }
    });
}
