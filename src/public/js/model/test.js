
import ab from "../lib/array-box.js";
import nb from "../lib/number-box.js";
import sb from "../lib/string-box.js";
import i18n from "../i18n/langs.js";

function Test() {
    this.enRender = (data, i) => {
        data.count = i + 1;
        data.c4_i18n = nb.enIsoFloat(data.c4);
        data.imp_i18n = nb.enIsoFloat(data.imp);
        data.fecha = sb.isoDate(data.fecha);
        data.fecha_i18n = data.fecha;
        data.memo_i18n = data.memo_en || data.memo;
        data["ac-nif"] = data.nif + " - " + data.name;
        return data;
    }
    this.esRender = (data, i) => {
        data.count = i + 1;
        data.c4_i18n = nb.esIsoFloat(data.c4);
        data.imp_i18n = nb.esIsoFloat(data.imp);
        data.fecha = sb.isoDate(data.fecha);
        data.fecha_i18n = sb.esDate(data.fecha);
        data.memo_i18n = data.memo;
        data["ac-nif"] = data.nif + " - " + data.name;
        return data;
    }

    this.filter = data => {
        i18n.reset() // All data optional
            .setData("name", data.name).setData("memo", data.memo)
            .setFloat("imp1", data.imp1).setFloat("imp2", data.imp2)
            .setData("f1", data.f1).setData("f2", data.f2);
        return i18n.getData();
    }
    this.validate = data => {
        // calculated data from autocomplete
        const ac = sb.split(data["ac-name"], " - ");
        i18n.reset() // required fields
            .gt0("imp", data.imp)
            .required("ac-name", data["ac-name"])
            .required("name", ab.pop(ac)).required("nif", data.nif)
            .date("fecha", data.fecha).text300("memo", data.memo);
        // Optionals fields
        i18n.setInteger("id", data.id)
            .setIntval("binary", data.binary)
            .setArray("values", data.values)
            .setIntval("icons", data.icons);
        return i18n.isOk() ? i18n.getData() : !i18n.setError("errForm");
    }
}

const test = new Test();
const langs = i18n.getLangs(); // Languages container
langs.en.renderTest = test.enRender;
langs.es.renderTest = test.esRender;

export default test;
